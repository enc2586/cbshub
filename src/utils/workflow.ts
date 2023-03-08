import { db } from 'configs/firebase'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { AutocompleteItem, Classrooms, Teachers, WorkflowConfigs } from 'types/workflow'

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
