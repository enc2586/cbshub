import * as React from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from 'services/firestore'

function useBook(id: string) {
  const [book, setBook] = React.useState<Book | null | undefined>(undefined)

  React.useEffect(() => {
    const booksRef = doc(db, 'books', id)
    return onSnapshot(booksRef, (doc) => {
      if (doc.exists()) {
        setBook(doc.data() as Book)
      } else {
        setBook(null)
      }
    })
  }, [])

  return book
}

export default useBook
