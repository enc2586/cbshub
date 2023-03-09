import { useNavigate } from 'react-router-dom'

import { Alert, Badge, Box, Button, Divider, Grid, Paper, Stack, Typography } from '@mui/material'

import LibraryMusicIcon from '@mui/icons-material/LibraryMusic'
import SecurityIcon from '@mui/icons-material/Security'
import AutoStoriesIcon from '@mui/icons-material/AutoStories'

import ListAltIcon from '@mui/icons-material/ListAlt'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import HomeIcon from '@mui/icons-material/Home'
import SchoolIcon from '@mui/icons-material/School'
import RestaurantIcon from '@mui/icons-material/Restaurant'
import ControlPointDuplicateIcon from '@mui/icons-material/ControlPointDuplicate'
import EventIcon from '@mui/icons-material/Event'
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary'
import CloudIcon from '@mui/icons-material/Cloud'
import FmdGoodIcon from '@mui/icons-material/FmdGood'
import Meal from 'components/Meal'

function Home() {
  const navigate = useNavigate()

  return (
    <Stack spacing={2}>
      <Alert severity='warning'>
        [서비스 소개], [내 계정] 메뉴는 아직 완성되지 않았습니다. 양해 부탁드립니다!
      </Alert>
      <Box m={-2}>
        <Grid container spacing={2} direction='row-reverse'>
          <Grid item xs={12} md={4}>
            <Meal />
          </Grid>
          <Grid item xs={12} md={8}>
            <Stack spacing={2}>
              <Paper sx={{ p: 2 }}>
                <Stack spacing={2}>
                  <Typography variant='h5'>제공하는 서비스</Typography>
                  <Box m={-2}>
                    <Grid container spacing={2} columns={{ xs: 1, sm: 2, md: 3 }}>
                      <Grid item xs={1}>
                        <Badge color='error' badgeContent='NEW' sx={{ width: '100%' }}>
                          <Button
                            size='large'
                            variant='contained'
                            fullWidth
                            startIcon={<FmdGoodIcon />}
                            onClick={() => {
                              navigate('/workflow')
                            }}
                          >
                            특별실 신청 예약
                          </Button>
                        </Badge>
                      </Grid>
                      <Grid item xs={1}>
                        <Button
                          size='large'
                          variant='contained'
                          fullWidth
                          startIcon={<LibraryMusicIcon />}
                          onClick={() => {
                            navigate('/reveille')
                          }}
                        >
                          기상음악 관리
                        </Button>
                      </Grid>
                      <Grid item xs={1}>
                        <Button
                          size='large'
                          variant='contained'
                          fullWidth
                          startIcon={<SecurityIcon />}
                          onClick={() => {
                            navigate('/privacy')
                          }}
                        >
                          개인정보처리방침
                        </Button>
                      </Grid>
                      <Grid item xs={1}>
                        <Button
                          size='large'
                          variant='contained'
                          fullWidth
                          startIcon={<AutoStoriesIcon />}
                          onClick={() => {
                            navigate('/introduction')
                          }}
                        >
                          서비스 소개
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                </Stack>
              </Paper>
              <Paper sx={{ p: 2 }}>
                <Stack spacing={2}>
                  <Typography variant='h5'>교내 생활 관련</Typography>
                  <Box m={-2}>
                    <Grid container spacing={2} columns={{ xs: 1, sm: 2, md: 3 }}>
                      <Grid item xs={1}>
                        <Button
                          size='large'
                          variant='outlined'
                          fullWidth
                          startIcon={<SchoolIcon />}
                          endIcon={<OpenInNewIcon />}
                          onClick={() => {
                            window.open('https://www.cbshself.kr/', '_blank', 'noreferrer')
                          }}
                        >
                          학생관리시스템
                        </Button>
                      </Grid>
                      <Grid item xs={1}>
                        <Button
                          size='large'
                          variant='outlined'
                          fullWidth
                          startIcon={<RestaurantIcon />}
                          endIcon={<OpenInNewIcon />}
                          onClick={() => {
                            window.open(
                              'https://school.cbe.go.kr/cbs-h/M01050705/',
                              '_blank',
                              'noreferrer',
                            )
                          }}
                        >
                          급식 일정
                        </Button>
                      </Grid>
                      <Grid item xs={1}>
                        <Button
                          size='large'
                          variant='outlined'
                          fullWidth
                          startIcon={<ListAltIcon />}
                          endIcon={<OpenInNewIcon />}
                          onClick={() => {
                            window.open('http://xn--s39aj90b0nb2xw6xh.kr/', '_blank', 'noreferrer')
                          }}
                        >
                          학생시간표
                        </Button>
                      </Grid>
                      <Grid item xs={1}>
                        <Button
                          size='large'
                          variant='outlined'
                          fullWidth
                          startIcon={<HomeIcon />}
                          endIcon={<OpenInNewIcon />}
                          onClick={() => {
                            window.open('https://school.cbe.go.kr/cbs-h', '_blank', 'noreferrer')
                          }}
                        >
                          학교 홈페이지
                        </Button>
                      </Grid>
                      <Grid item xs={1}>
                        <Button
                          size='large'
                          variant='outlined'
                          fullWidth
                          startIcon={<ControlPointDuplicateIcon />}
                          endIcon={<OpenInNewIcon />}
                          onClick={() => {
                            window.open(
                              'http://cbs.smileschool.kr/green/login.php',
                              '_blank',
                              'noreferrer',
                            )
                          }}
                        >
                          상벌점제
                        </Button>
                      </Grid>
                      <Grid item xs={1}>
                        <Button
                          size='large'
                          variant='outlined'
                          fullWidth
                          startIcon={<EventIcon />}
                          endIcon={<OpenInNewIcon />}
                          onClick={() => {
                            window.open(
                              'https://school.cbe.go.kr/cbs-h/M010407/',
                              '_blank',
                              'noreferrer',
                            )
                          }}
                        >
                          학사일정
                        </Button>
                      </Grid>
                      <Grid item xs={1}>
                        <Button
                          size='large'
                          variant='outlined'
                          fullWidth
                          startIcon={<LocalLibraryIcon />}
                          endIcon={<OpenInNewIcon />}
                          onClick={() => {
                            window.open('https://classroom.google.com/', '_blank', 'noreferrer')
                          }}
                        >
                          구글 클래스룸
                        </Button>
                      </Grid>
                      <Grid item xs={1}>
                        <Button
                          size='large'
                          variant='outlined'
                          fullWidth
                          startIcon={<CloudIcon />}
                          endIcon={<OpenInNewIcon />}
                          onClick={() => {
                            window.open('https://www.cbshai.kr/', '_blank', 'noreferrer')
                          }}
                        >
                          교내 GPU서버
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                </Stack>
              </Paper>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Stack>
  )
}

export default Home
