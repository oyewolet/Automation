// script.js
// Ensure the script runs after the DOM is fully loaded
// Generic function to call ESP backend
const ws = new WebSocket(`ws://${location.host}/ws`);
ws.onmessage = function(event) {
  // Expect event.data to be JSON: {type: 'temp', value: ...} or {type: 'level', value: ...}
  let msg;
  try {
    msg = JSON.parse(event.data);
  } catch {
    // fallback: treat as number (for backward compatibility)
    msg = { type: 'temp', value: parseInt(event.data) };
  }
  if (msg.type === 'temp') {
    const gauge = document.getElementById('gauge');
    gauge.style.setProperty('--temp', msg.value);
    gauge.setAttribute('data-temp', msg.value);
    // Update temperature text
    const tempText = document.getElementById('temperatureText');
    if (tempText) {
      tempText.textContent = `${msg.value}°C`;
    }
  } else if (msg.type === 'level') {
    const level = Math.round(msg.value / 256); // 0–4
    // handle level update here if needed
  }
};

function toggleDevice(deviceName) {
  fetch("/api/toggle", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `device=${deviceName}`,
  })
    .catch((err) => console.error("Toggle failed:", err))
    .finally(fetchStatus); // <-- Add this line to always refresh UI after toggle
}
// LIGHTS
// Device Toggle Functions
function toggleBulb() {
  const lamp = document.getElementById("imageLamp");
  const status = document.getElementById("2s");
  const isOff = lamp.src.includes("light_bulb_off.png");
  lamp.src = isOff
    ? "light_bulb_on.png"
    : "light_bulb_off.png";
  status.textContent = isOff ? "ON" : "OFF";
  toggleDevice("light1");
}

// FAN
// Device Toggle Functions
function togglefan() {
  const fan = document.getElementById("fan");
  const status = document.getElementById("22s");
  // Use endsWith for more reliable filename check
  const isOff = fan.src.endsWith("fan-off.png");
  fan.src = isOff ? "fan-on.png" : "fan-off.png";
  status.textContent = isOff ? "ON" : "OFF";
  toggleDevice("fan");
}

function toggleBulb1() {
  const lamp = document.getElementById("Lamp1");
  const status = document.getElementById("3s");
  const isOff = lamp.src.includes("light_bulb_off.png");
  lamp.src = isOff ? "light_bulb_on.png" : "light_bulb_off.png";
  status.textContent = isOff ? "ON" : "OFF";
  toggleDevice("light2");
}

function toggleBulb2() {
  const lamp = document.getElementById("Lamp2");
  const status = document.getElementById("4s");
  // const currentState = lamp.getAttribute("data-state");
  const isOff = lamp.src.includes("light_bulb_off.png");
  lamp.src = isOff ? "light_bulb_on.png" : "light_bulb_off.png";
  status.textContent = isOff ? "ON" : "OFF";
  toggleDevice("light3");
}
// DOORS
// Device Toggle Functions
function toggleBackDoor() {
  const Door = document.getElementById("backDoor");
  const status = document.getElementById("9s");
  const currentState = Door.getAttribute("data-state");
  const locked = currentState === "locked";
  Door.src = locked ? "open_lock.png" : "lock.png";
  Door.setAttribute("data-state", locked ? "unlocked" : "locked");
  status.textContent = locked ? "OPEN" : "CLOSE";
  toggleDevice("door1");
}

function toggleFrontDoor() {
  const Door = document.getElementById("frontDoor");
  const status = document.getElementById("10s");
  const currentState = Door.getAttribute("data-state");
  const locked = currentState === "locked";
  Door.src = locked ? "open_lock.png" : "lock.png";
  Door.setAttribute("data-state", locked ? "unlocked" : "locked");
  status.textContent = locked ? "OPEN" : "CLOSE";
  toggleDevice("door2");
}

function togglecamera() {
  const camera = document.getElementById("camera");
  const status = document.getElementById("5s");
  const isOff = camera.src.includes("camera-close.png");
  camera.src = isOff ? "camera-open.png" : "camera-close.png";
  status.textContent = isOff ? "ON" : "OFF";
  toggleDevice("camera1");
}

function togglecamera1() {
  const camera = document.getElementById("camera1");
  const status = document.getElementById("6s");
  const isOff = camera.src.includes("camera-close.png");
  camera.src = isOff ? "camera-open.png" : "camera-close.png";
  status.textContent = isOff ? "ON" : "OFF";
  toggleDevice("camera2");
}

function togglecamera2() {
  const camera = document.getElementById("camera2");
  const status = document.getElementById("7s");
  const isOff = camera.src.includes("camera-close.png");
  camera.src = isOff ? "camera-open.png" : "camera-close.png";
  status.textContent = isOff ? "ON" : "OFF";
  toggleDevice("camera3");
}

function togglecamera3() {
  const camera = document.getElementById("camera3");
  const status = document.getElementById("8s");
  const isOff = camera.src.includes("camera-close.png");
  camera.src = isOff ? "camera-open.png" : "camera-close.png";
  status.textContent = isOff ? "ON" : "OFF";
  toggleDevice("camera4");
}

let isArmed = true;
function setAlarmStatus(state) {
  const alarmBtn = document.getElementById("armed");
  const status = document.getElementById("11s");
  isArmed = state;
  alarmBtn.innerHTML = state ? "Armed" : "Disarmed";
  alarmBtn.classList.toggle("disarmed", !state);
  status.textContent = state ? "ON" : "OFF";
}

function fetchStatus() {
  fetch("/api/status")
    .then((response) => response.json())
    .then((data) => {
      setLamp("imageLamp", "2s", data.light1);
      setLamp("Lamp1", "3s", data.light2);
      setLamp("Lamp2", "4s", data.light3);
      setLock("backDoor", "9s", data.door1);
      setLock("frontDoor", "10s", data.door2);
      setCam("camera", "5s", data.camera1);
      setCam("camera1", "6s", data.camera2);

      const alarmBtn = document.getElementById("armed");
      const status = document.getElementById("11s");
      if (data.alarm === 1) {
        alarmBtn.innerHTML = "Armed";
        alarmBtn.classList.remove("disarmed");
        status.textContent = "ARMED";
        status.style.color = "blue";
        isArmed = true;
      } else {
        alarmBtn.innerHTML = "Disarmed";
        alarmBtn.classList.add("disarmed");
        status.textContent = "DISARMED";
        status.style.color = "red";
        isArmed = false;
      }
    })
    .catch((err) => console.error("Failed to fetch status:", err));
}
// UI HELPER FUNCTIONS
function setLamp(id, statusId, isOn) {
  const el = document.getElementById(id);
  const status = document.getElementById(statusId);
  el.src = isOn ? "light_bulb_on.png" : "light_bulb_off.png";
  status.textContent = isOn ? "ON" : "OFF";
}

function setLock(id, statusId, isLocked) {
  const el = document.getElementById(id);
  const status = document.getElementById(statusId);
  el.src = isLocked ? "lock.png" : "open_lock.png";
  el.setAttribute("data-state", isLocked ? "locked" : "unlocked");
  status.textContent = isLocked ? "CLOSE" : "OPEN";
}

function setCam(id, statusId, isOn) {
  const el = document.getElementById(id);
  const status = document.getElementById(statusId);
  el.src = isOn ? "camera-open.png" : "camera-close.png";
  status.textContent = isOn ? "ON" : "OFF";
}

function logout() {
  localStorage.removeItem("authenticated");
  window.location.href = "/login.html";
}

function saveUIState() {
  const state = {
    light1: document
      .getElementById("imageLamp")
      .src.includes("light_bulb_on.png"),
    light2: document.getElementById("Lamp1").src.includes("light_bulb_on.png"),
    light3: document.getElementById("Lamp2").src.includes("light_bulb_on.png"),
    door1:
      document.getElementById("backDoor").getAttribute("data-state") ===
      "locked",
    door2:
      document.getElementById("frontDoor").getAttribute("data-state") ===
      "locked",
    camera1: document.getElementById("camera").src.includes("camera-open.png"),
    camera2: document.getElementById("camera1").src.includes("camera-open.png"),
    camera3: document
      .getElementById("camera2")
      ?.src.includes("camera-open.png"),
    camera4: document
      .getElementById("camera3")
      ?.src.includes("camera-open.png"),
    alarm: isArmed,
  };
  localStorage.setItem("uiState", JSON.stringify(state));
}

// Unified DOMContentLoaded handler
document.addEventListener("DOMContentLoaded", function () {
  if (!localStorage.getItem("authenticated")) {
    // window.location.href = "/login.html";
  }

  const armedBtn = document.getElementById("armed");
  armedBtn.addEventListener("click", function () {
    setAlarmStatus(!isArmed);
    // Toggle the alarm state on the server
    toggleDevice("alarm");
  });

  const logoutBtn = document.getElementById("logoutBtn");
  logoutBtn.addEventListener("click", logout);
  logoutBtn.style.display = "block";

  fetchStatus();
});
