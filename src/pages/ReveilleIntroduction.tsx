import { Button } from '@mui/material'
import SubjectBox from 'components/SubjectBox'
import { ReveilleGuide } from 'features/introduction'
import { useNavigate } from 'react-router-dom'

function ReveilleIntroduction() {
  const navigate = useNavigate()
  return (
    <SubjectBox
      title='기상음악 신청 서비스에 대해'
      adornment={
        <Button
          size='small'
          variant='contained'
          onClick={() => {
            navigate('/reveille')
          }}
        >
          해당 서비스로
        </Button>
      }
    >
      <ReveilleGuide />
    </SubjectBox>
  )
}

export default ReveilleIntroduction
