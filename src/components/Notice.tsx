import * as React from 'react'

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material'
import store from 'store2'

function Notice() {
  const [isNoticeOpen, setIsNoticeOpen] = React.useState(false)

  React.useEffect(() => {
    if (!store.has('readNotice1')) {
      store.set('readNotice1', false)
    }

    setIsNoticeOpen(!store.get('readNotice1'))
  }, [])

  const handleNoticeClose = () => {
    setIsNoticeOpen(false)
    store.set('readNotice1', true)
  }

  return (
    <Dialog open={isNoticeOpen} onClose={() => setIsNoticeOpen(false)}>
      <DialogTitle>CBSHUB 업데이트 및 계정 삭제 안내</DialogTitle>
      <DialogContent>
        <DialogContentText>
          친애하는 사용자 여러분,
          <br />
          <br />
          겨울방학 동안 서비스가 업데이트되었으며, 시스템 이관 작업으로 인해 모든 사용자 계정이
          삭제되었음을 알려드립니다. <br />
          <br />
          <b>서비스를 계속 사용하려면 계정을 다시 등록해 주시기 바랍니다.</b> 귀하의 개인 데이터와
          로그인 세부 정보를 포함한 이전 계정 정보가 보안상의 이유로 삭제되었으며, 서비스에
          접근하려면 새 계정을 만들어야 합니다.
          <br />
          <br />
          이용에 불편을 드려 죄송합니다.
          <br />
          <br />
          CBSHUB 관리자 최홍제
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleNoticeClose}>다시 보지 않기</Button>
        <Button variant='contained' onClick={() => setIsNoticeOpen(false)}>
          확인
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default Notice
