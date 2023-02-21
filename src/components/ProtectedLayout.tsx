import * as React from 'react'

import { useLocation, Outlet, Navigate } from 'react-router-dom'
import { auth } from 'firebaseConfig/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import ValidateAuth from 'pages/ValidateAuth'

function useAuth() {
  const [currentUser, setCurrentUser] = React.useState<object | null | undefined>(undefined)
  React.useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setCurrentUser(user)
    })
  }, [])
  return currentUser
}

function ProtectedLayout() {
  const user = useAuth()
  const location = useLocation()

  return typeof user === 'undefined' ? (
    <ValidateAuth />
  ) : user ? (
    <Outlet />
  ) : (
    <Navigate to='/login' state={{ from: location }} replace />
  )
}

export default ProtectedLayout
