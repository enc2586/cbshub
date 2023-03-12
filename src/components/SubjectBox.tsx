import { Paper, Stack, Typography } from '@mui/material'
import { ReactNode } from 'react'

function SubjectBox({
  children,
  title,
  adornment,
}: {
  children: ReactNode
  title: ReactNode
  adornment?: ReactNode
}) {
  return (
    <Paper sx={{ p: 2 }}>
      <Stack spacing={2}>
        <Stack direction='row' alignItems='center' justifyContent='space-between'>
          <Typography variant='h5'>{title}</Typography>
          {adornment}
        </Stack>
        {children}
      </Stack>
    </Paper>
  )
}

export default SubjectBox
