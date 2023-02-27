import { Timestamp } from 'firebase/firestore'

type UserData = {
  authority?: string[]
  agreedTermsAt: Date | Timestamp
  email: string
  name: string
  sex: boolean
  grade: number
  classNo: number
  numberInClass: number
  reveillesApplied: number
}
