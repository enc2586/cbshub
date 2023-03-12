import * as React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import { Container } from '@mui/material'
import Reveille from 'pages/Reveille'

import { Toaster } from 'react-hot-toast'

import { lightTheme, darkTheme } from 'assets/themes'

import Home from 'pages/Home'
import SignIn from 'pages/SignIn'
import SignUp from 'pages/SignUp'
import PasswordReset from 'pages/PasswordReset'
// import ReveilleManagement from 'pages/ReveilleManagement'
import ResponsiveAppBar from 'components/ResponsiveAppBar'
import SignOut from 'pages/SignOut'

import store from 'store2'
import Lost from 'pages/Lost'
import AboutPrivacy from 'pages/AboutPrivacy'
import Follower from 'components/Follower'
import Notice from 'components/Notice'
import LowAuthority from 'pages/LowAuthority'
import Introduction from 'pages/Introduction'
// import Workflow from 'pages/Workflow'
import { AuthRequired } from 'features/authentication'
import Workflow from 'pages/Workflow'
import ReveilleManagement from 'pages/ReveilleManage'
import BooksManage from 'pages/BooksManage'
import Books from 'pages/Books'

function App() {
  const [isDarkTheme, setIsDarkTheme] = React.useState<boolean | undefined>(undefined)
  React.useEffect(() => {
    if (isDarkTheme !== undefined) {
      store.set('darkTheme', isDarkTheme)
      setTheme(isDarkTheme ? darkTheme : lightTheme)
    }
  }, [isDarkTheme])

  const [theme, setTheme] = React.useState(darkTheme)

  React.useEffect(() => {
    if (!store.has('darkTheme')) {
      store.set('darkTheme', false)
    }

    setIsDarkTheme(store.get('darkTheme'))
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <div style={{ background: theme.palette.background.default, minHeight: '100vh' }}>
        <BrowserRouter>
          <ResponsiveAppBar isDarkTheme={isDarkTheme} setIsDarkTheme={setIsDarkTheme} />
          <Container maxWidth='lg' sx={{ p: 2 }}>
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='signin' element={<SignIn />} />
              <Route path='signup' element={<SignUp />} />
              <Route path='signout' element={<SignOut />} />
              <Route path='passwordreset' element={<PasswordReset />} />
              <Route path='privacy' element={<AboutPrivacy />} />
              <Route path='introduction' element={<Introduction />} />
              <Route element={<AuthRequired />}>
                <Route path='reveille'>
                  <Route path='' element={<Reveille />} />
                  <Route element={<AuthRequired authority={['reveilleManager']} />}>
                    <Route path='manage' element={<ReveilleManagement />} />
                  </Route>
                </Route>
                <Route path='workflow' element={<Workflow />} />
              </Route>
              <Route path='books' element={<AuthRequired />}>
                <Route path='' element={<Books />} />
                <Route element={<AuthRequired authority={['teacher']} />}>
                  <Route path='manage' element={<BooksManage />} />
                </Route>
              </Route>
              <Route path={'test'} element={<AuthRequired authority={['administrator']} />}>
                <Route path='lost' element={<Lost />} />
                <Route path='lowauthority' element={<LowAuthority needed={['administrator']} />} />
              </Route>
              <Route path='*' element={<Lost />} />
            </Routes>
          </Container>
        </BrowserRouter>
        <Notice />
        {/* <Follower /> */}
      </div>
      <Toaster
        position='bottom-left'
        toastOptions={
          isDarkTheme
            ? {
                style: {
                  background: '#1e1e1e',
                  color: theme.palette.text.primary,
                },
              }
            : undefined
        }
      />
    </ThemeProvider>
  )
}

export default App
