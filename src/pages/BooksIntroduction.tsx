import { Button } from '@mui/material'
import SubjectBox from 'components/SubjectBox'
import { BookGuide, WorkflowGuide } from 'features/introduction'
import { useNavigate } from 'react-router-dom'

function BookIntroduction() {
  const navigate = useNavigate()
  return (
    <SubjectBox
      title='정보도서 대출에 대해'
      adornment={
        <Button
          size='small'
          variant='contained'
          onClick={() => {
            navigate('/book')
          }}
        >
          해당 서비스로
        </Button>
      }
    >
      <BookGuide />
    </SubjectBox>
  )
}

export default BookIntroduction
