import { UserData } from 'features/authentication'
import { Dormitory } from 'types/dormitories'

export function getDefaultDormitory(userData: UserData): Dormitory {
  const grade = userData.grade
  const sex = userData.sex

  if (!sex) return 'chungwoon'
  else if (grade === 1) return 'chungwoon'
  else return 'sareum'
}
