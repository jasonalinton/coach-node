import gql from 'graphql-tag';

export const typeDefs = gql`
type Query {
  # Metric
  metrics: [Metric!]!

  # Goal
  goals: [Goal!]!

  # Todo
  todos: [Todo!]!

  # Routine
  routines: [Routine!]!
}

type Mutation {
  # Metric
  updateMetric(metric: MetricInput!): Metric!

  # Goal
  addGoal(goal: GoalInput!): Goal!
  updateGoal(goal: GoalInput!): Goal!
  deleteGoal(id: Int!): Goal!

  # Todo
  addTodo(todo: TodoInput!): Todo!
  updateTodo(todo: TodoInput!): Todo!
  deleteTodo(id: Int!): Todo!

  # Routine
  addRoutine(routine: RoutineInput!): Routine!
  updateRoutine(routine: RoutineInput!): Routine!
  deleteRoutine(id: Int!): Routine!
}

type Subscription {
  # Metric
  metricUpdated: Metric!

  # Goal
  goalAdded: Goal!
  goalUpdated: Goal!
  goalDeleted: Goal!

  # Todo
  todoAdded: Todo!
  todoUpdated: Todo!
  todoDeleted: Todo!

  # Routine
  routineAdded: Routine!
  routineUpdated: Routine!
  routineDeleted: Routine!
}

input unmappedIDs {
  parents: [Int]
  children: [Int]
  metrics: [Int]
  goals: [Int]
  todos: [Int]
  routines: [Int]
}


type Metric {
  id: Int!
  text: String!
  description: String
  goals: [Goal]
  todos: [Todo]
  routines: [Routine]
}

input MetricInput {
  id: Int!
  text: String
  description: String
  goals: [GoalInput]
  todos: [TodoInput]
  routines: [RoutineInput]
  unmappedIDs: unmappedIDs
}

type Goal {
  id: Int!
  text: String!
  description: String
  isDeleted: Int
  parents: [Goal]
  children: [Goal]
  metrics: [Metric]
  todos: [Todo]
  routines: [Routine]
  timePairs: [Goal_TimePair]
  repeats: [Repeat]
}

input GoalInput {
  id: Int
  text: String
  description: String
  # isDeleted:   Int
  parents: [GoalInput]
  children: [GoalInput]
  metrics: [MetricInput]
  todos: [TodoInput]
  routines: [RoutineInput]
  unmappedIDs: unmappedIDs
  timePairs: [Goal_TimePairInput]
  repeats: [RepeatInput]
}

type Todo {
  id: Int!
  text: String!
  description: String
  isDeleted: Int
  parents: [Todo]
  children: [Todo]
  metrics: [Metric]
  goals: [Goal]
  routines: [Routine]
  timePairs: [Todo_TimePair]
  repeats: [Repeat]
}

input TodoInput {
  id: Int
  text: String
  description: String
  # isDeleted:   Int
  parents: [TodoInput]
  children: [TodoInput]
  metrics: [MetricInput]
  goals: [GoalInput]
  routines: [RoutineInput]
  unmappedIDs: unmappedIDs
  timePairs: [Todo_TimePairInput]
  repeats: [RepeatInput]
}

type Routine {
  id: Int!
  text: String!
  description: String
  isDeleted: Int
  parents: [Routine]
  children: [Routine]
  metrics: [Metric]
  todos: [Todo]
  goals: [Goal]
  timePairs: [Routine_TimePair]
  repeats: [Repeat]
}

input RoutineInput {
  id: Int
  text: String
  description: String
  # isDeleted:   Int
  parents: [RoutineInput]
  children: [RoutineInput]
  metrics: [MetricInput]
  todos: [TodoInput]
  goals: [GoalInput]
  unmappedIDs: unmappedIDs
  timePairs: [Routine_TimePairInput]
  repeats: [RepeatInput]
}


type Time {
  id: Int!
  type: Type!
  endpoint: Type!
  moment: Type!
  flexibility: Type!
  dateTime: String!
}

input TimeInput {
  id: Int
  type: TypeInput!
  endpoint: TypeInput!
  moment: TypeInput!
  flexibility: TypeInput!
  dateTime: String!
}

type Goal_TimePair {
  id: Int!
  goal: Goal!
  timeType: Type!
  startTime: Time
  endTime: Time
}

input Goal_TimePairInput {
  id: Int
  goal: GoalInput!
  timeType: TypeInput!
  startTime: TimeInput
  endTime: TimeInput
}

type Todo_TimePair {
  id: Int!
  todo: Todo!
  timeType: Type!
  startTime: Time
  endTime: Time
}

input Todo_TimePairInput {
  id: Int
  todo: TodoInput!
  timeType: TypeInput!
  startTime: TimeInput
  endTime: TimeInput
}

type Routine_TimePair {
  id: Int!
  routine: Routine!
  timeType: Type!
  startTime: Time
  endTime: Time
}

input Routine_TimePairInput {
  id: Int
  routine: RoutineInput!
  timeType: TypeInput!
  startTime: TimeInput
  endTime: TimeInput
}

type Repeat {
  id: Int!
  type: Type!
  timeframe: Type!
  startRepeat: Time
  endRepeat: Time
  startIteration: Time
  endIteration: Time
  interval: Int!
  frequency: Int!
  dayIndecies: [Repeat_DayIndex]
  goal_repeats: [Goal_Repeat]
  todo_repeats: [Todo_Repeat]
  routine_repeats: [Routine_Repeat]
}

input RepeatInput {
  id: Int
  type: TypeInput!
  timeframe: TypeInput!
  startRepeat: TimeInput
  endRepeat: TimeInput
  startIteration: TimeInput
  endIteration: TimeInput
  interval: Int!
  frequency: Int!
  dayIndecies: [Repeat_DayIndexInput]
  goal_repeats: [Goal_RepeatInput]
  todo_repeats: [Todo_RepeatInput]
  routine_repeats: [Routine_RepeatInput]

  isEdited: Boolean
}

type Repeat_DayIndex {
  id: Int
  repeat: Repeat
  index: Int
}

input Repeat_DayIndexInput {
  id: Int
  repeat: RepeatInput
  index: Int
}

type Goal_Repeat {
  id: Int!
  lastIterationDateTime: String
  isEventVisible: Boolean!
  goal: Goal!
  repeat: Repeat!
}

input Goal_RepeatInput {
  id: Int
  lastIterationDateTime: String
  isEventVisible: Boolean!
  goal: GoalInput!
  repeat: RepeatInput!
}

type Todo_Repeat {
  id: Int!
  lastIterationDateTime: String
  isEventVisible: Boolean!
  todo: Todo!
  repeat: Repeat!
}

input Todo_RepeatInput {
  id: Int
  lastIterationDateTime: String
  isEventVisible: Boolean!
  todo: TodoInput!
  repeat: RepeatInput!
}

type Routine_Repeat {
  id: Int!
  lastIterationDateTime: String
  isEventVisible: Boolean!
  routine: Routine!
  repeat: Repeat!
}

input Routine_RepeatInput {
  id: Int
  lastIterationDateTime: String
  isEventVisible: Boolean!
  routine: RoutineInput!
  repeat: RepeatInput!
}

type Type {
  id: Int!
  text: String!
  altText: String
  description: String
}

input TypeInput {
  id: Int
  text: String
  altText: String
  description: String
}

type Iteration {
  id: Int
  text: String
  startAt: String
  endAt: String
  attemptedAt: String
  completedAt: String
  isRecommended: Boolean

  todos: [Todo]
  routines: [Routine]

  events: [Event]
}

input IterationInput {
  id: Int
  text: String!
  startAt: String
  endAt: String
  attemptedAt: String
  completedAt: String
  isRecommended: Boolean

  todos: [TodoInput]
  routines: [RoutineInput]

  events: [EventInput]
}

type Event {
  id: Int
  text: String
  startAt: String
  endAt: String
  isAllDay: String
  isRecommended: String

  iterations: [Iteration]
}

input EventInput {
  id: Int
  text: String!
  startAt: String
  endAt: String
  isAllDay: String
  isRecommended: String!

  iterations: [IterationInput]
}

`