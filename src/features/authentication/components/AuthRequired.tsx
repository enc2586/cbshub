import { useLocation, Outlet, Navigate } from 'react-router-dom'

import useUserData from '../hooks/useUserData'
import { authority } from '../types/userData'

import ValidateAuth from 'pages/ValidateAuth'
import LowAuthority from 'pages/LowAuthority'
import { getInfoVersion } from 'utils/getSidVer'
import UpdateSidModal from './UpdateSidModal'
import useAuth from '../hooks/useAuth'

function AuthRequired({ authority }: { authority?: authority[] }) {
  const user = useAuth()
  const userData = useUserData()
  const location = useLocation()
  const requiredInfoVer = getInfoVersion()

  if (user === undefined || userData === undefined) return <ValidateAuth />

  if (user === null || userData === null)
    return <Navigate to='/signin' state={{ from: location }} replace />

  if (
    authority &&
    !userData.authority.includes('administrator') &&
    !authority.every((elem) => userData.authority.includes(elem))
  )
    return <LowAuthority needed={authority} />

  if (userData.infoVersion < getInfoVersion())
    return (
      <>
        <UpdateSidModal requiredInfoVer={requiredInfoVer} uid={user.uid} />
        <Outlet />
      </>
    )

  return <Outlet />
}

export default AuthRequired
