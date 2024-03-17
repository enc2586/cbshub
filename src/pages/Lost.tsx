import { useLocation } from 'react-router-dom'

import { Paper, Stack, Typography } from '@mui/material'

import { ErrorWindow, lostImage } from 'features/error'

function Lost() {
  const location = useLocation()

  return (
    <ErrorWindow
      title='404 NOT FOUND'
      image={lostImage}
      imageCaption='출처: 봇치 더 록!'
      primaryAdornment={
        <Stack direction='row' alignItems='center' spacing={1}>
          <Paper sx={{ p: 0.5 }}>
            <Typography>
              <b>{location.pathname}</b>
            </Typography>
          </Paper>
          <Typography>페이지를 찾을 수 없어요.</Typography>
        </Stack>
      }
    />
  )
}

export default Lost
