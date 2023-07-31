import clock from "clock";
import * as document from "document";
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
const batteryLabel = document.getElementById('batteryLabel');

clock.ontick = (evt) => {
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
  dateLabel.text = `${month} / ${dayNumber} / ${year}`;
  dayLabel.text = dayName
  batteryLabel.text = Math.floor(battery.chargeLevel) + "%";
}