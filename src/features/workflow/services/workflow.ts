import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore'
import { db } from 'services/firestore'
import {
  AutocompleteItem,
  Classrooms,
  Teachers,
  WeekdaysSelection,
  WorkflowConfigs,
  WeekdaysWorkflow,
  WeekendsWorkflow,
  Workflows,
} from '../types/workflow'

export async function getWorkflowConfigs() {
  const workflowConfigRef = doc(db, 'workflow', 'configuration')
  const workflowConfig = await getDoc(workflowConfigRef)

  if (workflowConfig.exists()) {
    return workflowConfig.data() as WorkflowConfigs
  } else {
    return undefined
  }
}

export function arrangeClassrooms(classrooms: Classrooms) {
  const result: AutocompleteItem[] = []

  for (const [className, data] of Object.entries(classrooms)) {
    result.push({ label: className, id: data.id })
  }

  return result
}

export function arrangeTeachers(teachers: Teachers) {
  const result: AutocompleteItem[] = []

  for (const [teacherName, teacherId] of Object.entries(teachers)) {
    result.push({ label: teacherName, id: teacherId })
  }

  return result
}

export function by(key: any) {
  return (obj1: any, obj2: any) => {
    if (obj1[key] > obj2[key]) {
      return 1
    }
    if (obj1[key] < obj2[key]) {
      return -1
    }
    return 0
  }
}

export async function updateSelfCred(uid: string, cred: { id: string; password: string }) {
  const userRef = doc(db, 'user', uid)
  await updateDoc(userRef, { selfServiceCredential: cred })
  return
}

export async function applyWeekdayWorkflow(
  uid: string,
  title: string,
  classroom: string,
  teacher: string,
  periods: WeekdaysSelection,
) {
  const workflowRef = collection(db, 'workflow')
  const workflowData = {
    user: uid,
    title: title,
    classroom: classroom,
    teacher: teacher,
    type: 'weekdays',
    state: 'idle',
    periods: periods,
  } as WeekdaysWorkflow

  await addDoc(workflowRef, workflowData)
}

export async function getWorkflows(uid: string): Promise<Workflows> {
  const workflowRef = collection(db, 'workflow')
  const userWorkflowQuery = query(workflowRef, where('user', '==', uid))

  const workflowSnap = await getDocs(userWorkflowQuery)

  const result: Workflows = {}
  workflowSnap.forEach((doc) => {
    result[doc.id] = doc.data() as WeekdaysWorkflow | WeekendsWorkflow
  })

  return result
}

export function searchLabel(from: AutocompleteItem[], target: string): string | undefined {
  for (const item of from) if (item.label === target) return item.id

  return undefined
}
export function searchId(from: AutocompleteItem[], target: string): string | undefined {
  for (const item of from) if (item.id === target) return item.label

  return undefined
}

export function workflowStatus(message: string): {
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
} {
  if (message === 'success') {
    return { message: '신청 성공', type: 'success' }
  } else if (message === 'idle') {
    return { message: '신청하지 않음', type: 'info' }
  } else if (message === 'fromTomorrow') {
    return { message: '내일부터 신청됨', type: 'warning' }
  } else {
    return { message: message, type: 'error' }
  }
}
