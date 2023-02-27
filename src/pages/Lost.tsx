import { Button, Paper, Stack, Typography } from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'

function Lost() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <Paper sx={{ p: 2 }}>
      <Stack spacing={2}>
        <Typography variant='h4'>길을 잃으셨나요?</Typography>
        <Stack direction='row' alignItems='center' spacing={1}>
          <Paper sx={{ p: 0.5 }}>
            <Typography>
              <b>{location.pathname}</b>
            </Typography>
          </Paper>
          <Typography>같은 페이지는 존재하지 않아요.</Typography>
        </Stack>
        <Stack sx={{ width: 'inherit' }} alignItems='center'>
          <img
            src='images\bocchi.jpg'
            style={{ width: '100%', maxWidth: '700px', borderRadius: '10px' }}
          />
        </Stack>
        <Stack direction='row-reverse' spacing={2}>
          <Button variant='contained' onClick={() => navigate(-1)}>
            뒤로가기
          </Button>
          <Button onClick={() => navigate('/')}>홈으로 돌아가기</Button>
        </Stack>
      </Stack>
    </Paper>
  )
}

export default Lost
