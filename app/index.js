import clock from "clock";
import * as document from "document";
import * as messaging from "messaging";
import { days, months, monthsShort } from "./locales/en.js";
import { battery } from "power";

function zeroPad(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}

clock.granularity = "minutes";

const timeLabel = document.getElementById("timeLabel");
const amPmLabel = document.getElementById('amPmLabel');
const dayLabel = document.getElementById("dayLabel");
const dateLabel = document.getElementById("dateLabel");
const tempLabel = document.getElementById("tempLabel");
const weatherLabel = document.getElementById('weatherLabel');
const batteryLabel = document.getElementById('batteryLabel');

let temp = "";
let weather = '';

clock.ontick = (evt) => {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    messaging.peerSocket.send({action: "weather"})
  }
  let today = evt.date;
  let hours = today.getHours();
  let postfix = "AM"
  if(hours > 12){
    postfix = "PM"
  }
  hours = hours % 12 || 12;
  hours = zeroPad(hours)
  let mins = zeroPad(today.getMinutes());
  let dayName = days[today.getDay()];
  let month = zeroPad(today.getMonth() + 1);
  let monthName = months[today.getMonth()];
  let monthNameShort = monthsShort[today.getMonth()];
  let dayNumber = zeroPad(today.getDate());
  let year = today.getFullYear();
  timeLabel.text = `${hours}:${mins}`;
  amPmLabel.text = postfix;
  dateLabel.text = `${month}/${dayNumber}/${year}`;
  dayLabel.text = dayName
  tempLabel.text = temp
  weatherLabel.text = weather
  batteryLabel.text = Math.floor(battery.chargeLevel) + "%";
}

messaging.peerSocket.onmessage = evt => {
    if (evt && evt.data && evt.data.temp){
        let unit = evt.data.unit
        if(unit.indexOf('cel') !== -1){
            unit = '°C'
        } else {
            unit = '°F'
        }
        temp = `${evt.data.temp}${unit}`;
        weather = `${evt.data.condDisplay}`
        tempLabel.text = temp
        weatherLabel.text = weather
    }
  };