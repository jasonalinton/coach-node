const { goalInclude } = require('../../properties/goalProperties');
const { iterationIncude } = require('../../properties/event/eventProperties');

async function goals(parent, args, context, info) {
    let goals = await context.prisma.goal.findMany({
        where: { isDeleted: false },
        include: goalInclude,
        orderBy: { id: 'desc'}
    });
    
    return goals;
}

/* Get goals mapped to iterations in given timeframe */
async function goalsByDate(parent, { startAt, endAt }, context, info) {
    let include = { ...goalInclude };
    include.todos =  { include: { iterations: { include: { routine: true }}}};
    
    let goals = await context.prisma.goal.findMany({
        where: {
            OR: [
                {
                    todos: { some: {
                            iterations: {
                                some: {
                                    AND: [
                                        {
                                            startAt: { gte: startAt},
                                            endAt: { not: null},
                                            todoIteration: { is: null } // Exclude todos that are in routine
                                        },
                                        {
                                            startAt: { lte: endAt },
                                            endAt: { not: null},
                                            todoIteration: { is: null } // Exclude todos that are in routine
                                        }
                                    ]
                                },}}}
                },
                {
                    timePairs: { some: {
                        AND: [
                            {
                                startTime: { dateTime: { gte: startAt } },
                                endTime: { isNot: null }
                            },
                            {
                                startTime: { dateTime: { lte: endAt } },
                                endTime: { isNot: null }
                            },
                        ]
                    }}
                    // TODO: Add endTime conditions
            }
            ],
        },
        orderBy: { id: 'desc' },
        include
    });
    
    return goals;
}

module.exports = {
    goals,
    goalsByDate
}