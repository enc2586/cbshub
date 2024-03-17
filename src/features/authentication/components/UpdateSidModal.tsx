import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@mui/material'
import { doc, updateDoc } from 'firebase/firestore'
import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { db } from 'services/firestore'

export default function UpdateSidModal({
  requiredInfoVer,
  uid,
}: {
  requiredInfoVer: number
  uid: string
}) {
  const [open, setOpen] = useState(true)
  const [newSid, setNewSid] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const isSidValid = useMemo(() => {
    if (newSid === null) return false
    if (newSid < 0) return false

    if (!(`${newSid}`.length === 4)) return false

    const grade = +`${newSid}`[0]
    if (grade < 1 || grade > 3) return false

    const classNo = +`${newSid}`[1]
    if (classNo === 0) return false

    const number = +`${newSid}`.slice(2)
    if (number === 0) return false

    return true
  }, [newSid])

  const handleSidChange = (value: string) => {
    if (value.length > 4) return
    if (parseInt(value) < 0) return

    setNewSid(value === '' ? null : parseInt(value))
  }

  const handleSave = async () => {
    if (!isSidValid) return

    const userRef = doc(db, 'user', uid)
    const newUserData = {
      grade: Math.floor(newSid! / 1000),
      classNo: Math.floor((newSid! % 1000) / 100),
      number: newSid! % 100,
      infoVersion: requiredInfoVer,
    }

    setIsLoading(true)
    await updateDoc(userRef, newUserData)
    setIsLoading(false)

    setOpen(false)
  }

  return (
    <Dialog open={open}>
      <DialogTitle>학적 업데이트 요구됨</DialogTitle>
      <DialogContent>
        <DialogContentText>
          이 서비스를 이용하려면 최신 학적 정보가 필요합니다.
          <br />
          {requiredInfoVer}학년도의 학적 정보로 업데이트해주세요.
        </DialogContentText>
        <TextField
          autoFocus
          required
          fullWidth
          margin='dense'
          variant='standard'
          label='학번'
          type='number'
          helperText={getSidHelperText(newSid)}
          value={newSid}
          onChange={(e) => handleSidChange(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleSave}
          autoFocus
          variant='contained'
          disabled={!isSidValid || isLoading}
        >
          업데이트
        </Button>
      </DialogActions>
    </Dialog>
  )
}

function getSidHelperText(newSid: number | null) {
  if (newSid === null) return '학번을 입력해주세요.'

  const sid = newSid * 10 ** (4 - `${newSid}`.length)

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

  return (
    (grade ? String(grade) : '?') +
    '학년 ' +
    (classNo ? String(classNo) : '?') +
    '반 ' +
    (number ? String(number) : '?') +
    '번'
  )
}
