import { clone } from "../../../utility";

class Workout {
    id;
    data;
    versions = [];

    constructor(workout) {
        this.id = workout.id;
        if (workout.id > 0) {
            this.data = workout;
        } else {
            data = {
                id: undefined,
                idType: undefined,
                idIteration: undefined,
                name: "",
                description: "",
                position: null,
                isTemplate: false,
                points: undefined,
                iteration: null,
                sections: [],
                exercises: [],
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
                updatedAt: new Date(),
                isProcessing: false,
            });
        }
        return newVersion;
    }
    
    removeVersion(component) {
        this.versions = this.versions.filter(v => v.component !== component);
    }
}

export default Workout;