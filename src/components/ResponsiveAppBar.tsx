import * as React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from 'features/authentication'

import {
  AppBar,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Paper,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import LogoutIcon from '@mui/icons-material/Logout'
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts'
import Brightness6Icon from '@mui/icons-material/Brightness6'
import DirectionsRunSharpIcon from '@mui/icons-material/DirectionsRunSharp'

const pages: { [k: string]: string } = {
  '서비스 소개': '/introduction',
  기상음악: '/reveille',
  개인정보처리방침: '/privacy',
}

function ResponsiveAppBar({
  isDarkTheme,
  setIsDarkTheme,
}: {
  isDarkTheme: boolean | undefined
  setIsDarkTheme: React.Dispatch<React.SetStateAction<boolean | undefined>>
}) {
  const user = useAuth()
  const navigate = useNavigate()

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null)
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null)

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget)
  }
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget)
  }

  const handleCloseNavMenu = () => {
    setAnchorElNav(null)
  }

  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
  }

  return (
    <AppBar position='static' elevation={0} sx={{ backgroundColor: 'black' }}>
      <Container maxWidth='lg'>
        <Toolbar disableGutters>
          <Button
            disableRipple
            onClick={() => navigate('/')}
            sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }}
          >
            <Stack direction='row' alignItems='center'>
              <DirectionsRunSharpIcon sx={{ mr: 1, color: 'white' }} />
              {/* <Typography
                variant='h6'
                noWrap
                sx={{
                  fontWeight: 700,
                  letterSpacing: '.3rem',
                  color: 'white',
                  textDecoration: 'none',
                }}
              >
                CBSHUB
              </Typography> */}
              {/* <Paper elevation={0} sx={{ backgroundColor: '#f7971d' }}> */}
              <Paper elevation={0} sx={{ backgroundColor: '#ffffff' }}>
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
                  CBSHUB
                </Typography>
              </Paper>
            </Stack>
          </Button>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size='large'
              aria-label='account of current user'
              aria-controls='menu-appbar'
              aria-haspopup='true'
              onClick={handleOpenNavMenu}
              color='inherit'
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id='menu-appbar'
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {Object.entries(pages).map(([title, link]) => (
                <MenuItem
                  key={title}
                  onClick={() => {
                    navigate(link)
                    handleCloseNavMenu()
                  }}
                >
                  <Typography textAlign='center'>{title}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          {/* <DirectionsRunSharpIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} /> */}
          <Typography
            variant='h5'
            noWrap
            component={Link}
            to='/'
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            <Button disableRipple onClick={() => navigate('/')} sx={{ mr: 1 }}>
              <Stack direction='row' alignItems='center'>
                <DirectionsRunSharpIcon sx={{ mr: 1, color: 'white' }} />
                {/* <Typography
                  variant='h6'
                  noWrap
                  sx={{
                    fontWeight: 700,
                    letterSpacing: '.3rem',
                    color: 'white',
                    textDecoration: 'none',
                  }}
                >
                  CBSHUB
                </Typography> */}
                <Paper elevation={0} sx={{ backgroundColor: '#ffffff' }}>
                  {/* <Paper elevation={0} sx={{ backgroundColor: '#f7971d' }}> */}
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
                    CBSHUB
                  </Typography>
                </Paper>
              </Stack>
            </Button>
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {Object.entries(pages).map(([title, link]) => (
              <Button
                key={title}
                onClick={() => {
                  navigate(link)
                  handleCloseNavMenu()
                }}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {title}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            {user === undefined ? (
              <CircularProgress color='inherit' size='20px' thickness={5} />
            ) : user ? (
              <Tooltip title='Open settings'>
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt='Remy Sharp' />
                </IconButton>
              </Tooltip>
            ) : (
              <Stack direction='row'>
                <Button color='inherit' onClick={() => navigate('/signin')}>
                  로그인
                </Button>
              </Stack>
            )}
            <Menu
              sx={{ mt: '45px' }}
              id='menu-appbar'
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem
                onClick={() => {
                  navigate('/signout')
                  handleCloseUserMenu()
                }}
              >
                <ListItemIcon>
                  <LogoutIcon fontSize='small' />
                </ListItemIcon>
                <Typography textAlign='center'>로그아웃</Typography>
              </MenuItem>
              {/* <MenuItem
                onClick={() => {
                  navigate('/myaccount')
                  handleCloseUserMenu()
                }}
              >
                <ListItemIcon>
                  <ManageAccountsIcon fontSize='small' />
                </ListItemIcon>
                <Typography textAlign='center'>내 계정</Typography>
              </MenuItem> */}
              <MenuItem
                onClick={() => {
                  setIsDarkTheme(!isDarkTheme)
                }}
              >
                <ListItemIcon>
                  <Brightness6Icon fontSize='small' />
                </ListItemIcon>
                <Typography textAlign='center'>다크 모드</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}
export default ResponsiveAppBar
