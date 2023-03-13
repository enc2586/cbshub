import * as React from 'react'
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import { db } from 'services/firestore'

function useBooks() {
  const [books, setBooks] = React.useState<{ [id: string]: Book }>({})

  React.useEffect(() => {
    const booksRef = collection(db, 'books')
    return onSnapshot(
      query(booksRef, orderBy('title', 'asc'), orderBy('state', 'asc')),
      (snapshot) => {
        const result: { [id: string]: Book } = {}
        snapshot.forEach((doc) => {
          const bookData = doc.data()
          bookData.checkedOn = bookData.checkedOn.toDate()

          result[doc.id] = bookData as Book
        })

        setBooks(result)
      },
    )
  }, [])

  return books
}

export default useBooks
