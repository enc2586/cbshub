import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
// import React from 'react'

import { Toaster } from 'react-hot-toast'

import theme from 'themes'

import TopAppBar from 'components/TopAppBar'

import Home from 'pages/Home'
import SignIn from 'pages/SignIn'
import SignUp from 'pages/SingUp'
import Reveille from 'pages/Reveille'
import { Box, Container } from '@mui/material'
import ValidateAuth from 'pages/ValidateAuth'
import PasswordReset from 'pages/PasswordReset'
import ReveilleManagement from 'pages/ReveilleManagement'
import AuthRequired from 'components/AuthRequired'

function App() {
  return (
    <ThemeProvider theme={theme}>
      <div style={{ background: theme.palette.background.default }}>
        <BrowserRouter>
          <TopAppBar />
          <Container>
            <Box sx={{ height: '10px' }} />
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/signin' element={<SignIn />} />
              <Route path='/signup' element={<SignUp />} />
              <Route path='/passwordreset' element={<PasswordReset />} />
              <Route path='/validatetest' element={<ValidateAuth />} />
              <Route element={<AuthRequired />}>
                <Route path='/reveille' element={<Reveille />} />
              </Route>
              <Route element={<AuthRequired authority='reveilleManager' />}>
                <Route path='/reveille/manage' element={<ReveilleManagement />} />
              </Route>
            </Routes>
          </Container>
        </BrowserRouter>
      </div>
      <Toaster position='bottom-left' />
    </ThemeProvider>
  )
}

export default App
