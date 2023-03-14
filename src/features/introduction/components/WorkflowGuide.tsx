import { Stack, Typography } from '@mui/material'

import workflowImage from '../assets/workflow.png'
import workflow1Image from '../assets/workflowStep1.png'
import workflow2Image from '../assets/workflowStep2.png'
import workflow3Image from '../assets/workflowStep3.png'
import workflowList from '../assets/workflowList.png'

function WorkflowGuide() {
  return (
    <Stack spacing={2}>
      <Stack spacing={1}>
        <img
          src={workflowImage}
          style={{ width: '100%', borderRadius: '10px', maxWidth: '700px' }}
        />
        <Typography>
          특별실 신청 예약 서비스란, 방과후나 동아리활동 등 주기적으로 신청해야 하는 자습의 신청을
          자동화해주는 서비스입니다.
          <br />
          <br />
          이곳에 원하는 교실명과 선생님, 시간대를 입력해두면, <b>평일 13시</b>마다 신청봇이 작동해
          해당 시간에 자습을 자동으로 신청해줍니다.
          <br />
          <br />
          평일 13시에 봇이 작동하므로, <b>13시 이후에 추가된 예약은 다음날부터 반영됩니다.</b>
          <br />
          <br />
          또한, 신청 예약을 등록하면 표출되는 <b>면책조항</b>을 꼭 확인하시기 바랍니다.
        </Typography>
      </Stack>
      <Stack spacing={1}>
        <Typography variant='h6'>신청 과정</Typography>

        <img
          src={workflow1Image}
          style={{ width: '100%', borderRadius: '10px', maxWidth: '400px' }}
        />
        <Typography>
          우선 예약 제목을 입력한 뒤, 신청할 교실과 지도교사 선생님을 선택합니다. 담임 선생님은
          가입된 정보를 기반으로 자동으로 선택됩니다.
          <br />
          <br />
        </Typography>
        <img
          src={workflow2Image}
          style={{ width: '100%', borderRadius: '10px', maxWidth: '400px' }}
        />
        <Typography>
          이후 신청할 시간대를 선택합니다. 다른 예약이 이미 설정된 시간대는 시계 아이콘으로 표시되며
          선택할 수 없습니다.
          <br />
          <br />
        </Typography>
        <img
          src={workflow3Image}
          style={{ width: '100%', borderRadius: '10px', maxWidth: '400px' }}
        />
        <Typography>
          마지막으로 학생관리시스템 로그인 정보를 확인하고 수정하거나, 없다면 추가한 뒤 신청할 수
          있습니다.
          <br />
          <br />
        </Typography>
      </Stack>
      <Stack spacing={1}>
        <Typography variant='h6'>신청 내역</Typography>
        <img
          src={workflowList}
          style={{ width: '100%', borderRadius: '10px', maxWidth: '400px' }}
        />
        <Typography>
          우측 상단을 통해 현재 봇이 자습신청을 완료했는지, 신청 중인지, 아직 신청하지 않았는지 알
          수 있습니다.
          <br />
          또한 각 자습의 지도교사, 교실, 신청 여부를 쉽게 파악할 수 있으며, 휴지통 버튼을 통해 쉽게
          삭제할 수 있습니다.
          <br />
        </Typography>
      </Stack>
    </Stack>
  )
}

export default WorkflowGuide
