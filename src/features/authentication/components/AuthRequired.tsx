import { useLocation, Outlet, Navigate } from 'react-router-dom'

import useUserData from '../hooks/useUserData'
import { authority } from '../types/userData'

import ValidateAuth from 'pages/ValidateAuth'
import LowAuthority from 'pages/LowAuthority'

function AuthRequired({ authority }: { authority?: authority[] }) {
  const userData = useUserData()
  const location = useLocation()

  if (userData === undefined) {
    return <ValidateAuth />
  } else if (userData === null) {
    return <Navigate to='/signin' state={{ from: location }} replace />
  } else {
    if (authority !== undefined) {
      if (
        userData.authority.includes('administrator') ||
        authority.every((elem) => userData.authority.includes(elem))
      ) {
        return <Outlet />
      } else {
        return <LowAuthority needed={authority} />
      }
    } else {
      return <Outlet />
    }
  }
}

export default AuthRequired
