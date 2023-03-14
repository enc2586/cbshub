import * as React from 'react'

import { Box } from '@mui/material'
import SubjectBox from 'components/SubjectBox'
// import { getTimetable } from '../services/comcigan'

function TimeTable({ grade, classNo }: { grade: number; classNo: number }) {
  React.useEffect(() => {
    ;(async function () {
      //   console.log(await getTimetable(grade, classNo))
    })()
  }, [])
  return (
    <SubjectBox title={grade + '학년 ' + classNo + '반 시간표'}>
      <Box></Box>
    </SubjectBox>
  )
}

export default TimeTable
