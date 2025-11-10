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

export async function foodSearchAutoComplete(searchTerm) {
    let data = { query: searchTerm };

    return fetch(`${URL}/api/Physical/FoodSearchAutoComplete`, {
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

export async function searchFoodUPC(upc) {
    let data = { upc };

    return fetch(`${URL}/api/Physical/SearchFoodUPC`, {
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

export async function addFoodItemToMeal(model) {
    return postEndpoint("Physical", "AddFoodItemToMeal", model);
}

export async function setFoodItemConsumption(mealID, foodItemID, wasConsumed, dateTime) {
    let data = { mealID, foodItemID, wasConsumed, dateTime };

    return fetch(`${URL}/api/Physical/SetFoodItemConsumption`, {
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

export async function logWater(amountFLOZ, dateTime, mealID) {
    let data = {amountFLOZ, dateTime, mealID };

    return fetch(`${URL}/api/Physical/LogWater`, {
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

export async function setMealTime(mealID, startAt, endAt) {
    let data = { mealID, startAt, endAt };

    return fetch(`${URL}/api/Physical/SetMealTime`, {
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

export async function removeFoodItem(mealID, foodItemID) {
    let data = { mealID, foodItemID };

    return fetch(`${URL}/api/Physical/RemoveFoodItem`, {
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