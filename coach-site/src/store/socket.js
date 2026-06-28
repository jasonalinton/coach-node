import { URL } from '../api/api';
import { HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';

var hubConnections = {
    coachHub: undefined,
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
        connection.onclose(async () => {
            connection.start();
        });

        hubConnections[hubName] = connection;
    }
}

export function isHubConnected(hubName) {
    let connection = getSocketConnection(hubName);
    return (connection.state == HubConnectionState.Connected);
}

let _deferred = [];
let _scheduled = false;

export function deferUpdate(fn) {
    _deferred.push(fn);
    if (!_scheduled) {
        _scheduled = true;
        setTimeout(() => {
            const fns = _deferred;
            _deferred = [];
            _scheduled = false;
            fns.forEach(f => f());
        }, 0);
    }
}