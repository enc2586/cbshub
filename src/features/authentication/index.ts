import useAuth from './hooks/useAuth'
import useUserData from './hooks/useUserData'
import useStudents from './hooks/useStudents'
export { useAuth, useUserData, useStudents }

import { authority, UserData } from './types/userData'
export type { authority, UserData }

import AuthRequired from './components/AuthRequired'
import StudentSelect from './components/StudentSelect'
export { AuthRequired, StudentSelect }

// TODO: 나중에 꼭 없앨 것!
import { auth } from './services/auth'
export { auth }

// eslint-disable-next-line no-duplicate-imports
import { UserDataForSignUp } from './types/userData'
export type { UserDataForSignUp }
