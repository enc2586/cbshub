import { db } from 'configs/firebase'
import { collection, getDocs, limit, orderBy, Query, query, where } from 'firebase/firestore'
import { Dormitory, PlayedMusic, QueuedMusic, CensoredMusic } from 'types/reveille'

async function fetchReveillesQueue(
  dormitory: Dormitory,
  limitCount?: number,
): Promise<QueuedMusic[]> {
  const reveilleRef = collection(db, 'reveille', dormitory, 'queue')

  let reveilleQuery: Query
  if (limitCount === undefined) {
    reveilleQuery = query(reveilleRef, orderBy('appliedOn', 'asc'))
  } else {
    reveilleQuery = query(reveilleRef, orderBy('appliedOn', 'asc'), limit(limitCount))
  }
  const reveille = await getDocs(reveilleQuery)

  const result: QueuedMusic[] = []
  reveille.forEach((doc) => {
    const musicData = doc.data()
    musicData.appliedOn = musicData.appliedOn.toDate()
    result.push({ ...(musicData as QueuedMusic), id: doc.id })
  })

  return result
}

async function fetchReveillesPlayed(
  dormitory: Dormitory,
  limitCount?: number,
): Promise<PlayedMusic[]> {
  const reveilleRef = collection(db, 'reveille', dormitory, 'played')

  let reveilleQuery: Query
  if (limitCount === undefined) {
    reveilleQuery = query(reveilleRef, orderBy('playedOn', 'desc'))
  } else {
    reveilleQuery = query(reveilleRef, orderBy('playedOn', 'desc'), limit(limitCount))
  }
  const reveille = await getDocs(reveilleQuery)

  const result: PlayedMusic[] = []
  reveille.forEach((doc) => {
    const musicData = doc.data()
    musicData.appliedOn = musicData.appliedOn.toDate()
    musicData.playedOn = musicData.playedOn.toDate()
    result.push({ ...(musicData as PlayedMusic), id: doc.id })
  })

  return result
}

async function fetchReveillesCensored(
  dormitory: Dormitory,
  limitDaysIn?: number,
): Promise<CensoredMusic[]> {
  const reveilleRef = collection(db, 'reveille', dormitory, 'censored')

  let reveilleQuery: Query
  if (limitDaysIn === undefined) {
    reveilleQuery = query(reveilleRef, orderBy('censoredOn', 'desc'))
  } else {
    const limitDate = new Date()
    limitDate.setDate(limitDate.getDate() - limitDaysIn)
    reveilleQuery = query(
      reveilleRef,
      where('censoredOn', '>=', limitDate),
      orderBy('censoredOn', 'desc'),
    )
  }
  const reveille = await getDocs(reveilleQuery)

  const result: CensoredMusic[] = []
  reveille.forEach((doc) => {
    const musicData = doc.data()
    musicData.appliedOn = musicData.appliedOn.toDate()
    musicData.censoredOn = musicData.censoredOn.toDate()
    result.push({ ...(musicData as CensoredMusic), id: doc.id })
  })

  return result
}

export { fetchReveillesQueue, fetchReveillesPlayed, fetchReveillesCensored }
