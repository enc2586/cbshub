import * as React from 'react'

import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Input,
  Paper,
  Slider,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import {
  DataGrid,
  GridColDef,
  GridToolbar,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarFilterButton,
} from '@mui/x-data-grid'
import {
  AddBox as AddBoxIcon,
  DeleteForever as DeleteForeverIcon,
  Output as OutputIcon,
  Login as LoginIcon,
  Sledding,
} from '@mui/icons-material'

import useBooks from '../hooks/useBook'
import { formatTime } from 'utils/datetimeFormatter'
import { addBooks, checkIn, checkOut, removeBook } from '../services/books'
import toast from 'react-hot-toast'
import { StudentSelect, UserData, useStudents } from 'features/authentication'
import { obj2arr } from 'utils/objArr'

function BookList() {
  const books = useBooks()
  const booksList = obj2arr(books) as (Book & { id: string })[]

  React.useEffect(() => {
    if (!selection.every((val) => Object.keys(books).includes(val))) {
      setSelection(selection.filter((item) => Object.keys(books).includes(item)))
    }
  }, [books])

  const [selection, setSelection] = React.useState<string[]>([])

  const columns: GridColDef[] = [
    {
      field: 'selection',
      headerName: '',
      width: 50,
      renderCell: (params: any) => {
        return (
          <Checkbox
            checked={selection.includes(params.row.id)}
            onChange={() => {
              if (selection.includes(params.row.id))
                setSelection(selection.filter((item) => item !== params.row.id))
              else setSelection(selection.concat([params.row.id]))
            }}
          />
        )
      },
    },
    { field: 'id', headerName: '도서ID', width: 100 },
    { field: 'title', headerName: '도서명', width: 200 },
    { field: 'author', headerName: '작가' },
    { field: 'publisher', headerName: '출판사' },
    {
      field: 'state',
      headerName: '상태',
      width: 50,
      renderCell: (params: any) => {
        if (params.value === 'checkedOut') return '대출'
        else if (params.value === 'idle') return '보관'
        else return params.value
      },
    },
    {
      field: 'actions',
      headerName: '액션',
      width: 150,
      // align: 'center',
      renderCell: (params: any) => {
        if (params.row.state === 'checkedOut')
          return (
            <Button
              variant='contained'
              color='warning'
              sx={{ width: '70px' }}
              onClick={() => {
                setSelection([params.row.id])
                setCheckinOpen(true)
              }}
            >
              반납처리
            </Button>
          )
        else if (params.row.state === 'idle')
          return (
            <Button
              variant='contained'
              color='primary'
              sx={{ width: '70px' }}
              onClick={() => {
                setSelection([params.row.id])
                setCheckoutOpen(true)
              }}
            >
              대출
            </Button>
          )
        else if (params.row.state === 'checkOutPend')
          return (
            <Stack direction='row'>
              <Button variant='contained' color='success' sx={{ width: '70px' }}>
                승인
              </Button>
              <Button variant='contained' color='error' sx={{ width: '70px' }}>
                거부
              </Button>
            </Stack>
          )
        else return null
      },
    },
    {
      field: 'userName',
      headerName: '이용자',
      width: 60,
      renderCell: (params: any) => {
        if (params.row.state === 'checkedOut') return params.value
        else return ''
      },
    },
    {
      field: 'user',
      headerName: '이용자 고유번호',
      renderCell: (params: any) => {
        if (params.row.state === 'checkedOut') return params.value
        else return ''
      },
    },
    {
      field: 'checkedOn',
      headerName: '대출일자',
      width: 150,
      renderCell: (params: any) => {
        if (params.row.state === 'checkedOut')
          return formatTime(params.value, { year: '2-digit', month: 'short', day: 'numeric' })
        else return ''
      },
    },
  ]

  const initialState = {
    columns: {
      columnVisibilityModel: {
        id: false,
        title: true,
        author: true,
        publisher: false,
        state: true,
        checkedOn: true,
        userName: true,
        user: false,
      },
    },
  }

  const handleAddBooks = () => {
    setAddBooksOpen(true)
  }
  const [addBooksOpen, setAddBooksOpen] = React.useState(false)

  const handleCheckout = () => {
    setCheckoutOpen(true)
  }
  const [checkoutOpen, setCheckoutOpen] = React.useState(false)

  const handleCheckin = () => {
    setCheckinOpen(true)
  }
  const [checkinOpen, setCheckinOpen] = React.useState(false)

  const handleRemove = () => {
    setRemoveOpen(true)
  }
  const [removeOpen, setRemoveOpen] = React.useState(false)

  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <Button variant='outlined' size='small' startIcon={<AddBoxIcon />} onClick={handleAddBooks}>
          도서 추가
        </Button>
        <Button
          variant='outlined'
          size='small'
          startIcon={<DeleteForeverIcon />}
          disabled={selection.length <= 0}
          onClick={handleRemove}
        >
          선택 삭제
        </Button>
        <Button
          variant='outlined'
          size='small'
          startIcon={<OutputIcon />}
          disabled={selection.length <= 0}
          onClick={handleCheckout}
        >
          선택 대출
        </Button>
        <Button
          variant='outlined'
          size='small'
          startIcon={<LoginIcon />}
          disabled={selection.length <= 0}
          onClick={handleCheckin}
        >
          선택 반납
        </Button>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarExport />
      </GridToolbarContainer>
    )
  }

  return (
    <Box sx={{ height: '500px' }}>
      <DataGrid
        rows={booksList}
        columns={columns}
        rowHeight={25}
        initialState={initialState}
        slots={{ toolbar: CustomToolbar }}
      />
      <AddBooksDialog open={addBooksOpen} setOpen={setAddBooksOpen} />
      <CheckoutDialog open={checkoutOpen} setOpen={setCheckoutOpen} targets={selection} />
      <CheckinDialog open={checkinOpen} setOpen={setCheckinOpen} targets={selection} />
      <RemoveDialog open={removeOpen} setOpen={setRemoveOpen} targets={selection} />
    </Box>
  )
}

const AddBooksDialog = ({
  open,
  setOpen,
}: {
  open: boolean
  setOpen: (value: boolean) => void
}) => {
  const [bookAmount, setBookAmout] = React.useState(1)

  const [bookInfo, setBookInfo] = React.useState<{
    title: string
    author: string
    publisher: string
  }>({
    title: '',
    author: '',
    publisher: '',
  })

  const handleAdd = async () => {
    setOpen(false)
    toast.promise(addBooks(bookInfo, bookAmount), {
      loading: '추가하는 중...',
      success: '추가에 성공했어요',
      error: '추가 도중 오류가 발생했어요. 추가된 수량을 확인하세요.',
    })
  }

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>도서 추가</DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <Typography>도서 정보를 입력해주세요.</Typography>
          <Stack spacing={1}>
            <TextField
              label='도서제목'
              value={bookInfo.title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setBookInfo({ ...bookInfo, title: e.target.value })
              }
            />
            <Stack spacing={1} direction='row'>
              <TextField
                label='작가'
                value={bookInfo.author}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setBookInfo({ ...bookInfo, author: e.target.value })
                }
              />
              <TextField
                label='출판사'
                value={bookInfo.publisher}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setBookInfo({ ...bookInfo, publisher: e.target.value })
                }
              />
            </Stack>
          </Stack>
          <Divider />
          <Stack spacing={1}>
            <Typography>도서 수량을 선택해주세요.</Typography>
            <Stack direction='row' spacing={2}>
              <Slider
                value={bookAmount}
                valueLabelDisplay='auto'
                step={1}
                marks
                min={1}
                max={20}
                onChange={(_event: Event, newValue: number | number[]) => {
                  setBookAmout(newValue as number)
                }}
              />
              <Input
                value={bookAmount}
                size='small'
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setBookAmout(Number(e.target.value))
                }
                inputProps={{
                  step: 1,
                  min: 1,
                  max: 100,
                  type: 'number',
                }}
              />
            </Stack>
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)}>취소</Button>
        <Button onClick={handleAdd} variant='contained'>
          추가
        </Button>
      </DialogActions>
    </Dialog>
  )
}

const CheckoutDialog = ({
  open,
  setOpen,
  targets,
}: {
  open: boolean
  setOpen: (value: boolean) => void
  targets: string[]
}) => {
  const [targetUser, setTargetUser] = React.useState<(UserData & { id: string }) | null>(null)

  const handleCheckout = () => {
    if (targetUser) {
      setOpen(false)
      toast.promise(checkOut(targetUser.id, targetUser.name, targets), {
        loading: '대출 처리중...',
        success: '성공적으로 대출했어요!',
        error: '대출 도중 오류가 발생했어요. 꼭 내역을 확인하세요.',
      })
    } else {
      toast.error('학생을 선택해주세요.')
    }
  }

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>도서 대출</DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <Typography>도서 {targets.length}권을 대출해줄 학생을 선택하세요.</Typography>
          <StudentSelect setStudentData={setTargetUser} label='학생 검색' />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)}>취소</Button>
        <Button onClick={handleCheckout} variant='contained'>
          승인
        </Button>
      </DialogActions>
    </Dialog>
  )
}

const CheckinDialog = ({
  open,
  setOpen,
  targets,
}: {
  open: boolean
  setOpen: (value: boolean) => void
  targets: string[]
}) => {
  const handleCheckin = () => {
    setOpen(false)
    toast.promise(checkIn(targets), {
      loading: '반납 처리중...',
      success: '성공적으로 반납했어요!',
      error: '반납 도중 오류가 발생했어요. 꼭 내역을 확인하세요.',
    })
  }

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>도서 반납</DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <Typography>도서 {targets.length}권을 반납처리할까요?</Typography>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)}>취소</Button>
        <Button onClick={handleCheckin} variant='contained'>
          승인
        </Button>
      </DialogActions>
    </Dialog>
  )
}

const RemoveDialog = ({
  open,
  setOpen,
  targets,
}: {
  open: boolean
  setOpen: (value: boolean) => void
  targets: string[]
}) => {
  const handleRemove = () => {
    setOpen(false)
    toast.promise(removeBook(targets), {
      loading: '삭제 처리중...',
      success: '성공적으로 삭제했어요!',
      error: '삭제 도중 오류가 발생했어요. 꼭 내역을 확인하세요.',
    })
  }

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>도서 삭제</DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <Typography>도서 {targets.length}권을 삭제처리할까요?</Typography>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)}>취소</Button>
        <Button onClick={handleRemove} variant='contained'>
          승인
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default BookList
