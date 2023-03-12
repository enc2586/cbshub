import * as React from 'react'
import { onAuthStateChanged, User } from 'firebase/auth'
import { auth } from '../services/auth'

function useAuth() {
  const [currentUser, setCurrentUser] = React.useState<User | null | undefined>(undefined)
  React.useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setCurrentUser(user)
    })
  }, [])
  return currentUser
}

export default useAuth
