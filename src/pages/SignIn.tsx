import * as React from 'react'
import toast from 'react-hot-toast'

import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from 'features/authentication'

import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import PasswordIcon from '@mui/icons-material/Password'
import { Stack, Typography, TextField, Button, Paper, Divider, Alert } from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'

function SignIn() {
  const navigate = useNavigate()
  const state = useLocation().state

  React.useEffect(() => {
    if (state?.from !== undefined) {
      toast('로그인해야 마저 계속할 수 있어요', { id: 'signInToKeepGoing' })
    }
  }, [])

  const [isSigningIn, setSigningIn] = React.useState(false)

  const handleSignIn = async () => {
    const signInToastId = toast.loading('로그인하는 중')
    setSigningIn(true)
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password)
      toast.success('로그인했어요', { id: signInToastId })

      if (state?.from !== undefined) {
        navigate(state.from.pathname)
      } else {
        navigate('/')
      }
    } catch (error: any) {
      const errorCode = error.code
      const errorMessage = error.message

      toast.error(handleSignInError(errorCode, errorMessage), { id: signInToastId })
    } finally {
      setSigningIn(false)
    }
  }
  const handleSignInError = (errorCode: string, errorMessage: string): string => {
    if (errorCode === 'auth/wrong-password') {
      return '잘못된 패스워드에요'
    } else if (errorCode === 'auth/user-not-found') {
      return '가입되지 않은 이메일에요'
    } else if (errorCode === 'auth/invalid-email') {
      return '이메일 형식이 올바르지 않아요'
    } else if (errorCode === 'auth/too-many-requests') {
      setAccountLocked(true)
      return '계정이 일시적으로 잠겼습니다'
    } else {
      console.error(errorCode)
      console.error(errorMessage)
      return '문제가 발생했어요'
    }
  }
  const [accountLocked, setAccountLocked] = React.useState(false)

  const [values, setValues] = React.useState({
    email: '',
    password: '',
  })
  const handleChange =
    (prop: string) => (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      setValues({
        ...values,
        [prop]: event.target.value,
      })
    }

  return (
    <Stack alignItems='center'>
      <Paper sx={{ width: '400px' }}>
        <Stack alignItems='center'>
          <Stack spacing={1} sx={{ p: 2, width: '300px' }}>
            {/* <BadgeIcon fontSize='large' /> */}

            <Typography variant='h4' align='center'>
              로그인
            </Typography>
            <Divider />
            {accountLocked ? <Alert severity='error'>계정이 일시적으로 잠겼습니다</Alert> : null}

            <Stack direction='row' alignItems='center' sx={{ width: '100%' }}>
              <AccountCircleIcon sx={{ color: 'action.active', mt: 2, mr: 1 }} />
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSignIn()
                }}
                style={{ width: '100%' }}
              >
                <TextField
                  label='이메일'
                  type='email'
                  disabled={isSigningIn}
                  fullWidth
                  value={values.email}
                  onChange={handleChange('email')}
                />
              </form>
            </Stack>
            <Stack direction='row' alignItems='center' sx={{ width: '100%' }}>
              <PasswordIcon sx={{ color: 'action.active', mt: 2, mr: 1 }} />

              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSignIn()
                }}
                style={{ width: '100%' }}
              >
                <TextField
                  label='패스워드'
                  type='password'
                  disabled={isSigningIn}
                  fullWidth
                  value={values.password}
                  onChange={handleChange('password')}
                />
              </form>
            </Stack>
            <Button
              variant='contained'
              disabled={isSigningIn || accountLocked}
              onClick={() => handleSignIn()}
            >
              로그인{state?.from !== undefined ? '해 계속하기' : null}
            </Button>
            <Stack
              direction='row'
              justifyContent='space-between'
              divider={<Divider orientation='vertical' flexItem />}
            >
              <Button onClick={() => navigate('/signup')} sx={{ width: '50%' }}>
                신규 가입
              </Button>
              <Button onClick={() => navigate('/passwordreset')} sx={{ width: '50%' }}>
                패스워드 분실
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </Paper>
    </Stack>
  )
}

export default SignIn
