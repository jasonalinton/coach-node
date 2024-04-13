import { HubConnectionBuilder } from '@microsoft/signalr';

var hubConnections = {
    metricHub: undefined,
    goalHub: undefined,
    todoHub: undefined,
    routineHub: undefined,
    plannerHub: undefined,
}

export function getSocketConnection(hubName) {
    if (hubConnections[hubName] == undefined) {
        let connection = new HubConnectionBuilder()
            .withUrl(`https://localhost:7104/${hubName}`, {
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

    return hubConnections[hubName];
}