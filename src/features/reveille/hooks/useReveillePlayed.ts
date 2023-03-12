import { PlayedMusic } from '../types/reveille'
import * as React from 'react'
import { collection, limit, onSnapshot, orderBy, query } from 'firebase/firestore'
import { db } from 'services/firestore'

function useReveillePlayed() {
  const [sareumReveillePlayed, setSareumReveillePlayed] = React.useState<PlayedMusic[]>([])
  const [chungwoonReveillePlayed, setChungwoonReveillePlayed] = React.useState<PlayedMusic[]>([])

  React.useEffect(() => {
    const sareumReveillePlayedRef = collection(db, 'reveille', 'sareum', 'played')
    return onSnapshot(
      query(sareumReveillePlayedRef, orderBy('playedOn', 'desc'), limit(30)),
      (snapshot) => {
        const result: PlayedMusic[] = []
        snapshot.forEach((doc) => {
          const musicData = doc.data()
          musicData.id = doc.id
          musicData.appliedOn = musicData.appliedOn.toDate()
          musicData.playedOn = musicData.playedOn.toDate()

          result.push(musicData as PlayedMusic)
        })
        setSareumReveillePlayed(result)
      },
    )
  }, [])

  React.useEffect(() => {
    const chungwoonReveillePlayedRef = collection(db, 'reveille', 'chungwoon', 'played')
    return onSnapshot(
      query(chungwoonReveillePlayedRef, orderBy('playedOn', 'desc'), limit(30)),
      (snapshot) => {
        const result: PlayedMusic[] = []
        snapshot.forEach((doc) => {
          const musicData = doc.data()
          musicData.id = doc.id
          musicData.appliedOn = musicData.appliedOn.toDate()
          musicData.playedOn = musicData.playedOn.toDate()

          result.push(musicData as PlayedMusic)
        })
        setChungwoonReveillePlayed(result)
      },
    )
  }, [])

  return {
    sareum: sareumReveillePlayed,
    chungwoon: chungwoonReveillePlayed,
  }
}

export default useReveillePlayed
