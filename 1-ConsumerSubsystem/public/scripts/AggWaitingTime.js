let color = Chart.helpers.color;
var barChartData = {
  labels: ["January", "February", "March"],
  datasets: [
    {
      label: "Waiting Time",
      backgroundColor: color(window.chartColors.blue).alpha(0.5).rgbString(),
      borderColor: window.chartColors.blue,
      borderWidth: 1,
      data: Statistics.aggWaitingTime,
    },
  ],
};

var ctx = document.getElementById("canvas-WaitingTime").getContext("2d");
window.myBar = new Chart(ctx, {
  type: "bar",
  data: barChartData,
  options: {
    responsive: true,
    legend: {
      position: "top",
    },
  },
});
