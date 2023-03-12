import * as React from 'react'

import {
  Box,
  Button,
  Card,
  Chip,
  Grid,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  useMediaQuery,
} from '@mui/material'
import {
  DoneAll as DoneAllIcon,
  AcUnit as AcUnitIcon,
  VpnKey as VpnKeyIcon,
} from '@mui/icons-material'

import SubjectBox from 'components/SubjectBox'
import { Dormitory } from 'types/dormitories'
import { ReveilleApplier, ReveilleCensored, ReveillePlayed, ReveilleQueue } from 'features/reveille'
import { useUserData } from 'features/authentication'
import { getDefaultDormitory } from 'features/reveille/utils/dormitory'
import { useNavigate } from 'react-router-dom'

function Reveille() {
  const navigate = useNavigate()

  const userData = useUserData()

  React.useEffect(() => {
    if (userData) {
      setDormitory(getDefaultDormitory(userData))
    }
  }, [userData])
  const [dormitory, setDormitory] = React.useState<Dormitory>('sareum')

  const handleDormitoryChange = (_event: React.MouseEvent<HTMLElement>, newValue: Dormitory) => {
    if (newValue !== null) {
      setDormitory(newValue)
    }
  }

  const [secondaryDataType, setSecondaryDataType] = React.useState<'played' | 'censored'>('played')

  const isSmScreen = useMediaQuery('(max-width:600px)')
  return (
    <Box>
      <Grid container spacing={2}>
        {isSmScreen ? (
          <Grid item xs={12}>
            <Button
              variant='contained'
              color='error'
              fullWidth
              startIcon={<VpnKeyIcon />}
              onClick={() => {
                navigate('/reveille/manage')
              }}
            >
              기상음악 관리 패널 열기
            </Button>
          </Grid>
        ) : null}
        <Grid item md={4} sm={6} xs={12}>
          <SubjectBox
            title='기상음악 신청'
            adornment={
              <ToggleButtonGroup
                color='primary'
                sx={{ height: '30px' }}
                value={dormitory}
                exclusive
                onChange={handleDormitoryChange}
              >
                <ToggleButton value='chungwoon'>청운</ToggleButton>
                <ToggleButton value='sareum'>사름</ToggleButton>
              </ToggleButtonGroup>
            }
          >
            <ReveilleApplier dormitory={dormitory} showEmptyResult={!isSmScreen} />
          </SubjectBox>
        </Grid>
        <Grid item md={8} sm={6} xs={12}>
          <SubjectBox
            title='대기열'
            adornment={
              <ToggleButtonGroup
                color='primary'
                sx={{ height: '30px' }}
                value={dormitory}
                exclusive
                onChange={handleDormitoryChange}
              >
                <ToggleButton value='chungwoon'>청운</ToggleButton>
                <ToggleButton value='sareum'>사름</ToggleButton>
              </ToggleButtonGroup>
            }
          >
            <Box m={-2}>
              <Grid container spacing={2}>
                <Grid item md={6} xs={12}>
                  <ReveilleQueue dormitory={dormitory} sx={{ height: '413px' }} />
                </Grid>
                <Grid item md={6} xs={12}>
                  <Card sx={{ height: '413px' }}>
                    <Stack direction='row' spacing={1} sx={{ m: 1 }}>
                      <Chip
                        label='재생된 음악'
                        size='small'
                        color={secondaryDataType === 'played' ? 'primary' : 'default'}
                        icon={<DoneAllIcon />}
                        variant='filled'
                        onClick={() => {
                          setSecondaryDataType('played')
                        }}
                      />
                      <Chip
                        label='검열된 음악'
                        size='small'
                        color={secondaryDataType === 'censored' ? 'primary' : 'default'}
                        icon={<AcUnitIcon />}
                        variant='filled'
                        onClick={() => {
                          setSecondaryDataType('censored')
                        }}
                      />
                    </Stack>
                    {secondaryDataType === 'played' ? (
                      <ReveillePlayed dormitory={dormitory} sx={{ height: '370px' }} />
                    ) : (
                      <ReveilleCensored dormitory={dormitory} sx={{ height: '370px' }} />
                    )}
                  </Card>
                </Grid>
              </Grid>
            </Box>
          </SubjectBox>
        </Grid>
        {!isSmScreen ? (
          <Grid item xs={12}>
            <Button
              variant='contained'
              color='error'
              fullWidth
              startIcon={<VpnKeyIcon />}
              onClick={() => {
                navigate('/reveille/manage')
              }}
            >
              기상음악 관리 패널 열기
            </Button>
          </Grid>
        ) : null}
      </Grid>
    </Box>
  )
}
export default Reveille
