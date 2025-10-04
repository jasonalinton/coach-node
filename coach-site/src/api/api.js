// export const URL = "http://192.168.1.129:7104"; // Home network
// export const URL = "http://172.20.10.11:7104"; // Hotspot
export const URL = "http://localhost:7104"
// export const URL = "https://coach-eea3hnh7fje3gxhw.canadacentral-01.azurewebsites.net"
import { getSocketConnection } from "../store/socket";


export async function postEndpoint(controller, endpoint, data) {
    return fetch(`${URL}/api/${controller}/${endpoint}`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Return-Updates': true
         },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then((data) => {
        if (data.status.success) {
            return data;
        } else {
            console.error('Error:', data.status.errorMessage);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function isSignalRConnected() {

}