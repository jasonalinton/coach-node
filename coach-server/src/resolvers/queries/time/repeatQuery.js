const { repeat_properties } = require('../../../properties/time/repeatProperties');

async function repeat(parent, { id }, context, info) {
    // console.log(`Get repeat, ID: ${id}`);

    let repeat = await context.prisma.repeat.findFirst({
        where: { id },
        select: repeat_properties
    });

    // console.log(`Got repeat, ID: ${id}`);
    
    return repeat;
}

module.exports = {
    repeat
}