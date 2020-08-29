"use strict";
function getTimesArr() {
  let myDate = new Date("July 21, 1983 00:00:00");
  let minutes = myDate.getMinutes();
  let hours = myDate.getHours();
  let currTime = new Date();
  let currHour = currTime.getHours();
  let currMinutes = currTime.getMinutes();
  let steps = 12 * currHour + Math.ceil(currMinutes / 5);
  let arr=[];
  for (let i = 0; i < steps; i++) {
    let myNewDate = new Date(myDate.getTime() + 5 * 60000);
    let toHour = myNewDate.getHours();
    let toMinute = myNewDate.getMinutes();
	arr.push(""+hours+":"+minutes+"-"+toHour+":"+toMinute);

    minutes = myNewDate.getMinutes();
    hours = myNewDate.getHours();
    myDate = myNewDate;
  }
  return arr;
}

window.chartColors = {
  red: "rgb(255, 99, 132)",
  orange: "rgb(255, 159, 64)",
  yellow: "rgb(255, 205, 86)",
  green: "rgb(75, 192, 192)",
  blue: "rgb(54, 162, 235)",
  purple: "rgb(153, 102, 255)",
  grey: "rgb(201, 203, 207)",
};

let COLORS = [
  "rgb(255, 99, 132)",
  "rgb(255, 159, 64)",
  "rgb(255, 205, 86)",
  "rgb(75, 192, 192)",
  "rgb(54, 162, 235)",
  "rgb(153, 102, 255)",
  "rgb(201, 203, 207)",
];
