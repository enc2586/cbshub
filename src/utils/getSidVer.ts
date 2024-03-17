export function getInfoVersion(date?: Date) {
  if (!date) date = new Date()

  const year = date.getFullYear()
  const month = date.getMonth() + 1

  if (month < 3) return year - 1
  return year
}
