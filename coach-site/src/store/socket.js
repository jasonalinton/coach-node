import { URL } from '../api/api';
import { HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import { replaceOrAddItem, sortAsc, indexByID } from '../../utility';

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

// Stores apply socket updates in a deferred tick, so another store's index doesn't have items from the
// same update yet - this returns that index with the incoming items layered in, sorted the way the stores sort
export function withUpdatedItems(items, index, updatedItems) {
    if (!updatedItems?.length) return index;
    let merged = [...items];
    updatedItems.forEach(item => replaceOrAddItem(item, merged));
    return indexByID(sortAsc(merged));
}
