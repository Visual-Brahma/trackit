let participantsList = new Map();
let attendanceData = new Map();
let startTime;
let meetDuration = 1;
let currentParticipants = [];

// Globals to identify the meeting report immediately
let meetCode = "";
let meetDate = "";
let reportUuid = "";

// Listen to custom event from injected script
document.addEventListener('TrackitJitsiParticipantsUpdate', function(e) {
    try {
        currentParticipants = JSON.parse(e.detail);
    } catch(err) {
        currentParticipants = [];
    }
});

function track_attendance() {
    // If the status indicator is removed from the DOM, the meeting UI was destroyed
    if (!document.getElementById("status")) {
        stop();
        return;
    }

    if (currentParticipants.length > 0) {
        participantsList.clear();

        if (meetDuration == 1) {
            startTime = new Date();
        }

        currentParticipants.forEach((participantObj) => {
            let avatarUrl = participantObj.avatarUrl;
            let participantName = participantObj.name;
            let key = participantName + "_" + avatarUrl;
            participantsList.set(key, {name: participantName, avatarUrl: avatarUrl});
        });

        participantsList.forEach(function(info, key) {
            if (attendanceData.has(key)) {
                let data = attendanceData.get(key);
                data.attendedDuration += 1;
                data.lastAttendedTimeStamp = new Date();
                attendanceData.set(key, data);
            } else {
                let joinTime = new Date();
                let data = {
                    avatarUrl: info.avatarUrl,
                    name: info.name,
                    joinTime: joinTime.getHours() + ":" + joinTime.getMinutes() + ":" + joinTime.getSeconds(),
                    attendedDuration: 1,
                    lastAttendedTimeStamp: new Date()
                };
                attendanceData.set(key, data);
            }
        });

        meetDuration += 1;
        saveToStorage(); // Active Sync
    }
}

function saveToStorage() {
    let stopTime = new Date();

    // Shallow copy data to finalize the leave times for the snapshot
    let snapshotData = new Map();
    attendanceData.forEach(function(data, key) {
        let snapshot = {...data};
        if (snapshot.lastAttendedTimeStamp) {
            snapshot.leaveTime = snapshot.lastAttendedTimeStamp.getHours() + ":" + snapshot.lastAttendedTimeStamp.getMinutes() + ":" + snapshot.lastAttendedTimeStamp.getSeconds();
        } else {
            snapshot.leaveTime = stopTime.getHours() + ":" + stopTime.getMinutes() + ":" + stopTime.getSeconds();
        }
        snapshotData.set(key, snapshot);
    });

    var attendanceDetails = {
        meetCode: meetCode,
        date: meetDate,
        startTime: startTime ? (startTime.getHours() + ":" + startTime.getMinutes() + ":" + startTime.getSeconds()) : "00:00:00",
        stopTime: stopTime.getHours() + ":" + stopTime.getMinutes() + ":" + stopTime.getSeconds(),
        participants: Array.from(snapshotData.values())
    }

    let attendanceReport = {}
    attendanceReport[reportUuid] = attendanceDetails

    chrome.storage.local.set(attendanceReport);
}

function start() {
    // Generate UUID and Metadata early
    meetCode = window.location.pathname.substring(1);
    let date = new Date();
    let dd = date.getDate();
    let mm = date.getMonth() + 1;
    let yyyy = date.getFullYear();
    reportUuid = "meet_attendance_report_" + meetCode + dd + mm + yyyy + date.getHours() + date.getMinutes() + date.getSeconds() + date.getMilliseconds();
    meetDate = dd + '/' + mm + "/" + yyyy;

    // Delegate tab closing/redirect monitoring to background.js
    chrome.runtime.sendMessage({ type: "TRACKING_STARTED" });

    // Inject the script into the main world to read Redux state
    let script = document.createElement('script');
    script.src = chrome.runtime.getURL('jitsi-inject.js');
    (document.head || document.documentElement).appendChild(script);

    tracking = setInterval(track_attendance, 1000);
}

let stop = STOP = function() {
    clearInterval(tracking);
    // The background script monitors URL changes naturally and triggers the tab opening.
    // If we call stop() while the tab is still alive, we can message it to open the tab manually
    chrome.runtime.sendMessage({ type: "TRACKING_STOPPED" });
}

/*
---------------------------------------------------
Update ui of jitsi meet to support extra features.
---------------------------------------------------
*/

// Status text
let statusText = document.createElement("button");
statusText.id = "status";
statusText.innerHTML = "&nbsp;🔴 Running Trackit";
statusText.style.color = "red";
statusText.style.fontWeight = "bold";
statusText.style.padding = "auto";
statusText.style.border = "none";
statusText.style.outline = "none";
statusText.style.background = "transparent";

const blinkSpeed = 500;
setInterval(function() { statusText.style.visibility = (statusText.style.visibility == 'hidden' ? '' : 'hidden'); }, blinkSpeed);

/*
-------------------
start the extension
-------------------
*/

let engine = setInterval(startEngine, 1000);

function startEngine() {
    try {
        let statusContainer = document.querySelector(".subject-info-container");
        if (statusContainer) {
            statusContainer.appendChild(statusText);
            start();
            clearInterval(engine);
        }
    } catch (error) {}
};