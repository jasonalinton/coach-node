import { capitalizeFirstLetter } from "../../utility";

export async function repositionItem(parentType, itemType, parentID, itemID, newPosition) {
    var data = { newPosition };
    data[`${parentType}ID`] = parentID;
    data.itemID = itemID;

    itemType = capitalizeFirstLetter(itemType);
    parentType = capitalizeFirstLetter(parentType);

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