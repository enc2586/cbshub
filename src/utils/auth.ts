import { db } from 'configs/firebase'
import { doc, getDoc } from 'firebase/firestore'
import toast from 'react-hot-toast'
import { UserData } from 'types/auth'

const fetchUserData = async (uid: string) => {
  const userDataRef = doc(db, 'user', uid)
  const result = await getDoc(userDataRef)
  if (result.exists()) {
    return result.data() as UserData
  } else {
    toast.error('Fatal Error: Auth와 DB간 연결을 찾을 수 없습니다. 관리자에게 문의하세요.', {
      id: 'noConnection',
      duration: Infinity,
    })
    return undefined
  }
}

export { fetchUserData }
