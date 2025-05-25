import { URL } from "./api";

export async function getBlurbsInMetric(idMetric, idTimeframe, datetime) {
    let data = { idMetric, idTimeframe, datetime }

    return fetch(`${URL}/api/Universal/GetBlurbsInMetric`, {
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

export async function getBriefingBlurbs(idTimeframe, datetime) {
    let data = { idTimeframe, datetime }

    return fetch(`${URL}/api/Universal/GetBriefingBlurbs`, {
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

export async function addBriefingBlurb(text, datetime, idBlurbType, idMetric, idTimeframe) {
    let data = { text, datetime, idBlurbType, idMetric, idTimeframe }

    return fetch(`${URL}/api/Universal/AddBriefingBlurb`, {
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