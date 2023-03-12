import * as React from 'react'

import { Autocomplete, TextField } from '@mui/material'
import { obj2arr } from 'utils/objArr'
import useStudents from '../hooks/useStudents'
import { UserData } from '../types/userData'

function StudentSelect({
  setStudentData,
  label = '학생 선택',
}: {
  setStudentData: (data: (UserData & { id: string }) | null) => void
  label?: string
}) {
  const students = useStudents()

  const [student, setStudent] = React.useState<(UserData & { id: string }) | null>(null)
  const studentList = obj2arr(students) as (UserData & { id: string })[]
  React.useEffect(() => {
    setStudentData(student)
  }, [student])
  return (
    <Autocomplete
      getOptionLabel={(option) => option.name}
      options={studentList}
      value={student}
      onChange={(
        _event: React.SyntheticEvent<Element, Event>,
        newValue: (UserData & { id: string }) | null,
      ) => {
        setStudent(newValue)
      }}
      renderInput={(params) => <TextField {...params} label={label} variant='filled' />}
    />
  )
}

export default StudentSelect
