

let languageChart = document.getElementById("canvas-DistributionByLanguage").getContext("2d");

let PopChart = new Chart(languageChart, {
  type: "doughnut", // bar, horizontalBar, pie, line, doughnut, radar, polarArea
  data: {
    labels: Statistics.distByLanguageX,
    datasets: [
      {
        label: "Population",
        data: Statistics.distByLanguageY,
        //backgroundColor:'green',
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
          "rgba(255, 159, 64, 0.6)",
          "rgba(255, 99, 132, 0.6)",
        ],
        borderWidth: 1,
        borderColor: "#777",
        hoverBorderWidth: 3,
        hoverBorderColor: "#000",
      },
    ],
  },
  options: {
    title: {
      display: true,
      text: "Distribution By Language",
      fontSize: 25,
    },
    legend: {
      display: true,
      position: "right",
      labels: {
        fontColor: "#000",
      },
    },
    layout: {
      padding: {
        left: 50,
        right: 0,
        bottom: 0,
        top: 0,
      },
    },
    tooltips: {
      enabled: true,
    },
  },
});
