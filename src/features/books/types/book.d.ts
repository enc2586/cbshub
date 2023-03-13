type Book = {
  title: string
  author: string
  publisher: string
  state: 'idle' | 'checkedOut' | 'checkOutReq' | 'checkInReq'
  user: string
  userName: string
  checkedOn: Date
}
