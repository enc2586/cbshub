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

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <TopAppBar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/signin' element={<SignIn />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/reveille' element={<Reveille />} />
        </Routes>
      </BrowserRouter>
      <Toaster position='bottom-left' />
    </ThemeProvider>
  )
}

export default App
