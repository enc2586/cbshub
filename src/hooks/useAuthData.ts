import * as React from 'react'
import useAuth from 'hooks/useAuth'
import { UserData } from 'types/auth'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from 'configs/firebase'

function useAuthData() {
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

export default useAuthData
