import * as React from 'react'

import { Box, Paper, Stack, Typography } from '@mui/material'
import SubjectBox from 'components/SubjectBox'

function TimeTable({ grade, classNo }: { grade: number; classNo: number }) {
  React.useEffect
  return (
    <Box>
      <SubjectBox title={'시간표'}>
        <Stack>
          <Typography variant='h6'>
            {grade}학년 {classNo}반
          </Typography>
        </Stack>
      </SubjectBox>
    </Box>
  )
}

export default TimeTable
