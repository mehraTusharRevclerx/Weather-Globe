am4core.useTheme(am4themes_material);
let obj = {};
var chart = am4core.create("chartdiv", am4maps.MapChart);

chart.geodata = am4geodata_worldLow;

chart.projection = new am4maps.projections.Orthographic();
chart.panBehavior = "rotateLongLat";
chart.deltaLatitude = -20;
chart.padding(20, 20, 20, 20);
var polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());
polygonSeries.useGeodata = true;
var polygonTemplate = polygonSeries.mapPolygons.template;
// Configure series
let weather, currTemp, icon, windSpeed;
let apikey = "e00749a0da77a25b4785acbc639ea958";

polygonTemplate.events.on("over", function (ev) {
  let currCon = ev.target.dataItem.dataContext.name;
  getData(currCon);
});

// polygonTemplate.tooltipText = "{name}";

let arr;
function getData(currCon) {
  let result;
  arr = new Array();
  $.get(
    `https://localhost:44306/weatherglobeapi.ashx?method=getweatherbycity&name=${currCon}`,
    (response) => {
      if (response === "No City Found") {
        $("#countryInfo").html(`
          <h2>${currCon}: No Weather Found</h2>
      `);
      } else {
        let res = JSON.parse(response);
        result = res;
        weather = res.weather[0].description;
        console.log(res.main.temp);
        currTemp = Math.round(res.main.temp);
        windSpeed = res.wind.speed;
        // obj.currTemp = res.main.temp - 273.15;
        // obj.icon = res.weather[0].icon;
        // obj.weather = res.weather[0].description;
        // obj.windSpeed = res.wind.speed;

        arr.push(res.main.temp - 273.15);
        arr.push(res.weather[0].icon);
        arr.push(res.weather[0].description);
        arr.push(res.wind.speed);

        $("#countryInfo").html(`
      <h2>${currCon}: ${weather}</h2>
      <h5>Temp: ${String(currTemp).substring(0, 4)}%</h5>
      <h5>WindSpeeed: ${windSpeed}km/h</h5>   
      `);
        // <img src="http://openweathermap.org/img/wn/${icon}@2x.png"></img>;
      }
    }
  );

  return result;
}

polygonTemplate.adapter.add("tooltipText", function (text, target) {
  debugger;

  // console.log(data.name);
  let data = target.tooltipDataItem.dataContext;

  console.log(data);
  if (data.name != null) return `[bold]{name}[/]`;
  else return "Not Found";
});
// polygonTemplate.tooltipText = `[bold]{name}[/]
// Temp: {${String(currTemp).substring(0, 4)}%}
// wind Speed: {${windSpeed}km/h}
// {http://openweathermap.org/img/wn/${icon}@2x.png}`;

// polygonTemplate.events.on("over", function (ev) {
//   ev.target.series.chart.zoomToMapObject(ev.target, 1.2);
// });
console.log(polygonTemplate);
polygonTemplate.fill = am4core.color("#47cf73");
polygonTemplate.stroke = am4core.color("#000033");
polygonTemplate.strokeWidth = 0.6;

polygonTemplate.cursorOverStyle = am4core.MouseCursorStyle.pointer;

polygonTemplate.urlTarget = "_blank";

var graticuleSeries = chart.series.push(new am4maps.GraticuleSeries());

graticuleSeries.mapLines.template.line.stroke = am4core.color("#ffffff");
graticuleSeries.mapLines.template.line.strokeOpacity = 0.08;
graticuleSeries.fitExtent = false;

chart.backgroundSeries.mapPolygons.template.polygon.fillOpacity = 0.2;
chart.backgroundSeries.mapPolygons.template.polygon.fill =
  am4core.color("#ffffff");

var hs = polygonTemplate.states.create("hover");

hs.properties.fill = chart.colors.getIndex(0).brighten(6.5);

let animation;
setTimeout(function () {
  animation = chart.animate(
    { property: "deltaLongitude", to: 100000 },
    2000000
  );
}, 100);
// chart.seriesContainer.events.on("over", function () {
//   animation.stop();
// });
