import { Paper, Stack, Typography } from '@mui/material'

import PrivacyAgreement from 'components/PrivacyAgreement'
import PrivacyTerms from 'components/PrivacyTerms'

function AboutPrivacy() {
  return (
    <Paper sx={{ p: 2 }}>
      <Stack spacing={4}>
        <Stack spacing={2}>
          <Typography variant='h5'>개인정보 수집·이용 동의</Typography>

          <Paper sx={{ p: 2 }}>
            <PrivacyAgreement />
          </Paper>
        </Stack>
        <Stack spacing={2}>
          <Typography variant='h5'>개인정보처리방침</Typography>
          <Paper sx={{ p: 2 }}>
            <PrivacyTerms />
          </Paper>
        </Stack>
      </Stack>
    </Paper>
  )
}

export default AboutPrivacy
