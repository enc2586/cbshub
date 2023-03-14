import { Box, Button, Grid, Stack, Typography } from '@mui/material'

import {
  VpnKey as VpnKeyIcon,
  QrCode as QrCodeIcon,
  OpenInNew as OpenInNewIcon,
} from '@mui/icons-material'

import { useNavigate } from 'react-router-dom'
import SubjectBox from 'components/SubjectBox'

import { qrImage } from 'features/books'

function Books() {
  const navigate = useNavigate()
  return (
    <Box>
      <Grid container justifyContent='center'>
        <Grid item md={6} xs={12}>
          <Stack spacing={2}>
            <Button
              size='large'
              variant='contained'
              fullWidth
              startIcon={<VpnKeyIcon />}
              color='error'
              onClick={() => {
                navigate('/book/manage')
              }}
            >
              대출 관리 패널
            </Button>
            <SubjectBox title='정보도서 대출'>
              <Stack spacing={2}>
                <Stack sx={{ width: 'inherit' }} alignItems='center' spacing={1}>
                  <img
                    src={qrImage}
                    style={{ width: '100%', maxWidth: '500px', borderRadius: '10px' }}
                  />
                </Stack>
                <Typography>
                  <b>도서에 부착된 QR코드를 촬영</b>해 현재 도서의 상태를 확인하고 대출/반납 요청을
                  선생님께 전송할 수 있습니다.
                </Typography>
                <Stack spacing={1}>
                  <Button
                    variant='contained'
                    size='large'
                    startIcon={<QrCodeIcon />}
                    endIcon={<OpenInNewIcon />}
                    onClick={() => {
                      window.open('https://qrcodescan.in/', '_blank', 'noreferrer')
                    }}
                  >
                    QR코드 촬영
                  </Button>
                  <Button
                    onClick={() => {
                      navigate('/introduction/book')
                    }}
                  >
                    QR 코드를 찍으면 어떻게 되나요?
                  </Button>
                </Stack>
              </Stack>
            </SubjectBox>
          </Stack>{' '}
        </Grid>
      </Grid>
    </Box>
  )
}

export default Books
