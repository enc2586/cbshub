import {
  addDoc,
  collection,
  deleteDoc,
  getDoc,
  doc,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore'
import { db } from 'services/firestore'
export async function addBooks(
  info: {
    title: string
    author: string
    publisher: string
  },
  amount: number,
) {
  const booksRef = collection(db, 'books')
  for (let i = 0; i < amount; i++) {
    await addDoc(booksRef, {
      ...info,
      state: 'idle',
      user: '',
      userName: '',
      checkedOn: serverTimestamp(),
    })
  }
}

export async function checkOut(uid: string, userName: string, targets: string[]) {
  for (const id of targets) {
    const bookRef = doc(db, 'books', id)
    await updateDoc(bookRef, {
      state: 'checkedOut',
      user: uid,
      userName: userName,
      checkedOn: serverTimestamp(),
    })
  }
}

export async function checkOutReq(uid: string, userName: string, targets: string[]) {
  for (const id of targets) {
    const bookRef = doc(db, 'books', id)
    await updateDoc(bookRef, {
      state: 'checkOutReq',
      user: uid,
      userName: userName,
    })
  }
}

export async function checkInReq(targets: string[]) {
  for (const id of targets) {
    const bookRef = doc(db, 'books', id)
    await updateDoc(bookRef, {
      state: 'checkInReq',
    })
  }
}

export async function checkIn(targets: string[]) {
  for (const id of targets) {
    const bookRef = doc(db, 'books', id)
    await updateDoc(bookRef, {
      state: 'idle',
    })
  }
}

export async function removeBook(targets: string[]) {
  for (const id of targets) {
    const bookRef = doc(db, 'books', id)
    await deleteDoc(bookRef)
  }
}

export async function getBook(target: string) {
  const bookRef = doc(db, 'books', target)
  const bookSnap = await getDoc(bookRef)

  if (bookSnap.exists()) {
    return bookSnap.data() as Book
  } else {
    return null
  }
}
