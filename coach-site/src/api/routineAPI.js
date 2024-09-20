import { URL } from "./api";

export async function getRoutines() {
    return fetch(`${URL}/api/Routine/GetRoutines`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (!data.errorMessage) {
            return data;
        } else {
            this.errorMessage = data.errorMessage;
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

export async function saveRoutine(data) {
    return fetch(`${URL}/api/Routine/SaveRoutine`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (!data.errorMessage) {
            return data;
        } else {
            this.errorMessage = data.errorMessage;
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

export async function saveRoutineRepeat(repeat) {
    let data = { repeat };
    
    return fetch(`${URL}/api/Routine/SaveRoutineRepeat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (!data.errorMessage) {
            return data;
        } else {
            this.errorMessage = data.errorMessage;
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

export async function mapTodos(routineID, addedIDs, removedIDs) {
    let data = { routineID, addedIDs, removedIDs };
    
    return fetch(`${URL}/api/Routine/MapTodosToRoutine`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (!data.errorMessage) {
            return data;
        } else {
            this.errorMessage = data.errorMessage;
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

export async function createAndMapItem(routineID, itemType, itemText) {
    let data = { routineID, itemType, itemText };
    
    return fetch(`${URL}/api/Routine/CreateAndMapItemToRoutine`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (!data.errorMessage) {
            return data;
        } else {
            this.errorMessage = data.errorMessage;
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

export async function refreshRepetitionForRepeat(id, repeatID) {
    let data = { id, repeatID };
    
    return fetch(`${URL}/api/Routine/RefreshRepetitionForRoutine`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then((data) => {
        if (data.status.success) {
            return data.result;
        } else {
            console.error('Error:', data.status.errorMessage);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

export async function refreshRepetitiveEvents(id, startAt, endAt, timeframeID, properties) {
    let data = { id, startAt, endAt, timeframeID, properties };
    
    return fetch(`${URL}/api/Routine/RefreshRepetitiveEventsForRoutine`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (!data.errorMessage) {
            return data;
        } else {
            this.errorMessage = data.errorMessage;
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}