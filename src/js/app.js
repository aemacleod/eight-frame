var Clay = require('pebble-clay');
var clayConfig = require('./config');
var clay = new Clay(clayConfig, null, { autoHandleEvents: false });

Pebble.addEventListener('showConfiguration', function(e) {
  Pebble.openURL(clay.generateUrl());
});

Pebble.addEventListener('webviewclosed', function(e) {
  if (e && !e.response) {
    return;
  }

  // Get the keys and values from each config item
  var dict = clay.getSettings(e.response);

  // Send settings values to watch side
  Pebble.sendAppMessage(dict, function(e) {
    console.log('Sent config data to Pebble');
  }, function(e) {
    console.log('Failed to send config data!');
    console.log(JSON.stringify(e));
  });

  // Retrieve and store Forecast.io API key
  var messageKeys = require('message_keys');
  var ApiKeyForecast = dict[messageKeys.API_KEY_FORECAST];
  localStorage.setItem('StoredApiKeyForecast', ApiKeyForecast);
});


var xhrRequest = function (url, type, callback) {
  var xhr = new XMLHttpRequest();
  xhr.onload = function () {
    callback(this.responseText);
  };
  xhr.open(type, url);
  xhr.send();
};


function locationSuccess(pos) {
  // Access API Key
  var ApiKeyForecast = localStorage.getItem('StoredApiKeyForecast');
  console.log('API key accessed is ' + ApiKeyForecast);

  // Construct URL for weather 
  var url = 'https://api.forecast.io/forecast/' + ApiKeyForecast +
      '/' + pos.coords.latitude + ',' + pos.coords.longitude + '?exclude=minutely,hourly,alerts,flags';
  console.log('URL entered is ' + url);

  // Request weather data
  xhrRequest(url, 'GET', 
    function(responseText) {
      // responseText contains a JSON object with weather info
      var json = JSON.parse(responseText);

      // Assemble weather items into variables
      var temperature = json.currently.temperature;
      var conditions = json.currently.icon;
      var min = json.daily.data[0].temperatureMin;
      var max = json.daily.data[0].temperatureMax;
      var windSpeed = json.currently.windSpeed;
      var windDirection = (json.currently.windBearing)*100;
      var precipProbability = (json.daily.data[0].precipProbability)*100;
      var precipMax = (json.daily.data[0].precipIntensityMax)*1000;



// OpenWeatherMap code, commented out until time to add multiple weather options
// Construct URL for weather data, add modifier for Imperial units
//   var url = 'http://api.openweathermap.org/data/2.5/weather?lat=' +
//       pos.coords.latitude + '&lon=' + pos.coords.longitude + '&appid=' + openWeatherAPIKey +
//         '&units=imperial';

  // Request weather data
//   xhrRequest(url, 'GET', 
//     function(responseText) {
      // responseText contains a JSON object with weather info
//       var json = JSON.parse(responseText);
// 
      // Assemble weather items into variables
//       var temperature = json.main.temp;
//       console.log('Temperature is ' + temperature);
//       var conditions = json.weather[0].main;      
//       console.log('Conditions are ' + conditions);

      // Assemble dictionary using keys
      var dictionary = {
          'TEMPERATURE': temperature,
          'CONDITIONS': conditions,
          'MIN': min,
          'MAX': max,
          'WIND_SPEED': windSpeed,
          'WIND_DIRECTION': windDirection,
          'PRECIP_PROBABILITY': precipProbability,
          'PRECIP_MAX': precipMax
      };
      
     // Send to Pebble
     Pebble.sendAppMessage(dictionary,
        function(e) {
          console.log('Weather info sent to Pebble successfully!');
        },
        function(e) {
          console.log('Error sending weather info to Pebble!');
        }
       );
    }
  );
}


function locationError(err) {
  console.log('Error requesting location!');
}


function getWeather() {
  navigator.geolocation.getCurrentPosition(
    locationSuccess,
    locationError,
    {timeout: 15000, maximumAge: 60000}
  );
}


// Listen for when the watchface is opened
Pebble.addEventListener('ready', 
  function(e) {
    console.log('PebbleKit JS ready!');
    
    // Get the initial weather
    getWeather();
  }
);

// Listen for when an AppMessage is received
Pebble.addEventListener('appmessage',
  function(e) {
    console.log('AppMessage received!');
    getWeather();
  }
);