import { defineStore } from 'pinia'
import { EVENTTYPE, CALENDAR_TYPES } from '../model/constants'
import { useWorkoutStore } from '@/store/workoutStore'
import { getWorkoutIDFromEvent } from '../api/workoutAPI'

// let initialized = false;

export const useAppStore = defineStore('app', {
    state: () => ({
        windowWidth: undefined,
        windowHeight: undefined,
        windowOuterWidth: undefined,
        windowOuterHeight: undefined,
        browserType: undefined,
        isTouchscreen: undefined,
        isExtraSmall: undefined,
        selectedItemPanel: "todo",
        isTabBarShown: true,
        /* Calendar */
        isMobileCalendarShown: false,
        calendarMobile: {
            isShown: true,
            type: CALENDAR_TYPES.WEEK
        },
        itemPanel: {
            selected: "todo",
            event: {
                type: undefined,
                event: undefined
            }
        }
    }),
    getters: {
        
    },
    actions: {
        setWindowSize(width, height) {
            this.windowWidth = width;
            this.windowHeight = height;

            if (width < 576) {
                this.isExtraSmall = true;
            } else {
                this.isExtraSmall = false;
            }
        },
        setWindowOuterSize(width, height) {
            this.windowOuterWidth = width;
            this.windowOuterHeight = height;
        },
        setSelectedItemPanel(panel) {
            this.itemPanel.selected = panel;
        },
        async setSelectedEvent(eevent) {
            console.log("hi");
            if (eevent.type.id == EVENTTYPE.WORKOUT) {
                let workoutStore = useWorkoutStore();
                let workoutID = await getWorkoutIDFromEvent(eevent.id);
                workoutStore.selectWorkout(workoutID);
                this.itemPanel.selected = "workout";
            } else if (eevent.type.id == EVENTTYPE.TODO) {
                this.itemPanel.selected = "event";
                this.itemPanel.event.type = EVENTTYPE.TODO;
                this.itemPanel.event.event = eevent;
            } else if (eevent.type.id == EVENTTYPE.ROUTINE) {
                this.itemPanel.selected = "event";
                this.itemPanel.event.type = EVENTTYPE.ROUTINE;
                this.itemPanel.event.event = eevent;
            }
        },
        toggleTabBar() {
            this.isTabBarShown = !this.isTabBarShown;
        },
        toggleMobileCalendar() {
            if (this.calendarMobile.isShown == false) {
                this.calendarMobile.type = CALENDAR_TYPES.WEEK;
                this.calendarMobile.isShown = true;
            } else if (this.calendarMobile.type == CALENDAR_TYPES.WEEK) {
                this.calendarMobile.type = CALENDAR_TYPES.MONTH;
                this.calendarMobile.isShown = true;
            } else if (this.calendarMobile.type == CALENDAR_TYPES.MONTH) {
                this.calendarMobile.type = undefined;
                this.calendarMobile.isShown = false;
            }

        },
        setCalendarMobileType(type) {
            if (type == CALENDAR_TYPES.WEEK) {
                this.calendarMobile.type = CALENDAR_TYPES.WEEK
            } else if (type == CALENDAR_TYPES.MONTH) {
                this.calendarMobile.type = CALENDAR_TYPES.MONTH
            }
        }
    },
})