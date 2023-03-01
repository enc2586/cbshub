import {
  Stack,
  Typography,
  TextField,
  Button,
  Paper,
  ToggleButtonGroup,
  ToggleButton,
  FormControlLabel,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material'
import { createUserWithEmailAndPassword, UserCredential } from 'firebase/auth'

import toast from 'react-hot-toast'

import { auth, db } from 'configs/firebase'
import * as React from 'react'
import Divider from '@mui/material/Divider'
import { collection, doc, getDocs, query, serverTimestamp, setDoc, where } from 'firebase/firestore'
import { FirebaseError } from 'firebase/app'
import { useNavigate } from 'react-router-dom'
import PrivacyAgreement from 'components/PrivacyAgreement'
import { UserData } from 'types/auth'

function SignUp() {
  const navigate = useNavigate()

  const newSignUp = async () => {
    const signUpToastId = toast.loading('정보 확인 중이에요')
    if (!handleValuesValidation(signUpToastId)) {
      return
    }

    toast.loading('중복 가입 검증 중이에요', { id: signUpToastId })
    const usersRef = collection(db, 'user')
    const duplicateVerifyQueue = query(
      usersRef,
      where('grade', '==', studentData.grade),
      where('classNo', '==', studentData.classNo),
      where('numberInClass', '==', studentData.number),
    )
    const duplicates = await getDocs(duplicateVerifyQueue)
    if (duplicates.docs.length > 0) {
      toast.error('해당 학번에 이미 가입된 사람이 있어요', { id: signUpToastId })
      return
    }

    toast.loading('회원가입 중이에요', { id: signUpToastId })
    let userCredential: UserCredential
    try {
      userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password)
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        const errorCode = error.code
        const errorMessage = error.message

        toast.error(handleSignUpError(errorCode, errorMessage), { id: signUpToastId })
        return
      } else {
        toast.error('알 수 없는 에러가 발생했어요', { id: signUpToastId })
        return
      }
    }

    toast.loading('회원정보를 등록하고 있어요', { id: signUpToastId })
    const uid = userCredential!.user.uid
    const newUserRef = doc(db, 'user', uid)
    const newUserData: UserData = {
      name: values.name,
      email: values.email,
      classNo: studentData.classNo,
      grade: studentData.grade,
      numberInClass: studentData.number,
      sex: values.sex,
      reveillesApplied: 0,
      agreedTermsAt: serverTimestamp(),
    }

    await setDoc(newUserRef, newUserData)
    // TODO: DB 정보 추가 실패 시 Auth에 가입된 계정 삭제하는 try-catch문 만들 것

    toast.success('가입에 성공했어요', { id: signUpToastId })
    navigate('/')
  }
  const handleValuesValidation = (toastId: string): boolean => {
    if (values.password.length === 0) {
      toast.error('비밀번호가 너무 약해요', { id: toastId })
      setInputErrors({
        ...inputErrors,
        password: true,
      })
    } else if (
      values.sid.length !== 4 ||
      studentData.grade > 3 ||
      studentData.classNo > 3 ||
      studentData.number > 20 ||
      studentData.grade * studentData.classNo * studentData.number === 0
    ) {
      toast.error('학번이 올바르지 않아요', { id: toastId })
      setInputErrors({
        ...inputErrors,
        sid: true,
      })
    } else if (values.name.length === 0) {
      toast.error('이름을 적어 주세요', { id: toastId })
      setInputErrors({
        ...inputErrors,
        name: true,
      })
    } else if (termsAgreeDate === null) {
      toast.error('개인정보 수집·이용에 미동의 시 가입할 수 없어요', { id: toastId })
    } else {
      return true
    }

    return false
  }
  const handleSignUpError = (errorCode: string, errorMessage: string): string => {
    if (errorCode === 'auth/invalid-email') {
      setInputErrors({
        ...inputErrors,
        email: true,
      })
      return '이메일이 잘못되었어요'
    } else if (errorCode === 'auth/weak-password') {
      setInputErrors({
        ...inputErrors,
        password: true,
      })
      return '패스워드가 약해 가입할 수 없어요'
    } else if (errorCode === 'auth/email-already-in-use') {
      setInputErrors({
        ...inputErrors,
        email: true,
      })
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
    name: '',
    sid: '',
    sex: true,
  })
  const [inputErrors, setInputErrors] = React.useState({
    email: false,
    password: false,
    name: false,
    sid: false,
  })
  const handleChange =
    (prop: string) => (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      const numbersOnly = /^\d*$/
      if (
        prop === 'sid' &&
        (event.target.value.length > 4 || !numbersOnly.test(event.target.value))
      ) {
        return
      }

      setValues({
        ...values,
        [prop]: event.target.value,
      })
      setInputErrors({
        ...inputErrors,
        [prop]: false,
      })
    }
  const handleSexChange = (_event: React.MouseEvent<HTMLElement>, newAlignment: boolean) => {
    if (newAlignment !== null) {
      setValues({
        ...values,
        sex: newAlignment,
      })
    }
  }

  const [studentData, setStudentData] = React.useState({
    grade: 0,
    classNo: 0,
    number: 0,
    helperText: '?학년 ?반 ?번',
  })
  React.useEffect(() => {
    const sid = Number(values.sid) * 10 ** (4 - values.sid.length)

    let grade, classNo, number
    if (sid !== 0) {
      grade = Math.floor(sid / 1000)
      classNo = Math.floor((sid % 1000) / 100)
      number = sid % 100
    } else {
      grade = 0
      classNo = 0
      number = 0
    }
    setStudentData({
      grade: grade,
      classNo: classNo,
      number: number,
      helperText:
        (grade ? String(grade) : '?') +
        '학년 ' +
        (classNo ? String(classNo) : '?') +
        '반 ' +
        (number ? String(number) : '?') +
        '번',
    })
  }, [values])

  const [termsAgreeDate, setTermsAgreeDate] = React.useState<Date | null>(null)
  const handleTermsAgreeClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setTermsDialogOpen(true)
    } else {
      setTermsAgreeDate(null)
    }
  }

  const [termsDialogOpen, setTermsDialogOpen] = React.useState<boolean>(false)
  const handleTermsDialogClose = () => {
    setTermsDialogOpen(false)
  }
  const handleTermsAgree = () => {
    const formatter = new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false,
      timeZone: 'Asia/Seoul',
    })
    const now = new Date()
    const dateString = formatter.format(now)
    toast.success(dateString + '에 개인정보 수집·이용에 동의하셨습니다.', { duration: 5000 })
    setTermsDialogOpen(false)
    setTermsAgreeDate(now)
  }

  return (
    <Stack alignItems='center'>
      <Paper sx={{ width: '400px' }}>
        <Stack alignItems='center'>
          <Stack spacing={1} sx={{ p: 5 }}>
            <Typography variant='h4' align='center'>
              신규 가입
            </Typography>
            <Divider />
            <TextField
              label='이메일'
              type='email'
              value={values.email}
              error={inputErrors.email}
              onChange={handleChange('email')}
            />
            <TextField
              label='패스워드'
              type='password'
              value={values.password}
              error={inputErrors.password}
              onChange={handleChange('password')}
            />
            <Stack direction='row' spacing={2}>
              <TextField
                label='학번'
                helperText={studentData.helperText}
                value={values.sid}
                error={inputErrors.sid}
                onChange={handleChange('sid')}
              />
              <TextField
                label='성명'
                value={values.name}
                error={inputErrors.name}
                onChange={handleChange('name')}
              />

              <ToggleButtonGroup
                color='primary'
                sx={{ pt: '20px', height: '30px' }}
                value={values.sex}
                exclusive
                onChange={handleSexChange}
              >
                <ToggleButton value={true}>남</ToggleButton>
                <ToggleButton value={false}>여</ToggleButton>
              </ToggleButtonGroup>
            </Stack>
            <FormControlLabel
              sx={{ pl: -10 }}
              control={
                <Checkbox
                  checked={termsAgreeDate !== null}
                  onChange={handleTermsAgreeClick}
                  required
                />
              }
              label='개인정보 수집·이용에 동의합니다'
            />
            <Button variant='contained' onClick={() => newSignUp()}>
              회원가입
            </Button>
            <Button onClick={() => navigate('/signin')}>로그인 화면으로</Button>
          </Stack>
        </Stack>
      </Paper>
      <Dialog open={termsDialogOpen} onClose={handleTermsDialogClose}>
        <DialogTitle>개인정보 수집·이용 동의 (필수)</DialogTitle>
        <DialogContent>
          <PrivacyAgreement />
        </DialogContent>
        <DialogActions>
          <Button variant='contained' onClick={handleTermsDialogClose}>
            거부
          </Button>
          <Button onClick={handleTermsAgree}>동의</Button>
        </DialogActions>
      </Dialog>
    </Stack>
  )
}

export default SignUp
