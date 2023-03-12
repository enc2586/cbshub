import * as React from 'react'
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore'
import { db } from 'services/firestore'
import { WeekdaysWorkflow, WeekendsWorkflow, Workflows } from '../types/workflow'

function useWorkflow(uid?: string) {
  const [workflow, setWorkflow] = React.useState<Workflows>({})

  React.useEffect(() => {
    const workflowRef = collection(db, 'workflow')
    if (uid) {
      return onSnapshot(query(workflowRef, where('user', '==', uid)), (snapshot) => {
        const result: Workflows = {}
        snapshot.forEach((doc) => {
          if (doc.id !== 'configuration') {
            if (doc.data().type === 'weekdays') {
              result[doc.id] = doc.data() as WeekdaysWorkflow
            } else {
              result[doc.id] = doc.data() as WeekendsWorkflow
            }
          }
        })
        setWorkflow(result)
      })
    } else {
      return onSnapshot(query(workflowRef), (snapshot) => {
        const result: Workflows = {}
        snapshot.forEach((doc) => {
          if (doc.id !== 'configuration') {
            if (doc.data().type === 'weekdays') {
              result[doc.id] = doc.data() as WeekdaysWorkflow
            } else {
              result[doc.id] = doc.data() as WeekendsWorkflow
            }
          }
        })
        setWorkflow(result)
      })
    }
  }, [uid])

  return workflow
}

export default useWorkflow
