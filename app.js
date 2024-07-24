// app.js

const apiKey = 'YOUR_API_KEY'; // Replace with your OpenWeatherMap API key

document.getElementById('get-weather').addEventListener('click', getWeather);
document.getElementById('detect-location').addEventListener('click', detectLocation);

async function getWeather() {
    const location = document.getElementById('location').value;
    if (location) {
        const weatherData = await fetchWeatherData(location);
        displayWeatherData(weatherData);
    } else {
        alert('Please enter a location.');
    }
}

async function detectLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            const weatherData = await fetchWeatherDataByCoords(latitude, longitude);
            displayWeatherData(weatherData);
        });
    } else {
        alert('Geolocation is not supported by this browser.');
    }
}

async function fetchWeatherData(location) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=metric`);
    const data = await response.json();
    return data;
}

async function fetchWeatherDataByCoords(latitude, longitude) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`);
    const data = await response.json();
    return data;
}

function displayWeatherData(data) {
    const weatherInfo = document.getElementById('weather-info');
    weatherInfo.innerHTML = '';

    if (data.cod === '200') {
        const city = data.city.name;
        const country = data.city.country;
        const forecastList = data.list;

        forecastList.forEach((forecast, index) => {
            if (index % 8 === 0) {
                const date = new Date(forecast.dt * 1000);
                const temp = forecast.main.temp;
                const description = forecast.weather[0].description;
                const humidity = forecast.main.humidity;

                const weatherDay = document.createElement('div');
                weatherDay.classList.add('weather-day');

                weatherDay.innerHTML = `
                    <h3>${city}, ${country}</h3>
                    <p>${date.toDateString()}</p>
                    <p>Temperature: ${temp} °C</p>
                    <p>Description: ${description}</p>
                    <p>Humidity: ${humidity}%</p>
                `;

                weatherInfo.appendChild(weatherDay);
            }
        });
    } else {
        weatherInfo.innerHTML = '<p>Location not found. Please try again.</p>';
    }
}
