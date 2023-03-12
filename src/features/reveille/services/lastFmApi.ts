import { fetch } from 'lib/fetch'

const lastFmApiUrl = 'https://ws.audioscrobbler.com/2.0'

export const searchMusicOnApi = async (query: string) => {
  const promise = fetch(lastFmApiUrl, {
    method: 'track.search',
    limit: 10,
    track: query,
    // eslint-disable-next-line camelcase
    api_key: process.env.REACT_APP_lastfm_api_key,
    format: 'json',
  })

  return await promise
}
