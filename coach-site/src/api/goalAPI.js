export async function getGoals() {
    return fetch(`https://localhost:7104/api/Goal/GetGoals`, {
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

export async function repositionTodo(goalID, todoID, newPosition) {
    var data = { goalID, todoID, newPosition };

    return fetch(`https://localhost:7104/api/Goal/RepositionTodoInGoal`, {
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