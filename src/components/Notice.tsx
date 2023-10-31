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

function Notice() {
  const [isNoticeOpen, setIsNoticeOpen] = React.useState(false)

  React.useEffect(() => {
    if (!store.has('readNotice3')) {
      store.set('readNotice3', false)
    }

    setIsNoticeOpen(!store.get('readNotice3'))
  }, [])

  const handleNoticeClose = () => {
    setIsNoticeOpen(false)
    store.set('readNotice3', true)
  }

  return (
    <Dialog open={isNoticeOpen} onClose={() => setIsNoticeOpen(false)}>
      <DialogTitle>또담 오픈채팅방 안내</DialogTitle>
      <DialogContent>
        <DialogContentText>
          또담에서 익명 오픈채팅을 개설했습니다!
          <br />
          오픈채팅을 통해 익명 1:1 상담도 가능합니다.
          <br />
          <br />
          채팅방 링크는 메인페이지 &apos;교내 생활 관련&apos; 탭에 있습니다.
          <br />
          많은 관심 부탁드립니다!
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleNoticeClose}>다시 보지 않기</Button>
        <Button
          variant='outlined'
          onClick={() => {
            window.open('https://open.kakao.com/o/gbYXULPf', '_blank', 'noreferrer')
          }}
        >
          오픈채팅 입장
        </Button>
        <Button variant='contained' onClick={() => setIsNoticeOpen(false)}>
          닫기
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default Notice
