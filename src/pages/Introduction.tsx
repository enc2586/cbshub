import * as React from 'react'

import { Box, Button, Grid, Paper, Stack, Typography } from '@mui/material'
import GitHubIcon from '@mui/icons-material/GitHub'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'

function Introduction() {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <Stack spacing={2}>
            <Stack direction='row' justifyContent='space-between'>
              <Typography variant='h5'>서비스 소개</Typography>

              <Button
                size='small'
                variant='outlined'
                startIcon={<GitHubIcon />}
                endIcon={<OpenInNewIcon />}
                onClick={() => {
                  window.open('https://github.com/enc2586/cbshub', '_blank', 'noreferrer')
                }}
              >
                Github 방문
              </Button>
            </Stack>
          </Stack>
        </Paper>
      </Grid>
    </Grid>
  )
}

export default Introduction
