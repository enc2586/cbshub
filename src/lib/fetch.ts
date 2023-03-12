import qs from 'qs'
import axios from 'axios'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fetch = async (url: string, query: any) => {
  const promise = axios.post(url, qs.stringify(query))

  return await promise
}
