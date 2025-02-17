const { getChart } = require('billboard-top-100');
const { listCharts } = require('billboard-top-100');


getChart('hot-mainstream-rock-tracks', '1997-10-16', (err, chart) => {
    if (err) console.log(err);

    console.log(chart.songs);

});

listCharts((err, charts) => {
  if (err) console.log(err);
  // array of all charts
    charts.forEach(chart => {
        if (chart.name.includes('Rock')) {
            console.log(chart);
        }

    });
});
