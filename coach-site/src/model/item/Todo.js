import { clone } from "../../../utility";

class Todo {
    todo;
    #isNewMap = false;


    constructor(todo) {
        this.todo = todo;
    }

    get isNewMap() {
        return this.#isNewMap;
    }
    set isNewMap(value) {
        this.#isNewMap = value;
    }

    addRepeat(repeat) {
        this.todo.repeats.push(clone(repeat));
    }
}