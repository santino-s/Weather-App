# Weather App

A responsive weather app built with HTML, CSS, Bootstrap, and vanilla JavaScript.

## Features

- Search any city worldwide by name
- Displays current temperature in Celsius or Fahrenheit via a toggle
- Animated weather icons powered by [Meteocons](https://meteocons.com/) via the Iconify CDN, with day and night variants
- Weather condition description (e.g. Sunny, Partly Cloudy, Heavy Rain) sourced from a local JSON lookup table mapped to WMO weather codes
- Daily high and low temperatures
- Background gradient shifts based on time of day at the searched location
- UI error messages for invalid or unrecognised city searches

## Built With

- HTML / CSS / Bootstrap 5
- Vanilla JavaScript (Fetch API, async/await)
- [Open-Meteo API](https://open-meteo.com/) — no API key required
- [Meteocons](https://meteocons.com/) for weather icons

## How It Works

1. User enters a city name in the search bar and hits Search or presses Enter
2. The app calls the Open-Meteo Geocoding API to convert the city name into coordinates
3. Those coordinates are passed to the Open-Meteo Forecast API to fetch current conditions and daily high/low
4. A local `weather-codes.json` file maps the returned WMO weather code to a description and the appropriate Meteocons icon, with day/night variants determined by the `is_day` field

## Known Limitations

- Celsius/Fahrenheit toggle requires a new search to apply — does not convert already-displayed data in real time
- City disambiguation not supported — searches return the most populated result when multiple cities share a name (e.g. Springfield or Richmond)
