import { HubConnectionBuilder } from '@microsoft/signalr';

export function getSocketConnection(hubName) {
    let connection = new HubConnectionBuilder()
        .withUrl(`https://localhost:7104/${hubName}`, {
             withCredentials: false,
             timeout: 120000,
            })
        .withAutomaticReconnect()
        .build();

    connection.keepAliveIntervalInMilliseconds = 60000;
    connection.serverTimeoutInMilliseconds = 120000;

    return connection;
}