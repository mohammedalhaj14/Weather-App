const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");
const weatherIcon = document.querySelector(".weather-icon");

async function checkWeather() {
    const city = cityInput.value.trim();
    if (!city) return;

    try {

        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`;
        const geoRes = await fetch(geoUrl);
        const geoData = await geoRes.json();

        if (!geoData.results) {
            alert("City not found!");
            return;
        }

        const { latitude, longitude, name } = geoData.results[0];

        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
        const weatherRes = await fetch(weatherUrl);
        const weatherData = await weatherRes.json();
        const current = weatherData.current_weather;

        document.querySelector(".city").innerHTML = name;
        document.querySelector(".temp").innerHTML = Math.round(current.temperature) + "°C";
        document.querySelector(".wind").innerHTML = current.windspeed + " km/h";

        updateIcon(current.weathercode);

    } catch (error) {
        console.error("Error:", error);
    }
}

function updateIcon(code) {
    // Open-Meteo uses WMO codes. We map them to common icons.
    let icon = "01d"; // Default: Clear sky
    if (code >= 1 && code <= 3) icon = "02d"; // Cloudy
    else if (code >= 45 && code <= 48) icon = "50d"; // Fog
    else if (code >= 51 && code <= 67) icon = "09d"; // Rain
    else if (code >= 71 && code <= 77) icon = "13d"; // Snow
    else if (code >= 80 && code <= 82) icon = "10d"; // Showers
    else if (code >= 95) icon = "11d"; // Thunderstorm

    weatherIcon.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
}

searchBtn.addEventListener("click", checkWeather);
cityInput.addEventListener("keypress", (e) => { if (e.key === "Enter") checkWeather(); });