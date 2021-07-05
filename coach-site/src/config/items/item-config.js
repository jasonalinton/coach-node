import { clone } from '../../../utility'

class ItemConfigModel {
    #itemModel;

    constructor(config) {
        this.itemType = config.itemType;
        this.props = config.props;
        this.query = config.query;
        this.subscriptions = config.subscriptions;
        this.#itemModel = config.itemModel
        this.addItem = config.addItem;
        this.updateItem = config.updateItem;
        this.deleteItem = config.deleteItem;
    }

    get name() {
        return this.itemType.charAt(0).toUpperCase() + this.itemType.slice(1);
    }

    get namePlural() {
        return `${this.name}s`;
    }

    get table() {
        return { columns: this.props }
    }

    newItem() {
        return clone(this.#itemModel);
    }

    // deleteSubscription(data, resultName, thisTypes, itemTypes) {
    //     let id = data[resultName].id
    //     this[thisTypes].forEach(item => {
    //         let itemWith = item[itemTypes].find(itemWith => itemWith.id == id);
    //         if (itemWith != undefined) {
    //             removeItem(itemWith, item[itemTypes]);
    //         }
    //     })
    // }
}

export default ItemConfigModel;