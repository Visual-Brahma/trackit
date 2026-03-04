let meetActionButtons;
let participantsList = new Map();
let attendanceData = new Map();
let participantsButtonIndex = 0;
let startTime;
let meetDuration = 1;
let currTime;

function getParticipantName(participantNode) {
    let nameNode = participantNode.querySelector(".zWGUib");
    return nameNode?.textContent.trim().toUpperCase();
}

function getParticipantAvatar(participantNode) {
    let avatarNode = participantNode.querySelector("img.KjWwNd");
    return avatarNode.src;
}

function getMeetingParticipants() {
    return Array.from(document.querySelectorAll('.m3Uzve.RJRKn [role="listitem"][data-participant-id]'));
}

function track_attendance() {
    let currentParticipants = getMeetingParticipants();

    if (currentParticipants.length > 0) {
        participantsList.clear();

        if (meetDuration == 1) {
            startTime = new Date();
        }

        currentParticipants.forEach((participantNode) => {
            let avatarUrl = getParticipantAvatar(participantNode);
            let participantName = getParticipantName(participantNode);
            participantsList.set(avatarUrl, participantName);
        });

        participantsList.forEach(function(name, avatarUrl) {
            if (attendanceData.has(avatarUrl)) {
                let data = attendanceData.get(avatarUrl);
                data.attendedDuration += 1;
                data.lastAttendedTimeStamp = new Date();
                attendanceData.set(avatarUrl, data);
            } else {
                let joinTime = new Date();
                let data = {
                    avatarUrl: avatarUrl,
                    name: name,
                    joinTime: joinTime.getHours() + ":" + joinTime.getMinutes() + ":" + joinTime.getSeconds(),
                    attendedDuration: 1,
                    lastAttendedTimeStamp: new Date()
                };
                attendanceData.set(avatarUrl, data);
            }
        });

        meetDuration += 1;

    } else {
        try {
            meetActionButtons[participantsButtonIndex % meetActionButtons.length].click();
        } catch (error) {
            stop();
        }
    }
}

function start() {
    tracking = setInterval(track_attendance, 1000);
}

let stop = STOP = function() {
    clearInterval(tracking);
    let meetCode = window.location.pathname.substring(1);
    let date = new Date();
    let dd = date.getDate();
    let mm = date.getMonth() + 1;
    let yyyy = date.getFullYear();

    let uuid = "meet_attendance_report_" + meetCode + dd + mm + yyyy + date.getHours() + date.getMinutes() + date.getSeconds() + date.getMilliseconds();

    date = dd + '/' + mm + "/" + yyyy;

    let stopTime = new Date();

    attendanceData.forEach(function(data, avatarUrl) {
        data.leaveTime = data.lastAttendedTimeStamp.getHours() + ":" + data.lastAttendedTimeStamp.getMinutes() + ":" + data.lastAttendedTimeStamp.getSeconds();
        attendanceData.set(avatarUrl, data);
    });

    var attendanceDetails = {
        meetCode: meetCode,
        date: date,
        startTime: startTime.getHours() + ":" + startTime.getMinutes() + ":" + startTime.getSeconds(),
        stopTime: stopTime.getHours() + ":" + stopTime.getMinutes() + ":" + stopTime.getSeconds(),
        participants: Array.from(attendanceData.values())
    }

    attendanceReport = {}
    attendanceReport[uuid] = attendanceDetails

    chrome.storage.local.set(attendanceReport, function() {
        console.log("Attendance saved successfully.");
    });

    window.open('https://trackit.visualbrahma.tech/save-report');
}

/*
---------------------------------------------------
Update ui of google meet to support extra features.
---------------------------------------------------
*/

// Status text
let statusText = document.createElement("button");
statusText.id = "status";
statusText.className = "Jyj1Td CkXZgc";
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
        meetActionButtons = document.getElementsByClassName("XSfT7e");
        document.getElementsByClassName("Qp8KI")[0].appendChild(statusText);
        start();
        clearInterval(engine);
    } catch (error) {}
};