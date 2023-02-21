import { Stack, Typography, TextField, Button } from '@mui/material'
import { createUserWithEmailAndPassword } from 'firebase/auth'

import toast from 'react-hot-toast'

import { auth } from 'firebaseConfig/firebase'
import React from 'react'

function SignUp() {
  const newSignUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password,
      )

      const user = userCredential.user

      console.log(user)
    } catch (error: any) {
      const errorCode = error.code
      const errorMessage = error.message

      toast.error(handleSignUpError(errorCode, errorMessage))
    }
  }
  const handleSignUpError = (errorCode: string, errorMessage: string): string => {
    if (errorCode === 'auth/invalid-email') {
      return '이메일이 잘못되었어요'
    } else if (errorCode === 'auth/weak-password') {
      return '비밀번호가 약해 가입할 수 없어요'
    } else if (errorCode === 'auth/email-already-in-use') {
      return '이미 사용 중인 이메일이에요'
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
      <Typography variant='h5'>Sign up to CBSHub</Typography>
      <TextField
        label='이메일'
        type='email'
        value={values.email}
        onChange={handleChange('email')}
      />
      <TextField
        label='패스워드'
        type='password'
        value={values.password}
        onChange={handleChange('password')}
      />
      <Button onClick={() => newSignUp()}>회원가입</Button>
    </Stack>
  )
}

export default SignUp
