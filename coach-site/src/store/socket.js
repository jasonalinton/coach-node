import { URL } from '../api/api';
import { HubConnectionBuilder } from '@microsoft/signalr';

var hubConnections = {
    coachHub: undefined,
    metricHub: undefined,
    goalHub: undefined,
    todoHub: undefined,
    routineHub: undefined,
    plannerHub: undefined,
}

export function getSocketConnection(hubName) {
    // Create connection if it doesn't exist
    if (hubConnections[hubName] == undefined) {
        createSocketConnection(hubName);
    }

    return hubConnections[hubName];
}

export function createSocketConnection(hubName) {
    if (hubConnections[hubName] == undefined) {
        let connection = new HubConnectionBuilder()
            .withUrl(`${URL}/${hubName}`, {
                 withCredentials: false,
                 timeout: 120000,
                })
            .withAutomaticReconnect()
            .build();
    
        connection.keepAliveIntervalInMilliseconds = 60000;
        connection.serverTimeoutInMilliseconds = 120000;

        connection.start();
            // .then(() => connection.invoke("SendMessage", "Hello"));

        hubConnections[hubName] = connection;
    }
}