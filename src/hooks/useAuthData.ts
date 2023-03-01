import * as React from 'react'
import useAuth from 'hooks/useAuth'
import { fetchUserData } from 'utils/auth'
import { UserData } from 'types/auth'

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
