// export const URL = "http://192.168.1.129:7104"; // Home network
// export const URL = "http://172.20.10.11:7104"; // Hotspot
export const URL = "http://localhost:7104"
// export const URL = "https://coach-eea3hnh7fje3gxhw.canadacentral-01.azurewebsites.net"
import { isHubConnected } from "../store/socket";
import { useMetricStore } from '@/store/metricStore'
import { useGoalStore } from '@/store/goalStore'
import { useTodoStore } from '@/store/todoStore'
import { useRoutineStore } from '@/store/routineStore'
import { useEventStore } from '@/store/eventStore'

export async function postEndpoint(controller, endpoint, data) {
    return fetch(`${URL}/api/${controller}/${endpoint}`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Return-Updates': !isSignalRConnected()
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
        let eventStore = useEventStore();
        
        metricStore.runUpdates(response.updates);
        goalStore.runUpdates(response.updates);
        todoStore.runUpdates(response.updates);
        routineStore.runUpdates(response.updates);
        eventStore.runUpdates(response.updates);
    }
    return response;
}