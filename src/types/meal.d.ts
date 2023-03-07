type MealInDay = { data: Meal[]; date: Date }

type Meal = {
  calorie: number
  menu: {
    allergy: number[]
    name: string
  }[]
  type: string
}
