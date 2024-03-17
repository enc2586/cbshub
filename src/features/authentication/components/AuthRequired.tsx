import { useLocation, Outlet, Navigate } from 'react-router-dom'

import useUserData from '../hooks/useUserData'
import { authority } from '../types/userData'

import ValidateAuth from 'pages/ValidateAuth'
import LowAuthority from 'pages/LowAuthority'

function AuthRequired({ authority }: { authority?: authority[] }) {
  const userData = useUserData()
  const location = useLocation()

  if (userData === undefined) return <ValidateAuth />

  if (userData === null) return <Navigate to='/signin' state={{ from: location }} replace />

  if (
    authority &&
    !userData.authority.includes('administrator') &&
    !authority.every((elem) => userData.authority.includes(elem))
  )
    return <LowAuthority needed={authority} />

  return <Outlet />
}

export default AuthRequired
