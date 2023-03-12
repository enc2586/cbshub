export const minuteFormat = (date: Date) => {
  const formatter = new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
    timeZone: 'Asia/Seoul',
  })

  return formatter.format(date)
}

export const formatTime = (date: Date, options?: Intl.DateTimeFormatOptions) => {
  const formatter = new Intl.DateTimeFormat('ko-KR', options)

  return formatter.format(date)
}
