import { defineStore } from 'pinia'

export const useItemTableStore = defineStore('itemTable', {
    state: () => ({
        dragged: {
            item: undefined,
            parent: undefined
        }
    }),
    getters: {
        getDragged() {
            return this.dragged;
        }
    },
    actions: {
        setDraggedProps(item, parent) {
            this.dragged.item = item;
            this.dragged.parent = parent;
        },
        clearDraggedProps() {
            this.dragged.item = undefined;
            this.dragged.parent = undefined;
        }
    },
})