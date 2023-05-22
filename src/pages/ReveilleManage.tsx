import * as React from 'react'
import {
  Backdrop,
  Box,
  Button,
  Card,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Slider,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  Grid,
} from '@mui/material'

import SelectAllIcon from '@mui/icons-material/SelectAll'
import DeselectIcon from '@mui/icons-material/Deselect'
import HighlightAltIcon from '@mui/icons-material/HighlightAlt'
import FlashOnIcon from '@mui/icons-material/FlashOn'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import TaskAltIcon from '@mui/icons-material/TaskAlt'
import AcUnitIcon from '@mui/icons-material/AcUnit'
import SettingsIcon from '@mui/icons-material/Settings'
import DiscFullIcon from '@mui/icons-material/DiscFull'

import { useUserData } from 'features/authentication'
import { fetchReveillesQueue, getDefaultDormitory, getReveilleConfig } from 'utils/reveille'
import toast from 'react-hot-toast'
import { db } from 'services/firestore'
import {
  doc,
  FieldValue,
  increment,
  serverTimestamp,
  Timestamp,
  updateDoc,
  writeBatch,
} from 'firebase/firestore'
import { Dormitory } from 'types/dormitories'
import {
  CensoredMusic,
  PlayedMusic,
  QueuedMusic,
  ReveilleConfig,
} from 'features/reveille/types/reveille'

// TODO: 빠르게 기숙사를 바꿨을 때 제대로 작동하나 확인

function ReveilleManagement() {
  const userData = useUserData()
  const reveilleConfigRef = doc(db, 'reveille', 'configuration')

  React.useEffect(() => {
    ;(async function () {
      if (userData !== undefined && userData !== null) {
        const defaultDormitory = getDefaultDormitory(userData)
        setOriginalDormitory(defaultDormitory)
        setDormitory(defaultDormitory)
        await loadMusic(defaultDormitory)
        setInitialLoading(false)

        const reveilleConfig = await getReveilleConfig()
        setReveilleConfig(reveilleConfig)
        setNewReveilleConfig(reveilleConfig)
      }
    })()
  }, [userData])
  const [originalDormitory, setOriginalDormitory] = React.useState<Dormitory>('sareum')

  const [intialLoading, setInitialLoading] = React.useState(true)

  const handleDormitoryChange = (_event: React.MouseEvent<HTMLElement>, newValue: Dormitory) => {
    if (newValue !== null) {
      setDormitory(newValue)
    }
  }
  const [dormitory, setDormitory] = React.useState<Dormitory>('sareum')

  React.useEffect(() => {
    ;(async function () {
      if (!intialLoading) {
        loadMusic(dormitory)
      }
    })()
  }, [dormitory])

  const loadMusic = async (dormitory: Dormitory) => {
    setQueueLoading(true)
    const queueList = await fetchReveillesQueue(dormitory)
    setQueue(queueList)
    setChecked([])
    setQueueLoading(false)
  }
  const handleLoadClick = () => {
    loadMusic(dormitory)
  }
  const [queue, setQueue] = React.useState<QueuedMusic[]>([])

  const [isQueueLoading, setQueueLoading] = React.useState(true)

  const handleMusicToggle = (value: number) => () => {
    const currentIndex = checked.indexOf(value)
    const newChecked = [...checked]

    if (currentIndex === -1) {
      newChecked.push(value)
      newChecked.sort()
    } else {
      newChecked.splice(currentIndex, 1)
    }
    setChecked(newChecked)
  }
  const [checked, setChecked] = React.useState<number[]>([])

  React.useEffect(() => {
    const titles: string[] = []
    checked.map((item) => {
      titles.push(queue[item].title + ' · ' + queue[item].artist)
    })

    setCheckedMusicStrings(titles)
  }, [checked])
  const [checkedMusicStrings, setCheckedMusicStrings] = React.useState<string[]>([])

  const handleDailyCopyAndPlay = () => {
    if (queue.length > 0) {
      handleDailySelect()
      setPlayedDialogOpen(true)
    } else {
      toast.error('곡이 하나도 없어요')
    }
  }

  const handleSelectAllClick = () => {
    if (checked.length === 0) {
      const allChecked = Array.from({ length: queue.length }, (_, i) => i)
      setChecked(allChecked)
    } else {
      setChecked([])
    }
  }

  const handleDailySelect = () => {
    if (queue.length >= reveilleConfig.playsPerDay[dormitory])
      setChecked(Array.from({ length: reveilleConfig.playsPerDay[dormitory] }, (_, i) => i))
    else setChecked(Array.from({ length: queue.length }, (_, i) => i))
  }

  const handleCopyClick = () => {
    const targets = checked

    if (targets.length > 0) {
      navigator.clipboard.writeText(checkedMusicStrings.join('\n'))
      toast.success(String(targets.length) + '곡을 복사했어요')
    } else {
      toast.error('한 개 이상의 곡을 선택해주세요')
    }
  }

  const handlePlayedClick = () => {
    if (checked.length > 0) {
      setPlayedDialogOpen(true)
    } else {
      toast.error('한 개 이상의 곡을 선택해주세요')
    }
  }
  const handlePlayedClose = () => {
    setPlayedDialogOpen(false)
  }
  const handlePlayedProcess = async () => {
    const targets = [...checked]
    const targetDormitory = dormitory
    setPlayedDialogOpen(false)
    const playedSetToastId = toast.loading('재생처리중')
    await playedSet(targets, targetDormitory)
    toast.success(String(targets.length) + '곡 재생처리에 성공했어요', { id: playedSetToastId })
    loadMusic(dormitory)
  }
  const handleCopyAndPlayedProcess = async () => {
    handleCopyClick()
    handlePlayedProcess()
  }
  const [playedDialogOpen, setPlayedDialogOpen] = React.useState(false)

  const playedSet = async (targets: number[], dormitory: Dormitory) => {
    const playedData: { [k: string]: any } = {}
    targets.map((index) => {
      const musicData: Omit<Omit<PlayedMusic, 'id'>, 'playedOn'> & {
        playedOn?: FieldValue
        id?: string
      } = { ...queue[index], playedOn: serverTimestamp() }
      const musicId = musicData.id as string
      delete musicData.id

      playedData[musicId] = musicData as Omit<Omit<PlayedMusic, 'id'>, 'playedOn'> & {
        playedOn: FieldValue
      }
    })

    const batch = writeBatch(db)
    for (const key in playedData) {
      const playedMusicRef = doc(db, 'reveille', dormitory, 'played', key)
      batch.set(playedMusicRef, playedData[key])

      const queueMusicRef = doc(db, 'reveille', dormitory, 'queue', key)
      batch.delete(queueMusicRef)

      const userRef = doc(db, 'user', playedData[key].user)
      batch.update(userRef, { reveillesApplied: increment(-1) })
    }

    await batch.commit()
  }

  const [CensorAskDialogOpen, setCensorAskDialogOpen] = React.useState(false)

  const handleCensorClick = () => {
    if (checked.length > 0) {
      setCensorAskDialogOpen(true)
    } else {
      toast.error('한 개 이상의 곡을 선택해주세요')
    }
  }
  const handleCensorAskProcess = () => {
    setCensorAskDialogOpen(false)
    setCensorProcessDialogOpen(true)
  }

  const [censorReason, setCensorReason] = React.useState('')
  const [banPeriod, setBanPeriod] = React.useState(3)

  const handleCensorProcessClose = () => {
    setCensorReason('')
    setBanPeriod(3)

    setCensorProcessDialogOpen(false)
  }
  const handleCensorProcessStart = async () => {
    if (censorReason === '') {
      toast.error('검열 사유를 작성해주세요')
      return
    }

    handleCensorProcessClose()

    const targets = [...checked]
    const reason = censorReason
    const period = banPeriod
    setCensorReason('')
    setBanPeriod(3)
    const censorProcessToastId = toast.loading(targets.length + '곡 검열 처리중')

    const censoredData: { [k: string]: any } = {}
    const targetUsers: string[] = []
    targets.map((index) => {
      const musicData: Omit<Omit<CensoredMusic, 'id'>, 'censoredOn'> & {
        censoredOn?: FieldValue
        id?: string
      } = { ...queue[index], censoredOn: serverTimestamp(), reason: reason }
      const musicId = musicData.id as string
      delete musicData.id

      censoredData[musicId] = musicData
      if (!targetUsers.includes(musicData.user)) targetUsers.push(musicData.user)
    })

    const batch = writeBatch(db)
    for (const key in censoredData) {
      const censoredMusicRef = doc(db, 'reveille', dormitory, 'censored', key)
      batch.set(censoredMusicRef, censoredData[key])

      const queueMusicRef = doc(db, 'reveille', dormitory, 'queue', key)
      batch.delete(queueMusicRef)

      const userRef = doc(db, 'user', censoredData[key].user)
      batch.update(userRef, { reveillesApplied: increment(-1) })
    }
    if (period !== 0) {
      const banDueDate = new Date()
      banDueDate.setDate(banDueDate.getDate() + period)

      const updateData: { [k: string]: FieldValue } = {}
      for (const user of targetUsers) {
        updateData['bannedUsers.' + user] = Timestamp.fromDate(banDueDate)
      }
      batch.update(reveilleConfigRef, updateData)
    }

    await batch.commit()
    toast.success('검열처리 성공!', { id: censorProcessToastId })

    loadMusic(dormitory)
  }
  const [CensorProcessDialogOpen, setCensorProcessDialogOpen] = React.useState(false)

  const dayMarks = [
    { value: 0, label: '0일' },
    { value: 3, label: '3일' },
    { value: 7, label: '1주' },
    { value: 14, label: '2주' },
  ]
  const musicMarks = [
    { value: 1, label: '1곡' },
    { value: 3, label: '' },
    { value: 2, label: '' },
    { value: 4, label: '' },
    { value: 5, label: '5곡' },
    { value: 6, label: '' },
    { value: 7, label: '' },
    { value: 8, label: '' },
    { value: 9, label: '' },
    { value: 10, label: '10곡' },
  ]

  const handleSettingsClick = async () => {
    setConfigOpen(true)
    setNewReveilleConfig(reveilleConfig)
  }

  const [reveilleConfig, setReveilleConfig] = React.useState<ReveilleConfig>({
    bannedUsers: {},
    maxReveilleApplies: { default: 5 },
    playsPerDay: {
      sareum: 5,
      chungwoon: 5,
    },
  })
  const [newReveilleConfig, setNewReveilleConfig] = React.useState<ReveilleConfig>({
    bannedUsers: {},
    maxReveilleApplies: { default: 5 },
    playsPerDay: {
      sareum: 5,
      chungwoon: 5,
    },
  })
  const [configOpen, setConfigOpen] = React.useState(false)
  const [isConfigApplying, setConfigApplying] = React.useState(false)

  const handleConfigApplyClick = async () => {
    setConfigOpen(false)
    setConfigApplying(true)

    await updateDoc(reveilleConfigRef, newReveilleConfig)

    setConfigApplying(false)
    setReveilleConfig(newReveilleConfig)
    toast.success('설정을 업데이트했어요')
  }

  return (
    <Box>
      <Paper>
        <Stack spacing={2} sx={{ p: 2 }}>
          <Stack direction='row' alignItems='center' justifyContent='space-between'>
            <Typography variant='h5'>기상음악 관리</Typography>
            <Stack direction='row' spacing={1} alignItems='center'>
              <ToggleButtonGroup
                color='primary'
                sx={{ height: '30px' }}
                value={dormitory}
                exclusive
                onChange={handleDormitoryChange}
              >
                <ToggleButton value='chungwoon'>청운</ToggleButton>
                <ToggleButton value='sareum'>사름</ToggleButton>
              </ToggleButtonGroup>
              <IconButton size='small' onClick={handleSettingsClick}>
                <SettingsIcon />
              </IconButton>
            </Stack>
          </Stack>
          <Box m={-2}>
            <Grid container direction='row-reverse' spacing={2}>
              <Grid item sm={3} xs={12}>
                <Grid container justifyContent='center' alignItems='stretch' spacing={1}>
                  <Grid item xs={12}>
                    <Button
                      onClick={handleDailyCopyAndPlay}
                      variant='contained'
                      startIcon={<FlashOnIcon />}
                      fullWidth
                    >
                      첫 {reveilleConfig.playsPerDay[dormitory]}개 제목 복사 후 재생처리
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <Divider />
                  </Grid>
                  <Grid item xs={6} sm={12}>
                    <Button
                      variant='outlined'
                      startIcon={checked.length === 0 ? <SelectAllIcon /> : <DeselectIcon />}
                      onClick={handleSelectAllClick}
                      fullWidth
                    >
                      모두 {checked.length === 0 ? '선택' : '해제'}
                    </Button>
                  </Grid>
                  <Grid item xs={6} sm={12}>
                    <Button
                      variant='outlined'
                      startIcon={<HighlightAltIcon />}
                      onClick={handleDailySelect}
                      fullWidth
                    >
                      첫 {reveilleConfig.playsPerDay[dormitory]}개 선택
                    </Button>
                  </Grid>
                  <Grid item xs={6} sm={12}>
                    <Button
                      variant='contained'
                      startIcon={<ContentCopyIcon />}
                      onClick={handleCopyClick}
                      fullWidth
                    >
                      제목 복사
                    </Button>
                  </Grid>
                  <Grid item xs={6} sm={12}>
                    <Button
                      variant='contained'
                      startIcon={<TaskAltIcon />}
                      onClick={handlePlayedClick}
                      fullWidth
                    >
                      재생처리
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant='contained'
                      startIcon={<AcUnitIcon />}
                      color='error'
                      onClick={handleCensorClick}
                      fullWidth
                    >
                      검열처리
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item sm={9} xs={12}>
                <Card>
                  <Box sx={{ height: '4px' }}>{isQueueLoading ? <LinearProgress /> : null}</Box>
                  <Box sx={{ height: '600px', overflow: 'auto' }}>
                    <List dense>
                      {queue.length === 0 ? (
                        <Stack
                          spacing={1}
                          alignItems='center'
                          justifyContent='center'
                          sx={{ height: '500px' }}
                        >
                          <DiscFullIcon sx={{ fontSize: 40, color: 'text.disabled' }} />
                          <Typography sx={{ color: 'text.disabled' }}>
                            저런.. 한 곡도 없네요
                          </Typography>
                        </Stack>
                      ) : (
                        queue.map((item, index) => {
                          const formatter = new Intl.DateTimeFormat('ko-KR', {
                            month: 'long',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: 'numeric',
                            hour12: false,
                            timeZone: 'Asia/Seoul',
                          })
                          const secondaryText = userData?.authority.includes('administrator')
                            ? item.userName + ' · ' + formatter.format(item.appliedOn)
                            : formatter.format(item.appliedOn)
                          return (
                            <ListItem disablePadding key={index}>
                              <ListItemButton onClick={handleMusicToggle(index)}>
                                <ListItemIcon>
                                  <Checkbox checked={checked.indexOf(index) !== -1} disableRipple />
                                </ListItemIcon>
                                <ListItemText
                                  primary={item.title + ' · ' + item.artist}
                                  secondary={secondaryText}
                                />
                              </ListItemButton>
                            </ListItem>
                          )
                        })
                      )}
                    </List>
                  </Box>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </Stack>
      </Paper>
      <Dialog open={playedDialogOpen}>
        <DialogTitle>경고: 되돌릴 수 없는 작업</DialogTitle>
        <DialogContent>
          <DialogContentText>
            아래 <b>{checked.length}곡을 재생처리</b>할까요?
            <br />
            <br />
          </DialogContentText>
          <Paper sx={{ p: 2 }}>
            {checkedMusicStrings.map((item, index) => (
              <Typography key={index}>{item}</Typography>
            ))}
          </Paper>
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePlayedClose}>취소</Button>
          <Button onClick={handleCopyAndPlayedProcess}>제목 복사 및 재생처리</Button>
          <Button onClick={handlePlayedProcess} variant='contained'>
            재생처리
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={CensorAskDialogOpen}>
        <DialogTitle>경고: 되돌릴 수 없는 작업</DialogTitle>
        <DialogContent>
          <DialogContentText>
            한 번 처리하면 되돌릴 수 없습니다. 정말 아래 <b>{checked.length}곡을 검열</b>
            하시겠습니까?
            <br />
            <br />
          </DialogContentText>
          <Paper sx={{ p: 2 }}>
            {checkedMusicStrings.map((item, index) => (
              <Typography key={index}>{item}</Typography>
            ))}
          </Paper>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCensorAskDialogOpen(false)}>취소</Button>
          <Button onClick={handleCensorAskProcess} color='error' variant='contained'>
            되돌릴 수 없음을 확인함
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={CensorProcessDialogOpen}>
        <DialogTitle>검열 세부정보 작성</DialogTitle>
        <DialogContent>
          <Stack spacing={3}>
            <Paper sx={{ p: 2 }}>
              {checkedMusicStrings.map((item, index) => (
                <Typography key={index}>{item}</Typography>
              ))}
            </Paper>
            <Stack>
              <DialogContentText>
                위 {checked.length}곡의 검열 사유를 작성하십시오.
              </DialogContentText>
              <TextField
                autoFocus
                margin='dense'
                label='검열 사유'
                fullWidth
                multiline
                variant='filled'
                value={censorReason}
                onChange={(e) => setCensorReason(e.target.value)}
              />
            </Stack>
            <Stack>
              <DialogContentText>
                신청자를 최대 14일간 밴할 수 있습니다. 기간을 선택하십시오.
              </DialogContentText>

              <Slider
                value={banPeriod}
                onChange={(_, value) => setBanPeriod(value as number)}
                step={1}
                valueLabelDisplay='auto'
                marks={dayMarks}
                min={0}
                max={14}
              />
            </Stack>
            <DialogContentText>
              <b>주의: 밴은 되돌릴 수 없습니다.</b>
            </DialogContentText>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCensorProcessClose}>취소</Button>
          <Button onClick={handleCensorProcessStart} color='error' variant='contained'>
            적용
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={configOpen} onClose={() => setConfigOpen(false)}>
        <DialogContent>
          <Stack spacing={4}>
            <Stack spacing={1}>
              <Typography variant='h6'>사용자 음악 신청 상한</Typography>
              <Slider
                value={newReveilleConfig.maxReveilleApplies.default}
                onChange={(_, value) =>
                  setNewReveilleConfig({
                    ...newReveilleConfig,
                    maxReveilleApplies: {
                      ...newReveilleConfig.maxReveilleApplies,
                      default: Number(value),
                    },
                  })
                }
                step={1}
                valueLabelDisplay='auto'
                marks={musicMarks}
                min={1}
                max={10}
              />
            </Stack>
            <Stack spacing={1}>
              <Typography variant='h6'>일일 음악 재생 추정치</Typography>
              <Stack direction='row'>
                <Typography sx={{ width: '50px', mt: '3px' }}>
                  <b>사름</b>
                </Typography>
                <Slider
                  value={newReveilleConfig.playsPerDay.sareum}
                  onChange={(_, value) =>
                    setNewReveilleConfig({
                      ...newReveilleConfig,
                      playsPerDay: { ...newReveilleConfig.playsPerDay, sareum: Number(value) },
                    })
                  }
                  step={1}
                  valueLabelDisplay='auto'
                  marks={musicMarks}
                  min={1}
                  max={10}
                />
              </Stack>
              <Stack direction='row'>
                <Typography sx={{ width: '50px', mt: '3px' }}>
                  <b>청운</b>
                </Typography>
                <Slider
                  value={newReveilleConfig.playsPerDay.chungwoon}
                  onChange={(_, value) =>
                    setNewReveilleConfig({
                      ...newReveilleConfig,
                      playsPerDay: { ...newReveilleConfig.playsPerDay, chungwoon: Number(value) },
                    })
                  }
                  step={1}
                  valueLabelDisplay='auto'
                  marks={musicMarks}
                  min={1}
                  max={10}
                />
              </Stack>
            </Stack>
            <DialogContentText>적용 버튼을 눌러야 적용됩니다.</DialogContentText>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfigOpen(false)}>취소</Button>
          <Button variant='contained' onClick={handleConfigApplyClick}>
            설정 적용
          </Button>
        </DialogActions>
      </Dialog>

      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isConfigApplying}
      >
        <CircularProgress color='inherit' />
      </Backdrop>
    </Box>
  )
}

export default ReveilleManagement
