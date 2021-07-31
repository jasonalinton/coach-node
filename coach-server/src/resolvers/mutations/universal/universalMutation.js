async function getTypes(parent, { parentType }, context, info) {
    let types = await context.prisma.type.findMany({
        where: { description: parentType }
    });
    
    return types;
}

module.exports = {
    getTypes
}