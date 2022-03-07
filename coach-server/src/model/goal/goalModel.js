class Goal {
    id;
    text;
    description;

    parents;
    children;
    metrics;
    todos;
    routines;

    timePairs;
    repeats;

    constructor(goal) {
        this.id = goal.id;
        this.text = goal.text;
        this.description = goal.description;
        this.parents = goal.parents;
        this.children = goal.children;
        this.metrics = goal.metrics;
        this.todos = goal.todos;
        this.routines = goal.routines;
    }
}