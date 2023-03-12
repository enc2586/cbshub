import * as React from 'react'

import {
  Box,
  Card,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  Stack,
  SxProps,
  Theme,
  Typography,
} from '@mui/material'

import { Delete as DeleteIcon, DiscFull as DiscFullIcon } from '@mui/icons-material'

import useReveilleConfig from '../hooks/useReveilleConfig'
import useReveilleQueue from '../hooks/useReveilleQueue'
import { Dormitory } from 'types/dormitories'
import { useAuth } from 'features/authentication'
import { removeReveille } from '../services/reveilleDb'
import toast from 'react-hot-toast'
import { User } from 'firebase/auth'
import { QueuedMusic, ReveilleConfig } from '../types/reveille'

function ReveilleQueue({
  dormitory,
  sx,
}: {
  dormitory: Dormitory
  sx?: SxProps<Theme> | undefined
}) {
  const user = useAuth()
  const config = useReveilleConfig()
  const reveilleQueue = useReveilleQueue()

  return (
    <Card sx={sx}>
      <Box sx={{ height: 'inherit', overflow: 'auto' }}>
        {reveilleQueue[dormitory].length > 0 ? (
          <List dense>{queueList(user, config, dormitory, reveilleQueue[dormitory])}</List>
        ) : (
          <Stack spacing={1} alignItems='center' justifyContent='center' sx={{ height: 'inherit' }}>
            <DiscFullIcon sx={{ fontSize: 40, color: 'text.disabled' }} />
            <Typography sx={{ color: 'text.disabled' }}>비어 있네요. 하나 신청해주세요!</Typography>
          </Stack>
        )}
      </Box>
    </Card>
  )
}

const queueList = (
  user: User | undefined | null,
  config: ReveilleConfig | undefined,
  dormitory: Dormitory,
  queue: QueuedMusic[],
) => {
  if (config && user) {
    const children = []
    const playsPerDay = config.playsPerDay[dormitory]

    for (let i = 0; i < queue.length; i++) {
      if (i % playsPerDay === 0) {
        if (i !== 0) children.push(<Divider key={'divider' + String(i)} />)
        children.push(
          <ListSubheader key={'subheader' + String(i)}>{i / playsPerDay}일 후 재생</ListSubheader>,
        )
      }

      const item = queue[i]
      const child = (
        <ListItem
          key={i}
          secondaryAction={
            item.user === user.uid ? <RemoveButton dormitory={dormitory} itemId={item.id} /> : null
          }
        >
          <ListItemText primary={item.title} secondary={item.artist} />
        </ListItem>
      )

      children.push(child)
    }
    return children
  }
  return []
}

function RemoveButton({ dormitory, itemId }: { dormitory: Dormitory; itemId: string }) {
  const handleButtonClick = async () => {
    setClicked(true)
    const removePromise = removeReveille(dormitory, itemId)
    await toast.promise(removePromise, {
      loading: '삭제중...',
      success: '성공적으로 삭제했어요',
      error: '삭제에 실패했어요',
    })
    setClicked(false)
  }
  const [clicked, setClicked] = React.useState(false)
  return (
    <IconButton onClick={handleButtonClick} disabled={clicked}>
      <DeleteIcon />
    </IconButton>
  )
}

export default ReveilleQueue
