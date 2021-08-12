import { clone } from "../../../utility";

class Routine {
    routine;
    #isNewMap = false;


    constructor(routine) {
        this.routine = routine;
    }

    get isNewMap() {
        return this.#isNewMap;
    }
    set isNewMap(value) {
        this.#isNewMap = value;
    }

    
}