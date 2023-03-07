import { db } from 'configs/firebase'
import { doc, getDoc } from 'firebase/firestore'

function hm(hours: number, minutes: number): number {
  return hours * 60 + minutes
}

export function defaultYMD(): string {
  const now = new Date()
  const hh = now.getHours()
  const mm = now.getMinutes()

  let targetDate: number[]
  if (hm(hh, mm) > hm(18, 30)) {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    targetDate = [tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate()]
  } else {
    targetDate = [now.getFullYear(), now.getMonth(), now.getDate()]
  }

  return (
    String(targetDate[0]) +
    String(targetDate[1] + 1).padStart(2, '0') +
    String(targetDate[2]).padStart(2, '0')
  )
}

export function defaultVariant(): number {
  const now = new Date()
  const hh = now.getHours()
  const mm = now.getMinutes()

  if (hm(hh, mm) > hm(18, 30)) {
    return 0
  } else {
    if (hm(hh, mm) > hm(13, 0)) {
      return 2
    } else if (hm(hh, mm) > hm(7, 20)) {
      return 1
    } else {
      return 0
    }
  }
}

export function calcYMD(ymd: string, delta: number): string {
  const year = parseInt(ymd.slice(0, 4), 10)
  const month = parseInt(ymd.slice(4, 6), 10) - 1
  const day = parseInt(ymd.slice(6, 8), 10)
  const result = new Date(year, month, day)

  result.setDate(result.getDate() + delta)

  return (
    String(result.getFullYear()) +
    String(result.getMonth() + 1).padStart(2, '0') +
    String(result.getDate()).padStart(2, '0')
  )
}

export function dayOfYMD(ymd: string, type: 'long' | 'narrow' | 'short'): string {
  const year = parseInt(ymd.slice(0, 4), 10)
  const month = parseInt(ymd.slice(4, 6), 10) - 1
  const day = parseInt(ymd.slice(6, 8), 10)
  const result = new Date(year, month, day)

  const formatter = new Intl.DateTimeFormat('ko-KR', {
    weekday: type,
    timeZone: 'Asia/Seoul',
  })

  return formatter.format(result)
}

export async function getMeal(ymd: string): Promise<MealInDay | undefined> {
  const mealRef = doc(db, 'meal', ymd)
  const mealSnap = await getDoc(mealRef)

  if (mealSnap.exists()) {
    const result = mealSnap.data()
    result['date'] = result['date'].toDate()

    return result as MealInDay
  } else {
    return undefined
  }
}
