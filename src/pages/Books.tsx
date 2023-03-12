import { Box, Button, Stack } from '@mui/material'

import { VpnKey as VpnKeyIcon } from '@mui/icons-material'

import { useNavigate } from 'react-router-dom'
import { ErrorWindow, lostImage, lowAuthorityImage } from 'features/error'

function Books() {
  const navigate = useNavigate()
  return (
    <Box>
      <Stack spacing={2}>
        <Button
          size='large'
          variant='contained'
          fullWidth
          startIcon={<VpnKeyIcon />}
          color='error'
          onClick={() => {
            navigate('/books/manage')
          }}
        >
          도서대출 관리
        </Button>
        <ErrorWindow
          title='아직 개발중 :-('
          image={lowAuthorityImage}
          imageCaption='출처: 스파이 패밀리 | 사진 제공: 최헌*'
          primaryAdornment='학생용 도서대출 페이지는 아직 개발중입니다.'
        />
      </Stack>
    </Box>
  )
}

export default Books
