const { metricInclude } = require('../../properties/metricProperties');

async function metrics(parent, args, context, info) {
    let metrics = await context.prisma.metric.findMany({
        include: metricInclude,
        orderBy: { id: 'asc'}
    });
    
    return metrics;
}

module.exports = {
    metrics
}