import * as React from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from 'services/firestore'
import { ReveilleConfig } from '../types/reveille'

function useReveilleConfig() {
  const [reveilleConfig, setReveilleConfig] = React.useState<ReveilleConfig | undefined>(undefined)

  React.useEffect(() => {
    const reveilleConfigRef = doc(db, 'reveille', 'configuration')
    return onSnapshot(reveilleConfigRef, (doc) => {
      const result = doc.data() as ReveilleConfig
      setReveilleConfig(result)
    })
  }, [])

  return reveilleConfig
}

export default useReveilleConfig
