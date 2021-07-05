const morgan = require('morgan');
const logger = require('../../src/index');

const format = 'dev';
const options = {
    stream: {
        write: message => {
            logger.info(message.trim())
        } ,
    },
}

module.exports = morgan(format);
// module.exports = morgan(format, options);