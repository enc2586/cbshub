import { FieldValue } from 'firebase/firestore'

export type UserData = {
  authority?: string[]
  agreedTermsAt: Date | FieldValue
  email: string
  name: string
  sex: boolean
  grade: number
  classNo: number
  numberInClass: number
  reveillesApplied: number
}
