var barChartData = {
  labels: ["January", "February", "March", "April", "May", "June", "July"],
  datasets: [
    {
      label: "Number Of Waiting Calls",
      backgroundColor: color(window.chartColors.purple).alpha(0.5).rgbString(),
      borderColor: window.chartColors.purple,
      borderWidth: 1,
      data: [50, 50, 50, 50, 50, 50, 50],
    },
  ],
};

var ctx2 = document.getElementById("canvas-NumOfWaitingCalls").getContext("2d");
window.myBar2 = new Chart(ctx2, {
  type: "bar",
  data: barChartData,
  options: {
    responsive: true,
    legend: {
      position: "top",
    },
  },
});
