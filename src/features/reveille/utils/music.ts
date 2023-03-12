import { SearchedMusic } from '../types/reveille'
import { searchMusicOnApi } from './../services/lastFmApi'

export const getSearchResultList = async (query: string): Promise<SearchedMusic[]> => {
  if (query !== '') {
    const result = await searchMusicOnApi(query)

    if (Object.keys(result.data).length !== 0) {
      return result.data.results.trackmatches.track
    } else {
      return []
    }
  } else {
    return []
  }
}
