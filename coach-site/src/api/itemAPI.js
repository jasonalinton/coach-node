import { capitalize } from "../../utility";

export async function repositionItem(parentType, itemType, parentID, itemID, newPosition) {
    var data = { newPosition };
    data[`${parentType}ID`] = parentID;
    data.itemID = itemID;

    itemType = capitalize(itemType);
    parentType = capitalize(parentType);

    return fetch(`https://localhost:7104/api/${parentType}/Reposition${itemType}In${parentType}`, {
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

export async function refreshItemPositions() {
    await fetch(`https://localhost:7104/api/Goal/SetItemPositions`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    })
    .catch(error => {
        console.error('Error:', error);
    });

    await fetch(`https://localhost:7104/api/Todo/SetItemPositions`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    })
    .catch(error => {
        console.error('Error:', error);
    });
}