import { URL, postEndpoint } from "./api";

export async function getNutritionHistory() {
    return fetch(`${URL}/api/Physical/GetNutritionHistory`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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

export async function getMealsInRange(startAt, endAt) {
    let data = { startAt, endAt };

    return fetch(`${URL}/api/Physical/GetMealsInRange`, {
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

export async function getRecentFoodItems() {
    return fetch(`${URL}/api/Physical/GetRecentFoodItems`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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

export async function getRecentFoodItems2() {
    return fetch(`${URL}/api/Physical/GetRecentFoodItems_Refactored`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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

export async function getWaterLogs() {
    return fetch(`${URL}/api/Physical/GetWaterLogs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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