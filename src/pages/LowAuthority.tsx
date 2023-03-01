import { useNavigate } from 'react-router-dom'

import { Button, Paper, Stack, Typography } from '@mui/material'

function LowAuthority({ needed }: { needed: string }) {
  const navigate = useNavigate()

  return (
    <Paper sx={{ p: 2 }}>
      <Stack spacing={2}>
        <Typography variant='h4'>권한이 부족해요...</Typography>
        <Stack direction='row' alignItems='center' spacing={1}>
          <Paper sx={{ p: 0.5 }}>
            <Typography>
              <b>{needed}</b>
            </Typography>
          </Paper>
          <Typography>권한이 필요해요. 관리자에게 문의해주세요.</Typography>
        </Stack>
        <Stack sx={{ width: 'inherit' }} alignItems='center'>
          <img
            src='images\lowauthority.jpg'
            style={{ width: '100%', maxWidth: '500px', borderRadius: '10px' }}
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

export default LowAuthority
