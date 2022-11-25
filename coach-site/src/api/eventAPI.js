export async function getEvents(start, end) {
    let data = {
        start: start,
        end: end
    };

    return fetch(`https://localhost:7104/api/Event/GetEventsInRange`, {
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