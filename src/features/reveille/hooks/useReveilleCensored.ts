import { CensoredMusic } from '../types/reveille'
import * as React from 'react'
import { collection, limit, onSnapshot, orderBy, query, where } from 'firebase/firestore'
import { db } from 'services/firestore'

function useReveilleCensored() {
  const [sareumReveilleCensored, setSareumReveilleCensored] = React.useState<CensoredMusic[]>([])
  const [chungwoonReveilleCensored, setChungwoonReveilleCensored] = React.useState<CensoredMusic[]>(
    [],
  )

  const limitDaysIn = 14
  const limitDate = new Date()
  limitDate.setDate(limitDate.getDate() - limitDaysIn)

  React.useEffect(() => {
    const sareumReveilleCensoredRef = collection(db, 'reveille', 'sareum', 'censored')
    return onSnapshot(
      query(
        sareumReveilleCensoredRef,
        where('censoredOn', '>=', limitDate),
        orderBy('censoredOn', 'desc'),
      ),
      (snapshot) => {
        const result: CensoredMusic[] = []
        snapshot.forEach((doc) => {
          const musicData = doc.data()
          musicData.id = doc.id
          musicData.appliedOn = musicData.appliedOn.toDate()
          musicData.censoredOn = musicData.censoredOn.toDate()

          result.push(musicData as CensoredMusic)
        })
        setSareumReveilleCensored(result)
      },
    )
  }, [])

  React.useEffect(() => {
    const chungwoonReveilleCensoredRef = collection(db, 'reveille', 'chungwoon', 'censored')
    return onSnapshot(
      query(
        chungwoonReveilleCensoredRef,
        where('censoredOn', '>=', limitDate),
        orderBy('censoredOn', 'desc'),
      ),
      (snapshot) => {
        const result: CensoredMusic[] = []
        snapshot.forEach((doc) => {
          const musicData = doc.data()
          musicData.id = doc.id
          musicData.appliedOn = musicData.appliedOn.toDate()
          musicData.censoredOn = musicData.censoredOn.toDate()

          result.push(musicData as CensoredMusic)
        })
        setChungwoonReveilleCensored(result)
      },
    )
  }, [])

  return {
    sareum: sareumReveilleCensored,
    chungwoon: chungwoonReveilleCensored,
  }
}

export default useReveilleCensored
