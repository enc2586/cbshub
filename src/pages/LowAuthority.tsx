import { Paper, Stack, Typography } from '@mui/material'
import { authority } from 'features/authentication'

import { ErrorWindow, lowAuthorityImage } from 'features/error'

function LowAuthority({ needed }: { needed?: authority[] }) {
  return (
    <ErrorWindow
      title='권한이 부족해요...'
      image={lowAuthorityImage}
      imageCaption='출처: 스파이 패밀리 | 사진 제공: 최헌*'
      primaryAdornment={
        <Stack>
          <Stack direction='row' alignItems='center' spacing={1}>
            {needed?.map((authority) => (
              <Paper sx={{ p: 0.5 }} key={authority}>
                <Typography>
                  <b>{authority}</b>
                </Typography>
              </Paper>
            ))}
          </Stack>
          <Typography>위의 권한이 필요해요. 관리자에게 문의해주세요.</Typography>
        </Stack>
      }
    />
  )
}

export default LowAuthority
