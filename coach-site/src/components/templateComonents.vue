<template>
    <div>
        <button type="button" class="btn btn-primary mb-2" @click="logAllSets">Log All Sets</button>
        
        <input class="textbox text" type="text" placeholder="Title"
                           v-model.lazy.trim="newPost.title" 
                           spellcheck="true"/>

        <input class="mb-2" type="datetime-local" :value="newPost.datetime" @change="onChange"/>
        
        <textarea class="textarea" 
                v-model.lazy.trim="description.value"
                placeholder="Click to add Description"
                spellcheck="true"></textarea>

    </div>
</template>

<script>
function getDateTimeString() {
    let date = new Date(this.time.dateTime);
    let dateTimeJSON = date.toJSON();

    if (this.time.idMoment == 87) { // Date
        let dateTimeArray = dateTimeJSON.split("T");
        let dateArray = dateTimeArray[0].split("-");
        return `${dateArray[0]}-${dateArray[1]}-${dateArray[2]}`;
    } else if (this.time.idMoment == 88) { // Time
        let dateTimeArray = dateTimeJSON.split("T");
        let timeArray = dateTimeArray[1].split(":");
        return `${timeArray[0]}:${timeArray[1]}`;
    } else if (this.time.idMoment == 89) { // Date-Time
        let dateTimeArray = dateTimeJSON.split("T");
        let dateArray = dateTimeArray[0].split("-");
        let timeArray = dateTimeArray[1].split(":");
        return `${dateArray[0]}-${dateArray[1]}-${dateArray[2]} ${timeArray[0]}:${timeArray[1]}`;
    }
} 

</script>