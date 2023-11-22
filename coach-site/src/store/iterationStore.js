import { defineStore } from 'pinia'
import { getSocketConnection } from './socket'
import { getRepetitiveTodoIterations } from '../api/todoAPI';
import { removeItem, replaceOrAddItem, sortAsc } from '../../utility'

let initialized = false;

export const useIterationStore = defineStore('iteration', {
    state: () => ({
        iterations: []
    }),
    getters: {
        
    },
    actions: {
        // async initialize() {
        async initialize() {
            // let promise = this.fill();
            this.connectSocket();
            initialized = true;
            // return promise;
        },
        // async fill() {
        //     return getIterations().then(res => this.iterations = res);
        // },
        // getIterations(startAt, endAt) {

        // },
        async getRepetitiveTodoIterations(startAt, endAt) {
            let _this = this;
            let iterations = await getRepetitiveTodoIterations(startAt, endAt);
            iterations.forEach(iteration => {
                replaceOrAddItem(iteration, _this.iterations);
            })
            sortAsc(this.iterations);
            return this.iterations;
        },
        // getRepetitiveTodoIterations(startAt, endAt) {
        //     let _this = this;
        //     getRepetitiveTodoIterations(startAt, endAt)
        //     .then(_iterations => {
        //         let iterations_this = [..._this.iterations];
        //         _iterations.forEach(iteration => {
        //             replaceOrAddItem(iteration, iterations_this);
        //         })
        //         sortAsc(iterations_this, 'startAt');
        //         this.iterations = [...iterations_this];
        //     });
        //     return this.iterations;
        // },
        connectSocket() {
            if (!initialized) {
                let connection = getSocketConnection("iterationHub");

                let _this = this;
                connection.on("UpdateIterationss", iterations => {
                    this.initializeItems(iterations);
                    iterations.forEach(iteration => {
                        replaceOrAddItem(iteration, _this.iterations);
                    })
                    sortAsc(_this.iterations);
                });
                connection.on("RemoveIterations", iterations => {
                    iterations.forEach(iteration => {
                        removeItem(iteration, _this.iterations);
                    })
                    sortAsc(_this.iterations);
                });
            }
        }
    },
})