const searchButton = document.querySelector(".search-btn");
const locationButton = document.querySelector(".location-btn");
const cityInput = document.querySelector(".city-input");
const currentWeatherDIV = document.querySelector(".current-weather");
const weathercardsDIV = document.querySelector(".weather-card");
const API_key = "ceeda7fc93f6dd7ea0c7f78c23ffea2f";


const getCityCoordinates = () => {
    const cityName = cityInput.value.trim();
    if (!cityName) return;

    const createWeatherCard = (cityName, weatherItem, index) => {
        if (index === 0) {
            return `<div class="detail">
                        <h2>${cityName} (${weatherItem.dt_txt.split(" ")[0]})</h2>
                        <h4>Temperature: ${(weatherItem.main.temp - 273.15).toFixed(2)}</h4>
                        <h4>Wind: ${weatherItem.wind.speed} m/s</h4>
                        <h4>Humidity: ${weatherItem.main.humidity}%</h4>
                    </div>
                    <div class="icon">
                        <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-icon">
                        <h4>${weatherItem.weather[0].description}</h4>
                    </div>`;
        } else {
            return `<li class="cards">
                        <h3>(${weatherItem.dt_txt.split(" ")[0]})</h3>
                        <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="weather-icon">
                        <h4>Temp: ${(weatherItem.main.temp - 273.15).toFixed(2)}</h4>
                        <h4>Wind: ${weatherItem.wind.speed} m/s</h4>
                        <h4>Humidity: ${weatherItem.main.humidity}%</h4>
                    </li>`;
        }
    };

    const getweatherDetail = (cityName, lat, lon) => {
        const Weather_url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_key}`;
        fetch(Weather_url).then(res => res.json()).then(data => {
            const uniqueForecastDays = [];
            const fivedayForeCast = data.list.filter(forecast => {
                const forcastDate = new Date(forecast.dt_txt).getDate();
                if (!uniqueForecastDays.includes(forcastDate)) {
                    return uniqueForecastDays.push(forcastDate);
                }
            });
            cityInput.value = "";
            currentWeatherDIV.innerHTML = "";
            weathercardsDIV.innerHTML = "";
            fivedayForeCast.forEach((weatherItem, index) => {
                if (index == 0) {
                    currentWeatherDIV.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherItem, index));
                } else {
                    weathercardsDIV.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherItem, index));
                }
            });
        }).catch(() => {
            alert("An error occured while fetching the weather forecast!");
        });
    };

    const geourl = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=${API_key}`;
    fetch(geourl).then(res => res.json()).then(data => {
        if (!data.length) return alert(`No coordinates found on ${cityName}`);
        const { name, lat, lon } = data[0];
        getweatherDetail(name, lat, lon);
    }).catch(() => {
        alert("An error occured while fetching the coordinates!");
    });
};

const getUserCoordinates = () => {
    navigator.geolocation.getCurrentPosition(
        position => {
            const { latitude, longitude } = position.coords;
            const reverse_geocoding_url = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_key}`;
            fetch(reverse_geocoding_url).then(res => res.json()).then(data => {
                if (!data.length) return alert(`No coordinates found!`);
                const { name, lat, lon } = data[0];
                getweatherDetail(name, latitude, longitude);
            }).catch(() => {
                alert("An error occured while fetching the city!");
            });
        },
        error => {
            if (error.code === error.PERMISSION_DENIED) {
                alert("Geolocation request denied. Please reset location permission to grant access again.");
            }
        }
    );
};

locationButton.addEventListener("click", getUserCoordinates);
searchButton.addEventListener("click", getCityCoordinates);
cityInput.addEventListener("keyup", e => e.key === "Enter" && getCityCoordinates());

