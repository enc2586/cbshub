import { Timestamp } from 'firebase/firestore'

type AutocompleteItem = {
  label: string
  id: string
}

type WorkflowConfigs = {
  classes: Classrooms
  teachers: Teachers
  homeroom: { [gradeNo: '1' | '2' | '3']: { [classNo: '1' | '2' | '3']: string } }
  lastUpdated: Timestamp
}

type Classrooms = {
  [className: string]: Classroom
}

type Classroom = {
  floor: string
  id: string
  maxppl: string
  tcher: string
}

type Teachers = {
  [teacherName: string]: string
}
