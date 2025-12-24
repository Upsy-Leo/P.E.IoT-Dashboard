const express = require('express');
const router = express.Router();
const User = require('../models/User');
const axios = require('axios');

const API_KEY = process.env.OPENWEATHER_API_KEY;

// Mock data generator based on location name
const getMockWeather = (location) => {
    const loc = location ? location.toLowerCase() : 'worldwide';

    // Seed random based on location string length + first char
    const seed = loc.length + (loc.charCodeAt(0) || 0);
    const temp = 15 + (seed % 15); // 15 to 30 degrees
    const humidity = 40 + (seed % 40); // 40 to 80%
    const wind = 5 + (seed % 20); // 5 to 25 km/h

    const conditions = ['Sunny', 'Cloudy', 'Rainy', 'Windy', 'Clear'];
    const condition = conditions[seed % conditions.length];

    return {
        location: location || 'Worldwide',
        temp,
        humidity,
        wind,
        condition,
        timestamp: new Date()
    };
};

router.get('/', async (req, res) => {
    const { location, userId } = req.query;

    let resolvedLocation = location || 'Paris'; // Default to Paris if nothing else

    if (userId) {
        try {
            const user = await User.findById(userId);
            if (user) resolvedLocation = user.location;
        } catch (err) {
            console.error("Weather Route User Lookup Error:", err.message);
        }
    }

    if (!API_KEY) {
        console.warn("[WEATHER] No API Key found, using mock data.");
        return res.json(getMockWeather(resolvedLocation));
    }

    try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
            params: {
                q: resolvedLocation,
                appid: API_KEY,
                units: 'metric',
                lang: 'fr'
            }
        });

        const data = response.data;
        res.json({
            location: data.name,
            temp: Math.round(data.main.temp),
            humidity: data.main.humidity,
            wind: Math.round(data.wind.speed * 3.6), // m/s to km/h
            condition: data.weather[0].main,
            description: data.weather[0].description,
            timestamp: new Date()
        });
    } catch (err) {
        console.error("OpenWeather API Error:", err.response?.data || err.message);
        // Fallback to mock data on error so UI doesn't break
        res.json(getMockWeather(resolvedLocation));
    }
});

module.exports = router;
