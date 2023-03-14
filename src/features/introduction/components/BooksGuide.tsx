import { Grid, Stack, Typography } from '@mui/material'

import bookImage from '../assets/book.png'
import bookCheckoutImage from '../assets/bookCheckout.png'
import bookManageImage from '../assets/bookManage.png'
// import bookImage from '../assets/book.png'

function BookGuide() {
  return (
    <Stack spacing={2}>
      <Stack spacing={1}>
        <img src={bookImage} style={{ width: '100%', borderRadius: '10px', maxWidth: '500px' }} />
        <Typography>
          위 화면에서 [QR코드 촬영] 버튼을 눌러 도서에 부착된 코드를 촬영한 뒤, 해당 링크로 이동하면
          해당 도서의 정보를 볼 수 있습니다.
          <br />
        </Typography>
      </Stack>
      <Stack spacing={1}>
        <Typography variant='h6'>도서 정보 화면</Typography>
        <img
          src={bookCheckoutImage}
          style={{ width: '100%', borderRadius: '10px', maxWidth: '500px' }}
        />
        <Typography>
          도서의 정보를 확인하고 도서를 대출/반납요청하거나 그 요청을 취소할 수도 있습니다.
        </Typography>
      </Stack>
      <Stack spacing={1}>
        <Typography variant='h6'>관리 패널 화면</Typography>
        <img
          src={bookManageImage}
          style={{ width: '100%', borderRadius: '10px', maxWidth: '700px' }}
        />
        <Typography>
          전체 도서의 정보를 확인하고, 도서를 추가/삭제하거나, 일괄 대출/반납처리할 수 있습니다.
          선생님만 입장할 수 있습니다.
        </Typography>
      </Stack>
    </Stack>
  )
}

export default BookGuide
