import * as React from 'react'

import {
  Box,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  LinearProgress,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import {
  Bedtime as BedtimeIcon,
  Clear as ClearIcon,
  PriorityHigh as PriorityHighIcon,
  Search as SearchIcon,
} from '@mui/icons-material'

import { Dormitory } from 'types/dormitories'
import { getSearchResultList } from '../utils/music'
import { SearchedMusic } from '../types/reveille'
import useReveilleQueue from '../hooks/useReveilleQueue'
import useReveilleConfig from '../hooks/useReveilleConfig'
import { useAuth, useUserData } from 'features/authentication'
import { applyReveille, isBanned } from '../services/reveilleDb'
import { toast } from 'react-hot-toast'
import { minuteFormat } from 'utils/datetimeFormatter'

const ReveilleApplier = ({
  dormitory,
  showEmptyResult = true,
}: {
  dormitory: Dormitory
  showEmptyResult?: boolean
}) => {
  const user = useAuth()
  const userData = useUserData()
  const config = useReveilleConfig()
  React.useEffect(() => {
    if (config && user) {
      if (Object.keys(config.maxReveilleApplies).includes(user.uid)) {
        setMaxApplies(config.maxReveilleApplies[user.uid])
      } else {
        setMaxApplies(config.maxReveilleApplies.default)
      }
    }
  }, [config, user])
  const [maxApplies, setMaxApplies] = React.useState<number>(5)

  const reveille = useReveilleQueue()
  React.useEffect(() => {
    if (user) {
      let myAppliesCount = 0
      for (const queue of Object.values(reveille)) {
        for (const music of queue) {
          if (music.user === user.uid) myAppliesCount += 1
        }
      }
      setMyApplies(myAppliesCount)
    }
  }, [reveille])
  const [myApplies, setMyApplies] = React.useState<number>(99)

  const [query, setQuery] = React.useState('')

  const handleMusicSearch = async (query: string) => {
    setIsSearchLoading(true)
    setLastQuery(query)
    setResultList(await getSearchResultList(query))
    setIsSearchLoading(false)
  }
  const [isSearchLoading, setIsSearchLoading] = React.useState(false)
  const [lastQuery, setLastQuery] = React.useState('')
  const [resultList, setResultList] = React.useState<SearchedMusic[]>([])

  const handleMusicClick = async (index: number) => {
    if (maxApplies - myApplies <= 0) {
      toast.error(
        '신청 상한은 ' + maxApplies + '곡이에요. 현재 이미 ' + myApplies + '곡이나 신청했어요.',
      )
    } else {
      setTargetMusic(resultList[index])
      setIsApplyDialogOpen(true)
    }
  }
  const [targetMusic, setTargetMusic] = React.useState<SearchedMusic | undefined>(undefined)
  const [isApplyDialogOpen, setIsApplyDialogOpen] = React.useState(false)

  const handleCancelApply = () => {
    setIsApplyDialogOpen(false)
  }

  const handleApply = async () => {
    setIsApplyDialogOpen(false)
    if (user && userData) {
      if (config) {
        const banDueDate = isBanned(user.uid, config)
        if (banDueDate) {
          toast.error(minuteFormat(banDueDate) + '까지 밴으로 인해 신청이 제한됩니다')
        } else if (maxApplies - myApplies <= 0) {
          toast.error(
            '신청 상한은 ' + maxApplies + '곡이에요. 현재 이미 ' + myApplies + '곡이나 신청했어요.',
          )
        } else {
          const applyPromise = applyReveille(
            user.uid,
            dormitory,
            targetMusic as SearchedMusic,
            userData.name,
          )
          toast.promise(applyPromise, {
            loading: '신청 중이에요',
            success: '성공적으로 신청했어요',
            error: '신청에 실패했어요',
          })
        }
      }
    } else {
      toast.error('사용자 정보를 불러오지 못했어요. 새로고침해보세요!')
    }
  }

  return (
    <Stack>
      <Stack direction='row'>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleMusicSearch(query)
          }}
          style={{ width: '100%' }}
        >
          <TextField
            label='제목, 가수, 앨범명 검색'
            value={query}
            variant='filled'
            size='small'
            sx={{ width: '100%' }}
            onChange={(e) => setQuery(e.target.value)}
            InputProps={{
              endAdornment:
                query.length > 0 ? (
                  <InputAdornment position='end'>
                    <IconButton onClick={() => setQuery('')}>
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                ) : undefined,
            }}
          />
        </form>
        <Button
          variant='contained'
          disabled={isSearchLoading}
          startIcon={<SearchIcon />}
          sx={{ width: '100px' }}
          onClick={() => handleMusicSearch(query)}
        >
          검색
        </Button>
      </Stack>
      {!showEmptyResult && lastQuery === '' ? null : (
        <Card sx={{ height: '365px', overflow: 'auto' }}>
          <Box>{isSearchLoading ? <LinearProgress /> : null}</Box>
          {isSearchLoading ? null : resultList.length > 0 ? (
            <List>
              {resultList.map((item, index) => (
                <ListItemButton key={index} onClick={() => handleMusicClick(index)}>
                  <ListItemText primary={item.name} secondary={item.artist} />
                </ListItemButton>
              ))}
            </List>
          ) : lastQuery === '' ? (
            <NoQuery />
          ) : (
            <NoResult />
          )}
        </Card>
      )}
      <Dialog open={isApplyDialogOpen} onClose={handleCancelApply}>
        <DialogTitle>{targetMusic?.name}</DialogTitle>
        <DialogContent>
          <Typography>이 음악을 신청할까요?</Typography>
          <Typography>
            {maxApplies - myApplies}곡 더 신청할 수 있어요. (신청 상한: {maxApplies}곡)
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelApply}>아니요</Button>
          <Button variant='contained' autoFocus onClick={handleApply}>
            네
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  )
}

const NoQuery = () => {
  return (
    <Stack spacing={1} alignItems='center' justifyContent='center' sx={{ height: 'inherit' }}>
      <BedtimeIcon sx={{ fontSize: 40, color: 'text.disabled' }} />
      <Typography sx={{ color: 'text.disabled' }}>아직 검색어가 없네요 {':-)'}</Typography>
    </Stack>
  )
}

const NoResult = () => {
  return (
    <Stack spacing={1} alignItems='center' justifyContent='center' sx={{ height: 'inherit' }}>
      <PriorityHighIcon sx={{ fontSize: 40, color: 'text.disabled' }} />
      <Typography sx={{ color: 'text.disabled' }}>결과가 없어요 {':-('}</Typography>
    </Stack>
  )
}

export default ReveilleApplier
