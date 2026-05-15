import { clone } from "../../../utility";

class Todo {
    id;
    data;
    versions = [];

    constructor(todo) {
        this.id = todo.id;
        if (todo.id > 0) {
            this.data = todo;
        } else {
            data = {
                text: "",
                description: "",
                points: undefined,
                typeID: undefined,
                mediumID: undefined,
                parentIDs: [],
                childIDs: [],
                goalIDs: [],
            }
        }
    }
    clone(component) {
        // TODO: Clone this once you stop storing list of objects
        // let newVersion = clone(this.data);
        let newVersion = {...this.data};

        let version = this.versions.find(v => v.component === component);
        if (version){
            // If version exists, update
            version.data = newVersion;
        } else {
            // If version doesn't exist, add new version
            this.versions.push({
                component: component,
                data: newVersion,
                isProcessing: false,
            });
        }
        return newVersion;
    }
    
    removeVersion(component) {
        this.versions = this.versions.filter(v => v.component !== component);
    }
}

export default Todo;