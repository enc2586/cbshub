import * as React from 'react'
import { useParams } from 'react-router-dom'

import SubjectBox from 'components/SubjectBox'
import { Grid, Stack, Typography, Paper, Button } from '@mui/material'

import { FiberManualRecord as StatusIcon } from '@mui/icons-material'

import { Player } from '@lottiefiles/react-lottie-player'
import { ErrorWindow } from 'features/error'
import useBook from '../hooks/useBook'
import { LoginToContinueButton, useAuth, useUserData } from 'features/authentication'
import { checkIn, checkInReq, checkOut, checkOutReq } from '../services/books'
import toast from 'react-hot-toast'

function BookInfo() {
  const user = useAuth()
  const userData = useUserData()

  const params = useParams()
  const bookId = params.bookId as string

  const bookData = useBook(bookId)

  return bookData === undefined ? (
    <Grid container sx={{ width: '100%' }} justifyContent='center'>
      <Grid item sx={{ maxWidth: '100%', width: '400px' }}>
        <SubjectBox title='도서 검색중...'>
          <Stack spacing={2}>
            <Player
              src='https://assets5.lottiefiles.com/packages/lf20_l5qvxwtf.json'
              loop
              autoplay
            />
            <Typography>이 화면이 오래 지속되면 새로고침하세요</Typography>
          </Stack>
        </SubjectBox>
      </Grid>
    </Grid>
  ) : bookData === null ? (
    <ErrorWindow
      title='책을 찾지 못했어요'
      primaryAdornment={
        <Stack direction='row' alignItems='center' spacing={1}>
          <Paper sx={{ p: 0.5 }}>
            <Typography>
              <b>id: {bookId}</b>
            </Typography>
          </Paper>
          <Typography>데이터베이스에서 이 책을 찾지 못했어요</Typography>
        </Stack>
      }
    />
  ) : (
    <Grid container sx={{ width: '100%' }} justifyContent='center'>
      <Grid item sx={{ maxWidth: '100%', width: '500px' }}>
        <SubjectBox title={bookData.title}>
          <Stack spacing={2}>
            <Paper sx={{ backgroundColor: 'secondaryBackground.main', p: 1 }} elevation={0}>
              <Stack direction='row' alignItems='center' spacing={1}>
                {' '}
                <StatusIcon
                  fontSize='small'
                  color={
                    bookData.state === 'idle'
                      ? 'success'
                      : bookData.state === 'checkedOut'
                      ? 'error'
                      : 'warning'
                  }
                />
                <Typography>
                  {bookData.state === 'idle'
                    ? '서가에 보관중'
                    : bookData.state === 'checkedOut'
                    ? '대출중'
                    : bookData.state === 'checkOutReq'
                    ? '대출요청 대기중'
                    : bookData.state === 'checkInReq'
                    ? '반납요청 대기중'
                    : '알 수 없음'}
                </Typography>
              </Stack>
            </Paper>
            <Stack spacing={1} sx={{ p: 1 }}>
              <Typography>
                도서ID: <b>{bookId}</b>
              </Typography>
              <Typography>
                저자: <b>{bookData.author}</b>
              </Typography>
              <Typography>
                출판사: <b>{bookData.publisher}</b>
              </Typography>
              {bookData.state === 'checkedOut' ? (
                <Typography>
                  대출한 사람: <b>{bookData.userName}</b>({bookData.user})
                </Typography>
              ) : bookData.state === 'checkOutReq' ? (
                <Typography>
                  대기중인 사람: <b>{bookData.userName}</b>({bookData.user})
                </Typography>
              ) : null}
              {user ? null : <LoginToContinueButton variant='contained' />}
            </Stack>
            <Stack direction='row' justifyContent='space-between'>
              <Button variant='outlined'>뒤로가기</Button>
              {bookData.state === 'idle' ? (
                <Stack direction='row'>
                  <Button
                    variant='contained'
                    disabled={!user || !userData}
                    onClick={() =>
                      toast.promise(checkOutReq(user!.uid, userData!.name, [bookId]), {
                        loading: '대출 요청 처리중...',
                        success: '대출 요청이 등록되었어요. 선생님께 문의하세요.',
                        error: '오류로 인해 대출 요청이 등록되지 못했어요',
                      })
                    }
                  >
                    대출 요청하기
                  </Button>
                </Stack>
              ) : bookData.state === 'checkedOut' && bookData.user === user?.uid ? (
                <Stack direction='row'>
                  <Button
                    variant='contained'
                    onClick={() =>
                      toast.promise(checkInReq([bookId]), {
                        loading: '반납 요청 처리중...',
                        success: '반납 요청이 등록되었어요. 선생님께 문의하세요.',
                        error: '오류로 인해 반납 요청이 등록되지 못했어요',
                      })
                    }
                  >
                    반납 요청하기
                  </Button>
                </Stack>
              ) : bookData.state === 'checkOutReq' ? (
                <Stack direction='row'>
                  <Button
                    variant='contained'
                    color='warning'
                    disabled={bookData.user !== user?.uid}
                    onClick={() =>
                      toast.promise(checkIn([bookId]), {
                        loading: '대출 요청 취소처리중...',
                        success: '대출 요청이 취소되었어요',
                        error: '오류로 인해 대출 요청이 취소되지 못했어요',
                      })
                    }
                  >
                    대출요청 취소
                  </Button>
                </Stack>
              ) : bookData.state === 'checkInReq' ? (
                <Stack direction='row'>
                  <Button
                    variant='contained'
                    color='warning'
                    disabled={bookData.user !== user?.uid || !userData}
                    onClick={() =>
                      toast.promise(checkOut(user!.uid, userData!.name, [bookId]), {
                        loading: '반납 요청 취소처리중...',
                        success: '반납 요청이 취소되었어요',
                        error: '오류로 인해 반납 요청이 취소되지 못했어요',
                      })
                    }
                  >
                    반납요청 취소
                  </Button>
                </Stack>
              ) : null}
            </Stack>
          </Stack>
        </SubjectBox>
      </Grid>
    </Grid>
  )
}

export default BookInfo
