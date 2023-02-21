import * as React from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'

import { useNavigate } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { auth } from 'firebaseConfig/firebase'
import { toast } from 'react-hot-toast'

function TopAppBar() {
  const navigate = useNavigate()

  const [isSignOutButtonLocked, setSignOutButtonLocked] = React.useState(false)
  const handleSignOut = async () => {
    try {
      setSignOutButtonLocked(true)
      await signOut(auth)
      toast.success('로그아웃했어요')
    } catch (error) {
      console.error(error)
      toast.error('로그아웃 중 문제가 일어났어요')
    } finally {
      setSignOutButtonLocked(false)
    }
  }

  return (
    <AppBar position='static'>
      <Toolbar>
        <IconButton size='large' edge='start' color='inherit' aria-label='menu' sx={{ mr: 2 }}>
          <MenuIcon />
        </IconButton>
        <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
          CBSHub
        </Typography>
        <Button color='inherit' onClick={() => navigate('/signup')}>
          회원가입
        </Button>
        <Button color='inherit' onClick={() => navigate('/signin')}>
          로그인
        </Button>
        <Button color='inherit' disabled={isSignOutButtonLocked} onClick={() => handleSignOut()}>
          로그아웃
        </Button>
        <Button color='inherit' onClick={() => navigate('/reveille')}>
          기상송
        </Button>
      </Toolbar>
    </AppBar>
  )
}

export default TopAppBar
