const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-button");
const weatherCardsDiv = document.querySelector(".weather-cards");
const currentWeatherDiv = document.querySelector(".current-weather");
const locationbtn = document.querySelector(".location-button");

const API_KEY = "424e693098e98397588d5f8b341fa18e";

const createWeatherCard = (cityName, WeatherItem, index) =>{

    if(index === 0){

        return `<div class="details">
        <h2>${cityName} (${WeatherItem.dt_txt.split(" ")[0]})</h2>
        <h4>Temperature : ${(WeatherItem.main.temp - 273.15).toFixed(2)}°C</h4>
        <h4>Wind : ${WeatherItem.wind.speed} M/S</h4>
        <h4>Humidity : ${WeatherItem.main.humidity}%</h4>
    </div>
    <div class="icon">
    <img src="https://openweathermap.org/img/wn/${WeatherItem.weather[0].icon}@4x.png" alt="Weather-icon">
        <h4>${WeatherItem.weather[0].description}</h4>
    </div>`

    }
    else {
        return`<li class="cards">
        <h3>(${WeatherItem.dt_txt.split(" ")[0]})</h3>
        <img src="https://openweathermap.org/img/wn/${WeatherItem.weather[0].icon}@2x.png" alt="Weather-icon">
        <h4>Temperature : ${(WeatherItem.main.temp - 273.15).toFixed(2)}°C</h4>
        <h4>Wind : ${WeatherItem.wind.speed} M/S</h4>
        <h4>Humidity : ${WeatherItem.main.humidity}%</h4>
    </li>`;
    }

}

const getWeatherDetails = (cityName, lat, lon) => {
    const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

    fetch(WEATHER_API_URL).then(res => res.json()).then(data => {

        const uniqueForecastDays = [];
        const fiveDaysForecast = data.list.filter(forecast => {
            const forecastDate = new Date(forecast.dt_txt).getDate();
            if(!uniqueForecastDays.includes(forecastDate)){
                return uniqueForecastDays.push(forecastDate);
            }
        });

        cityInput.value = "";
        weatherCardsDiv.innerHTML = "";
        currentWeatherDiv.innerHTML = "";
        

        fiveDaysForecast.forEach((WeatherItem , index) => {
            if(index === 0){
                currentWeatherDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityName, WeatherItem, index));
            }
            else{
                weatherCardsDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityName, WeatherItem, index));
            }
        });

    }).catch(() => {
        alert("An error occured while fetching the data");
    });
}

const getCityCoordinates = () =>{
    const cityName = cityInput.value.trim();

    if(!cityName) return;

    const GEO_CODING_API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;

    fetch(GEO_CODING_API_URL).then(res => res.json()).then(data => {
        if(!data.length) return alert(`No coordinates found for ${cityName}`);
        const { name, lat, lon } = data[0];
        getWeatherDetails(name, lat, lon);
    }).catch(() => {
        alert("An error occured while fetching the data");
    });
}

const getUserCoordinates = () => {
    navigator.geolocation.getCurrentPosition(
        position =>{
            const { latitude, longitude } = position.coords;
            const REVERSE_GEOCODING_URL = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`;
            fetch(REVERSE_GEOCODING_URL).then(res => res.json()).then(data => {
                const { name } = data[0];
                getWeatherDetails(name, latitude, longitude);
            }).catch(() => {
                alert("An error occured while fetching the city!");
            });
        },
        error =>{
            if(error.code === error.PERMISSION_DENIED){
                alert("Geolocation Permission denied please reset the location")
            }
        }
    );
}

locationbtn.addEventListener("click" ,getUserCoordinates);
searchButton.addEventListener("click" ,getCityCoordinates);
cityInput.addEventListener("keyup", e => e.key === "Enter" && getCityCoordinates());