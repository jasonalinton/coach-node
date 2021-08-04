import Item from './Item';
import Goal from './Goal';
import Routine from './Routine';

class Todo extends Item  {
    goals: Goal[];
    routines: Routine[];
}

export default Todo; 