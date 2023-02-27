import { onAuthStateChanged, User } from 'firebase/auth'
import { auth } from 'configs/firebase'
import React from 'react'

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
