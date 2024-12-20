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
        navbar: {
            active: "main"
        },
        /* Calendar */
        isMobileCalendarShown: false,
        calendarMobile: {
            isShown: true,
            type: CALENDAR_TYPES.WEEK
        },
        itemPanel: {
            selected: "todo",
            todo: {
                showRepeat: true,
                showTimeline: false,
                showRecommended: true,
                showHierarchy: true,
                sort: {
                    by: 'Default',
                    items: [
                        { id: 1, text: "Metric" },
                        { id: 2, text: "Date" },
                        { id: 3, text: "Repetition" },
                        { id: 4, text: "Custom" },
                        { id: 5, text: "Default" },
                    ],
                },
            },
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
        onMenuButtonClicked() {
            if (this.navbar.active == "main") {
                if (this.isTabBarShown) {
                    this.navbar.active = "itemPanel"
                    this.isTabBarShown = false;
                } else {
                    this.isTabBarShown = true;
                }
            } else {
                this.navbar.active = "main"
                if (!this.isTabBarShown) {
                    this.isTabBarShown = true;
                }
            }
        },
        initItemPanels() {

        },
        onItemPanelTabButtonClicked(panel) {
            if (this.itemPanel.selected == panel) {
                if (this.navbar.active == "main") {
                    this.navbar.active = "itemPanel";
                } else {
                    this.isTabBarShown = false;
                }
            } else {
                this.itemPanel.selected = panel;
                this.navbar.active = "itemPanel";
            }
        },
        setSelectedItemPanel(panel) {
            this.itemPanel.selected = panel;
        },
        setItemPanelSetting(panel, prop, value) {
            this.itemPanel[panel][prop] = value;
        },
        setItemPanelSortBy(panel, value) {
            this.itemPanel[panel].sort.by = value;
            localStorage.setItem(`${panel}-panel-sort-by`, value);
        },
        async setSelectedEvent(eevent) {
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