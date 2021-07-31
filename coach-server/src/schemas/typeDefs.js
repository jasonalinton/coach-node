const fs = require('fs');
const path = require('path');

let typeDefs = "";
typeDefs += fs.readFileSync(path.join(__dirname, './schema.graphql'), 'utf8');
typeDefs += fs.readFileSync(path.join(__dirname, './universal.graphql'), 'utf8');
typeDefs += fs.readFileSync(path.join(__dirname, './metric.graphql'), 'utf8');
typeDefs += fs.readFileSync(path.join(__dirname, './goal.graphql'), 'utf8');
typeDefs += fs.readFileSync(path.join(__dirname, './todo.graphql'), 'utf8');
typeDefs += fs.readFileSync(path.join(__dirname, './routine.graphql'), 'utf8');
typeDefs += fs.readFileSync(path.join(__dirname, './time.graphql'), 'utf8');
typeDefs += fs.readFileSync(path.join(__dirname, './planner.graphql'), 'utf8');

module.exports = {
    typeDefs
}