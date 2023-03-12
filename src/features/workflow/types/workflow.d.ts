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
  botState: BotState
}

type BotState = 'idle' | 'running' | 'finished'

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

type WeekdaysSelection = { [day in WeekdaysIndex]: { [period in WeekdaysPeriod]: boolean } }
type WeekdaysIndex = 0 | 1 | 2 | 3 | 4
type WeekdaysPeriod = 0 | 1 | 2

type WeekdaysWorkflow = {
  user: string
  title: string
  classroom: string
  teacher: string
  type: 'weekdays'
  state: 'success' | 'idle' | string
  periods: WeekdaysSelection
}

type WeekendsWorkflow = {
  user: string
  title: string
  classroom: string
  teacher: string
  type: 'weekends'
  state: 'success' | 'idle' | string
  periods: WeekdaysSelection
}

type Workflows = { [id: string]: WeekdaysWorkflow | WeekendsWorkflow }
