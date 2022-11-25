export async function getRoutines() {
    return fetch(`https://localhost:7104/api/Routine/GetRoutines`, {
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