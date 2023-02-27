import { db } from 'configs/firebase'
import { doc, getDoc } from 'firebase/firestore'
import useAuth from 'hooks/useAuth'
import React from 'react'
import { toast } from 'react-hot-toast'
import { UserData } from 'types/auth'
import { fetchUserData } from 'utils/auth'

function useAuthData() {
  const user = useAuth()
  const [userData, setUserData] = React.useState<UserData | undefined | null>(undefined)

  React.useEffect(() => {
    ;(async function () {
      if (user === undefined || user === null) {
        setUserData(user)
      } else {
        const newData = await fetchUserData(user.uid)
        setUserData(newData)
      }
    })()
  }, [user])

  return userData
}

export default useAuthData
