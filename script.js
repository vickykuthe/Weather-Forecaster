document.getElementById("getWeather").addEventListener("click", () => {       //event listner
    const city = document.getElementById("cityInput").value;
    if (city) {
        fetchWeatherByCity(city);
    }
});

function fetchWeatherByCity(city) {
    const apiKey = "19f8d88c843b44fee6cebb6997ffea20";   //api key
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
        .then(res => res.json())
        .then(data => {
            displayWeather(data);
            fetchForecast(city);                         // weather documentation code
        })
        .catch(error => console.error("Error fetching weather data:", error));
}

function fetchForecast(city) {
    const apiKey = "19f8d88c843b44fee6cebb6997ffea20";
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`)
        .then(res => res.json())
        .then(data => {
            displayForecast(data.list);
        })
        .catch(error => console.error("Error fetching forecast data:", error));
}

function displayWeather(data) {
    document.getElementById("weatherInfo").innerHTML = `
        <h2>${data.name}</h2>
        <p>Condition: ${data.weather[0].description}</p>
        <p>Temperature: ${data.main.temp}°C</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Wind Speed: ${data.wind.speed} m/s</p>
    `;
}

function displayForecast(data) {
    const chartData = data.reduce((acc, curr) => {
        const date = curr.dt_txt.split(" ")[0];
        if (!acc[date]) {
            acc[date] = { temp: [], humidity: [] };
        }
        acc[date].temp.push(curr.main.temp);
        acc[date].humidity.push(curr.main.humidity);
        return acc;
    }, {});

    const formattedData = Object.keys(chartData).map(date => ({
        date,
        temp: (chartData[date].temp.reduce((a, b) => a + b, 0) / chartData[date].temp.length).toFixed(1),
        humidity: (chartData[date].humidity.reduce((a, b) => a + b, 0) / chartData[date].humidity.length).toFixed(1)
    }));

    const ctx = document.getElementById("weatherChart").getContext("2d");

    if (window.weatherChartInstance) {
        window.weatherChartInstance.destroy();
    }

    window.weatherChartInstance = new Chart(ctx, {
        type: "line",
        data: {
            labels: formattedData.map(d => d.date),
            datasets: [
                {
                    label: "Temperature (°C)",
                    data: formattedData.map(d => d.temp),
                    borderColor: "#ff6384",
                    fill: false
                },
                {
                    label: "Humidity (%)",
                    data: formattedData.map(d => d.humidity),
                    borderColor: "#36a2eb",
                    fill: false
                }
            ]
        }
    });
}
