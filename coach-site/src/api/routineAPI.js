// import axios from "axios";

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

// export async function getRoutines() {
//     return axios({
//         method: 'post',
//         url: 'https://localhost:7104/api/Routine/GetRoutines',
//         // data: { }
//       })
//       .then(response => response.data)
//       .then(data => {
//           if (!data.errorMessage) {
//             if (typeof data === 'string' || data instanceof String) {
//                 data = data.replaceAll(',null', '')
//                 data = JSON.parse(data);
//             }
//             // data = data.replaceAll(',null', '')
//               return data;
//           } else {
//               this.errorMessage = data.errorMessage;
//           }
//       })
//       .catch(error => {
//           console.error('Error:', error);
//       });
// }

export async function refreshRepetitiveEvents(id, startAt, endAt, timeframeID, properties) {
    let data = { id, startAt, endAt, timeframeID, properties };
    
    return fetch(`https://localhost:7104/api/Routine/RefreshRepetitiveEventsForRoutine`, {
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