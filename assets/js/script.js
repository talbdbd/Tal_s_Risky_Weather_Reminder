const apiKey = 'cf27ad07c5cd4764d1c6690c7643dd71';

const cityForm = document.getElementById('city-form');
const cityInput = document.getElementById('city-input');
const searchHistory = document.getElementById('search-history');
const currentWeather = document.getElementById('current-weather');
const forecast = document.getElementById('forecast');

cityForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const cityName = cityInput.value.trim();
    if (cityName) {
        getWeather(cityName);
        cityInput.value = '';
    }
});

async function getWeather(city) {
    const currentWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;

    try {
        const [currentResponse, forecastResponse] = await Promise.all([
            fetch(currentWeatherURL),
            fetch(forecastURL)
        ]);

        if (!currentResponse.ok || !forecastResponse.ok) {
            throw new Error('City not found');
        }

        const currentData = await currentResponse.json();
        const forecastData = await forecastResponse.json();

        displayWeather(currentData, forecastData);
        addToHistory(city);
    } catch (error) {
        console.error('Error fetching data:', error);
        alert('City not found. Please enter a valid city name.');
    }
}

function displayWeather(currentData, forecastData) {
    currentWeather.innerHTML = `
        <div class="card">
            <h2>${currentData.name}</h2>
            <p>${new Date().toLocaleDateString()}</p>
            <img src="http://openweathermap.org/img/wn/${currentData.weather[0].icon}.png" alt="${currentData.weather[0].description}">
            <p>Temperature: ${currentData.main.temp} °C</p>
            <p>Humidity: ${currentData.main.humidity}%</p>
            <p>Wind Speed: ${currentData.wind.speed} m/s</p>
        </div>
    `;

    forecast.innerHTML = '';
    for (let i = 0; i < forecastData.list.length; i += 8) {
        const forecastItem = forecastData.list[i];
        const date = new Date(forecastItem.dt * 1000).toLocaleDateString();
        const icon = forecastItem.weather[0].icon;
        const temp = forecastItem.main.temp;
        const wind = forecastItem.wind.speed;
        const humidity = forecastItem.main.humidity;

        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
            <h3>${date}</h3>
            <img src="http://openweathermap.org/img/wn/${icon}.png" alt="${forecastItem.weather[0].description}">
            <p>Temp: ${temp} °C</p>
            <p>Wind: ${wind} m/s</p>
            <p>Humidity: ${humidity}%</p>
        `;
        forecast.appendChild(card);
    }
}

function addToHistory(city) {
    const button = document.createElement('button');
    button.textContent = city;
    button.addEventListener('click', function() {
        getWeather(city);
    });
    searchHistory.appendChild(button);
}