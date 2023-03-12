import { getAuth } from 'firebase/auth'
import { app } from 'services/firebase'

export const auth = getAuth(app)
