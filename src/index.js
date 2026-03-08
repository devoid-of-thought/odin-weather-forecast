// Add your JavaScript code here
import "./styles.css";

import snowIcon from "./icons/weather-snowy.svg";
import snowRainyIcon from "./icons/weather-snowy-rainy.svg";
import lightningRainyIcon from "./icons/weather-lightning-rainy.svg";
import rainyIcon from "./icons/weather-rainy.svg";
import pouringIcon from "./icons/weather-pouring.svg";
import hazyIcon from "./icons/weather-hazy.svg";
import windyIcon from "./icons/weather-windy.svg";
import cloudyIcon from "./icons/weather-cloudy.svg";
import partlyCloudyDayIcon from "./icons/weather-partly-cloudy.svg";
import partlyCloudyNightIcon from "./icons/weather-night-partly-cloudy.svg";
import sunnyIcon from "./icons/weather-sunny.svg";
import nightIcon from "./icons/weather-night.svg";

import template from "./template.json";
const iconMap = {
    "snow": snowIcon,
    "snow-showers-day": snowRainyIcon,
    "snow-showers-night": snowRainyIcon,
    "thunder-rain": lightningRainyIcon,
    "thunder-showers-day": lightningRainyIcon,
    "thunder-showers-night": lightningRainyIcon,
    "rain": rainyIcon,
    "showers-day": pouringIcon,
    "showers-night": pouringIcon,
    "fog": hazyIcon,
    "wind": windyIcon,
    "cloudy": cloudyIcon,
    "partly-cloudy-day": partlyCloudyDayIcon,
    "partly-cloudy-night": partlyCloudyNightIcon,
    "clear-day": sunnyIcon,
    "clear-night": nightIcon
};

function searchCity() {
  const searchButton = document.getElementById("search-button");

  searchButton.addEventListener("click", () => {
    const cityInput = document.getElementById("city-input");
    const cityName = cityInput.value.trim();
    searchCityOnEnter(cityName);
  });
}

function searchCityOnEnter(cityName) {
      try {
        weatherData(cityName).then(parsedWeatherData => {
            parsedWeatherToDom(parsedWeatherData.parsedData, parsedWeatherData.forecastData);
        });
      } catch (error) {
        console.error("Error displaying weather data:", error);
      }

}


async function weatherData(city) {
    const apiKey =  process.env.API_KEY;
    const apiUrl = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=${apiKey}&contentType=json`;
    
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const result = await response.json();
        const parsedData = parseData(result);
        console.log(parsedData);
        const forecastData = readForecastData(result);
        return { parsedData,forecastData };
    } catch (error) {
        console.error(error);
    }
}

function parseData(data) {
    const latitude = data.latitude;
    const longitude = data.longitude;
    const address = data.address;
    
    const currentConditions = data.currentConditions;

    const measurementTime = currentConditions.datetime;
    const currentTemp = currentConditions.temp;
    const currentFeelsLike = currentConditions.feelslike;
    const currentHumidity = currentConditions.humidity;
    const currentWindSpeed = currentConditions.windspeed;
    const currentConditionsDescription = currentConditions.conditions;
    const currentPressure = currentConditions.pressure;
    const currentCloudCover = currentConditions.cloudcover;
    const currentPercentPrecipitation = currentConditions.precip;
    const currentPrecipitationType = currentConditions.preciptype;
    const currentPrecipitationPossibility = currentConditions.precipprob;
    const currentIcon = currentConditions.icon;
    return {
        latitude,
        longitude,
        address,
        measurementTime,
        currentTemp,
        currentFeelsLike,
        currentHumidity,
        currentWindSpeed,
        currentConditionsDescription,
        currentPressure,
        currentCloudCover,
        currentPercentPrecipitation,
        currentPrecipitationType,
        currentIcon,
        currentPrecipitationPossibility
    };
}
function readForecastData(parsedData) {
    const nextDays = parsedData.days.slice(1, 5).map(day => ({
        temp: day.temp,
        precipprob: day.precipprob,
        conditions: day.conditions,
        icon: day.icon
    }));
    return nextDays;
}

function parsedWeatherToDom(parsedWeatherData, forecastData) {
    const contentDiv = document.querySelector(".content");
    contentDiv.innerHTML = "";

    const LocationInfo = createLocationInfo(parsedWeatherData);

    const weatherInfo = createWeatherInfo(parsedWeatherData,forecastData);

    contentDiv.appendChild(LocationInfo);
    contentDiv.appendChild(weatherInfo);

}

function createLocationInfo(parsedWeatherData) {
    const contentDiv = document.querySelector(".content");

    const LocationInfo = document.createElement("div");
    LocationInfo.classList.add("location-info");

        const cityName = document.createElement("h1");
    cityName.textContent = parsedWeatherData.address;
    LocationInfo.appendChild(cityName);

    const measurementTime = document.createElement("p");
    measurementTime.innerHTML = `<strong>Measurement Time:</strong> ${parsedWeatherData.measurementTime}`;
    LocationInfo.appendChild(measurementTime);

    const latAndLong = document.createElement("div");
    latAndLong.classList.add("lat-and-long");

    const latitude = document.createElement("p");
    latitude.innerHTML = `<strong>Latitude:</strong> ${parsedWeatherData.latitude}`;
    latAndLong.appendChild(latitude);
    
    const longitude = document.createElement("p");
    longitude.innerHTML = `<strong>Longitude:</strong> ${parsedWeatherData.longitude}`;
    latAndLong.appendChild(longitude);

    LocationInfo.appendChild(latAndLong);
    return LocationInfo;
}
function createWeatherInfo(parsedWeatherData, forecastData) {

    const weatherInfo = document.createElement("div");
    weatherInfo.classList.add("weather-info");
    
    const tempDiv = createTemperatureInfo(parsedWeatherData);
    
    const currentConditionsDescription = createConditionsDescription(parsedWeatherData);

    const percipitationInfo = createPercipitationInfo(parsedWeatherData);

    weatherInfo.appendChild(tempDiv);
    weatherInfo.appendChild(currentConditionsDescription);
    weatherInfo.appendChild(percipitationInfo);

    const forecastDataDiv = createForecastData(forecastData);
    weatherInfo.appendChild(forecastDataDiv);
    return weatherInfo;
}

function createForecastData(forecastData) {
    const forecastDataDiv = document.createElement("div");
    forecastDataDiv.classList.add("forecast-data");

    const forecastTable = document.createElement("table");
    const headerRow = document.createElement("tr");
    const dayHeader = document.createElement("th");
    dayHeader.textContent = "Day";
    const tempHeader = document.createElement("th");
    tempHeader.textContent = "Temp (°C)";
    const precipProbHeader = document.createElement("th");
    precipProbHeader.textContent = "Precipitation Probability (%)";
    const conditionsHeader = document.createElement("th");
    conditionsHeader.textContent = "Conditions";
    
    headerRow.appendChild(dayHeader);
    headerRow.appendChild(tempHeader);
    headerRow.appendChild(precipProbHeader);
    headerRow.appendChild(conditionsHeader);
    forecastTable.appendChild(headerRow);

    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    forecastData.forEach((day, index) => {
        const row = document.createElement("tr");

        const dayCell = document.createElement("td");
        dayCell.textContent = `${daysOfWeek[(new Date().getDay() + index + 1) % 7]}`;
        row.appendChild(dayCell);

        const tempCell = document.createElement("td");
        tempCell.textContent = day.temp;
        row.appendChild(tempCell);

        const precipProbCell = document.createElement("td");
        precipProbCell.textContent = day.precipprob;
        row.appendChild(precipProbCell);

        const conditionsCell = document.createElement("td");

        const wrapper = document.createElement("div");
        wrapper.classList.add("conditions-cell");
        const conditionsIcon = createConditionsIcon(day.icon);
        const conditionsDescription = document.createElement("p");
        conditionsDescription.textContent = day.conditions;
        wrapper.appendChild(conditionsIcon);
        wrapper.appendChild(conditionsDescription);
        conditionsCell.appendChild(wrapper);
        row.appendChild(conditionsCell);

        forecastTable.appendChild(row);
    });

    forecastDataDiv.appendChild(forecastTable);
    return forecastDataDiv;
  
}

function createTemperatureInfo(parsedWeatherData) {
    const tempDiv = document.createElement("div");
    tempDiv.classList.add("temp-div");

    const currentTempDiv = document.createElement("div");
    currentTempDiv.classList.add("current-temp-div");
    const currentTempHeader = document.createElement("h2");
    currentTempHeader.textContent = "Current Temperature:";
    const currentTemp = document.createElement("p");
    currentTemp.textContent = `${parsedWeatherData.currentTemp}°C`;
    currentTempDiv.appendChild(currentTempHeader);
    currentTempDiv.appendChild(currentTemp);
    tempDiv.appendChild(currentTempDiv);

    const feelsLikeDiv = document.createElement("div");
    feelsLikeDiv.classList.add("feels-like-div");
    const feelsLikeHeader = document.createElement("h2");
    feelsLikeHeader.textContent = "Feels Like:";
    const feelsLike = document.createElement("p");
    feelsLike.textContent = `${parsedWeatherData.currentFeelsLike}°C`;
    feelsLikeDiv.appendChild(feelsLikeHeader);
    feelsLikeDiv.appendChild(feelsLike);
    tempDiv.appendChild(feelsLikeDiv);

    const humidityDiv = document.createElement("div");
    humidityDiv.classList.add("humidity-div");
    const humidityHeader = document.createElement("h2");
    humidityHeader.textContent = "Humidity:";
    const humidity = document.createElement("p");
    humidity.textContent = `${parsedWeatherData.currentHumidity}%`;
    humidityDiv.appendChild(humidityHeader);
    humidityDiv.appendChild(humidity);
    tempDiv.appendChild(humidityDiv);

    return tempDiv;
}
function createConditionsDescription(parsedWeatherData) {
    const conditionsDiv = document.createElement("div");
    conditionsDiv.classList.add("conditions-div");

    const currentConditionsDiv = document.createElement("div");
    currentConditionsDiv.classList.add("current-conditions-div");
    const currentConditionsHeader = document.createElement("h2");
    currentConditionsHeader.textContent = "Current Conditions:";

    const currentConditionsIcon = createConditionsIcon(parsedWeatherData.currentIcon);
    const currentConditionsDescription = document.createElement("p");
    currentConditionsDescription.textContent = parsedWeatherData.currentConditionsDescription;
    currentConditionsDiv.appendChild(currentConditionsHeader);
    currentConditionsDiv.appendChild(currentConditionsIcon);
    currentConditionsDiv.appendChild(currentConditionsDescription);
    conditionsDiv.appendChild(currentConditionsDiv);

    const windSpeedDiv = document.createElement("div");
    windSpeedDiv.classList.add("wind-speed-div");
    const windSpeedHeader = document.createElement("h2");
    windSpeedHeader.textContent = "Wind Speed:";
    const windSpeed = document.createElement("p");
    windSpeed.textContent = `${parsedWeatherData.currentWindSpeed} km/h`;
    windSpeedDiv.appendChild(windSpeedHeader);
    windSpeedDiv.appendChild(windSpeed);
    conditionsDiv.appendChild(windSpeedDiv);

    const pressureDiv = document.createElement("div");
    pressureDiv.classList.add("pressure-div");
    const pressureHeader = document.createElement("h2");
    pressureHeader.textContent = "Pressure:";
    const pressure = document.createElement("p");
    pressure.textContent = `${parsedWeatherData.currentPressure} hPa`;
    pressureDiv.appendChild(pressureHeader);
    pressureDiv.appendChild(pressure);
    conditionsDiv.appendChild(pressureDiv);

    const cloudCoverDiv = document.createElement("div");
    cloudCoverDiv.classList.add("cloud-cover-div");
    const cloudCoverHeader = document.createElement("h2");
    cloudCoverHeader.textContent = "Cloud Cover:";
    const cloudCover = document.createElement("p");
    cloudCover.textContent = `${parsedWeatherData.currentCloudCover}%`;
    cloudCoverDiv.appendChild(cloudCoverHeader);
    cloudCoverDiv.appendChild(cloudCover);
    conditionsDiv.appendChild(cloudCoverDiv);

    return conditionsDiv;
}
function createConditionsIcon(currentIcon) {
    const icon = document.createElement("img");
    icon.classList.add("conditions-icon");
    icon.src = iconMap[currentIcon];  
    icon.alt = currentIcon;    
    return icon;
}

function createPercipitationInfo(parsedWeatherData) {
    const percipitationInfo = document.createElement("div");
    percipitationInfo.classList.add("percipitation-info");

    const percentPrecipitationDiv = document.createElement("div");
    percentPrecipitationDiv.classList.add("percent-precipitation-div");
    const percentPrecipitationHeader = document.createElement("h2");
    percentPrecipitationHeader.textContent = "Current Precipitation:";
    const percentPrecipitation = document.createElement("p");
    percentPrecipitation.textContent = `${parsedWeatherData.currentPercentPrecipitation}%`;
    percentPrecipitationDiv.appendChild(percentPrecipitationHeader);
    percentPrecipitationDiv.appendChild(percentPrecipitation);
    percipitationInfo.appendChild(percentPrecipitationDiv);

    const precipitationTypeDiv = document.createElement("div");
    precipitationTypeDiv.classList.add("precipitation-type-div");
    const precipitationTypeHeader = document.createElement("h2");
    precipitationTypeHeader.textContent = "Precipitation Type:";
    const precipitationType = document.createElement("p");
    precipitationType.textContent = parsedWeatherData.currentPrecipitationType || "N/A";
    precipitationTypeDiv.appendChild(precipitationTypeHeader);
    precipitationTypeDiv.appendChild(precipitationType);
    percipitationInfo.appendChild(precipitationTypeDiv);

    const precipitationPossibilityDiv = document.createElement("div");
    precipitationPossibilityDiv.classList.add("precipitation-possibility-div");
    const precipitationPossibilityHeader = document.createElement("h2");
    precipitationPossibilityHeader.textContent = "Precipitation Possibility:";
    const precipitationPossibility = document.createElement("p");
    precipitationPossibility.textContent = `${parsedWeatherData.currentPrecipitationPossibility}%`;
    precipitationPossibilityDiv.appendChild(precipitationPossibilityHeader);
    precipitationPossibilityDiv.appendChild(precipitationPossibility);
    percipitationInfo.appendChild(precipitationPossibilityDiv);

    return percipitationInfo;
}

searchCityOnEnter("New York");
searchCity();