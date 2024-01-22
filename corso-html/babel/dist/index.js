"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.riminiCityCoordinates = exports.getUserCoordinates = exports.getCityCoordinates = exports.firstCardWidth = void 0;
var _weekCard = require("./weekCard.js");
var _actuallyWeather = require("./actuallyWeather.js");
var firstCardWidth;
var searchInput = document.querySelector('.search-input');
var API_key = "3b23162ae4aa8318af8c3f9f09cc742e"; // API Keys for OpenWeatherMap

var getWeatherDetails = function getWeatherDetails(name, lat, lon) {
  var WEATHER_API_URL = "https://api.openweathermap.org/data/2.5/forecast?lat=".concat(lat, "&lon=").concat(lon, "&appid=").concat(API_key);
  fetch(WEATHER_API_URL).then(function (res) {
    return res.json();
  }).then(function (data) {
    //Filter the forecast to get only one forecast per day
    var uniqueForecastDays = [];
    var fiveDaysForecast = data.list.filter(function (forecast) {
      var forecastDate = new Date(forecast.dt_txt).getDate();
      if (!uniqueForecastDays.includes(forecastDate)) {
        return uniqueForecastDays.push(forecastDate);
      }
    });
    document.querySelector(".weather-cards").innerHTML = '';
    fiveDaysForecast.forEach(function (weatherItem, index) {
      if (index === 0) (0, _actuallyWeather.setActuallyWeather)(weatherItem, name);else (0, _weekCard.createdCard)(weatherItem);
    });
    exports.firstCardWidth = firstCardWidth = document.querySelector('.card').offsetWidth + 12;
  })["catch"](function () {
    alert("An error occurred while fetching the weather forecast!");
  });
};
var getCityCoordinates = exports.getCityCoordinates = function getCityCoordinates() {
  var cityName = searchInput.value.trim(); // Get user entered city name and remove extra spaces
  if (!cityName) return; // Return if cityName is empty
  var GEOCODING_API_URL = "https://api.openweathermap.org/geo/1.0/direct?q=".concat(cityName, "&limit=1&appid=").concat(API_key);
  searchInput.value = '';
  // Get entered city coordinates (latitude, longitude and name) from the api response
  fetch(GEOCODING_API_URL).then(function (res) {
    return res.json();
  }).then(function (data) {
    if (!data.length) return alert("No coordinates found for ".concat(cityName));
    var _data$ = data[0],
      name = _data$.name,
      lat = _data$.lat,
      lon = _data$.lon;
    getWeatherDetails(name, lat, lon);
  })["catch"](function () {
    alert('An error occured while fetching the coordinates!');
  });
};
var riminiCityCoordinates = exports.riminiCityCoordinates = function riminiCityCoordinates() {
  var GEOCODING_API_URL = "https://api.openweathermap.org/geo/1.0/direct?q=Rimini&limit=1&appid=".concat(API_key);
  searchInput.value = '';
  fetch(GEOCODING_API_URL).then(function (res) {
    return res.json();
  }).then(function (data) {
    var _data$2 = data[0],
      name = _data$2.name,
      lat = _data$2.lat,
      lon = _data$2.lon;
    getWeatherDetails(name, lat, lon);
  })["catch"](function () {
    alert('An error occured while fetching the coordinates!');
  });
};
var getUserCoordinates = exports.getUserCoordinates = function getUserCoordinates() {
  navigator.geolocation.getCurrentPosition(function (position) {
    var _position$coords = position.coords,
      latitude = _position$coords.latitude,
      longitude = _position$coords.longitude; // Get coordinates of user location
    var REVERSE_GEOCODING_URL = "https://api.openweathermap.org/geo/1.0/reverse?lat=".concat(latitude, "&lon=").concat(longitude, "&limit=1&appid=").concat(API_key);

    //Get city name from coordinates using reverse geoconding API
    fetch(REVERSE_GEOCODING_URL).then(function (res) {
      return res.json();
    }).then(function (data) {
      var name = data[0].name;
      getWeatherDetails(name, latitude, longitude);
    })["catch"](function () {
      alert('An error occured while fetching the coordinates!');
    });
  }, function (error) {
    // Show alert if user denied the location permission
    if (error.code === error.PERMISSION_DENIED) {
      alert("Geolocation request denied. Please reset location permissed to grant access again.");
    }
  });
};