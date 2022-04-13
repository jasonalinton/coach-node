const { select_repeat } = require('../time/repeatProperties');

const routineTodoIterationIncude = {
    include: {
        routineIteration: true,
        todoIterations: {
            include: { 
                todo: {
                    include: {
                        metrics: true,
                        goals: true,
                        parents: true,
                        children: true
                    }
                },
                routineIteration: { select: { id: true } },
                events: { 
                    select: { 
                        id: true,
                        startAt: true,
                        endAt: true
                     }
                },
            },
            orderBy: { id: 'desc'}
        }
    }
};

const iterationIncude = {
    todo: {
        select: {
            id: true,
            text: true,
            metrics: {
                select: {
                    id: true,
                    text: true
                }
            },
            goals: {
                select: {
                    id: true,
                    text: true
                }
            },
            routines: {
                select: {
                    id: true,
                    text: true
                }
            },
            // timePairs: {
            //     select: {

            //     }
            // }
        }
    },
    routine: {
        include: { 
            goals: true
        }
    },
    repeat: {
        include: {
            routineIterations: true
        }
    },
    todoRepeat: true,
    routineRepeat: select_repeat,
    routineIteration: routineTodoIterationIncude,
    todoIteration: routineTodoIterationIncude,
    events: { 
        select: { 
            id: true,
            startAt: true,
            endAt: true
         }
    }
}

const eventInclude = {
    type: true,
    iterations: { include: iterationIncude },
}

module.exports = {
    iterationIncude,
    eventInclude,
    routineTodoIterationIncude
}