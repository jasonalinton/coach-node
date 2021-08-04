import Item from './Item';
import Todo from './Todo';
import Routine from './Routine';

class Goal extends Item  {
    todos: Todo[];
    routines: Routine[];
}

export default Goal;