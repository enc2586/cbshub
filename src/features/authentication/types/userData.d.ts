import { FieldValue } from 'firebase/firestore'

export type UserData = {
  authority: authority[]
  agreedTermsAt: Date
  email: string
  name: string
  sex: boolean
  grade: number
  classNo: number
  numberInClass: number
  reveillesApplied: number
  selfServiceCredential?: {
    id: string
    password: string
  }
}

export type UserDataForSignUp = Omit<UserData, 'agreedTermsAt'> & { agreedTermsAt: FieldValue }

export type authority = 'student' | 'teacher' | 'administrator' | 'reveilleManager'
