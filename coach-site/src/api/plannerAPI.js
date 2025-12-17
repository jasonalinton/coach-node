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

export async function getUnplannedIterations() {
    return fetch(`${URL}/api/Planner/GetUnplannedIterations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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