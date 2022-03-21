const { eventInclude } = require("../../../properties/event/eventProperties");

async function events(parent, { startAt, endAt }, context, info) {
    let where = {};
    if (startAt) where.startAt = { gte: startAt };
    if (endAt) where.endAt = { lte: endAt };

    let events = await context.prisma.event.findMany({
        where,
        include: eventInclude,
        orderBy: { startAt: 'asc'}
    });
    
    return events;
}

async function event(parent, args, context, info) {
    console.log(`Query event, id = ${args.id}`)

    let event = await context.prisma.event.findFirst({
        include: eventInclude,
        where: { id: args.id }
    });

    console.log(`Query event, id = ${args.id}`)
    
    return event;
}


module.exports = {
    events,
    event,
}