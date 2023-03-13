import { Button, SxProps, Theme } from '@mui/material'
import { Login as LoginIcon } from '@mui/icons-material'

import { useLocation, useNavigate } from 'react-router-dom'

function LoginToContinueButton({
  variant,
  sx,
}: {
  variant?: 'text' | 'outlined' | 'contained'
  sx?: SxProps<Theme>
}) {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <Button
      variant={variant}
      onClick={() => navigate('/signin', { state: { from: location } })}
      sx={sx}
      endIcon={<LoginIcon />}
    >
      로그인해 계속하기
    </Button>
  )
}

export default LoginToContinueButton
