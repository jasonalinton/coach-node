import Item from './Item';
import Goal from './Goal';
import Todo from './Todo';

class Routine extends Item {
    todos: Todo[];
    goals: Goal[];
}

export default Routine;