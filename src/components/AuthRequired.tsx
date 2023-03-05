import { useLocation, Outlet, Navigate } from 'react-router-dom'
import useAuthData from 'hooks/useAuthData'

import ValidateAuth from 'pages/ValidateAuth'
import LowAuthority from 'pages/LowAuthority'

function AuthRequired({ authority }: { authority?: string }) {
  const userData = useAuthData()
  const location = useLocation()

  if (userData === undefined) {
    return <ValidateAuth />
  } else if (userData === null) {
    return <Navigate to='/signin' state={{ from: location }} replace />
  } else {
    if (authority !== undefined) {
      if (userData.authority.includes(authority) || userData.authority.includes('administrator')) {
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
