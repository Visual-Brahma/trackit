let meetActionButtons: HTMLCollectionOf<Element>;
let participantsList = new Map();
let attendanceData = new Map();
let participantsButtonIndex = 1;
let startTime: Date;
let meetDuration = 1;
// eslint-disable-next-line no-undef
let trackingInterval: NodeJS.Timeout;

const track_attendance = () => {
  let currentParticipants = document.getElementsByClassName("KjWwNd");
  let currentParticipantsName = document.getElementsByClassName("zWGUib");

  if (currentParticipants.length > 0) {
    participantsList.clear();

    if (meetDuration == 1) {
      startTime = new Date();
    }

    for (let i = 0; i < currentParticipants.length; i++) {
      participantsList.set(
        (currentParticipants[i]! as HTMLImageElement).src,
        currentParticipantsName[i]!.innerHTML.toUpperCase(),
      );
    }

    participantsList.forEach(function (name, avatarUrl) {
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
          joinTime:
            joinTime.getHours() +
            ":" +
            joinTime.getMinutes() +
            ":" +
            joinTime.getSeconds(),
          attendedDuration: 1,
          lastAttendedTimeStamp: new Date(),
        };
        attendanceData.set(avatarUrl, data);
      }
    });

    meetDuration += 1;
  } else {
    try {
      (
        meetActionButtons[
          participantsButtonIndex % meetActionButtons.length
        ]! as HTMLButtonElement
      ).click();
    } catch (error) {
      stopTracking();
    }
  }
};

const stopTracking = () => {
  clearInterval(trackingInterval);
  const meetCode = window.location.pathname.substring(1);
  let currDate = new Date();
  let dd = currDate.getDate();
  let mm = currDate.getMonth() + 1;
  let yyyy = currDate.getFullYear();

  let uuid =
    "meet_attendance_report_" +
    meetCode +
    dd +
    mm +
    yyyy +
    currDate.getHours() +
    currDate.getMinutes() +
    currDate.getSeconds() +
    currDate.getMilliseconds();

  const date = dd + "/" + mm + "/" + yyyy;

  let stopTime = new Date();

  attendanceData.forEach(function (data, avatarUrl) {
    data.leaveTime =
      data.lastAttendedTimeStamp.getHours() +
      ":" +
      data.lastAttendedTimeStamp.getMinutes() +
      ":" +
      data.lastAttendedTimeStamp.getSeconds();
    attendanceData.set(avatarUrl, data);
  });

  var attendanceDetails = {
    meetCode: meetCode,
    date: date,
    startTime:
      startTime.getHours() +
      ":" +
      startTime.getMinutes() +
      ":" +
      startTime.getSeconds(),
    stopTime:
      stopTime.getHours() +
      ":" +
      stopTime.getMinutes() +
      ":" +
      stopTime.getSeconds(),
    participants: Array.from(attendanceData.values()),
  };

  const attendanceReport: {
    [key: string]: any;
  } = {};
  attendanceReport[uuid] = attendanceDetails;

  // eslint-disable-next-line no-undef
  browser.storage.local.set(attendanceReport);

  window.open("https://trackit.visualbrahma.tech/save-report");
};

/*
---------------------------------------------------
Update ui of google meet to support extra features.
---------------------------------------------------
*/

interface DraggableButtonState {
  isDragging: boolean;
  startX: number;
  startY: number;
  startLeft: number;
  startTop: number;
  hasMoved: boolean;
}

const trackitButton: HTMLButtonElement = document.createElement("button");
trackitButton.id = "trackit-action-button";
trackitButton.innerText = "Trackit";
trackitButton.style.fontWeight = "bold";
trackitButton.style.padding = "8px 12px";
trackitButton.style.border = "none";
trackitButton.style.position = "fixed";
trackitButton.style.bottom = "40px";
trackitButton.style.left = "40px";
trackitButton.style.zIndex = "9999";
trackitButton.style.backgroundColor = "hsl(262.1 83.3% 57.8%)";
trackitButton.style.color = "white";
trackitButton.style.borderRadius = "5px";
trackitButton.style.cursor = "move";
trackitButton.style.userSelect = "none";

const state: DraggableButtonState = {
  isDragging: false,
  startX: 0,
  startY: 0,
  startLeft: 0,
  startTop: 0,
  hasMoved: false,
};

const startDragging = (e: MouseEvent) => {
  state.isDragging = true;
  state.hasMoved = false;
  state.startX = e.clientX;
  state.startY = e.clientY;
  state.startLeft = parseInt(trackitButton.style.left) || 0;
  state.startTop = parseInt(trackitButton.style.bottom) || 0;
  e.preventDefault();
};

const drag = (e: MouseEvent) => {
  if (!state.isDragging) return;

  const deltaX = e.clientX - state.startX;
  const deltaY = e.clientY - state.startY;

  // Check if the button has moved more than a small threshold to not trigger a click
  if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
    state.hasMoved = true;
  }

  let newLeft = state.startLeft + deltaX;
  let newBottom = state.startTop - deltaY;

  const buttonRect = trackitButton.getBoundingClientRect();
  const buttonWidth = buttonRect.width;
  const buttonHeight = buttonRect.height;

  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  // Check if the button is out of viewport and reset if necessary
  if (newLeft < 0) newLeft = 0;
  if (newLeft + buttonWidth > viewportWidth)
    newLeft = viewportWidth - buttonWidth;
  if (newBottom < 0) newBottom = 0;
  if (newBottom + buttonHeight > viewportHeight)
    newBottom = viewportHeight - buttonHeight;

  trackitButton.style.left = `${newLeft}px`;
  trackitButton.style.bottom = `${newBottom}px`;
};

trackitButton.addEventListener("mousedown", startDragging);
document.addEventListener("mousemove", drag);
document.addEventListener("mouseup", () => {
  state.isDragging = false;
});

trackitButton.addEventListener("click", () => {
  if (!state.hasMoved) {
    // eslint-disable-next-line no-undef
    browser.runtime.sendMessage({ action: "openPopup" });
  }
  state.hasMoved = false;
});

/*
-------------------
start the extension
-------------------
*/

const startEngine = () => {
  try {
    meetActionButtons = document.getElementsByClassName("NtU4hc");
    if (meetActionButtons.length === 0) {
      throw new Error("Meeting not started yet.");
    }
    document.body.appendChild(trackitButton);
    trackingInterval = setInterval(track_attendance, 1000);
    clearInterval(engine);
  } catch (error) {
    console.log("Waiting for the meet to start...");
  }
};

const engine = setInterval(startEngine, 1000);
