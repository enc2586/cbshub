import { Card, Grid, Typography } from '@mui/material'
import { Player } from '@lottiefiles/react-lottie-player'

function ValidateAuth() {
  return (
    <Grid container sx={{ width: '100%', mt: 10 }} justifyContent='center'>
      <Grid item sx={{ maxWidth: '100%', width: '400px' }}>
        <Card sx={{ width: '100%' }}>
          <Grid container justifyContent='center' spacing={1} sx={{ p: 3 }}>
            <Grid item xs={12}>
              <Typography variant='h4' align='center'>
                권한 검증 중...
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Player
                src='https://assets5.lottiefiles.com/packages/lf20_l5qvxwtf.json'
                loop
                autoplay
              />
            </Grid>
            <Grid item xs={12}>
              <Typography align='center'>이 화면이 오래 지속되면 새로고침하세요</Typography>
            </Grid>
          </Grid>
        </Card>
      </Grid>
    </Grid>
  )
}

export default ValidateAuth
