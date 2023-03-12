import { QueuedMusic } from '../types/reveille'
import * as React from 'react'
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import { db } from 'services/firestore'

function useReveilleQueue() {
  const [sareumReveilleQueue, setSareumReveilleQueue] = React.useState<QueuedMusic[]>([])
  const [chungwoonReveilleQueue, setChungwoonReveilleQueue] = React.useState<QueuedMusic[]>([])

  React.useEffect(() => {
    const sareumReveilleQueueRef = collection(db, 'reveille', 'sareum', 'queue')
    return onSnapshot(query(sareumReveilleQueueRef, orderBy('appliedOn', 'asc')), (snapshot) => {
      const result: QueuedMusic[] = []
      snapshot.forEach((doc) => {
        const musicData = doc.data()
        musicData.id = doc.id
        musicData.appliedOn = musicData.appliedOn.toDate()

        result.push(musicData as QueuedMusic)
      })
      setSareumReveilleQueue(result)
    })
  }, [])

  React.useEffect(() => {
    const chungwoonReveilleQueueRef = collection(db, 'reveille', 'chungwoon', 'queue')
    return onSnapshot(query(chungwoonReveilleQueueRef, orderBy('appliedOn', 'asc')), (snapshot) => {
      const result: QueuedMusic[] = []
      snapshot.forEach((doc) => {
        const musicData = doc.data()
        musicData.id = doc.id
        musicData.appliedOn = musicData.appliedOn.toDate()

        result.push(musicData as QueuedMusic)
      })
      setChungwoonReveilleQueue(result)
    })
  }, [])

  return {
    sareum: sareumReveilleQueue,
    chungwoon: chungwoonReveilleQueue,
  }
}

export default useReveilleQueue
