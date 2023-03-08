import * as React from 'react'

import { Box, Divider, Paper, Skeleton, Stack, Typography } from '@mui/material'

import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore'
import IconButton from '@mui/material/IconButton'
import { calcYMD, dayOfYMD, defaultVariant, defaultYMD, getMeal } from 'utils/meal'
import CircularProgress from '@mui/material/CircularProgress'

function Meal() {
  const [isMealLoading, setIsMealLoading] = React.useState<boolean>(true)
  const [variantSearching, setVariantSearching] = React.useState<'prev' | 'next' | false>('next')
  const [targetMeal, setTargetMeal] = React.useState<{ ymd: string; variant: number }>({
    ymd: defaultYMD(),
    variant: defaultVariant(),
  })
  const [mealShowData, setMealShowData] = React.useState<Meal | undefined>(undefined)

  const meal = React.useRef<{ [ymd: string]: MealInDay | undefined }>({})

  React.useEffect(() => {
    ;(async function () {
      if (targetMeal.variant > 2) {
        setTargetMeal({
          ymd: calcYMD(targetMeal.ymd, +1),
          variant: 0,
        })
      } else if (targetMeal.variant < 0) {
        setTargetMeal({
          ymd: calcYMD(targetMeal.ymd, -1),
          variant: 2,
        })
      } else {
        if (!Object.keys(meal.current).includes(targetMeal.ymd)) {
          setIsMealLoading(true)
          const mealResult = await getMeal(targetMeal.ymd)
          meal.current[targetMeal.ymd] = mealResult
          setIsMealLoading(false)
        }

        if (meal.current[targetMeal.ymd] === undefined) {
          setMealShowData(undefined)
          setVariantSearching(false)
        } else if (meal.current[targetMeal.ymd]!['data'][targetMeal.variant] === null) {
          if (variantSearching === 'next') {
            setTargetMeal({
              ...targetMeal,
              variant: targetMeal.variant + 1,
            })
          } else {
            setTargetMeal({
              ...targetMeal,
              variant: targetMeal.variant - 1,
            })
          }
        } else {
          setMealShowData(meal.current[targetMeal.ymd]!['data'][targetMeal.variant])
          setVariantSearching(false)
        }
      }
    })()
  }, [targetMeal])

  const mealTimeIncrement = (delta: 'next' | 'prev'): void => {
    setVariantSearching(delta)
    if (mealShowData === undefined) {
      if (delta === 'next') {
        setTargetMeal({
          ymd: calcYMD(targetMeal.ymd, +1),
          variant: 0,
        })
      } else {
        setTargetMeal({
          ymd: calcYMD(targetMeal.ymd, -1),
          variant: 2,
        })
      }
    } else {
      if (delta === 'next') {
        setTargetMeal({
          ...targetMeal,
          variant: targetMeal.variant + 1,
        })
      } else {
        setTargetMeal({
          ...targetMeal,
          variant: targetMeal.variant - 1,
        })
      }
    }
  }

  return (
    <Paper sx={{ p: 2 }}>
      <Stack spacing={2}>
        <Stack direction='row' alignItems='center' justifyContent='space-between'>
          <Typography variant='h5'>급식</Typography>

          <Stack direction='row' spacing={1}>
            <IconButton onClick={() => mealTimeIncrement('prev')}>
              <NavigateBeforeIcon />
            </IconButton>
            <IconButton onClick={() => mealTimeIncrement('next')}>
              <NavigateNextIcon />
            </IconButton>
          </Stack>
        </Stack>
        <Paper sx={{ p: 2, backgroundColor: 'secondaryBackground.main' }} elevation={0}>
          <Stack spacing={1}>
            <Stack direction='row' alignItems='center' justifyContent='space-between'>
              <Typography>
                <b>
                  {Number(targetMeal.ymd.slice(4, 6))}월 {Number(targetMeal.ymd.slice(6, 8))}일 (
                  {dayOfYMD(targetMeal.ymd, 'short')}){' '}
                  {!isMealLoading ? (mealShowData ? mealShowData.type : null) : null}
                </b>
              </Typography>

              {!isMealLoading ? (
                mealShowData ? (
                  <Paper sx={{ px: 1 }} elevation={0}>
                    <Typography fontSize={15}>{mealShowData.calorie} kCal</Typography>
                  </Paper>
                ) : null
              ) : (
                <Skeleton variant='rounded' width={80} height={20} />
              )}
            </Stack>
            <Divider />
            {!isMealLoading ? (
              mealShowData === undefined ? (
                <Stack
                  alignItems='center'
                  justifyContent='center'
                  sx={{ width: '100%', height: '150px' }}
                >
                  <Typography>급식 정보가 없어요</Typography>
                </Stack>
              ) : (
                <Stack>
                  {mealShowData.menu.map((item, index) => {
                    return <Typography key={index}>{item.name}</Typography>
                  })}
                </Stack>
              )
            ) : (
              <Stack spacing={1} sx={{ width: '100%', height: '150px' }}>
                <Skeleton variant='rounded' width={70} height={17} />
                <Skeleton variant='rounded' width={100} height={17} />
                <Skeleton variant='rounded' width={80} height={17} />
                <Skeleton variant='rounded' width={60} height={17} />
                <Skeleton variant='rounded' width={90} height={17} />
                <Skeleton variant='rounded' width={50} height={17} />
              </Stack>
            )}
          </Stack>
        </Paper>
      </Stack>
    </Paper>
  )
}

export default Meal
