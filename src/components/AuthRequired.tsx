import { useLocation, Outlet, Navigate } from 'react-router-dom'
import ValidateAuth from 'pages/ValidateAuth'
import useAuthData from 'hooks/useAuthData'

function AuthRequired({ authority }: { authority?: string }) {
  const userData = useAuthData()
  const location = useLocation()

  if (userData === undefined) {
    return <ValidateAuth />
  } else if (userData === null) {
    return <Navigate to='/signin' state={{ from: location }} replace />
  } else {
    if (authority !== undefined) {
      if (
        userData.authority !== undefined &&
        (userData.authority.includes(authority) || userData.authority.includes('administrator'))
      ) {
        return <Outlet />
      } else {
        return <Navigate to='/signUp' replace />
        // TODO: 권한 부족 페이지
      }
    } else {
      return <Outlet />
    }
  }
}

export default AuthRequired
