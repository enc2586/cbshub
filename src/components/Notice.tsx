import * as React from 'react'

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
} from '@mui/material'
import store from 'store2'

const noticeVersion = 4
const noticeId = `readNotice${noticeVersion}`

function Notice() {
  const [isNoticeOpen, setIsNoticeOpen] = React.useState(false)

  React.useEffect(() => {
    if (!store.has(noticeId)) {
      store.set(noticeId, false)
    }

    setIsNoticeOpen(!store.get(noticeId))
  }, [])

  const handleDoNotOpenAgain = () => {
    setIsNoticeOpen(false)
    store.set(noticeId, true)
  }

  return (
    <Dialog open={isNoticeOpen} onClose={() => setIsNoticeOpen(false)}>
      <DialogTitle>2024.2.1 핫픽스 안내</DialogTitle>
      <DialogContent>
        <DialogContentText>
          2023학년도의 학번과 중복이 발생해 신입생이 가입할 수 없는 문제를 해결했습니다.
          <br />
          <br />
          불편을 드려 죄송합니다.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant='contained' onClick={handleDoNotOpenAgain}>
          닫기
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default Notice
