// export const URL = "http://192.168.1.129:7104"; // Home network
// export const URL = "http://172.20.10.11:7104"; // Hotspot
export const URL = "http://localhost:7104"
// export const URL = "https://coach-eea3hnh7fje3gxhw.canadacentral-01.azurewebsites.net"
import { isHubConnected } from "../store/socket";

import { useMetricStore } from '@/store/metricStore'
import { useGoalStore } from '@/store/goalStore'
import { useTodoStore } from '@/store/todoStore'
import { useRoutineStore } from '@/store/routineStore'
import { useIterationStore } from '@/store/iterationStore'
import { useEventStore } from '@/store/eventStore'
import { usePhysicalStore } from '@/store/physicalStore'

let requests = [];

function shouldRequest(endpoint, props) {
    var doRequest = requests.some(r => r.endpoint == endpoint && JSON.stringify(r.props) == JSON.stringify(props));
    return doRequest;
}

export async function attemptPostEndpoint(controller, endpoint, props, headers)  {
    let request = {
        controller,
        endpoint,
        props,
        time: new Date(),
        isProcessing: true
    };
    if (!shouldRequest(endpoint, props)) {
        requests.push(request);
        let dropRequest = () => { requests = requests.filter(r => r !== request); };

        return postEndpoint(controller, endpoint, props, headers).then(response => {
            if (!response || !response.status || !response.status.success) {
                dropRequest();
                return;
            }
            request.isProcessing = false;
            return response;
        })
    }
}

export async function postEndpoint(controller, endpoint, data, headers) {
    return fetch(`${URL}/api/${controller}/${endpoint}`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Return-Updates': !isSignalRConnected(),
            ...headers
         },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(onResponse)
    .then((response) => {
        if (response.status.success) {
            return response;
        } else {
            console.error('Error:', response.status.message);
            alert(response.status.message)
            return response;
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function isSignalRConnected() {
    let isConnected = isHubConnected("coachHub");
    return isConnected;
}

function onResponse(response) {
    if (response.updates) {
        let metricStore = useMetricStore();
        let goalStore = useGoalStore();
        let todoStore = useTodoStore();
        let routineStore = useRoutineStore();
        let iterationStore = useIterationStore();
        let eventStore = useEventStore();
        let physicalStore = usePhysicalStore();
        
        metricStore.runUpdates(response.updates);
        goalStore.runUpdates(response.updates);
        todoStore.runUpdates(response.updates);
        routineStore.runUpdates(response.updates);
        iterationStore.runUpdates(response.updates);
        eventStore.runUpdates(response.updates);
        physicalStore.runUpdates(response.updates);
    }
    return response;
}