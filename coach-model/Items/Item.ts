import Metric from './Metric';

class Item {
    id: number;
    text: string;
    description: string;
    isDeleted: number;

    metrics: Metric[];
}

export default Item;