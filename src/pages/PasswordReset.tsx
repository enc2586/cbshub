import * as React from 'react'

import {
  Alert,
  AlertTitle,
  Button,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { toast } from 'react-hot-toast'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from 'configs/firebase'
import { useNavigate } from 'react-router-dom'

function PasswordReset() {
  const navigate = useNavigate()

  const handleEmailChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setEmail(event.target.value)
  }
  const [email, setEmail] = React.useState('')

  const handleConfirmClick = async () => {
    const passwordResetToastId = toast.loading('이메일 보내는 중...')
    try {
      sendPasswordResetEmail(auth, email)
    } catch (error) {
      console.error(error)
      toast.error('알 수 없는 에러가 발생했어요', { id: passwordResetToastId })
      return
    }

    toast.success('비밀번호 재설정 메일을 보냈어요', { id: passwordResetToastId })
    setEmailSent(true)
  }
  const [isEmailSent, setEmailSent] = React.useState(false)

  return (
    <Stack alignItems='center'>
      <Paper sx={{ width: '400px' }}>
        <Stack alignItems='center' sx={{ width: 'inherit' }}>
          <Stack spacing={1} sx={{ p: 5, width: '80%' }}>
            <Typography variant='h4' align='center'>
              패스워드 재설정
            </Typography>
            <Divider />
            {isEmailSent ? (
              <Alert severity='info'>
                <AlertTitle>패스워드 재설정 메일 전송 완료</AlertTitle>
                패스워드 재설정 링크가 담긴 메일을 아래 주소로 전송했습니다. 링크에 접속하여 안내에
                따라 주세요.
              </Alert>
            ) : null}
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleConfirmClick()
              }}
              style={{ width: '100%' }}
            >
              <TextField
                label='이메일'
                value={email}
                fullWidth
                type='email'
                variant='filled'
                onChange={handleEmailChange}
              />
            </form>
            <Button variant='contained' onClick={handleConfirmClick}>
              확인
            </Button>
            <Button onClick={() => navigate('/signin')}>로그인 화면으로</Button>
          </Stack>
        </Stack>
      </Paper>
    </Stack>
  )
}

export default PasswordReset
