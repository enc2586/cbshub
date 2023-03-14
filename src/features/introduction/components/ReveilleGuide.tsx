import { Grid, Stack, Typography } from '@mui/material'

import reveilleImage from '../assets/reveille.png'
import reveilleManagerImage from '../assets/reveilleManager.png'
import reveilleBanImage from '../assets/reveilleBan.png'
import reveillePlayedImage from '../assets/reveillePlayed.png'
import reveilleSettingsImage from '../assets/reveilleSettings.png'

function ReveilleGuide() {
  return (
    <Stack spacing={2}>
      <Stack spacing={1}>
        <Typography>
          과거 기상음악 신청 방식은 복도에 있는 칠판에 학번과 함께 음악을 적는 것이었습니다.
          <br />
          기상음악을 신청하기 위해 복도 칠판까지 가는 것은 귀찮은 일이며, 신청된 음악이 마음에 들지
          않는 누군가가 남의 음악을 지우거나 학교에서 재생할 수 없는 수위의 음악을 신청하는 경우도
          있었습니다.
          <br />
          <br />이 문제를 해결하고자, 웹사이트에서 기상송을 신청/관리할 수 있도록 하는 서비스를
          제공합니다.
        </Typography>
      </Stack>
      <Stack spacing={1}>
        <Typography variant='h6'>메인 페이지</Typography>

        <img
          src={reveilleImage}
          style={{ width: '100%', borderRadius: '10px', maxWidth: '700px' }}
        />
        <Typography>
          왼쪽의 기상음악 신청 탭에서 음악을 검색하고 신청할 수 있습니다.
          <br />
          기본적으로는 자신이 소속된 기숙사가 뜨지만, 얼마든지 다른 기숙사에도 신청하거나 내역을
          확인할 수 있습니다.
          <br />
          <br />
          음악이 신청되면 대기열로 옮겨가며, 대기열에 있을 때는 언제든 자신이 신청했던 곡을 삭제할
          수 있습니다.
          <br />
          관리자 권한이 있는 학생은 아래 [기상음악 관리 패널 열기] 버튼을 통해 관리 패널로 진입할 수
          있으며, 이 패널 속에서 음악들을 재생처리하거나 검열할 수 있습니다.
        </Typography>
      </Stack>
      <Stack spacing={1}>
        <Typography variant='h6'>관리 패널</Typography>

        <img
          src={reveilleManagerImage}
          style={{ width: '100%', borderRadius: '10px', maxWidth: '700px' }}
        />
        <Typography>
          관리자는 음악들을 선택하고 재생처리하거나 검열할 수 있습니다.
          <br />
          검열 시 뜨는 창을 통해 해당 곡을 신청한 학생들을 최대 2주간 밴할 수 있습니다. 밴 처리된
          학생은 해당 기간 동안 기상송의 신규 신청이 불가능합니다.
          <br />
          <br />
          아래는 재생처리/ 검열처리 안내창과 관리자설정 창 입니다.
        </Typography>
        <Grid container columns={{ xs: 1, sm: 3 }} spacing={1}>
          <Grid item xs={1}>
            <img
              src={reveillePlayedImage}
              style={{ width: '100%', borderRadius: '10px', maxWidth: '300px' }}
            />
          </Grid>
          <Grid item xs={1}>
            <img
              src={reveilleBanImage}
              style={{ width: '100%', borderRadius: '10px', maxWidth: '300px' }}
            />
          </Grid>
          <Grid item xs={1}>
            <img
              src={reveilleSettingsImage}
              style={{ width: '100%', borderRadius: '10px', maxWidth: '300px' }}
            />
          </Grid>
        </Grid>
      </Stack>
    </Stack>
  )
}

export default ReveilleGuide
