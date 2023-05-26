const apiKey = "03fd001dd5bcdbe7949116fb3c9658ff"
const searchForm = document.getElementById('sbtbutton');
var cityInput = document.getElementById('city-input');
const currentWeatherContainer = document.getElementById('current-weather');
const forecastContainer = document.getElementById('forecast');
const searchHistoryContainer = document.getElementById('search-history');
var forecastheading = document.getElementById("five-day");
var cityNames = JSON.parse(localStorage.getItem("citynames")) || [];

searchForm.addEventListener('click', handleFormSubmit);
searchHistoryContainer.addEventListener('click', handleSearchHistoryClick);

function handleFormSubmit(event) {
    event.preventDefault();
    var city = cityInput.value;

    // console.log(city);
    // localStorage.setItem('cityNames', JSON.stringify(city)) || [];
    if (city) {
      getWeatherData(city);
      cityInput.value = '';
    }
  }

  function displayPreviousSearches() {
    var searchDiv = document.getElementById("prev-searches");
    searchDiv.classList.add('forecast-day');
    searchDiv.innerHTML = cityInput;
  }

  function handleSearchHistoryClick(event) {
    const clickedCity = event.target.innerText;
    getWeatherData(clickedCity);
  }

function getWeatherData(city) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`)
      .then(response => response.json())
      .then(data => {
        // console.log(data);
        cityInput = data.city.name;
        cityNames.push(city);
        localStorage.setItem("cityNames", JSON.stringify(cityNames));
        displayCurrentWeather(data.list[0]);
        displayForecast(data.list);
        addSearchHistory(city);
      })
      .catch(error => {
        console.log('Error:', error);
      });
  }

  function displayCurrentWeather(currentWeather) {
    currentWeatherContainer.innerHTML = '';
    const icon = currentWeather.weather[0].icon; 
    currentWeatherContainer.innerHTML = `
      <h2>${cityInput} Date: ${currentWeather.dt_txt.split(' ')[0]} <img src="http://openweathermap.org/img/w/${icon}.png" alt="Weather Icon"></h2>
      <p>Temperature: ${currentWeather.main.temp}°F</p>
      <p>Humidity: ${currentWeather.main.humidity}%</p>
      <p>Wind Speed: ${currentWeather.wind.speed} m/s</p>
    `;
  }
  
  function displayForecast(forecastData) {
    forecastheading.innerHTML = "5-Day Forecast: ";
    forecastContainer.innerHTML = '';
    
    for (let i = 0; i < forecastData.length; i += 8) {
      const forecast = forecastData[i];
      const date = forecast.dt_txt.split(' ')[0];
      const icon = forecast.weather[0].icon;
      const temperature = forecast.main.temp;
      const windSpeed = forecast.wind.speed;
      const humidity = forecast.main.humidity;
  
      const forecastDay = document.createElement('div');
      forecastDay.classList.add('forecast-day');
      forecastDay.innerHTML = `
        <h3>${date}</h3>
        <img src="http://openweathermap.org/img/w/${icon}.png" alt="Weather Icon">
        <p>Temperature: ${temperature}°F</p>
        <p>Wind Speed: ${windSpeed} mph</p>
        <p>Humidity: ${humidity}%</p>
      `;
  
      forecastContainer.appendChild(forecastDay);
    }
    function addSearchHistory(city) {
      const listItem = document.createElement("li");
      listItem.innerText = city;
      searchHistoryContainer.appendChild(listItem);
      cityNames.push(city);
    }
  }



//   To Do:
//   --Current Wheather at top isn't displaying properly
//   --Need to add localStorage for searched cites;
//   --LAST: change it so layout changes when button ispressed(cities are on left)