import { clone } from '../../../utility'

class ItemConfigModel {
    #itemModel;

    constructor(config) {
        this.itemType = config.itemType;
        this.props = config.props;
        this.query = config.query;
        this.#itemModel = config.itemModel;

        if (config.addItem)
            this.addItem = config.addItem;
        if (config.updateItem)
            this.updateItem = config.updateItem;
        if (config.deleteItem)
            this.deleteItem = config.deleteItem;
    }

    get name() {
        return this.itemType.charAt(0).toUpperCase() + this.itemType.slice(1);
    }

    get namePlural() {
        return `${this.name}s`;
    }

    get icon() {
        if (['goal', 'todo', 'routine'].includes(this.itemType)) {
            return `${this.itemType}-icon.png`;
        } else {
            return null
        }
    }

    get table() {
        return { columns: this.props.filter(x => x.isColumn) }
    }

    newItem() {
        return clone(this.#itemModel);
    }
}

export default ItemConfigModel;