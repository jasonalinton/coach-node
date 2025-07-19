// export const URL = "http://192.168.1.129:7104"; // Home network
// export const URL = "http://172.20.10.11:7104"; // Hotspot
export const URL = "http://localhost:7104"
// export const URL = "https://coach-eea3hnh7fje3gxhw.canadacentral-01.azurewebsites.net"


export async function postEndpoint(endpoint, data) {

    return fetch(`${URL}/api/Universal/${endpoint}`, {
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