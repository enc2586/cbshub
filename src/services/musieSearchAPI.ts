import qs from 'qs'
import axios from 'axios'

export const musicSearchAPI = async (query: string) => {
  if (query == '') {
    return []
  }

  const promise = axios.post(
    'https://ws.audioscrobbler.com/2.0',
    qs.stringify({
      method: 'track.search',
      limit: 10,
      track: query,
      // eslint-disable-next-line camelcase
      api_key: process.env.REACT_APP_lastfm_api_key,
      format: 'json',
    }),
  )

  const result = await promise

  if (Object.keys(result.data).length !== 0) {
    const musicList = result.data.results.trackmatches.track
    return musicList
  } else {
    return []
  }
}

export default { searchMusic: musicSearchAPI }
