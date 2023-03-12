import { useLocation } from 'react-router-dom'

import { Paper, Stack, Typography } from '@mui/material'

import { ErrorWindow, lostImage } from 'features/error'

function Lost() {
  const location = useLocation()

  return (
    <ErrorWindow
      title='길을 잃었어요...'
      image={lostImage}
      imageCaption='출처: 봇치 더 록! | 사진 제공: 방희*'
      primaryAdornment={
        <Stack direction='row' alignItems='center' spacing={1}>
          <Paper sx={{ p: 0.5 }}>
            <Typography>
              <b>{location.pathname}</b>
            </Typography>
          </Paper>
          <Typography>같은 페이지는 존재하지 않아요.</Typography>
        </Stack>
      }
    />
  )
}

export default Lost
