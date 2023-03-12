import * as React from 'react'

import {
  Autocomplete,
  Box,
  Button,
  Card,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Link,
  Paper,
  Stack,
  Step,
  StepConnector,
  StepContent,
  StepLabel,
  Stepper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'

import SettingsIcon from '@mui/icons-material/Settings'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import CircleIcon from '@mui/icons-material/Circle'
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined'
import AccessTimeFilledRoundedIcon from '@mui/icons-material/AccessTimeFilledRounded'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import BorderColorIcon from '@mui/icons-material/BorderColor'
import DeleteIcon from '@mui/icons-material/Delete'
import GroupWorkIcon from '@mui/icons-material/GroupWork'
import InfoIcon from '@mui/icons-material/Info'
import SubjectIcon from '@mui/icons-material/Subject'
import {
  applyWeekdayWorkflow,
  arrangeClassrooms,
  arrangeTeachers,
  by,
  getWorkflowConfigs,
  getWorkflows,
  searchId,
  searchLabel,
  updateSelfCred,
  workflowStatus,
} from 'features/workflow/services/workflow'
import {
  AutocompleteItem,
  BotState,
  WeekdaysIndex,
  WeekdaysPeriod,
  WeekdaysSelection,
  WeekdaysWorkflow,
  WeekendsWorkflow,
  WorkflowConfigs,
  Workflows,
} from 'features/workflow/types/workflow'
import { User } from 'firebase/auth'
import { toast } from 'react-hot-toast'
import { collection, deleteDoc, doc, onSnapshot, query, where } from 'firebase/firestore'

import selfSystemImage from 'images/selfSystem.png'
import { useAuth, useUserData } from 'features/authentication'
import { db } from 'services/firestore'

const emptyWeekdaySelection = {
  0: { 0: false, 1: false, 2: false },
  1: { 0: false, 1: false, 2: false },
  2: { 0: false, 1: false, 2: false },
  3: { 0: false, 1: false, 2: false },
  4: { 0: false, 1: false, 2: false },
}

function Workflow() {
  const user = useAuth() as User
  const userData = useUserData()

  const [selfServiceCredential, setSelfServiceCredential] = React.useState<
    { id: string; password: string } | undefined
  >(undefined)
  React.useEffect(() => {
    if (userData) {
      setSelfServiceCredential(userData.selfServiceCredential)
    } else {
      setSelfServiceCredential(undefined)
    }
  }, [userData])

  const [classrooms, setClassrooms] = React.useState<AutocompleteItem[]>([])
  const [teachers, setTeachers] = React.useState<AutocompleteItem[]>([])

  const [botState, setBotState] = React.useState<BotState>('idle')

  const [workflows, setWorkflows] = React.useState<Workflows>({})

  React.useEffect(() => {
    const lockedWeekdaysSelection = JSON.parse(JSON.stringify(emptyWeekdaySelection))
    for (const value of Object.values(workflows)) {
      if (value.type === 'weekdays') {
        for (const [day, periods] of Object.entries(value.periods)) {
          for (const [period, isLocked] of Object.entries(periods)) {
            if (isLocked) {
              lockedWeekdaysSelection[Number(day) as WeekdaysIndex][
                Number(period) as WeekdaysPeriod
              ] = true
            }
          }
        }
      }
    }
    setWeekdaySelection({ current: emptyWeekdaySelection, locked: lockedWeekdaysSelection })
  }, [workflows])

  React.useEffect(() => {
    const workflowConfigRef = doc(db, 'workflow', 'configuration')
    onSnapshot(workflowConfigRef, (doc) => {
      const workflowConfigurations = doc.data() as WorkflowConfigs
      setBotState(workflowConfigurations.botState)
      setClassrooms(arrangeClassrooms(workflowConfigurations.classes).sort(by('label')))
      setTeachers(arrangeTeachers(workflowConfigurations.teachers).sort(by('label')))
    })
  }, [])
  React.useEffect(() => {
    if (user) {
      const workflowRef = collection(db, 'workflow')
      const userWorkflowQuery = query(workflowRef, where('user', '==', user.uid))
      onSnapshot(userWorkflowQuery, (querySnapshot) => {
        const result: Workflows = {}
        querySnapshot.forEach((doc) => {
          result[doc.id] = doc.data() as WeekdaysWorkflow | WeekendsWorkflow
        })
        setWorkflows(result)
      })
    }
  }, [user])

  const [teacher, setTeacher] = React.useState<AutocompleteItem | null>(null)
  const [classroom, setClassroom] = React.useState<AutocompleteItem | null>(null)

  const [isWeekendSelection, setIsWeekendSelection] = React.useState(false)

  const [weekdaySelection, setWeekdaySelection] = React.useState<{
    current: WeekdaysSelection
    locked: WeekdaysSelection
  }>({ current: emptyWeekdaySelection, locked: emptyWeekdaySelection })
  const [isWeekdaySelectionValid, setIsWeekdaySelectionValid] = React.useState(false)

  React.useEffect(() => {
    ;(function () {
      for (const day of [0, 1, 2, 3, 4] as WeekdaysIndex[]) {
        for (const period of [0, 1, 2] as WeekdaysPeriod[]) {
          if (weekdaySelection.current[day][period]) {
            setIsWeekdaySelectionValid(true)
            return
          }
        }
      }
      setIsWeekdaySelectionValid(false)
    })()
  }, [weekdaySelection])

  const [workflowTitle, setWorkflowTitle] = React.useState<string>('')

  const [applyStep, setApplyStep] = React.useState(0)

  const [isSelfCredEditOpen, setIsSelfCredEditOpen] = React.useState(false)
  React.useEffect(() => {
    if (isSelfCredEditOpen) {
      if (selfServiceCredential) {
        setSelfCredEdit(selfServiceCredential)
      } else {
        setSelfCredEdit({ id: '', password: '' })
      }
    }
  }, [isSelfCredEditOpen])

  const [selfCredEdit, setSelfCredEdit] = React.useState<{ id: string; password: string }>({
    id: '',
    password: '',
  })

  const handleSelfCredUpdate = async () => {
    await updateSelfCred(user.uid, selfCredEdit)
    setSelfServiceCredential(selfCredEdit)
    setIsSelfCredEditOpen(false)
  }

  const handleWorkflowApply = async () => {
    if (classroom && teacher) {
      setApplyStep(3)
      if (!isWeekendSelection) {
        await applyWeekdayWorkflow(
          user.uid,
          workflowTitle,
          classroom.id,
          teacher.id,
          weekdaySelection.current,
        )
      } else {
        // 주말 신청
      }

      setIsWeekendSelection(false)
      setClassroom(null)
      setTeacher(null)
      setApplyStep(0)
      setWorkflowTitle('')
      toast.success('신청에 성공했습니다')
    }
  }

  const [isAboutSelfSystemOpen, setIsAboutSelfSystemOpen] = React.useState(false)

  const [isExemptionOpen, setIsExemptionOpen] = React.useState(false)

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Stack spacing={2}>
              <Stack direction='row' alignItems='center' justifyContent='space-between'>
                <Stack direction='row' spacing={1}>
                  <Typography variant='h5'>특별실 신청 예약</Typography>
                  {Object.keys(workflows).length > 0 ? (
                    <Typography
                      component={Link}
                      onClick={() => setIsExemptionOpen(true)}
                      fontSize='12px'
                    >
                      면책조항
                    </Typography>
                  ) : null}
                </Stack>
                <Stack direction='row'>
                  <IconButton onClick={() => setIsSelfCredEditOpen(true)}>
                    <SettingsIcon />
                  </IconButton>
                </Stack>
              </Stack>
              <Stepper activeStep={applyStep} orientation='vertical'>
                <Step>
                  <StepLabel>초기 정보 입력</StepLabel>
                  <StepContent>
                    <Stack spacing={3}>
                      <Stack spacing={1}>
                        <Typography>알아보기 쉽도록 활동 제목을 설정해주세요.</Typography>
                        <TextField
                          label='(선택사항) 활동 제목'
                          variant='filled'
                          value={workflowTitle}
                          onChange={(
                            event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
                          ) => {
                            setWorkflowTitle(event.target.value)
                          }}
                        />
                      </Stack>
                      <Stack spacing={1}>
                        <Typography>
                          교실과 지도교사를 선택해주세요. 화살표를 클릭해 목록 중에서 찾거나 빈칸을
                          클릭해 검색할 수 있어요.
                        </Typography>
                        <Box m={-1}>
                          <Grid container spacing={1}>
                            <Grid item xs={12} sm={6}>
                              <Autocomplete
                                options={classrooms}
                                value={classroom}
                                onChange={(
                                  _event: React.SyntheticEvent<Element, Event>,
                                  newValue: AutocompleteItem | null,
                                ) => {
                                  setClassroom(newValue)
                                }}
                                renderInput={(params) => (
                                  <TextField {...params} label='교실' variant='filled' />
                                )}
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Autocomplete
                                options={teachers}
                                value={teacher}
                                onChange={(
                                  _event: React.SyntheticEvent<Element, Event>,
                                  newValue: AutocompleteItem | null,
                                ) => {
                                  setTeacher(newValue)
                                }}
                                renderInput={(params) => (
                                  <TextField {...params} label='지도교사' variant='filled' />
                                )}
                              />
                            </Grid>
                          </Grid>
                        </Box>
                      </Stack>
                      <Stack direction='row' justifyContent='flex-end' spacing={1}>
                        <Button
                          variant='contained'
                          disabled={applyStep !== 0 || !teacher || !classroom}
                          onClick={() => setApplyStep(applyStep + 1)}
                        >
                          다음
                        </Button>
                      </Stack>
                    </Stack>
                  </StepContent>
                </Step>
                <Step>
                  <StepLabel>신청 교시 선택</StepLabel>
                  <StepContent>
                    <Stack spacing={1}>
                      <Typography>신청할 요일과 교시를 선택해주세요.</Typography>

                      <TableContainer component={Paper}>
                        <Table size='small'>
                          <TableHead>
                            <TableRow>
                              <TableCell>교시</TableCell>
                              {['월', '화', '수', '목', '금'].map((day, index) => (
                                <TableCell align='center' key={index}>
                                  {day}
                                </TableCell>
                              ))}
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {([0, 1, 2] as WeekdaysPeriod[]).map((period) => (
                              <TableRow key={period}>
                                <TableCell>{period + 1}</TableCell>
                                {([0, 1, 2, 3, 4] as WeekdaysIndex[]).map((day) => (
                                  <TableCell align='center' key={day}>
                                    <Checkbox
                                      disabled={weekdaySelection.locked[day][period]}
                                      checked={weekdaySelection.current[day][period]}
                                      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                        setWeekdaySelection({
                                          ...weekdaySelection,
                                          current: {
                                            ...weekdaySelection.current,
                                            [day]: {
                                              ...weekdaySelection.current[day],
                                              [period]: event.target.checked,
                                            },
                                          },
                                        })
                                      }}
                                      size='small'
                                      disableRipple
                                      icon={
                                        weekdaySelection.locked[day][period] ? (
                                          <AccessTimeFilledRoundedIcon />
                                        ) : (
                                          <CircleOutlinedIcon />
                                        )
                                      }
                                      checkedIcon={<CircleIcon />}
                                    />
                                  </TableCell>
                                ))}
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                      <Stack direction='row' justifyContent='flex-end' spacing={1}>
                        <Button onClick={() => setApplyStep(applyStep - 1)}>이전</Button>
                        <Button
                          variant='contained'
                          disabled={applyStep !== 1 || !isWeekdaySelectionValid}
                          onClick={() => setApplyStep(applyStep + 1)}
                        >
                          다음
                        </Button>
                      </Stack>
                    </Stack>
                  </StepContent>
                </Step>
                <Step>
                  <StepLabel>로그인 정보 검토</StepLabel>
                  <StepContent>
                    <Stack spacing={3}>
                      <Typography>
                        학생관리시스템
                        <IconButton
                          disableRipple
                          sx={{ p: 0, pb: '3px' }}
                          onClick={() => {
                            setIsAboutSelfSystemOpen(true)
                          }}
                        >
                          <InfoIcon sx={{ fontSize: 20, color: 'info.main' }} />
                        </IconButton>{' '}
                        의 로그인 정보를 검토해주세요.
                      </Typography>
                      {selfServiceCredential ? (
                        <Stack direction='row' spacing={1}>
                          <Grid container spacing={1}>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                variant='outlined'
                                size='small'
                                label='아이디'
                                value={selfServiceCredential ? selfServiceCredential.id : null}
                                InputProps={{
                                  readOnly: true,
                                }}
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                variant='outlined'
                                size='small'
                                type='password'
                                label='패스워드'
                                value={
                                  selfServiceCredential ? selfServiceCredential.password : null
                                }
                                InputProps={{
                                  readOnly: true,
                                }}
                              />
                            </Grid>
                          </Grid>
                          <IconButton onClick={() => setIsSelfCredEditOpen(true)}>
                            <BorderColorIcon />
                          </IconButton>
                        </Stack>
                      ) : (
                        <Button
                          variant='contained'
                          endIcon={<AddCircleIcon />}
                          onClick={() => setIsSelfCredEditOpen(true)}
                        >
                          학생관리시스템 로그인 정보 추가
                        </Button>
                      )}
                      <Stack direction='row' justifyContent='flex-end' spacing={1}>
                        <Button onClick={() => setApplyStep(applyStep - 1)}>이전</Button>
                        <Button
                          variant='contained'
                          disabled={applyStep !== 2 || !selfServiceCredential}
                          onClick={handleWorkflowApply}
                        >
                          신청
                        </Button>
                      </Stack>
                    </Stack>
                  </StepContent>
                </Step>
              </Stepper>
            </Stack>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Stack spacing={2}>
              <Stack direction='row' alignItems='center' justifyContent='space-between'>
                <Typography variant='h5'>신청 내역 일람</Typography>
                <BotStateChip botState={botState} />
              </Stack>
              <Typography color='text.secondary'>평일 13시에 신청됩니다</Typography>
              {Object.keys(workflows).length > 0 ? null : (
                <Paper sx={{ p: 2 }}>
                  <Stack justifyContent='center' alignItems='center' sx={{ height: '300px' }}>
                    <SubjectIcon fontSize='large' sx={{ color: 'text.secondary' }} />
                    <Typography color='text.secondary'>비어 있어요</Typography>
                  </Stack>
                </Paper>
              )}
              {Object.keys(workflows).map((id) => {
                return (
                  <Card sx={{ p: 2 }} key={id}>
                    <Stack spacing={1}>
                      <Stack direction='row' justifyContent='space-between'>
                        <Typography
                          variant='h6'
                          color={workflows[id].title.length > 0 ? undefined : 'text.secondary'}
                        >
                          {workflows[id].title.length > 0 ? workflows[id].title : '예약 제목 없음'}
                        </Typography>
                        <IconButton
                          onClick={() => {
                            ;(async function () {
                              try {
                                deleteDoc(doc(db, 'workflow', id))
                                toast.success('삭제에 성공했습니다')
                              } catch (error) {
                                toast.error('삭제에 실패했습니다')
                              }
                            })()
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Stack>
                      <Stack direction='row' spacing={1} sx={{ overflow: 'auto' }}>
                        <Chip
                          size='small'
                          label={<b>{workflowStatus(workflows[id].state).message}</b>}
                          color={workflowStatus(workflows[id].state).type}
                        />
                        <Chip
                          size='small'
                          label={searchId(teachers, workflows[id].teacher)}
                          icon={<AccountCircleIcon />}
                        />
                        <Chip
                          size='small'
                          label={searchId(classrooms, workflows[id].classroom)}
                          icon={<GroupWorkIcon />}
                        />
                      </Stack>

                      <TableContainer component={Paper}>
                        <Table size='small'>
                          <TableHead>
                            <TableRow>
                              {['월', '화', '수', '목', '금'].map((day, index) => (
                                <TableCell align='center' key={index}>
                                  {day}
                                </TableCell>
                              ))}
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {([0, 1, 2] as WeekdaysPeriod[]).map((period) => (
                              <TableRow key={period}>
                                {([0, 1, 2, 3, 4] as WeekdaysIndex[]).map((day) => (
                                  <TableCell align='center' key={day}>
                                    {workflows[id].periods[day][period] ? (
                                      <CircleIcon
                                        fontSize='small'
                                        sx={{
                                          color: workflowStatus(workflows[id].state).type + '.main',
                                        }}
                                      />
                                    ) : (
                                      <CircleOutlinedIcon
                                        fontSize='small'
                                        sx={{ color: 'text.secondary' }}
                                      />
                                    )}
                                  </TableCell>
                                ))}
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Stack>
                  </Card>
                )
              })}
            </Stack>
          </Paper>
        </Grid>
      </Grid>
      <Dialog open={isSelfCredEditOpen} onClose={() => setIsSelfCredEditOpen(false)}>
        <DialogTitle>
          학생관리시스템 로그인 정보 {selfServiceCredential ? '변경' : '추가 등록'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField
              size='small'
              variant='outlined'
              label='아이디'
              value={selfCredEdit.id}
              onChange={(e) => setSelfCredEdit({ ...selfCredEdit, id: e.target.value })}
            />
            <TextField
              size='small'
              variant='outlined'
              label='패스워드'
              value={selfCredEdit.password}
              type='password'
              onChange={(e) => setSelfCredEdit({ ...selfCredEdit, password: e.target.value })}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsSelfCredEditOpen(false)}>취소</Button>
          <Button variant='contained' onClick={handleSelfCredUpdate}>
            적용
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={isAboutSelfSystemOpen} onClose={() => setIsAboutSelfSystemOpen(false)}>
        <DialogTitle>학생관리시스템이란?</DialogTitle>
        <DialogContent>
          <img src={selfSystemImage} style={{ width: '100%', borderRadius: '5px' }} />
          <Typography>
            평소에 자주 이용하던{' '}
            <Link
              rel='noopener noreferrer'
              href='https://www.cbshself.kr/sign/login.do'
              target='_blank'
            >
              이 사이트
            </Link>
            의 로그인 정보를 입력해주세요.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setIsAboutSelfSystemOpen(false)
            }}
          >
            닫기
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={isExemptionOpen} onClose={() => setIsExemptionOpen(false)}>
        <DialogTitle>면책조항</DialogTitle>
        <DialogContent>
          <Typography>
            본 서비스는 특별실 신청을 위한 편의 기능을 제공할 뿐이며, 신청의 성공 여부를 보장하지
            않습니다.
            <br />
            <br />
            사용자는 본 서비스에 접속하여 신청 상태를 확인하고 필요한 조치를 취해야 합니다.
            <br />
            <br />본 서비스의 오류나 장애로 인하여 특별실 신청이 되지 않거나 취소되어 발생하는 모든
            손해에 대하여 본 서비스 제공자는 어떠한 책임도 지지 않습니다.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button variant='contained' onClick={() => setIsExemptionOpen(false)}>
            닫기
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

function BotStateChip({ botState }: { botState: BotState }) {
  const [label, setLabel] = React.useState('예약 일정 확인중')
  const [color, setColor] = React.useState<
    'error' | 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'default' | undefined
  >('warning')

  React.useEffect(() => {
    if (botState === 'idle') {
      setLabel('신청 대기중')
      setColor('info')
    } else if (botState === 'running') {
      setLabel('신청 진행중')
      setColor('warning')
    } else {
      setLabel('금일 신청 종료')
      setColor('success')
    }
  }, [botState])

  return <Chip label={label} color={color} />
}

export default Workflow
