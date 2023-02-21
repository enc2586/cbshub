import React from 'react'
import toast from 'react-hot-toast'

import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from 'firebaseConfig/firebase'

import BadgeIcon from '@mui/icons-material/Badge'
import { Stack, Typography, TextField, Button } from '@mui/material'

function SignIn() {
  const handleSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password)
      toast.success('로그인했어요')
    } catch (error: any) {
      const errorCode = error.code
      const errorMessage = error.message

      toast.error(handleSignInError(errorCode, errorMessage))
    }
  }
  const handleSignInError = (errorCode: string, errorMessage: string): string => {
    if (errorCode === 'auth/wrong-password') {
      return '잘못된 비밀번호를 입력하셨어요'
    } else if (errorCode === 'auth/user-not-found') {
      return '이메일이 존재하지 않아요'
    } else if (errorCode === 'auth/invalid-email') {
      return '이메일 형식이 올바르지 않아요'
    } else {
      console.error(errorCode)
      console.error(errorMessage)
      return '문제가 발생했어요'
    }
  }

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
    <Stack spacing={2} alignItems='center'>
      <BadgeIcon fontSize='large' />
      <Typography variant='h5'>Sign in to CBSHub</Typography>
      <TextField label='email' type='email' value={values.email} onChange={handleChange('email')} />
      <TextField
        label='password'
        type='password'
        value={values.password}
        onChange={handleChange('password')}
      />
      <Button onClick={() => handleSignIn()}>로그인</Button>
    </Stack>
  )
}

export default SignIn
