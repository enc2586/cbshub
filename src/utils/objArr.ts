export const obj2arr = (obj: {
  [key: string | number | symbol]: { [key: string | number | symbol]: any }
}) => {
  const result = []
  for (const [key, value] of Object.entries(obj)) {
    const newValue = { ...value, id: key }
    result.push(newValue)
  }
  return result
}
