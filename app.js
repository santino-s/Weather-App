// SELECTION OF ELEMENTS USING THE DOM
const search = document.querySelector("#searchBar");
const searchBtn = document.querySelector("#button-addon2")
const currentLocation = document.querySelector("#currentLocation");
const currentTemp = document.querySelector("#currentTemp");
const currentCode = document.querySelector("#currentCode");
const currentHigh = document.querySelector("#currentHigh");
const currentLow = document.querySelector("#currentLow");
const weatherImg = document.querySelector("#weatherImage");
const celsiusBtn = document.querySelector("#celsiusBtn");
const fahrenheitBtn = document.querySelector("#fahrenheitBtn");

// CREATING A VARIABLE TO STORE THE WEATHER-CODES.JSON FILE DATA (OBJECT)
let weatherCodesObject;


let scaleToMeasureTemp;


fahrenheitBtn.addEventListener("click", function(){
    fahrenheitBtn.classList.add("active");
    celsiusBtn.classList.remove("active");
});

celsiusBtn.addEventListener("click", function(){
    fahrenheitBtn.classList.remove("active")
    celsiusBtn.classList.add("active");
})


// FETCHING THE DATA FROM THE WEATHER-CODES.JSON FILE USING ASYNC AND AWAIT
async function fetchWeatherCodes() {
    try {
        const translateWeatherCode = await fetch ("./weather-codes.json");

        if(!translateWeatherCode.ok) {
            throw new Error("Could not fetch weather code data")
        };

        const weatherCodeResponse = await translateWeatherCode.json();
        weatherCodesObject = weatherCodeResponse;
    }

    catch(error) {
        console.error(error)
        currentLocation.textContent = "--Your City--";
        currentTemp.textContent = "--° C/F";
        currentHigh.textContent = "High /";
        currentLow.textContent = "Low";
        currentCode.textContent = "";
    }
}

fetchWeatherCodes();


async function fetchData() {
    const userInputSearch = search.value.toLowerCase();

    try {
        const geoResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${userInputSearch}&count=1&language=en&format=json`);
        
        if(!geoResponse.ok) {
            throw new Error("Could not fetch resource")
        };

        const geoData = await geoResponse.json();

        // Stops execution if it's empty, or if the result isn't a populated city/town
        if (!geoData.results || geoData.results.length === 0 || !geoData.results[0].population || geoData.results[0].population === 0) {
            throw new Error("Not a valid populated city");
        };

        console.log(geoData);
        const lat = geoData.results[0].latitude;
        const lon = geoData.results[0].longitude;

        const displayCity = geoData.results[0].name;
        currentLocation.textContent = displayCity;


        if (fahrenheitBtn.classList.contains("active")) {
            scaleToMeasureTemp = "fahrenheit";
        } else {
            scaleToMeasureTemp = "celsius";
        };

        const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&temperature_unit=${scaleToMeasureTemp}&daily=temperature_2m_min,temperature_2m_max&current=temperature_2m,is_day,weather_code&timezone=auto`);

        if(!weatherResponse.ok) {
            throw new Error("Could not fetch resource")
        };

        const weatherData = await weatherResponse.json();
        console.log(weatherData)

        const currentLocationTemp = weatherData.current.temperature_2m;
        currentTemp.textContent = `${parseInt(currentLocationTemp)}°`;

        const weatherCode = weatherData.current.weather_code;
        let isDay = weatherData.current.is_day;

        if (isDay === 1) {
            isDay = "day"
            document.body.style.background = "linear-gradient(to bottom right, #2ba0ff, #0f0f3e)"
        } else {
            isDay = "night"
            document.body.style.background = "linear-gradient(to bottom right, #0f0f3e, #2ba0ff)"
        };

        currentCode.textContent = weatherCodesObject[weatherCode][isDay].description;

        const dayHigh = weatherData.daily.temperature_2m_max[0];
        const dayLow = weatherData.daily.temperature_2m_min[0]

        currentHigh.textContent = `High: ${dayHigh}°`;
        currentLow.textContent = `Low: ${dayLow}°`;

        weatherImg.src = weatherCodesObject[weatherCode][isDay].image;    
    }
    catch(error) {
        console.error(error);
        currentLocation.textContent = "Error, city not found. Please try again.";
        currentTemp.textContent = "--°";
        currentHigh.textContent = "High /";
        currentLow.textContent = "Low";
        currentCode.textContent = "";
    };
};

searchBtn.addEventListener("click", fetchData);
   
// Execute a function when the user presses a key on the keyboard
search.addEventListener("keypress", function(event){
    // If the user presses the "Enter" key on the keyboard
    if (event.key === "Enter") {
        // Cancel the default action, if needed
        event.preventDefault();
        // Trigger the button element with a click
        searchBtn.click();
    }
});
