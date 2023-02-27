import { db } from 'configs/firebase'
import { doc, getDoc } from 'firebase/firestore'
import { UserData } from 'types/auth'
import { Dormitory, ReveilleConfig } from 'types/reveille'

function getDefaultDormitory(userData: UserData): Dormitory {
  const grade = userData.grade
  const sex = userData.sex

  if (!sex) return 'chungwoon'
  else if (grade === 1) return 'chungwoon'
  else return 'sareum'
}

async function getReveilleConfig(): Promise<ReveilleConfig> {
  const reveilleConfigRef = doc(db, 'reveille', 'configuration')
  const reveilleConfigSnap = await getDoc(reveilleConfigRef)
  if (reveilleConfigSnap.exists()) {
    return reveilleConfigSnap.data() as ReveilleConfig
  } else {
    throw new Error('Reveille configuration does not exist.')
  }
}

export { getDefaultDormitory, getReveilleConfig }
