var Clay = require('pebble-clay');
var clayConfig = require('./config');
var clay = new Clay(clayConfig, null, {
    autoHandleEvents: false
});

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

    // Retrieve and store Dark Sky API key and units
    var messageKeys = require('message_keys');
    var ApiKeyDarkSky = dict[messageKeys.API_KEY_DARK_SKY];
    localStorage.setItem('StoredApiKeyDarkSky', ApiKeyDarkSky);
    var UnitsDarkSky = dict[messageKeys.UNITS_DARK_SKY];
    console.log('Units requested are ' + UnitsDarkSky);
    localStorage.setItem('StoredUnitsDarkSky', UnitsDarkSky);
});


var xhrRequest = function(url, type, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
        callback(this.responseText);
    };
    xhr.open(type, url);
    xhr.send();
};


function locationSuccess(pos) {
    // Access API Key and units
    var ApiKeyDarkSky = localStorage.getItem('StoredApiKeyDarkSky');
    var UnitsDarkSky = localStorage.getItem('StoredUnitsDarkSky');

    // Construct URL for weather
    var url = 'https://api.forecast.io/forecast/' + ApiKeyDarkSky +
        '/' + pos.coords.latitude + ',' + pos.coords.longitude + '?units=' + UnitsDarkSky +
        '&exclude=minutely,hourly,alerts,flags';
    console.log('URL entered is ' + url);

    // Request weather data
    xhrRequest(url, 'GET',
        function(responseText) {
            // responseText contains a JSON object with weather info
            var json = JSON.parse(responseText);

            // Assemble weather items into variables
            var temperature = Math.round(json.currently.temperature) + '°';
            var conditions = json.currently.icon;
            var weatherIcon;
            switch (conditions) {
                case 'clear-day':
                    weatherIcon = 'A';
                    break;
                case 'clear-night':
                    weatherIcon = 'I';
                    break;
                case 'rain':
                    weatherIcon = 'R';
                    break;
                case 'snow':
                    weatherIcon = 'W';
                    break;
                case 'sleet':
                    weatherIcon = 'S';
                    break;
                case 'wind':
                    weatherIcon = 'a';
                    break;
                case 'fog':
                    weatherIcon = 'G';
                    break;
                case 'cloudy':
                    weatherIcon = 'P';
                    break;
                case 'partly-cloudy-day':
                    weatherIcon = 'C';
                    break;
                case 'partly-cloudy-night':
                    weatherIcon = 'J';
                    break;
                default:
                    weatherIcon = 'p';
                    break;
            }
            var maxMin = Math.round(json.daily.data[0].temperatureMax) + '/' +
                Math.round(json.daily.data[0].temperatureMin);

            var windSpeed = Math.round(json.currently.windSpeed);
            var windBearingNumber = (json.currently.windBearing) * 100;
            var windBearingAbbreviation;
            if (0 <= windBearingNumber && windBearingNumber <= 1125) {
                windBearingAbbreviation = 'n';
            } else if (1125 < windBearingNumber && windBearingNumber <= 3375) {
                windBearingAbbreviation = 'nne';
            } else if (3375 < windBearingNumber && windBearingNumber <= 5625) {
                windBearingAbbreviation = 'ne';
            } else if (5625 < windBearingNumber && windBearingNumber <= 7875) {
                windBearingAbbreviation = 'ene';
            } else if (7875 < windBearingNumber && windBearingNumber <= 10125) {
                windBearingAbbreviation = 'e';
            } else if (10125 < windBearingNumber && windBearingNumber <= 12375) {
                windBearingAbbreviation = 'ese';
            } else if (12375 < windBearingNumber && windBearingNumber <= 14625) {
                windBearingAbbreviation = 'se';
            } else if (14625 < windBearingNumber && windBearingNumber <= 16875) {
                windBearingAbbreviation = 'sse';
            } else if (16875 < windBearingNumber && windBearingNumber <= 19125) {
                windBearingAbbreviation = 's';
            } else if (19125 < windBearingNumber && windBearingNumber <= 21375) {
                windBearingAbbreviation = 'ssw';
            } else if (21375 < windBearingNumber && windBearingNumber <= 23625) {
                windBearingAbbreviation = 'sw';
            } else if (23625 < windBearingNumber && windBearingNumber <= 25875) {
                windBearingAbbreviation = 'wsw';
            } else if (25875 < windBearingNumber && windBearingNumber <= 28125) {
                windBearingAbbreviation = 'w';
            } else if (28125 < windBearingNumber && windBearingNumber <= 30375) {
                windBearingAbbreviation = 'wnw';
            } else if (30375 < windBearingNumber && windBearingNumber <= 32625) {
                windBearingAbbreviation = 'nw';
            } else if (32625 < windBearingNumber && windBearingNumber <= 34875) {
                windBearingAbbreviation = 'nnw';
            } else if (34875 < windBearingNumber && windBearingNumber <= 36000) {
                windBearingAbbreviation = 'n';
            } else {
                windBearingAbbreviation = '?';
            }
            var windGauge = windSpeed + windBearingAbbreviation;

            var precipProbability = Math.round((json.daily.data[0].precipProbability) * 100);
            var precipMax = json.daily.data[0].precipIntensityMax;
            var precipIntensity;
            if (UnitsDarkSky == 'us') {
                if (0 <= precipMax && precipMax <= .005) {
                    precipIntensity = '.';
                } else if (.005 < precipMax && precipMax <= .035) {
                    precipIntensity = '!';
                } else if (.035 < precipMax && precipMax <= .110) {
                    precipIntensity = '!!';
                } else if (.110 < precipMax) {
                    precipIntensity = '!!!';
                } else {
                    precipIntensity = '?';
                }
            } else {
                if (0 <= precipMax && precipMax <= .127) {
                    precipIntensity = '.';
                } else if (.127 < precipMax && precipMax <= .889) {
                    precipIntensity = '!';
                } else if (.889 < precipMax && precipMax <= 2.794) {
                    precipIntensity = '!!';
                } else if (2.794 < precipMax) {
                    precipIntensity = '!!!';
                } else {
                    precipIntensity = '?';
                }
            }
            var precipGauge = precipProbability + precipIntensity;

            var relativeHumidity = ((json.currently.humidity) * 100) + '%rh';

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
                'WEATHER_ICON': weatherIcon,
                'MAX_MIN': maxMin,
                'WIND_GAUGE': windGauge,
                'PRECIP_GAUGE': precipGauge,
                'HUMIDITY': relativeHumidity
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
        locationError, {
            timeout: 15000,
            maximumAge: 60000
        }
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
