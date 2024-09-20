import { URL } from "./api";

export async function getEvents(start, end) {
    let data = {
        start: start,
        end: end
    };

    return fetch(`${URL}/api/Event/GetEventsInRange`, {
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

export async function getIterationsInRange(startAt, endAt) {
    let data = { startAt, endAt };

    return fetch(`${URL}/api/Planner/GetIterationsInRange`, {
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
    .catch((error) => {
        console.error('Error:', error);
    });
}

export async function getAllIterationsInRange(startAt, endAt) {
    let data = { startAt, endAt };

    return fetch(`${URL}/api/Planner/GetAllIterationsInRange`, {
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
    .catch((error) => {
        console.error('Error:', error);
    });
}

export async function updateIteration(iterationID, text, points, startAt, endAt) {
    let data = { iterationID, text, points, startAt, endAt };

    return fetch(`${URL}/api/Planner/UpdateIteration`, {
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

export async function rescheduleIteration(iterationID, startAt, endAt) {
    let data = { iterationID, startAt, endAt };

    return fetch(`${URL}/api/Planner/RescheduleIteration`, {
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

export async function toggleTaskCompletion(iterationID, attemptedAt, completedAt) {
    let data = { iterationID, attemptedAt, completedAt };

    return fetch(`${URL}/api/Planner/ToggleTaskCompletion`, {
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

export async function attemptIteration(iterationID, attemptedAt) {
    let data = { iterationID, attemptedAt };

    return fetch(`${URL}/api/Planner/AttemptIteration`, {
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
    let data = { iterationID };

    return fetch(`${URL}/api/Planner/DeleteIteration`, {
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