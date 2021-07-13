import { clone } from '../../../utility'

class ItemConfigModel {
    #itemModel;

    constructor(config) {
        this.itemType = config.itemType;
        this.props = config.props;
        this.query = config.query;
        this.subscriptions = config.subscriptions;
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

    get table() {
        return { columns: this.props.filter(x => x.isColumn) }
    }

    newItem() {
        return clone(this.#itemModel);
    }
}

export default ItemConfigModel;