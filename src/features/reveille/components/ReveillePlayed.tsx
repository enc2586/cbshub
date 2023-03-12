import { Box, List, ListItem, ListItemText, Stack, SxProps, Theme, Typography } from '@mui/material'
import { DiscFull as DiscFullIcon } from '@mui/icons-material'
import { minuteFormat } from 'utils/datetimeFormatter'
import useReveillePlayed from '../hooks/useReveillePlayed'
import { Dormitory } from 'types/dormitories'

function ReveillePlayed({
  dormitory,
  sx,
}: {
  dormitory: Dormitory
  sx?: SxProps<Theme> | undefined
}) {
  const played = useReveillePlayed()

  return (
    <Box sx={{ ...sx, overflow: 'auto' }}>
      {played[dormitory].length > 0 ? (
        <List dense>
          {played[dormitory].map((item, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={item.title + ' · ' + item.artist}
                secondary={minuteFormat(item.playedOn) + '에 재생처리됨'}
              />
            </ListItem>
          ))}
        </List>
      ) : (
        <Stack spacing={1} alignItems='center' justifyContent='center' sx={{ height: 'inherit' }}>
          <DiscFullIcon sx={{ fontSize: 40, color: 'text.disabled' }} />
          <Typography sx={{ color: 'text.disabled' }}>비어 있네요.</Typography>
        </Stack>
      )}
    </Box>
  )
}

export default ReveillePlayed
