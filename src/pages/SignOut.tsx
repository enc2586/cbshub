import { auth } from 'features/authentication'
import { signOut } from 'firebase/auth'
import * as React from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

function SignOut() {
  const navigate = useNavigate()

  const handleSignOut = async () => {
    toast.loading('로그아웃하는 중', { id: 'signout' })
    try {
      await signOut(auth)
      toast.success('로그아웃했어요', { id: 'signout' })
      navigate('/')
    } catch (error) {
      console.error(error)
      toast.error('로그아웃 중 문제가 일어났어요', { id: 'signout' })
      navigate('/')
    }
  }

  React.useEffect(() => {
    handleSignOut()
  }, [])
  return <div></div>
}

export default SignOut
