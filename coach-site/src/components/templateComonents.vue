<template>
    <div>
        <button type="button" class="btn btn-primary mb-2" @click="logAllSets">Log All Sets</button>
        
        <input class="textbox text" type="text" placeholder="Title"
               v-model.lazy.trim="newPost.title" 
               v-on:keyup.enter="addTask(false)"
               v-on:keyup.esc="newTaskText = undefined"
               spellcheck="true"/>

        <input class="mb-2" type="datetime-local" :value="newPost.datetime" @change="onChange"/>
        
        <textarea class="textarea" 
                v-model.lazy.trim="description.value"
                placeholder="Click to add Description"
                spellcheck="true"></textarea>

        <div class="top d-flex flex-column sticky-top">
            <div class="label d-flex flex-row mb-2">
                <img class="icon-button mb-2"
                        src='/icon/previous.png' width="20" height="20"
                        @click.prevent="back"/>
                <span>Exercises</span>
                <img class="icon-button" src="/icon/add-button.png" :width="20" :height="20" 
                    @click="selectExercises" />
            </div>
            <input id="name" class="textbox mb-2" type="text" ref="text"  placeholder="Workout Name"
                    v-model.lazy.trim="name.value" 
                    spellcheck="true"/>
            </div>
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