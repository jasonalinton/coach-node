export async function getTodos() {
    return fetch(`https://localhost:7104/api/Todo/GetTodos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // body: JSON.stringify(data)
    })
    .then((response) => response.json())
    .then((data) => {
        if (!data.errorMessage) {
            return data;
        } else {
            this.errorMessage = data.errorMessage;
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

export async function saveTodoRepeat(repeat) {
    let data = { repeat };
    
    return fetch(`https://localhost:7104/api/Todo/SaveTodoRepeat`, {
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

export async function saveTodoTimePair(timePair) {
    let data = { timePair };
    
    return fetch(`https://localhost:7104/api/Todo/SaveTodoTimePair`, {
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

export async function createAndMapItem(todoID, itemType, itemText) {
    let data = { todoID, itemType, itemText };
    
    return fetch(`https://localhost:7104/api/Todo/CreateAndMapItemToTodo`, {
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

export async function refreshRepetitiveEvents(id, startAt, endAt, timeframeID, properties) {
    let data = { id, startAt, endAt, timeframeID, properties };
    
    return fetch(`https://localhost:7104/api/Todo/RefreshRepetitiveEventsForTodo`, {
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

export async function getRepetitiveTodoIterations(start, end) {
    let data = {
        startAt: start,
        endAt: end
    };

    return fetch(`https://localhost:7104/api/Todo/GetRepetitiveTodoIterations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then((response) => response.json())
    .then((data) => {
        if (!data.errorMessage) {
            return data;
        } else {
            this.errorMessage = data.errorMessage;
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

export async function toggleIterationCompletion(iterationID, attemptedAt, completedAt) {
    let data = {
        iterationID,
        attemptedAt,
        completedAt
    };

    return fetch(`https://localhost:7104/api/Todo/ToggleTodoIterationCompletion`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then((response) => response.json())
    .then((data) => {
        if (!data.errorMessage) {
            return data;
        } else {
            this.errorMessage = data.errorMessage;
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

export async function deleteIteration(iterationID) {
    let data = {
        iterationID
    };

    return fetch(`https://localhost:7104/api/Todo/DeleteTodoIteration`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then((response) => response.json())
    .then((data) => {
        if (!data.errorMessage) {
            return data;
        } else {
            this.errorMessage = data.errorMessage;
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

export async function deleteOrArchiveRepeat(repeatID) {
    let data = {
        repeatID
    };

    return fetch(`https://localhost:7104/api/Todo/DeleteOrArchiveRepeat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then((response) => response.json())
    .then((data) => {
        if (!data.errorMessage) {
            return data;
        } else {
            this.errorMessage = data.errorMessage;
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}