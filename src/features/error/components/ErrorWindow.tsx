import { useNavigate } from 'react-router-dom'

import { Button, Paper, Stack, Typography } from '@mui/material'

import { ReactNode } from 'react'

function ErrorWindow({
  title,
  image,
  imageCaption,
  primaryAdornment,
  secondaryAdornment,
}: {
  title: string
  image?: string
  imageCaption?: string
  primaryAdornment: ReactNode
  secondaryAdornment?: ReactNode
}) {
  const navigate = useNavigate()

  return (
    <Paper sx={{ p: 2 }}>
      <Stack spacing={2}>
        <Typography variant='h4'>{title}</Typography>
        {primaryAdornment}
        {image ? (
          <Stack sx={{ width: 'inherit' }} alignItems='center' spacing={1}>
            <img src={image} style={{ width: '100%', maxWidth: '700px', borderRadius: '10px' }} />
            {imageCaption ? <Typography color='text.secondary'>{imageCaption}</Typography> : null}
          </Stack>
        ) : null}
        {secondaryAdornment}
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

export default ErrorWindow
