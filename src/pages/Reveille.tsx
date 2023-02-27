import React from 'react'

import {
  Alert,
  Badge,
  Box,
  Button,
  Card,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListSubheader,
  Paper,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import BedtimeIcon from '@mui/icons-material/Bedtime'
import PriorityHighIcon from '@mui/icons-material/PriorityHigh'
import DeleteIcon from '@mui/icons-material/Delete'
import RefreshIcon from '@mui/icons-material/Refresh'
import DiscFullIcon from '@mui/icons-material/DiscFull'
import DoneAllIcon from '@mui/icons-material/DoneAll'
import AcUnitIcon from '@mui/icons-material/AcUnit'
import VpnKeyIcon from '@mui/icons-material/VpnKey'

import { Stack } from '@mui/system'
import { musicSearchAPI } from 'services/musieSearchAPI'
import {
  collection,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  increment,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  writeBatch,
} from 'firebase/firestore'
import { auth, db } from 'configs/firebase'
import { toast } from 'react-hot-toast'
import { User } from 'firebase/auth'
import { CensoredMusic, Dormitory, PlayedMusic, QueuedMusic } from 'types/reveille'
import useAuthData from 'hooks/useAuthData'
import { getDefaultDormitory, getReveilleConfig } from 'utils/reveille'
import {
  fetchReveillesQueue,
  fetchReveillesPlayed,
  fetchReveillesCensored,
} from 'services/reveilles'
import useAuth from 'hooks/useAuth'
import { fetchUserData } from 'utils/auth'
import { UserData } from 'types/auth'
import { useNavigate } from 'react-router-dom'

type musicInfo = {
  name: string
  artist: string
}

const dateFormatter = new Intl.DateTimeFormat('ko-KR', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  hour12: false,
  timeZone: 'Asia/Seoul',
})

function Reveille() {
  const user = useAuth() as User
  const userData = useAuthData()
  const navigate = useNavigate()

  React.useEffect(() => {
    ;(async function () {
      if (userData !== undefined && userData !== null) {
        const defaultDormitory = getDefaultDormitory(userData)
        setOriginalDormitory(defaultDormitory)
        setDormitory(defaultDormitory)
        await loadMusicQueue(defaultDormitory)
        await loadSecondaryData(defaultDormitory)
        setInitialLoading(false)

        if (userData.authority !== undefined) {
          if (
            userData.authority.includes('reveilleManager') ||
            userData.authority.includes('admin')
          ) {
            setAdmin(true)
          }
        }

        const reveilleConfig = await getReveilleConfig()
        setMaxReveilleApplies(reveilleConfig.maxReveilleApplies.default)
        setPlaysPerDay(reveilleConfig.playsPerDay)
        if (user.uid in reveilleConfig.bannedUsers) {
          const banDueDate = reveilleConfig.bannedUsers[user.uid].toDate()
          if (banDueDate > new Date()) {
            setBanDue(dateFormatter.format(banDueDate))
            return
          } else {
            await unban(user.uid, reveilleConfig)
          }
        }
      }
    })()
  }, [userData])
  const [originalDormitory, setOriginalDormitory] = React.useState<Dormitory>('sareum')
  const [dormitory, setDormitory] = React.useState<Dormitory>('sareum')
  const [banDue, setBanDue] = React.useState<string>('')
  const [isAdmin, setAdmin] = React.useState(false)
  const [maxReveilleApplies, setMaxReveilleApplies] = React.useState(5)
  const [playesPerDay, setPlaysPerDay] = React.useState({
    sareum: 7,
    chungwoon: 7,
  })
  const [initialLoading, setInitialLoading] = React.useState(true)

  React.useEffect(() => {
    if (!initialLoading) {
      loadMusicQueue(dormitory)
      loadSecondaryData(dormitory)
    }
  }, [dormitory])

  const loadMusicQueue = async (targetDormitory: Dormitory) => {
    setMusicQueueLoading(true)

    const tempMusicQueueList = await fetchReveillesQueue(targetDormitory)
    setMusicQueueList(tempMusicQueueList)

    setMusicQueueLoading(false)
  }
  const [isMusicQueueLoading, setMusicQueueLoading] = React.useState(true)
  const [musicQueueList, setMusicQueueList] = React.useState<QueuedMusic[]>([])

  const handleDormitoryChange = (_event: React.MouseEvent<HTMLElement>, newValue: Dormitory) => {
    if (newValue !== null) {
      setDormitory(newValue)
    }
  }

  const [musicQuery, setMusicQuery] = React.useState('')
  const [lastQuery, setLastQuery] = React.useState('')

  const [isSearchLoading, setSearchLoadingState] = React.useState(false)

  const [searchedMusics, setSearchedMusics] = React.useState<musicInfo[]>([])
  const searchMusic = async () => {
    setSelectedIndex(undefined)
    setSearchLoadingState(true)
    setLastQuery(musicQuery)

    const searchResult = await musicSearchAPI(musicQuery)
    setSearchedMusics(searchResult)

    setSearchLoadingState(false)
  }

  const handleApplyDialogClose = () => {
    setSelectedIndex(undefined)
    setDialogOpen(false)
  }
  const handleMusicClick = (index: number) => () => {
    setSelectedIndex(index)
    setDialogOpen(true)
  }
  const [isDialogOpen, setDialogOpen] = React.useState(false)
  const [selectedIndex, setSelectedIndex] = React.useState<undefined | number>(undefined)

  const applyMusic = async () => {
    const stateToastId = toast.loading('신청 권한 검증 중...')
    const title = searchedMusics[selectedIndex as number].name
    const artist = searchedMusics[selectedIndex as number].artist
    const targetDormitory = dormitory
    handleApplyDialogClose()

    try {
      const reveilleConfig = await getReveilleConfig()
      if (user.uid in reveilleConfig.bannedUsers) {
        const banDueDate = reveilleConfig.bannedUsers[user.uid].toDate()
        if (banDueDate > new Date()) {
          toast.error(
            dateFormatter.format(banDueDate) + '까지 밴으로 인해 신규 신청이 제한되었습니다.',
            { id: stateToastId, duration: 15000 },
          )
          return
        } else {
          await unban(user.uid, reveilleConfig)
        }
      }

      const currentUserData: UserData = (await fetchUserData(user.uid)) as UserData
      const reveillesCount = currentUserData.reveillesApplied
      let maxReveilleApplies: number
      if (user.uid in reveilleConfig.maxReveilleApplies) {
        maxReveilleApplies = reveilleConfig.maxReveilleApplies[user.uid]
      } else {
        maxReveilleApplies = reveilleConfig.maxReveilleApplies.default
      }
      if (reveillesCount >= maxReveilleApplies) {
        toast.error('한 번에 신청할 수 있는 횟수를 넘었어요', { id: stateToastId })
        return
      }
      toast.loading('신규 신청 등록 중...', { id: stateToastId })

      const batch = writeBatch(db)
      const userRef = doc(db, 'user', user.uid)
      batch.update(userRef, { reveillesApplied: increment(1) })

      const reveilleRef = doc(collection(db, 'reveille', targetDormitory, 'queue'))
      const musicApplyData = {
        title: title,
        artist: artist,
        userName: currentUserData.name,
        user: user.uid,
        appliedOn: serverTimestamp(),
      }
      batch.set(reveilleRef, musicApplyData)
      await batch.commit()

      toast.success('성공적으로 음악을 신청했어요', { id: stateToastId })
      setMusicQuery('')
      setLastQuery('')
      setSearchedMusics([])
      setDormitory(targetDormitory)
      loadMusicQueue(targetDormitory)
    } catch (error) {
      console.error(error)
      toast.error('음악 신청에 실패했어요', { id: stateToastId })
    }
  }
  const unban = async (uid: string, previousConfig: DocumentData) => {
    const bannedUsers = previousConfig.bannedUsers
    delete bannedUsers[uid]

    const newReveilleConfig = {
      ...previousConfig,
      bannedUsers: bannedUsers,
    }

    const reveilleConfigRef = doc(db, 'reveille', 'configuration')
    await setDoc(reveilleConfigRef, newReveilleConfig)
  }

  const loadSecondaryData = async (targetDormitory: Dormitory) => {
    setSecondaryDataLoading(true)

    setMusicPlayedList((await fetchReveillesPlayed(targetDormitory, 30)) as PlayedMusic[])
    setMusicCensoredList((await fetchReveillesCensored(targetDormitory, 14)) as CensoredMusic[])

    setSecondaryDataLoading(false)
  }
  const [isSecondaryDataLoading, setSecondaryDataLoading] = React.useState(true)

  const [musicPlayedList, setMusicPlayedList] = React.useState<PlayedMusic[]>([])
  const [musicCensoredList, setMusicCensoredList] = React.useState<CensoredMusic[]>([])
  const [secondaryDataType, setSecondaryDataType] = React.useState<'played' | 'censored'>('played')

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          {banDue !== '' ? (
            <Alert severity='error'>밴으로 인해 {banDue} 까지 신규 신청이 제한되었습니다.</Alert>
          ) : null}
        </Grid>
        <Grid item md={4} sm={6} xs={12}>
          <Paper>
            <Stack sx={{ p: 2 }} spacing={2}>
              <Stack direction='row' alignItems='center' justifyContent='space-between'>
                <Typography variant='h5'>기상음악 신청</Typography>
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
              </Stack>
              <Stack>
                <Stack direction='row'>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      searchMusic()
                    }}
                    style={{ width: '100%' }}
                  >
                    <TextField
                      label='제목, 가수, 앨범명 검색'
                      value={musicQuery}
                      variant='filled'
                      size='small'
                      sx={{ width: '100%' }}
                      onChange={(e) => setMusicQuery(e.target.value)}
                    />
                  </form>
                  <Button
                    variant='contained'
                    // size='small'
                    disabled={isSearchLoading}
                    startIcon={<SearchIcon />}
                    sx={{ width: '100px' }}
                    onClick={() => searchMusic()}
                  >
                    검색
                  </Button>
                </Stack>
                <Card sx={{ height: '365px', overflow: 'auto' }}>
                  {isSearchLoading ? (
                    <LinearProgress />
                  ) : searchedMusics.length === 0 ? (
                    lastQuery === '' ? (
                      <Stack
                        spacing={1}
                        alignItems='center'
                        justifyContent='center'
                        sx={{ height: 'inherit' }}
                      >
                        <BedtimeIcon sx={{ fontSize: 40, color: 'text.disabled' }} />
                        <Typography sx={{ color: 'text.disabled' }}>
                          아직 검색어가 없네요 :-)
                        </Typography>
                      </Stack>
                    ) : (
                      <Stack
                        spacing={1}
                        alignItems='center'
                        justifyContent='center'
                        sx={{ height: 'inherit' }}
                      >
                        <PriorityHighIcon sx={{ fontSize: 40, color: 'text.disabled' }} />
                        <Typography sx={{ color: 'text.disabled' }}>결과가 없어요 :-(</Typography>
                      </Stack>
                    )
                  ) : (
                    <List>
                      {searchedMusics.map((item, index) => (
                        <ListItemButton
                          key={index}
                          selected={selectedIndex === index}
                          onClick={handleMusicClick(index)}
                        >
                          <ListItemText primary={item.name} secondary={item.artist} />
                        </ListItemButton>
                      ))}
                    </List>
                  )}
                </Card>
              </Stack>
            </Stack>
          </Paper>
        </Grid>
        <Grid item md={8} sm={6} xs={12}>
          <Paper>
            <Stack sx={{ p: 2 }} spacing={2}>
              <Stack direction='row' alignItems='center' justifyContent='space-between'>
                <Typography variant='h5'>대기열</Typography>
                <Stack direction='row' spacing={1}>
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
                  <Button
                    disabled={isMusicQueueLoading && isSecondaryDataLoading}
                    variant='outlined'
                    size='small'
                    sx={{ height: '30px' }}
                    startIcon={<RefreshIcon />}
                    onClick={() => {
                      loadMusicQueue(dormitory)
                      loadSecondaryData(dormitory)
                    }}
                  >
                    새로고침
                  </Button>
                </Stack>
              </Stack>
              <Box m={-2}>
                <Grid container spacing={2}>
                  <Grid item md={6} xs={12}>
                    <Card sx={{ height: '413px' }}>
                      <Box sx={{ height: '4px' }}>
                        {isMusicQueueLoading ? <LinearProgress /> : null}
                      </Box>
                      <Box sx={{ height: '409px', overflow: 'auto' }}>
                        {musicQueueList.length !== 0 ? (
                          <MusicQueueList
                            items={musicQueueList}
                            playsPerDay={playesPerDay[dormitory]}
                            dormitory={dormitory}
                            refreshFunction={loadMusicQueue}
                          />
                        ) : (
                          <Stack
                            spacing={1}
                            alignItems='center'
                            justifyContent='center'
                            sx={{ height: '409px' }}
                          >
                            <DiscFullIcon sx={{ fontSize: 40, color: 'text.disabled' }} />
                            <Typography sx={{ color: 'text.disabled' }}>
                              비어 있네요. 하나 신청해주세요!
                            </Typography>
                          </Stack>
                        )}
                      </Box>
                    </Card>
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <Card sx={{ height: '413px' }}>
                      <Box sx={{ height: '4px' }}>
                        {isSecondaryDataLoading ? <LinearProgress /> : null}
                      </Box>
                      <Stack direction='row' spacing={1} sx={{ m: 1 }}>
                        <Chip
                          label='재생된 음악'
                          size='small'
                          color={secondaryDataType === 'played' ? 'primary' : 'default'}
                          icon={<DoneAllIcon />}
                          variant='filled'
                          onClick={() => {
                            setSecondaryDataType('played')
                          }}
                        />
                        <Chip
                          label='검열된 음악'
                          size='small'
                          color={secondaryDataType === 'censored' ? 'primary' : 'default'}
                          icon={<AcUnitIcon />}
                          variant='filled'
                          onClick={() => {
                            setSecondaryDataType('censored')
                          }}
                        />
                      </Stack>
                      <Box sx={{ height: '370px', overflow: 'auto' }}>
                        <List dense>
                          {secondaryDataType === 'played' ? (
                            musicPlayedList.length > 0 ? (
                              musicPlayedList.map((item, index) => (
                                <ListItem key={index}>
                                  <ListItemText
                                    primary={item.title + ' · ' + item.artist}
                                    secondary={
                                      dateFormatter.format(item.playedOn) + '에 재생처리됨'
                                    }
                                  />
                                </ListItem>
                              ))
                            ) : (
                              <Stack
                                spacing={1}
                                alignItems='center'
                                justifyContent='center'
                                sx={{ height: '300px' }}
                              >
                                <DiscFullIcon sx={{ fontSize: 40, color: 'text.disabled' }} />
                                <Typography sx={{ color: 'text.disabled' }}>
                                  아무것도 없어요 :-)
                                </Typography>
                              </Stack>
                            )
                          ) : musicCensoredList.length > 0 ? (
                            musicCensoredList.map((item, index) => (
                              <ListItem key={index}>
                                <ListItemText
                                  primary={item.title + ' · ' + item.artist}
                                  secondary={'사유: ' + item.reason}
                                />
                              </ListItem>
                            ))
                          ) : (
                            <Stack
                              spacing={1}
                              alignItems='center'
                              justifyContent='center'
                              sx={{ height: '300px' }}
                            >
                              <DiscFullIcon sx={{ fontSize: 40, color: 'text.disabled' }} />
                              <Typography sx={{ color: 'text.disabled' }}>
                                아무것도 없어요 :-)
                              </Typography>
                            </Stack>
                          )}
                        </List>
                      </Box>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            </Stack>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Button
            variant='contained'
            color='secondary'
            fullWidth
            startIcon={<VpnKeyIcon />}
            onClick={() => {
              navigate('/reveille/manage')
            }}
          >
            기상음악 관리 패널 열기
          </Button>
        </Grid>
      </Grid>
      <Dialog open={isDialogOpen} onClose={handleApplyDialogClose}>
        <DialogTitle>
          {typeof selectedIndex === 'number' ? searchedMusics[selectedIndex].name : '0_0'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            이 음악을 신청할까요?
            <br />한 번에 최대 {String(maxReveilleApplies)}곡까지 신청할 수 있습니다.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleApplyDialogClose}>아니요</Button>
          <Button variant='contained' autoFocus onClick={() => applyMusic()}>
            네
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

function MusicQueueList({
  items,
  playsPerDay,
  dormitory,
  refreshFunction,
}: {
  items: QueuedMusic[]
  playsPerDay: number
  dormitory: 'sareum' | 'chungwoon'
  refreshFunction: (dormitory: 'sareum' | 'chungwoon') => Promise<void>
}) {
  const user = auth.currentUser as User
  const children = []

  for (let i = 0; i < items.length; i++) {
    if (i % playsPerDay === 0) {
      if (i !== 0) {
        children.push(<Divider key={'divider' + String(i)} />)
      }
      children.push(
        <ListSubheader key={'subheader' + String(i)}>{i / playsPerDay}일 후 재생</ListSubheader>,
      )
    }

    const item = items[i]
    const child = (
      <ListItem
        key={i}
        secondaryAction={
          item.user == user.uid ? (
            <RemoveMusicButton
              dormitory={dormitory}
              itemId={item.id!}
              itemUser={item.user}
              onClick={refreshFunction}
            />
          ) : null
        }
      >
        <ListItemText primary={item.title} secondary={item.artist} />
      </ListItem>
    )

    children.push(child)
  }

  return <List dense>{children}</List>
}

function RemoveMusicButton({
  dormitory,
  itemId,
  itemUser,
  onClick,
}: {
  dormitory: 'sareum' | 'chungwoon'
  itemId: string
  itemUser: string
  onClick: (dormitory: 'sareum' | 'chungwoon') => Promise<void>
}) {
  const removeMusic = async (dormitory: 'sareum' | 'chungwoon', id: string, user: string) => {
    const removeMusicToastId = toast.loading('음악 삭제 중...')
    try {
      setDisabled(true)
      const batch = writeBatch(db)
      const musicRef = doc(db, 'reveille', dormitory, 'queue', id)
      batch.delete(musicRef)
      const userRef = doc(db, 'user', user)
      batch.update(userRef, { reveillesApplied: increment(-1) })
      await batch.commit()
      toast.success('음악을 삭제했어요', { id: removeMusicToastId })
    } catch (error) {
      console.error(error)
      toast.error('음악을 삭제하지 못했어요', { id: removeMusicToastId })
    } finally {
      await onClick(dormitory)
      setDisabled(false)
    }
  }

  const [isDisabled, setDisabled] = React.useState(false)
  return (
    <IconButton disabled={isDisabled} onClick={() => removeMusic(dormitory, itemId, itemUser)}>
      <DeleteIcon />
    </IconButton>
  )
}

export default Reveille
