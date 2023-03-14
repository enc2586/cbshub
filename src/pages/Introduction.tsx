import * as React from 'react'

import { Alert, AlertTitle, Box, Button, Grid, Paper, Stack, Typography } from '@mui/material'
import GitHubIcon from '@mui/icons-material/GitHub'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import DirectionsRunSharpIcon from '@mui/icons-material/DirectionsRunSharp'
import { Link, useNavigate } from 'react-router-dom'

function Introduction() {
  const navigate = useNavigate()

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <Stack spacing={4}>
            <Stack spacing={2}>
              <Stack direction='row' justifyContent='space-between'>
                <Typography variant='h5'>서비스 소개</Typography>

                <Button
                  size='small'
                  variant='contained'
                  startIcon={<GitHubIcon />}
                  endIcon={<OpenInNewIcon />}
                  onClick={() => {
                    window.open('https://github.com/enc2586/cbshub', '_blank', 'noreferrer')
                  }}
                >
                  Github 방문
                </Button>
              </Stack>
              <Box sx={{ backgroundColor: 'black', p: 1, pl: 2, borderRadius: 1 }}>
                <Stack direction='row' alignItems='center'>
                  <DirectionsRunSharpIcon sx={{ mr: 1, color: 'white' }} />
                  <Typography
                    variant='h6'
                    noWrap
                    sx={{
                      fontWeight: 700,
                      letterSpacing: '.3rem',
                      color: 'white',
                      textDecoration: 'none',
                    }}
                  >
                    CBS
                  </Typography>
                  <Paper elevation={0} sx={{ backgroundColor: '#f7971d' }}>
                    <Typography
                      variant='h6'
                      noWrap
                      sx={{
                        ml: '.3rem',
                        fontWeight: 700,
                        letterSpacing: '.3rem',
                        color: 'black',
                        textDecoration: 'none',
                      }}
                    >
                      HUB
                    </Typography>
                  </Paper>
                </Stack>
              </Box>
              <Typography>
                충북과학고등학교의 편리한 <b>기상음악 신청</b>을 위해 2022년 4월경부터 개시된
                서비스입니다.
                <br />
                <br />
                과거 기상음악 신청 방식은 복도에 있는 칠판에 학번과 함께 음악을 적는 것이었습니다.
                기상음악을 신청하기 위해 복도 칠판까지 가는 것은 귀찮은 일이며, 신청된 음악이 마음에
                들지 않는 누군가가 남의 음악을 지우거나 학교에서 재생할 수 없는 수위의 음악을
                신청하는 경우도 있었습니다.
                <br />
                <br />
                처음에는 기상음악 신청 과정에서의 문제와 불편함을 해결하고자 시작한 프로젝트였지만,
                더 나아가 교내 생활 전반에 도움을 줄 수 있는 사이트로 발전하는 것이 목표입니다.
                <br />
                <br />
                기술적인 내용은{' '}
                <a href='https://github.com/enc2586/cbshub' target='_blank' rel='noreferrer'>
                  Github에 방문
                </a>
                하여 알아보실 수 있습니다.
              </Typography>
            </Stack>
            <Box m={-1}>
              <Grid container columns={{ xs: 1, sm: 2, md: 3, xl: 4 }} spacing={1}>
                <Grid item xs={1}>
                  <Button
                    size='large'
                    variant='outlined'
                    fullWidth
                    onClick={() => {
                      navigate('/introduction/reveille')
                    }}
                  >
                    기상음악에 대해
                  </Button>
                </Grid>
                <Grid item xs={1}>
                  <Button
                    size='large'
                    variant='outlined'
                    fullWidth
                    onClick={() => {
                      navigate('/introduction/workflow')
                    }}
                  >
                    특별실 신청 예약에 대해
                  </Button>
                </Grid>
                <Grid item xs={1}>
                  <Button
                    size='large'
                    variant='outlined'
                    fullWidth
                    onClick={() => {
                      navigate('/introduction/book')
                    }}
                  >
                    정보도서 대출에 대해
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Stack>
        </Paper>
      </Grid>
    </Grid>
  )
}

export default Introduction
