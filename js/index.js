// OpenWeatherMap won't work if the protocol is https
// it has to be http in order to get data from it
// it can be solved by using a remote CORS server
// but I found them to be down a lot, so I opted
// for this solution
/* if (window.location.protocol === "https:") {
  $(".container-fluid").html("Please replace the https in the address bar url to http. Thank you :)")
}; */
// However, github doesn't allow the user to change protocol to http
// so I am using CORS server here afterall

$(document).ready(function() {
  $("img").addClass("img-responsive");
  // set font size, so that all of weather data fits on
  // the page without vertical scrolling
  // regardless of the screen height
  var fontSize = Math.floor(window.innerHeight / 29);
  $("body").css("font-size", fontSize)
    // Get location data geoip-bg api
  $.getJSON("https://geoip-db.com/json/geoip.php?jsonp=?", function(locationData) {
    // display location
    var city = locationData.city;
    var country = locationData.country_code;
    var loc = city + ", " + country;
    $("#location").html(loc);

    // Get weather data  from openweathermap.org
    var apiUrl = "https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/weather?q=" + city + "," + country + "&APPID=7cd7a2135a314e01b121bf6e69c6e4a8";

    $.getJSON(apiUrl, function(weatherData) {

      // set time of day to d or n
      var timeOfDay = weatherData.weather[0].icon[2];
      // change background sky color if night
      if (timeOfDay === "n") {
        $("body").css("background-color", "#122750");
      };
      // Place appropriate weather icon
      // Weather icons by gnokii - https://openclipart.org/user-detail/gnokii 
      var weatherImg = "";
      var iconHeight = Math.floor(window.innerHeight / 3);
      switch (weatherData.weather[0].icon) {
        case "01d":
          weatherImg = '<img class="img-responsive center-block" src="https://openclipart.org/image/' + iconHeight + 'px/svg_to_png/170678/sunny.png&disposition=attachment" alt="weather icon - sunny"/>';
          break;
        case "01n":
          weatherImg = '<img class="img-responsive center-block" src="https://openclipart.org/image/' + iconHeight + 'px/svg_to_png/170669/full-moon.png&disposition=attachment" alt="weather icon - full moon"/>';
          break;
        case "02n":
        case "02d":
          weatherImg = '<img class="img-responsive center-block" src="https://openclipart.org/image/' + iconHeight + 'px/svg_to_png/170679/sunny-to-cloudy.png&disposition=attachment" alt="weather icon - sunny to cloudy"/>';
          break;
        case "03n":
        case "03d":
          weatherImg = '<img class="img-responsive center-block" src="https://openclipart.org/image/' + iconHeight + 'px/svg_to_png/170664/1339686466.png&disposition=attachment" alt="weather icon - cloudy"/>';
          break;
        case "04n":
        case "04d":
          weatherImg = '<img class="img-responsive center-block" src="https://openclipart.org/image/' + iconHeight + 'px/svg_to_png/170674/overcast.png&disposition=attachment" alt="weather icon - overcast"/>';
          break;
        case "09d":
          weatherImg = '<img class="img-responsive center-block" src="https://openclipart.org/image/' + iconHeight + 'px/svg_to_png/170680/sun-rain.png&disposition=attachment" alt="weather icon - sun rain"/>';
          break;
        case "09n":
        case "10n":
        case "10d":
          weatherImg = '<img class="img-responsive center-block" src="https://openclipart.org/image/' + iconHeight + 'px/svg_to_png/170675/showers.png&disposition=attachment" alt="weather icon - showers"/>';
          break;
        case "11n":
        case "11d":
          weatherImg = '<img class="img-responsive center-block" src="https://openclipart.org/image/' + iconHeight + 'px/svg_to_png/170681/thunder.png&disposition=attachment" alt="weather icon - thunder"/>';
          break;
        case "13n":
        case "13d":
          weatherImg = '<img class="img-responsive center-block" src="https://openclipart.org/image/' + iconHeight + 'px/svg_to_png/170676/snowy.png&disposition=attachment" alt="weather icon - snowy"/>';
          break;
        case "50n":
        case "50d":
          weatherImg = '<img class="img-responsive center-block" src="https://openclipart.org/image/' + iconHeight + 'px/svg_to_png/170667/fog.png&disposition=attachment" alt="weather icon - fog"/>';
          break;
      }
      $("#weatherIcon").html(weatherImg);
      // Determine if country uses Celsius           
      var usesC = function(country) {
        // Array of countries using Fahrenheit
        var fahrenheitCountries = ["BS", "BZ", "KY", "PW", "US", "PR", "GU", "VI"];
        return fahrenheitCountries.indexOf(country) === -1;
      };
      // Convert temperature from kelvin to F and C
      var tempF = Math.floor((weatherData.main.temp - 273.15) * 9 / 5 + 32) + "F";
      var tempC = Math.floor(weatherData.main.temp - 273.15) + "C";
      // convert wind speed to mph and m/s
      var mph = Math.floor(weatherData.wind.speed / 0.44704 * 10) / 10 + " mph";
      var ms = weatherData.wind.speed + " m/s"
        //setting temperature, wind speed and temperature unit buttons        
        // stc-- set temperature in celsius
        // paired with wind in m/s
      function stc() {
        $("#temperature").html(tempC); //adds temperature
        $("#wind").html(ms); // adds wind speed
        $("#switchToC").addClass("disabled"); //disables C button
        $("#switchToC").css("cursor", "default");
        $("#switchToC").removeAttr("title");
      }
      // stf-- set temperature in fahrenheit
      // paired with wind in mph
      function stf() {
        $("#temperature").html(tempF); //adds temperature
        $("#wind").html(mph); // adds wind speed
        $("#switchToF").addClass("disabled"); //disables F button
        $("#switchToF").css("cursor", "default");
        $("#switchToF").removeAttr("title");
      }
      // print temperature, temperature unit buttons, wind speed
      if (usesC(country)) {
        stc();
      } else {
        stf();
      }
      // Switch to F by clicking button         
      $("#switchToF").on("click", function() {
        stf();
        $("#switchToC").attr("title", "Switch to Celsius");
        $("#switchToC").removeClass("disabled");
      });
      // Switch to C by clicking button         
      $("#switchToC").on("click", function() {
        stc();
        $("#switchToF").attr("title", "Switch to Fahrenheit");
        $("#switchToF").removeClass("disabled");
      });
      // Add weather description
      $("#weatherDescription").html(weatherData.weather[0].main);

      // Add wind illustration icon if wind speed is greater than 13 m/s         
      if (weatherData.wind.speed > 13) {
        windImg = '<img class="img-responsive center-block"  src="https://openclipart.org/image/' + iconHeight + 'px/svg_to_png/170683/windy.png&disposition=attachment" alt="weather icon - windy"/>';
        $("#windIcon").html(windImg);
      }
      // print humidity data
      $("#humidity").html(weatherData.main.humidity);

    });
  });

}); // End of $(document).ready()
