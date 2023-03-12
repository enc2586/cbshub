import { Box, List, ListItem, ListItemText, Stack, SxProps, Theme, Typography } from '@mui/material'
import { DiscFull as DiscFullIcon } from '@mui/icons-material'
import { Dormitory } from 'types/dormitories'
import useReveilleCensored from '../hooks/useReveilleCensored'

function ReveilleCensored({
  dormitory,
  sx,
}: {
  dormitory: Dormitory
  sx?: SxProps<Theme> | undefined
}) {
  const played = useReveilleCensored()

  return (
    <Box sx={{ ...sx, overflow: 'auto' }}>
      {played[dormitory].length > 0 ? (
        <List dense>
          {played[dormitory].map((item, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={item.title + ' · ' + item.artist}
                secondary={'사유: ' + item.reason}
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

export default ReveilleCensored
