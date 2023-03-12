import useAuth from './hooks/useAuth'
import useUserData from './hooks/useUserData'
export { useAuth, useUserData }

import { authority, UserData } from './types/userData'
export type { authority, UserData }

import AuthRequired from './components/AuthRequired'
export { AuthRequired }

// TODO: 나중에 꼭 없앨 것!
import { auth } from './services/auth'
export { auth }

// eslint-disable-next-line no-duplicate-imports
import { UserDataForSignUp } from './types/userData'
export type { UserDataForSignUp }
