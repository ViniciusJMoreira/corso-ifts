import { createdCard } from "./weekCard.js";
import { setActuallyWeather } from "./actuallyWeather.js";
export { firstCardWidth }


let firstCardWidth;
const searchInput = document.querySelector('.search-input');
const API_key = "3b23162ae4aa8318af8c3f9f09cc742e"; // API Keys for OpenWeatherMap

const getWeatherDetails = (name, lat, lon) => {
  const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_key}`;

  fetch(WEATHER_API_URL).then(res => res.json()).then(data => {
    //Filter the forecast to get only one forecast per day
    const uniqueForecastDays = [];
    const fiveDaysForecast = data.list.filter(forecast => {
      const forecastDate = new Date(forecast.dt_txt).getDate();
      if(!uniqueForecastDays.includes(forecastDate)) {
        return uniqueForecastDays.push(forecastDate);
      }
    });
    document.querySelector(".weather-cards").innerHTML = '';
    fiveDaysForecast.forEach((weatherItem, index) => {
      if(index === 0) setActuallyWeather(weatherItem, name);
      else createdCard(weatherItem);
    });
    firstCardWidth = document.querySelector('.card').offsetWidth + 12;
  }).catch(() => {
    alert("An error occurred while fetching the weather forecast!");
  })
};

const getCityCoordinates = () => {
  const cityName = searchInput.value.trim(); // Get user entered city name and remove extra spaces
  if(!cityName) return; // Return if cityName is empty
  const GEOCODING_API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_key}`;

  searchInput.value = '';
  // Get entered city coordinates (latitude, longitude and name) from the api response
  fetch(GEOCODING_API_URL).then(res => res.json()).then(data => {
    if(!data.length) return alert(`No coordinates found for ${cityName}`);
    const { name, lat, lon } = data[0];
    getWeatherDetails(name, lat, lon);
  }).catch(() => {
    alert('An error occured while fetching the coordinates!');
  });
}

const riminiCityCoordinates = () => {
  const GEOCODING_API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=Rimini&limit=1&appid=${API_key}`;

  searchInput.value = '';
  fetch(GEOCODING_API_URL).then(res => res.json()).then(data => {
    const { name, lat, lon } = data[0];
    getWeatherDetails(name, lat, lon);
  }).catch(() => {
    alert('An error occured while fetching the coordinates!');
  });
}

const getUserCoordinates = () => {
  navigator.geolocation.getCurrentPosition(
    position => {
      const { latitude ,longitude } = position.coords;// Get coordinates of user location
      const REVERSE_GEOCODING_URL = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_key}`;

      //Get city name from coordinates using reverse geoconding API
      fetch(REVERSE_GEOCODING_URL).then(res => res.json()).then(data => {
        const { name } = data[0];
        getWeatherDetails(name, latitude, longitude);
      }).catch(() => {
        alert('An error occured while fetching the coordinates!');
      });

    },
    error => { // Show alert if user denied the location permission
      if(error.code === error.PERMISSION_DENIED) {
        alert("Geolocation request denied. Please reset location permissed to grant access again.");
      }
    }
  );
}

export { getCityCoordinates, getUserCoordinates, riminiCityCoordinates }