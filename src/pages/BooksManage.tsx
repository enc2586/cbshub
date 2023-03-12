import SubjectBox from 'components/SubjectBox'
import { BookList } from 'features/books'

function BooksManage() {
  return (
    <SubjectBox title='도서 대출 현황'>
      <BookList />
    </SubjectBox>
  )
}

export default BooksManage
