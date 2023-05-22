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
    if (!store.has('readNotice2')) {
      store.set('readNotice2', false)
    }

    setIsNoticeOpen(!store.get('readNotice2'))
  }, [])

  const handleNoticeClose = () => {
    setIsNoticeOpen(false)
    store.set('readNotice2', true)
  }

  return (
    <Dialog open={isNoticeOpen} onClose={() => setIsNoticeOpen(false)}>
      <DialogTitle>긴급 공지 - 본관동 개방 대응</DialogTitle>
      <DialogContent>
        <DialogContentText>
          선요약:
          <br />
          <i>호환성을 위해 기존의 예약은 전부 삭제되었습니다. 알맞은 특별실로 다시 신청해주세요.</i>
          <br />
          <br />
          본관동이 개방됨에 따라 추가/삭제된 특별실이 많습니다. 이에 혼선을 피하고자 05월 22일 17시
          40분 기준, 기존의 예약들을 일괄 삭제했습니다. 이용자 여러분께서는 다시 알맞은 특별실로
          예약을 신청해주시기 바랍니다. 불편을 드려 죄송합니다.
          <br />
          <br />
          아울러, 특별실 예약 신청 페이지에 표출되는 특별실 목록은 매일 00시경 캐싱(받아오기)하기에
          실시간으로 업데이트되지 않을 수 있는 점 양해 부탁드립니다.
          <br />
          <br />
          감사합니다.
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
