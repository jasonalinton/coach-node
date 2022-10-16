function getGoals() {
    this.isLoading = true;
    let controller = (!this.parentRow) ? "Goal" : this.parentRow.viewModel.modelType;
    let endpoint = this.getEndpoint();
    let data = this.getEndpointData(); 

    fetch(`https://localhost:7104/api/Goal/${endpoint}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then((response) => response.json())
    .then((data) => {
        if (!data.errorMessage) {
            this.goalTableVM = data;
        } else {
            this.errorMessage = data.errorMessage;
        }
        this.isLoading = false;
    })
    .catch((error) => {
        this.isLoading = false;
        console.error('Error:', error);
    });
}