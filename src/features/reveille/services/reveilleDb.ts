import {
  doc,
  serverTimestamp,
  collection,
  addDoc,
  updateDoc,
  deleteField,
  deleteDoc,
} from 'firebase/firestore'
import { db } from 'services/firestore'
import { Dormitory } from 'types/dormitories'
import { ReveilleConfig, SearchedMusic } from '../types/reveille'

export async function applyReveille(
  uid: string,
  dormitory: Dormitory,
  music: SearchedMusic,
  userName = '',
) {
  const reveilleQueueRef = collection(db, 'reveille', dormitory, 'queue')
  const reveilleData = {
    title: music.name,
    artist: music.artist,
    user: uid,
    userName: userName,
    appliedOn: serverTimestamp(),
  }

  return await addDoc(reveilleQueueRef, reveilleData)
}

export async function removeReveille(dormitory: Dormitory, id: string) {
  const targetRef = doc(db, 'reveille', dormitory, 'queue', id)
  return deleteDoc(targetRef)
}

export function isBanned(uid: string, reveilleConfig: ReveilleConfig): Date | false {
  if (Object.keys(reveilleConfig.bannedUsers).includes(uid)) {
    const dueDate = reveilleConfig.bannedUsers[uid].toDate()

    if (dueDate > new Date()) {
      return dueDate
    } else {
      unban(uid)
      return false
    }
  } else {
    return false
  }
}

async function unban(uid: string) {
  const reveilleConfigRef = doc(db, 'reveille', 'configuration')
  await updateDoc(reveilleConfigRef, {
    ['bannedUsers.' + uid]: deleteField(),
  })
}
