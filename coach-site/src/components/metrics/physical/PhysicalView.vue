<template>
    <div class="d-flex flex-column flex-grow-1">
        <div class="hero">
            <!-- <img class="img-fluid" src="/metric/physical/Badass Workout Photo.jpg" /> -->
            <WeightChart />
        </div>
        <div class="cards d-flex flex-row justify-content-center overflow-scroll">
            <div class="card">
                <div class="height d-flex flex-row">
                    <span class="feet">6</span>
                    <span class="ft">ft</span>
                    <span class="inch">0</span>
                    <span class="in">in</span>
                </div>
                <div class="weight d-flex flex-row">
                    <span>145lbs</span>
                </div>
            </div>
            <div class="card"></div>
            <div class="card"></div>
            <div class="card"></div>
            <div class="card"></div>
            <div class="card"></div>
        </div>
        <div class="blurbs d-flex flex-column">
            <div v-for="blurb in blurbs" :key="blurb.id"
                 class="blurb d-flex flex-column">
                <span class="date">{{ blurb.date }}</span>
                <span class="time">{{ blurb.time }}</span>
                <span v-if="blurb.title" class="title">{{ blurb.title }}</span>
                <span class="text">{{ blurb.text }}</span>
                <div class="d-flex flex-row">
                    <span v-for="(tag, index) in blurb.tags" :key="index" class="tag">{{ tag }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import WeightChart from './WeightChart.vue';

export default {
    name: 'PhysicalView',
    components: { WeightChart },
    props: {
        
    },
    data: function () {
        return {
            blurbs: [
                {
                    id: 1,
                    date: "February 14, 2018",
                    time: "9:22 AM",
                    title: "The type I want",
                    text: "I want an independent ambisiuos girl who is self driven and destined to accomplish their goals. I want a girl who doesn't actually \"need\" me to get through lifes challenges, but instead uses me as a resource for support and knows that I will always be there for them",
                    tags: [
                        "Social-Sexual",
                        "girls",
                        "want",
                        "independent"
                    ]
                },
                {
                    id: 2,
                    date: "February 15, 2018",
                    time: "11:25 AM",
                    title: undefined,
                    text: "It's 11:30 and I just saw the lady in the cubical in front of me eating her lunch...",
                    tags: [
                        "Physical",
                        "food",
                        "apetite",
                    ]
                },
                {
                    id: 3,
                    date: "February 15, 2018",
                    time: "11:25 AM",
                    title: undefined,
                    text: "It's 11:30 and I just saw the lady in the cubical in front of me eating her lunch... I haven't event finished the apple I started to eat for breakfast an hour and a half ago. Not to mention the fact that I haven't even started on the yogurt as yet",
                    tags: [
                        "Physical",
                        "food",
                        "apetite",
                    ]
                },
                {
                    id: 4,
                    date: "February 14, 2018",
                    time: "9:22 AM",
                    title: "The type I want",
                    text: "I want an independent ambisiuos girl who is self driven and destined to accomplish their goals. I want a girl who doesn't actually \"need\" me to get through lifes challenges, but instead uses me as a resource for support and knows that I will always be there for them",
                    tags: [
                        "Social-Sexual",
                        "girls",
                        "want",
                        "independent"
                    ]
                },
                {
                    id: 5,
                    date: "February 15, 2018",
                    time: "11:25 AM",
                    title: "The type I want",
                    text: "It's 11:30 and I just saw the lady in the cubical in front of me eating her lunch...",
                    tags: [
                        "Physical",
                        "food",
                        "apetite",
                    ]
                },
                {
                    id: 6,
                    date: "February 15, 2018",
                    time: "11:25 AM",
                    title: "The type I want",
                    text: "It's 11:30 and I just saw the lady in the cubical in front of me eating her lunch... I haven't event finished the apple I started to eat for breakfast an hour and a half ago. Not to mention the fact that I haven't even started on the yogurt as yet",
                    tags: [
                        "Physical",
                        "food",
                        "apetite",
                    ]
                },
            ]
        }
    },
    created: function() {
       
    },
    methods: {
        
    },
}

</script>

<style scoped>
.hero img {
    max-height: 800px;
}

.card {
    min-width: 170px;
    min-height: 170px;
    background-color: gray;
}

.card .height {
    margin: 10px auto 0 auto;
}

.card .feet, .card .inch {
    font-size: 68px;
}

.card .weight {
    margin: 0 auto;
    font-size: 48px;
}

.card .ft, .card .in {
    font-size: 28px;
}

.blurb {
    background-color: #EDEDED;
    padding: 15px 28px;
    text-align: start;
    margin: 22px auto 0 auto;
    max-width: 720px;
    width: 100%;
}

.blurb .date {
    font-size: 12px;
}

.blurb .time {
    font-size: 10px;
    font-style: italic;
    font-weight: bolder;
}

.blurb .title {
    font-size: 28px;
    line-height: 34px;
    color: #4A90E2
}

.blurb .text {
    font-size: 14px;
}

.blurb .tag {
    font-size: 12px;
    color: #F5A623;
}
</style>