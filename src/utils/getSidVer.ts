export function getSidVer() {
  const date = new Date()

  const year = date.getFullYear()
  const month = date.getMonth() + 1

  if (month < 3) return year - 1
  return year
}
