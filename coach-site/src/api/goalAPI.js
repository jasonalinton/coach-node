export async function getGoals() {
    return fetch(`https://localhost:7104/api/Goal/GetGoals`, {
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

export async function getGoalsWithTimeframe(start, end) {
    let data = { start, end };

    return fetch(`https://localhost:7104/api/Goal/GetGoalsWithTimeframe`, {
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

export async function saveGoal(data) {
    return fetch(`https://localhost:7104/api/Goal/SaveGoal`, {
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

export async function saveGoalTimePair(timePair) {
    let data = { timePair };
    
    return fetch(`https://localhost:7104/api/Goal/SaveGoalTimePair`, {
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

export async function createAndMapItem(goalID, itemType, itemText) {
    let data = { goalID, itemType, itemText };
    
    return fetch(`https://localhost:7104/api/Goal/CreateAndMapItemToGoal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then((data) => {
        if (!data.status.errorCode) {
            return data.result;
        } else {
            console.error('Error:', data.status.errorMessage);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

export async function mapItems(goalID, itemType, addedIDs, removedIDs) {
    let data = { goalID, itemType, addedIDs, removedIDs };
    
    return fetch(`https://localhost:7104/api/Goal/MapItemsToGoal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then((data) => {
        if (!data.status.errorCode) {
            return data.result;
        } else {
            console.error('Error:', data.status.errorMessage);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}