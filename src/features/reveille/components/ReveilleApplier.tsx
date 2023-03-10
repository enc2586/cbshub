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
        '?????? ????????? ' + maxApplies + '????????????. ?????? ?????? ' + myApplies + '????????? ???????????????.',
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
          toast.error(minuteFormat(banDueDate) + '?????? ????????? ?????? ????????? ???????????????')
        } else if (maxApplies - myApplies <= 0) {
          toast.error(
            '?????? ????????? ' + maxApplies + '????????????. ?????? ?????? ' + myApplies + '????????? ???????????????.',
          )
        } else {
          const applyPromise = applyReveille(
            user.uid,
            dormitory,
            targetMusic as SearchedMusic,
            userData.name,
          )
          toast.promise(applyPromise, {
            loading: '?????? ????????????',
            success: '??????????????? ???????????????',
            error: '????????? ???????????????',
          })
        }
      }
    } else {
      toast.error('????????? ????????? ???????????? ????????????. ????????????????????????!')
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
            label='??????, ??????, ????????? ??????'
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
          ??????
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
          <Typography>??? ????????? ????????????????</Typography>
          <Typography>
            {maxApplies - myApplies}??? ??? ????????? ??? ?????????. (?????? ??????: {maxApplies}???)
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelApply}>?????????</Button>
          <Button variant='contained' autoFocus onClick={handleApply}>
            ???
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
      <Typography sx={{ color: 'text.disabled' }}>?????? ???????????? ????????? {':-)'}</Typography>
    </Stack>
  )
}

const NoResult = () => {
  return (
    <Stack spacing={1} alignItems='center' justifyContent='center' sx={{ height: 'inherit' }}>
      <PriorityHighIcon sx={{ fontSize: 40, color: 'text.disabled' }} />
      <Typography sx={{ color: 'text.disabled' }}>????????? ????????? {':-('}</Typography>
    </Stack>
  )
}

export default ReveilleApplier
