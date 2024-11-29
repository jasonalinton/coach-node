import { defineStore } from 'pinia'
import { EVENTTYPE } from '../model/constants'
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
        isMobileCalendarShown: false,
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
            this.selectedItemPanel = panel;
        },
        async setSelectedEvent(eevent) {
            if (eevent.type.id == EVENTTYPE.WORKOUT) {
                let workoutStore = useWorkoutStore();
                let workoutID = await getWorkoutIDFromEvent(eevent.id);
                workoutStore.selectWorkout(workoutID);

                this.selectedItemPanel = "workout";
            }
        },
        toggleTabBar() {
            this.isTabBarShown = !this.isTabBarShown;
        },
        toggleMobileCalendar() {
            this.isMobileCalendarShown = !this.isMobileCalendarShown;
        }
    },
})