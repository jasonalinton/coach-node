export class Iteration {
    iteration;

    constructor(iteration) {
        this.iteration = iteration;
    }
    
    get isInRoutine() {
        return this.iteration.idRoutineIteration != null;
    }
}