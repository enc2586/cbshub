import { getFirestore } from 'firebase/firestore'
import { app } from 'services/firebase'

export const db = getFirestore(app)
