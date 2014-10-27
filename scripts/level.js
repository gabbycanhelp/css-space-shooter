/**
 * Created by Michael on 08/10/2014.
 */

/**
 * Reads the levelData array and emits any events that occur at a given timestamp
 */
var levelPlayer = (function() {
    var module = {};
    var startTime, levelData, secondsElapsed, activeAliens = 0, currentStageIndex = 0;

    module.setLevel = function(level) {
        levelData = level;
    };

    module.getEvents = function(timestamp) {
        var currentStage;

        if (typeof startTime === 'undefined') {
            startTime = timestamp;
        }

        currentStage = getCurrentStage();
        secondsElapsed = getSecondsElapsed(startTime, timestamp);
        return getEventAtTime(secondsElapsed, currentStage);
    };

    module.alienRemoved = function() {
        activeAliens = Math.max(activeAliens - 1, 0);
    };

    function getSecondsElapsed(startTime, timestamp) {
        return Math.floor((timestamp - startTime) / 1000);
    }

    function getCurrentStage(timestamp) {
        if (allStageEventsFired() && activeAliens === 0) {
            currentStageIndex ++;
            activeAliens = 0;
            startTime = timestamp;
        }
        return levelData[currentStageIndex];
    }

    function allStageEventsFired() {
        var stageEvents = levelData[currentStageIndex].events;
        return stageEvents[stageEvents.length - 1].fired === true;
    }

    function getEventAtTime(secondsElapsed, currentStage) {
        var e, event;

        for (e = 0; e < currentStage.events.length; e++) {
            event = currentStage.events[e];

            if (event.time === secondsElapsed) {
                if (!event.fired) {
                    event.fired = true;
                    setActiveAliens(event);
                    return event;
                }
            }
        }

        return [];
    }

    function setActiveAliens(event) {
        if (event.type === 'spawn') {
            activeAliens += event.data.length;
        }
    }

    return module;
})();

/**
 * An "enum" of the different types of alien
 *
 * @type {{stationary: number, vertical: number, horizontal: number, spiral: number, random: number}}
 */
var ALIEN_CLASS = {
    stationary: 1,
    vertical: 2,
    horizontal: 3,
    spiral: 4,
    random: 5
};

/**
 * This array describes the game level structure.
 *
 * @type {{name: string, duration: number, sequence: {time: number, spawn: *[]}[]}[]}
 */
var levelData = [
    {
        events: [
            { time: 2, type: 'announcement', data: { title: 'Stage 1', subtitle: 'Warm-up!'} },
            { time: 3, type: 'spawn', data: [
                { class: ALIEN_CLASS.stationary, speed: 1 }
            ] },
            { time: 7, type: 'spawn', data: [
                { class: ALIEN_CLASS.stationary, speed: 1 }
            ] },
            { time: 11, type: 'spawn', data: [
                { class: ALIEN_CLASS.stationary, speed: 1 }
            ] },
            { time: 16, type: 'spawn', data: [
                { class: ALIEN_CLASS.stationary, speed: 1 },
                { class: ALIEN_CLASS.stationary, speed: 1 }
            ] }
        ]
    },
    {
        events: [
            { time: 2, type: 'announcement', data: {title: 'Stage 2'} },
            { time: 3, type: 'spawn', data: [
                { class: ALIEN_CLASS.vertical, speed: 1 }
            ] },
            { time: 6, type: 'spawn', data: [
                { class: ALIEN_CLASS.horizontal, speed: 1 }
            ] },
            { time: 9, type: 'spawn', data: [
                { class: ALIEN_CLASS.vertical, speed: 1 },
                { class: ALIEN_CLASS.stationary, speed: 1 }
            ] },
            { time: 13, type: 'spawn', data: [
                { class: ALIEN_CLASS.horizontal, speed: 1 },
                { class: ALIEN_CLASS.stationary, speed: 1 }
            ] },
            { time: 17, type: 'spawn', data: [
                { class: ALIEN_CLASS.vertical, speed: 1.5 },
                { class: ALIEN_CLASS.horizontal, speed: 1.5 }
            ] }
        ]
    },
    {
        events: [
            { time: 2, type: 'announcement', data: { title: 'Stage 3', subtitle: 'Spirals!'} },
            { time: 3, type: 'spawn', data: [
                { class: ALIEN_CLASS.spiral, speed: 1 }
            ] },
            { time: 7, type: 'spawn', data: [
                { class: ALIEN_CLASS.spiral, speed: 1 }
            ] },
            { time: 11, type: 'spawn', data: [
                { class: ALIEN_CLASS.spiral, speed: 1 }
            ] },
            { time: 15, type: 'spawn', data: [
                { class: ALIEN_CLASS.spiral, speed: 2 }
            ] },
            { time: 16, type: 'spawn', data: [
                { class: ALIEN_CLASS.spiral, speed: 2 }
            ] }
        ]
    }
];