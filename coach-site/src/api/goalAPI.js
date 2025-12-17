import { URL } from "./api";

export async function getGoals() {
    return fetch(`${URL}/api/Goal/GetGoals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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

    return fetch(`${URL}/api/Goal/GetGoalsWithTimeframe`, {
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