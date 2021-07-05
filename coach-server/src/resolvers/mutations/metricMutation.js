const controller = require('../../controller/itemController');
const { metricInclude } = require('../../properties/metricProperties');

async function updateMetric(parent, args, context, info) {
    let id = args.goal.id;
    let data = controller.initData(args.metric);

    let metric = await context.prisma.metric.update({
        where: { id },
        data,
        include: metricInclude
    });

    context.pubsub.publish("METRIC_UPDATED", { metricUpdated: metric });
    
    return metric;
}

module.exports = {
    updateMetric
} 