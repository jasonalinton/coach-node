import { defineStore } from 'pinia'
import { EVENTTYPE, CALENDAR_TYPES } from '../model/constants'
import { useWorkoutStore } from '@/store/workoutStore'
import { getWorkoutIDFromEvent } from '../api/workoutAPI'
import { now } from 'jquery'

// let initialized = false;

/*
Local Storage:
DayCount
CalendarView
Selected Page
*/

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
            active: "main",
            selectedPage: 'planner',
        },
        showLeftPanel: true,
        /* Calendar */
        isMobileCalendarShown: false,
        calendarMobile: {
            isShown: true,
            type: CALENDAR_TYPES.WEEK
        },
        thumbnailCalendar: {
            monthCount: 1
        },
        planner: {
            selectedView: "week",
            dayCount: 7
        },
        itemPanel: {
            selected: "todo",
            briefing: {
                title: "Briefing"
            },
            todo: {
                showRepeat: true,
                showTimeline: false,
                showRecommended: true,
                showHierarchy: true,
                sort: {
                    by: 'Default',
                    items: [
                        { id: 1, text: "Default" },
                        { id: 2, text: "Backlog" },
                        { id: 3, text: "Custom" },
                        { id: 4, text: "Repetition" },
                        { id: 5, text: "Metric" },
                    ],
                },
            },
            goal: {
                showReverse: true,
                showTimeline: false,
                showHierarchy: true,
                sort: {
                    by: 'Timeframe',
                    items: [
                        { id: 1, text: "Dashboard" },
                        { id: 2, text: "Timeframe" },
                        { id: 3, text: "Custom" },
                        { id: 4, text: "Repetition" },
                        { id: 5, text: "Metric" },
                        { id: 6, text: "Date" },
                    ]
                },
            },
            inventory: {
                title: "Inventory",
                showPrimary: true,
                showSecondary: false,
                showTertiary: false,
                primaryToggled: undefined,
                secondaryToggled: undefined,
                tertiaryToggled: undefined,
                clear: 0, // Incrementor to trigger watch value component
            },
            event: {
                type: undefined,
                event: undefined
            },
            workout: {
                selectedView: "dashboard",
                selectedWorkoutID: undefined,
                selectedExerciseID: undefined,
                exerciseList: {
                    selectedSectionID: undefined,
                    nextExercisePosition: undefined,
                    isSelector: undefined
                },
                panelQueue: [ ],

            },
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
        setLeftPanelVisibility(isVisible) {
            this.showLeftPanel = isVisible;
        },
        toggleLeftPanel() {
            this.showLeftPanel = !this.showLeftPanel;
        },
        selectPage(page) {
            this.navbar.selectedPage = page;
        },
        selectPlannerView(view) {
            this.planner.selectedView = view;
        },
        setPlannerDayCount(count) {
            this.planner.dayCount = count;
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
                this.selectWorkout(workoutID);
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
        },
        /* Workout */
        selectWorkoutView(view) {
            let workoutPanel = this.itemPanel.workout
            if (workoutPanel.selectedView != view) {
                workoutPanel.panelQueue.push(workoutPanel.selectedView);
            }
            workoutPanel.selectedView = view;
        },
        selectWorkout(id) {
            this.itemPanel.workout.selectedWorkoutID = id;
            this.selectWorkoutView("workoutActive")
        },
        selectExercise(id) {
            this.itemPanel.workout.selectedExerciseID = id;
            this.selectWorkoutView("workoutExercise")
        },
        onAddExerciseToSection(idSection, position) {
            this.itemPanel.workout.exerciseList.selectedSectionID = idSection;
            this.itemPanel.workout.exerciseList.nextExercisePosition = position;
            this.itemPanel.workout.exerciseList.isSelector = true;

            this.selectWorkoutView("exerciseList");
        },
        onDoneExerciseSelection() {
            this.itemPanel.workout.exerciseList.selectedSectionID = undefined;
            this.itemPanel.workout.exerciseList.nextExercisePosition = undefined;
            this.itemPanel.workout.exerciseList.addedExerciseIDs = [];
            this.itemPanel.workout.exerciseList.isSelector = undefined;
        },
        onBackWorkoutPanel() {
            this.itemPanel.workout.selectedView = this.itemPanel.workout.panelQueue.pop();
        }
    },
})