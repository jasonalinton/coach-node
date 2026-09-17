import { defineStore } from 'pinia'
import { EVENTTYPE, CALENDAR_TYPES } from '../model/constants'
import { useWorkoutStore } from '@/store/workoutStore'
import { LEFT_PANEL_WIDTH, RIGHT_PANEL_WIDTH, SELECTED_ITEM_TAB } from '../model/appDefaults'

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
        bodyOuterHeight: undefined,
        bodyOuterWidth: undefined,
        windowOuterHeight: undefined,
        mouseX: undefined,
        mouseY: undefined,
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
            selected: (localStorage.getItem(`selected-item-panel`) == "undefined") 
                ? undefined : localStorage.getItem(`selected-item-panel`) 
                    || "todo",
            briefing: {
                title: "Briefing"
            },
            todo: {
                selectedTask: undefined,
                showRepeat: true,
                showTimeline: false,
                showRecommended: true,
                showHierarchy: true,
                sort: {
                    by: 'Default',
                    items: [
                        { id: 1, text: "Default" },
                        { id: 1, text: "Default2" },
                        { id: 2, text: "Backlog" },
                        { id: 3, text: "Custom" },
                        { id: 4, text: "Repetition" },
                        { id: 5, text: "Metric" },
                        { id: 5, text: "Memorization" },
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
                activeExerciseID: undefined,
                exerciseFormID: undefined,
                exerciseList: {
                    selectedSectionID: undefined,
                    nextExercisePosition: undefined,
                    isSelector: undefined
                },
                exerciseHistory: {
                    idExercise: undefined,
                    variationIDs: []
                },
                panelQueue: [ ],

            },
        },
        nav: {
            selectedPage: localStorage.getItem(`selected-page`) || "planner",
            pages: [
                { id: 1, text: "Planner", route: "/planner" },
                { id: 2, text: "Items", route: "/items/todo" },
                { id: 3, text: "Physical View", route: "/physical-view" },
            ]
        },
        leftPanel: {
            isShown: true,
            width: parseInt(localStorage.getItem('left-panel-width') || `${LEFT_PANEL_WIDTH}`),
        },
        rightPanel: {
            isShown: true,
            width: parseInt(localStorage.getItem('right-panel-width') || `${RIGHT_PANEL_WIDTH}`),
        },
        body: {
            selectedTodoFormId: localStorage.getItem('selected-todo-form-id'),
            selectedGoalFormId: localStorage.getItem('selected-goal-form-id'),
        },
        itemTabs: {
            selectedTab: localStorage.getItem('selected-item-tab') || SELECTED_ITEM_TAB
        }
    }),
    getters: {
        bodyWidth() {
            return this.bodyOuterWidth;
        }
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
        setBodyOuterSize(width, height) {
            this.bodyOuterWidth = width;
            this.bodyOuterHeight = height;
        },
        setMouseXY(x, y) {
            this.mouseX = x;
            this.mouseY = y;
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
        /* Left Panel */
        toggleLeftPanel() {
            this.setLeftPanelVisibility(!this.leftPanel.isShown);
        },
        setLeftPanelVisibility(isVisible) {
            this.leftPanel.isShown = isVisible;
            localStorage.setItem('left-panel-visibility', isVisible);
        },
        setLeftPanelWidth(width) {
            this.leftPanel.width = width;
            localStorage.setItem('left-panel-width', width);
        },
        /* Right Panel */
        toggleRightPanel() {
            this.setRightPanelVisibility(!this.rightPanel.isShown);
        },
        setRightPanelVisibility(isVisible) {
            this.rightPanel.isShown = isVisible;
            localStorage.setItem('right-panel-visibility', isVisible);
        },
        setRightPanelWidth(width) {
            this.rightPanel.width = width;
            localStorage.setItem('right-panel-width', width);
        },
        selectPage(page) {
            this.nav.selectedPage = page;
            localStorage.setItem('selected-page', page);
        },
        selectTodoForm(id) {
            this.selectPage('todoForm');
            this.body.selectedTodoFormId = id;
            localStorage.setItem('selected-todo-form-id', id);
        },
        selectGoalForm(id) {
            this.selectPage('goalForm');
            this.body.selectedGoalFormId = id;
            localStorage.setItem('selected-goal-form-id', id);
        },
        selectPlannerView(view) {
            this.planner.selectedView = view;
        },
        setPlannerDayCount(count) {
            this.planner.dayCount = count;
        },
        selectItemTab(tab) {
            this.itemTabs.selectedTab = tab;
            localStorage.setItem('selected-item-tab', tab);
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
                this.setSelectedItemPanel(panel);
                this.navbar.active = "itemPanel";
            }
        },
        setSelectedItemPanel(panel) {
            this.itemPanel.selected = panel;
            localStorage.setItem(`selected-item-panel`, panel);
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
                let workoutID = await workoutStore.getWorkoutIDFromEvent(eevent.id);
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
            } else if (eevent.type.id == EVENTTYPE.BLOCKROUTINE) {
                this.itemPanel.selected = "event";
                this.itemPanel.event.type = EVENTTYPE.BLOCKROUTINE;
                this.itemPanel.event.event = eevent;
            }
        },
        setSelectedTask(task) {
            this.itemPanel.selected = "todo";
            this.itemPanel.todo.selectedTask = task;
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
        setActiveExercise(id) {
            this.itemPanel.workout.activeExerciseID = id;
        },
        selectExerciseForm(idExercise) {
            this.itemPanel.workout.exerciseFormID = idExercise;
            this.selectWorkoutView("exerciseForm");
        },
        selectExerciseHistory(idExercise, variationIDs) {
            this.itemPanel.workout.exerciseHistory.idExercise = idExercise;
            this.itemPanel.workout.exerciseHistory.variationIDs = [...variationIDs];
            this.selectWorkoutView("exerciseHistory")
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
        onDoneWorkout() {
            this.itemPanel.workout.selectedWorkoutID = undefined;
            this.itemPanel.workout.selectedExerciseID = undefined;
            this.itemPanel.workout.activeExerciseID = undefined;
        },
        onBackWorkoutPanel() {
            this.itemPanel.workout.selectedView = this.itemPanel.workout.panelQueue.pop();
        }
    },
})