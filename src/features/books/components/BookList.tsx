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

import useBooks from '../hooks/useBooks'
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
      headerName: 'ì í',
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
    { field: 'id', headerName: 'ëìID', width: 225 },
    {
      field: 'copyId',
      headerName: 'URL',
      width: 85,
      renderCell: (params: any) => (
        <Button
          onClick={() => {
            navigator.clipboard.writeText(
              window.location.href.slice(0, -7) + '/id/' + params.row.id,
            )
            toast.success('ë§í¬ë¥¼ ë³µì¬íì´ì')
          }}
        >
          ë³µì¬
        </Button>
      ),
    },
    { field: 'title', headerName: 'ëìëª', width: 200 },
    { field: 'author', headerName: 'ìê°' },
    { field: 'publisher', headerName: 'ì¶íì¬' },
    {
      field: 'state',
      headerName: 'ìí',
      width: 75,
      renderCell: (params: any) => {
        if (params.value === 'checkedOut') return 'ëì¶'
        else if (params.value === 'idle') return 'ë³´ê´'
        else if (params.value === 'checkInReq') return 'ë°ë©ìì²­'
        else if (params.value === 'checkOutReq') return 'ëì¶ìì²­'
        else return params.value
      },
    },
    {
      field: 'actions',
      headerName: 'ì¡ì',
      width: 150,
      // align: 'center',
      renderCell: (params: any) => {
        if (params.row.state === 'checkedOut')
          return (
            <Button
              variant='contained'
              color='info'
              sx={{ width: '70px' }}
              onClick={() => {
                setSelection([params.row.id])
                setCheckinOpen(true)
              }}
            >
              ë°ë©
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
              ëì¶
            </Button>
          )
        else if (params.row.state === 'checkOutReq')
          return (
            <Stack direction='row'>
              <Button
                variant='contained'
                color='success'
                sx={{ width: '70px' }}
                onClick={() =>
                  toast.promise(
                    checkOut(params.row.user as string, params.row.userName as string, [
                      params.row.id as string,
                    ]),
                    {
                      loading: 'ëì¶ ì¹ì¸ ì²ë¦¬ì¤...',
                      success: 'ëì¶ ì¹ì¸ë¨',
                      error: 'ëì¶ ì¹ì¸ ì¤í¨. ë´ì­ì ê¼­ íì¸íì¸ì.',
                    },
                  )
                }
              >
                ì¹ì¸
              </Button>
              <Button
                variant='contained'
                color='error'
                sx={{ width: '70px' }}
                onClick={() =>
                  toast.promise(checkIn([params.row.id as string]), {
                    loading: 'ëì¶ ê±°ë¶ ì²ë¦¬ì¤...',
                    success: 'ëì¶ ê±°ë¶ë¨',
                    error: 'ëì¶ ê±°ë¶ ì¤í¨. ë´ì­ì ê¼­ íì¸íì¸ì.',
                  })
                }
              >
                ê±°ë¶
              </Button>
            </Stack>
          )
        else if (params.row.state === 'checkInReq')
          return (
            <Stack direction='row'>
              <Button
                variant='contained'
                color='success'
                sx={{ width: '70px' }}
                onClick={() =>
                  toast.promise(checkIn([params.row.id as string]), {
                    loading: 'ë°ë© ì¹ì¸ ì²ë¦¬ì¤...',
                    success: 'ë°ë© ì¹ì¸ë¨',
                    error: 'ë°ë© ì¹ì¸ ì¤í¨. ë´ì­ì ê¼­ íì¸íì¸ì.',
                  })
                }
              >
                ì¹ì¸
              </Button>
              <Button
                variant='contained'
                color='error'
                sx={{ width: '70px' }}
                onClick={() =>
                  toast.promise(
                    checkOut(params.row.user as string, params.row.userName as string, [
                      params.row.id as string,
                    ]),
                    {
                      loading: 'ë°ë© ê±°ë¶ ì²ë¦¬ì¤...',
                      success: 'ë°ë© ê±°ë¶ë¨',
                      error: 'ë°ë© ê±°ë¶ ì¤í¨. ë´ì­ì ê¼­ íì¸íì¸ì.',
                    },
                  )
                }
              >
                ê±°ë¶
              </Button>
            </Stack>
          )
        else return null
      },
    },
    {
      field: 'userName',
      headerName: 'ì´ì©ì',
      width: 60,
      renderCell: (params: any) => {
        if (params.row.state === 'checkedOut') return params.value
        else return ''
      },
    },
    {
      field: 'user',
      headerName: 'ì´ì©ì ê³ ì ë²í¸',
      renderCell: (params: any) => {
        if (params.row.state === 'checkedOut') return params.value
        else return ''
      },
    },
    {
      field: 'checkedOn',
      headerName: 'ëì¶ì¼ì',
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
        selection: true,
        copyId: true,
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
          ëì ì¶ê°
        </Button>
        <Button
          variant='outlined'
          size='small'
          startIcon={<DeleteForeverIcon />}
          disabled={selection.length <= 0}
          onClick={handleRemove}
        >
          ì í ì­ì 
        </Button>
        <Button
          variant='outlined'
          size='small'
          startIcon={<OutputIcon />}
          disabled={selection.length <= 0}
          onClick={handleCheckout}
        >
          ì í ëì¶
        </Button>
        <Button
          variant='outlined'
          size='small'
          startIcon={<LoginIcon />}
          disabled={selection.length <= 0}
          onClick={handleCheckin}
        >
          ì í ë°ë©
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
      loading: 'ì¶ê°íë ì¤...',
      success: 'ì¶ê°ì ì±ê³µíì´ì',
      error: 'ì¶ê° ëì¤ ì¤ë¥ê° ë°ìíì´ì. ì¶ê°ë ìëì íì¸íì¸ì.',
    })
  }

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>ëì ì¶ê°</DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <Typography>ëì ì ë³´ë¥¼ ìë ¥í´ì£¼ì¸ì.</Typography>
          <Stack spacing={1}>
            <TextField
              label='ëìì ëª©'
              value={bookInfo.title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setBookInfo({ ...bookInfo, title: e.target.value })
              }
            />
            <Stack spacing={1} direction='row'>
              <TextField
                label='ìê°'
                value={bookInfo.author}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setBookInfo({ ...bookInfo, author: e.target.value })
                }
              />
              <TextField
                label='ì¶íì¬'
                value={bookInfo.publisher}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setBookInfo({ ...bookInfo, publisher: e.target.value })
                }
              />
            </Stack>
          </Stack>
          <Divider />
          <Stack spacing={1}>
            <Typography>ëì ìëì ì íí´ì£¼ì¸ì.</Typography>
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
        <Button onClick={() => setOpen(false)}>ì·¨ì</Button>
        <Button onClick={handleAdd} variant='contained'>
          ì¶ê°
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
        loading: 'ëì¶ ì²ë¦¬ì¤...',
        success: 'ì±ê³µì ì¼ë¡ ëì¶íì´ì!',
        error: 'ëì¶ ëì¤ ì¤ë¥ê° ë°ìíì´ì. ê¼­ ë´ì­ì íì¸íì¸ì.',
      })
    } else {
      toast.error('íìì ì íí´ì£¼ì¸ì.')
    }
  }

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>ëì ëì¶</DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <Typography>ëì {targets.length}ê¶ì ëì¶í´ì¤ íìì ì ííì¸ì.</Typography>
          <StudentSelect setStudentData={setTargetUser} label='íì ê²ì' />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)}>ì·¨ì</Button>
        <Button onClick={handleCheckout} variant='contained'>
          ì¹ì¸
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
      loading: 'ë°ë© ì²ë¦¬ì¤...',
      success: 'ì±ê³µì ì¼ë¡ ë°ë©íì´ì!',
      error: 'ë°ë© ëì¤ ì¤ë¥ê° ë°ìíì´ì. ê¼­ ë´ì­ì íì¸íì¸ì.',
    })
  }

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>ëì ë°ë©</DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <Typography>ëì {targets.length}ê¶ì ë°ë©ì²ë¦¬í ê¹ì?</Typography>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)}>ì·¨ì</Button>
        <Button onClick={handleCheckin} variant='contained'>
          ì¹ì¸
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
      loading: 'ì­ì  ì²ë¦¬ì¤...',
      success: 'ì±ê³µì ì¼ë¡ ì­ì íì´ì!',
      error: 'ì­ì  ëì¤ ì¤ë¥ê° ë°ìíì´ì. ê¼­ ë´ì­ì íì¸íì¸ì.',
    })
  }

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>ëì ì­ì </DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <Typography>ëì {targets.length}ê¶ì ì­ì ì²ë¦¬í ê¹ì?</Typography>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)}>ì·¨ì</Button>
        <Button onClick={handleRemove} variant='contained'>
          ì¹ì¸
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default BookList
