import { Button } from '@mui/material'
import SubjectBox from 'components/SubjectBox'
import { WorkflowGuide } from 'features/introduction'
import { useNavigate } from 'react-router-dom'

function WorkflowIntroduction() {
  const navigate = useNavigate()
  return (
    <SubjectBox
      title='특별실 신청 예약에 대해'
      adornment={
        <Button
          size='small'
          variant='contained'
          onClick={() => {
            navigate('/workflow')
          }}
        >
          해당 서비스로
        </Button>
      }
    >
      <WorkflowGuide />
    </SubjectBox>
  )
}

export default WorkflowIntroduction
