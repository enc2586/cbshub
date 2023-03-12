import * as React from 'react'
import useAuth from './useAuth'
import { UserData } from '../types/userData'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from 'services/firestore'

function useUserData() {
  const user = useAuth()
  const [userData, setUserData] = React.useState<UserData | undefined | null>(undefined)

  React.useEffect(() => {
    if (user === undefined || user === null) {
      setUserData(user)
    } else {
      const userRef = doc(db, 'user', user.uid)
      onSnapshot(userRef, (doc) => {
        const userData = doc.data() as UserData
        setUserData(userData)
      })
    }
  }, [user])

  return userData
}

export default useUserData
