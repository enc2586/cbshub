import { UserData } from './../types/userData.d'
import * as React from 'react'
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore'
import { db } from 'services/firestore'

function useStudents() {
  const [students, setStudents] = React.useState<{ [id: string]: UserData }>({})

  React.useEffect(() => {
    const studentsRef = collection(db, 'user')
    return onSnapshot(
      query(studentsRef, where('authority', 'array-contains', 'student')),
      (snapshot) => {
        const result: { [id: string]: UserData } = {}
        snapshot.forEach((doc) => {
          result[doc.id] = doc.data() as UserData
        })

        setStudents(result)
      },
    )
  }, [])

  return students
}

export default useStudents
