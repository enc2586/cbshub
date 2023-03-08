import * as React from 'react'

import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
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
import BorderColorIcon from '@mui/icons-material/BorderColor'
import {
  arrangeClassrooms,
  arrangeTeachers,
  by,
  getWorkflowConfigs,
  updateSelfCred,
} from 'utils/workflow'
import { AutocompleteItem } from 'types/workflow'
import useAuthData from 'hooks/useAuthData'
import { UserData } from 'types/auth'
import { User } from 'firebase/auth'
import useAuth from 'hooks/useAuth'

const emptyWeekdaySelection = {
  0: { 0: false, 1: false, 2: false },
  1: { 0: false, 1: false, 2: false },
  2: { 0: false, 1: false, 2: false },
  3: { 0: false, 1: false, 2: false },
  4: { 0: false, 1: false, 2: false },
}
const testWeekdaySelection = {
  0: { 0: false, 1: false, 2: false },
  1: { 0: true, 1: false, 2: true },
  2: { 0: false, 1: false, 2: false },
  3: { 0: true, 1: true, 2: false },
  4: { 0: false, 1: false, 2: true },
}

function Workflow() {
  const user = useAuth() as User
  const userData = useAuthData()

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

  React.useEffect(() => {
    ;(async function () {
      const workflowConfigurations = await getWorkflowConfigs()

      if (workflowConfigurations !== undefined) {
        setClassrooms(arrangeClassrooms(workflowConfigurations.classes).sort(by('label')))
        setTeachers(arrangeTeachers(workflowConfigurations.teachers).sort(by('label')))
      }
    })()
  }, [])

  const [teacher, setTeacher] = React.useState<AutocompleteItem | null>(null)
  const [classroom, setClassroom] = React.useState<AutocompleteItem | null>(null)

  const [isWeekendSelection, setIsWeekendSelection] = React.useState(false)

  const [weekdaySelection, setWeekdaySelection] = React.useState<{
    current: {
      [day in 0 | 1 | 2 | 3 | 4]: { [period in 0 | 1 | 2]: boolean }
    }
    locked: {
      [day in 0 | 1 | 2 | 3 | 4]: { [period in 0 | 1 | 2]: boolean }
    }
  }>({ current: emptyWeekdaySelection, locked: testWeekdaySelection })
  const [isWeekdaySelectionValid, setIsWeekdaySelectionValid] = React.useState(false)

  React.useEffect(() => {
    ;(function () {
      for (const day of [0, 1, 2, 3, 4] as (0 | 1 | 2 | 3 | 4)[]) {
        for (const period of [0, 1, 2] as (0 | 1 | 2)[]) {
          if (weekdaySelection.current[day][period]) {
            setIsWeekdaySelectionValid(true)
            return
          }
        }
      }
      setIsWeekdaySelectionValid(false)
    })()
  }, [weekdaySelection])

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

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Stack spacing={2}>
              <Stack direction='row' alignItems='center' justifyContent='space-between'>
                <Typography variant='h5'>특별실 신청 예약</Typography>
                <Stack direction='row'>
                  <IconButton onClick={() => setIsSelfCredEditOpen(true)}>
                    <SettingsIcon />
                  </IconButton>
                </Stack>
              </Stack>
              <Stepper activeStep={applyStep} orientation='vertical'>
                <Step>
                  <StepLabel>교실, 지도교사 선택</StepLabel>
                  <StepContent>
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
                            {([0, 1, 2] as (0 | 1 | 2)[]).map((period) => (
                              <TableRow key={period}>
                                <TableCell>{period + 1}</TableCell>
                                {([0, 1, 2, 3, 4] as (0 | 1 | 2 | 3 | 4)[]).map((day) => (
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
                        <a
                          href='https://www.cbshself.kr/sign/login.do'
                          target='_blank'
                          rel='noreferrer'
                        >
                          학생관리시스템
                        </a>
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
                          학생관리서비스 로그인 정보 추가
                        </Button>
                      )}
                      <Stack direction='row' justifyContent='flex-end' spacing={1}>
                        <Button onClick={() => setApplyStep(applyStep - 1)}>이전</Button>
                        <Button
                          variant='contained'
                          disabled={applyStep !== 2 || !selfServiceCredential}
                          onClick={() => setApplyStep(applyStep + 1)}
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
              </Stack>
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
    </Box>
  )
}

export default Workflow
