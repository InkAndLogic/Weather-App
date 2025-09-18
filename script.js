/*
============================================
🌤️ WEATHER APP - SIMPLE API IMPLEMENTATION
============================================
*/

// Simple Weather App Implementation
const apiKey = "6b60a5806e4400d9b19d35dba380f0d7";

document.addEventListener('DOMContentLoaded', () => {
  // Initialize with default city
  fetchWeather('Berlin');
  
  // Add search functionality
  const searchForm = document.querySelector('.search-form');
  const searchInput = document.querySelector('.search-form__input');
  
  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const city = searchInput.value.trim();
    
    if (city === "") {
      showError("Please enter a city name");
      return;
    }
    
    fetchWeather(city);
  });
  
  // Add units functionality
  const tempRadios = document.querySelectorAll('input[name="temperature"]');
  const windRadios = document.querySelectorAll('input[name="wind"]');
  
  tempRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      const city = document.querySelector('.current-weather__city')?.textContent?.split(',')[0];
      if (city) fetchWeather(city);
    });
  });
  
  windRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      const city = document.querySelector('.current-weather__city')?.textContent?.split(',')[0];
      if (city) fetchWeather(city);
    });
  });
  
  // Setup units dropdown
  setupUnitsDropdown();
});

function fetchWeather(city) {
  const units = getUnits();
  showLoading(true);
  hideError();
  
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&appid=${apiKey}`)
    .then(res => res.json())
    .then(data => {
      if (data.cod !== 200) {
        showError(`❌ ${data.message}`);
        return;
      }
      
      updateWeatherDisplay(data);
      fetchForecast(data.coord.lat, data.coord.lon);
    })
    .catch(error => {
      console.error('Weather fetch error:', error);
      showError('⚠️ Unable to fetch weather data');
    })
    .finally(() => {
      showLoading(false);
    });
}

function fetchForecast(lat, lon) {
  const units = getUnits();
  
  fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`)
    .then(res => res.json())
    .then(data => {
      if (data.cod === "200") {
        updateForecastDisplay(data);
      }
    })
    .catch(error => {
      console.error('Forecast fetch error:', error);
    });
}

function updateWeatherDisplay(data) {
  const units = getUnits();
  const tempUnit = units === "metric" ? "C" : "F";
  const windUnit = getWindUnit();
  
  // Update current weather
  document.querySelector('.current-weather__city').textContent = `${data.name}, ${data.sys.country}`;
  document.querySelector('.current-weather__date').textContent = formatDate(new Date());
  document.querySelector('.current-weather__temp').textContent = `${Math.round(data.main.temp)}°${tempUnit}`;
  
  // Update weather icon
  const iconElement = document.querySelector('.current-weather__icon');
  const iconName = getWeatherIconName(data.weather[0].main);
  iconElement.src = `./assets/images/${iconName}`;
  iconElement.alt = data.weather[0].description;
  
  // Update weather metrics
  const weatherValues = document.querySelectorAll('.weather-metric__value');
  weatherValues[0].textContent = `${Math.round(data.main.feels_like)}°${tempUnit}`;
  weatherValues[1].textContent = `${data.main.humidity}%`;
  weatherValues[2].textContent = `${Math.round(convertWindSpeed(data.wind.speed, units, windUnit))} ${windUnit}`;
  weatherValues[3].textContent = `${data.rain ? Math.round(data.rain['1h'] || 0) : 0} mm`;
}

function updateForecastDisplay(data) {
  const units = getUnits();
  const tempUnit = units === "metric" ? "C" : "F";
  
  // Process daily forecast
  const dailyData = processDailyForecast(data.list);
  const dailyItems = document.querySelectorAll('.daily-forecast__item');
  
  dailyData.forEach((day, index) => {
    if (index < dailyItems.length) {
      const item = dailyItems[index];
      item.querySelector('.daily-forecast__day').textContent = day.day;
      item.querySelector('.daily-forecast__high').textContent = `${Math.round(day.high)}°${tempUnit}`;
      item.querySelector('.daily-forecast__low').textContent = `${Math.round(day.low)}°${tempUnit}`;
      
      const iconName = getWeatherIconName(day.weather);
      item.querySelector('.daily-forecast__icon').src = `./assets/images/${iconName}`;
    }
  });
  
  // Process hourly forecast (today's data)
  const hourlyData = data.list.slice(0, 8);
  const hourlyItems = document.querySelectorAll('.hourly-forecast__item');
  
  hourlyData.forEach((hour, index) => {
    if (index < hourlyItems.length) {
      const item = hourlyItems[index];
      const time = new Date(hour.dt * 1000);
      item.querySelector('.hourly-forecast__time').textContent = formatTime(time);
      item.querySelector('.hourly-forecast__temp').textContent = `${Math.round(hour.main.temp)}°${tempUnit}`;
      
      const iconName = getWeatherIconName(hour.weather[0].main);
      item.querySelector('.hourly-forecast__icon').src = `./assets/images/${iconName}`;
    }
  });
}

function processDailyForecast(forecastList) {
  const dailyMap = new Map();
  
  forecastList.forEach(item => {
    const date = new Date(item.dt * 1000);
    const dayKey = date.toDateString();
    
    if (!dailyMap.has(dayKey)) {
      dailyMap.set(dayKey, {
        day: formatDayName(date),
        high: item.main.temp_max,
        low: item.main.temp_min,
        weather: item.weather[0].main
      });
    } else {
      const existing = dailyMap.get(dayKey);
      existing.high = Math.max(existing.high, item.main.temp_max);
      existing.low = Math.min(existing.low, item.main.temp_min);
    }
  });
  
  return Array.from(dailyMap.values()).slice(0, 7);
}

function getUnits() {
  const tempRadio = document.querySelector('input[name="temperature"]:checked');
  return tempRadio && tempRadio.value === 'fahrenheit' ? 'imperial' : 'metric';
}

function getWindUnit() {
  const windRadio = document.querySelector('input[name="wind"]:checked');
  return windRadio ? windRadio.value : 'kmh';
}

function convertWindSpeed(speed, units, targetUnit) {
  if (units === 'metric') {
    // Speed is in m/s, convert to km/h or mph
    if (targetUnit === 'mph') {
      return speed * 2.237; // m/s to mph
    } else {
      return speed * 3.6; // m/s to km/h
    }
  } else {
    // Speed is in mph
    if (targetUnit === 'kmh') {
      return speed * 1.609; // mph to km/h
    } else {
      return speed;
    }
  }
}

function getWeatherIconName(condition) {
  const iconMap = {
    'Clear': 'icon-sunny.webp',
    'Clouds': 'icon-overcast.webp',
    'Rain': 'icon-rain.webp',
    'Drizzle': 'icon-drizzle.webp',
    'Thunderstorm': 'icon-storm.webp',
    'Snow': 'icon-snow.webp',
    'Mist': 'icon-fog.webp',
    'Fog': 'icon-fog.webp',
    'Haze': 'icon-fog.webp'
  };
  
  return iconMap[condition] || 'icon-overcast.webp';
}

function formatDate(date) {
  const options = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  };
  return date.toLocaleDateString('en-US', options);
}

function formatDayName(date) {
  return date.toLocaleDateString('en-US', { weekday: 'short' });
}

function formatTime(date) {
  return date.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    hour12: true 
  });
}

function setupUnitsDropdown() {
  const toggle = document.querySelector('.units-dropdown__toggle');
  const content = document.querySelector('.units-dropdown__content');
  
  if (toggle && content) {
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', !isExpanded);
    });

    document.addEventListener('click', () => {
      toggle.setAttribute('aria-expanded', 'false');
    });

    content.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }
}

function showLoading(show) {
  const app = document.querySelector('.app');
  if (app) {
    if (show) {
      app.classList.add('loading');
    } else {
      app.classList.remove('loading');
    }
  }
}

function showError(message) {
  hideError();
  
  const searchSection = document.querySelector('.search-section');
  if (searchSection) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error';
    errorDiv.textContent = message;
    searchSection.appendChild(errorDiv);
    
    setTimeout(() => {
      hideError();
    }, 5000);
  }
}

function hideError() {
  const existingError = document.querySelector('.error');
  if (existingError) {
    existingError.remove();
  }
}

// Weather App JavaScript - Live API Only

class WeatherApp {
  constructor() {
    // API configuration
    this.API_KEY = '6b60a5806e4400d9b19d35dba380f0d7'; // Replace with your actual API key from openweathermap.org
    this.BASE_URL = 'https://api.openweathermap.org/data/2.5';
    this.GEOCODING_URL = 'https://api.openweathermap.org/geo/1.0';
    
    // Default settings
    this.currentUnits = 'metric';
    this.currentCity = null;
    this.currentWeatherData = null;
    this.forecastData = null;
    
    console.log('Weather App initialized - Live API mode only');
    
    // Check if API key is configured
    if (this.API_KEY === 'YOUR_API_KEY_HERE') {
      this.showError('Please configure your OpenWeatherMap API key in script.js');
      return;
    }
    
    // Initialize the app
    this.init();
  }

  init() {
    this.bindEvents();
    this.loadDefaultWeather();
  }

  updateCurrentWeather() {
    // Search form submission
    const searchForm = document.querySelector('.search-form');
    searchForm.addEventListener('submit', (e) => this.handleSearch(e));

    // Units dropdown functionality
    this.setupUnitsDropdown();

    // Temperature unit toggle
    const tempRadios = document.querySelectorAll('input[name="temperature"]');
    tempRadios.forEach(radio => {
      radio.addEventListener('change', () => this.handleTemperatureUnitChange());
    });

    // Wind speed unit toggle
    const windRadios = document.querySelectorAll('input[name="wind"]');
    windRadios.forEach(radio => {
      radio.addEventListener('change', () => this.handleWindUnitChange());
    });

    // Precipitation unit toggle
    const precipRadios = document.querySelectorAll('input[name="precipitation"]');
    precipRadios.forEach(radio => {
      radio.addEventListener('change', () => this.handlePrecipitationUnitChange());
    });

    // Daily forecast day selection
    const daySelector = document.querySelector('.hourly-forecast__day-selector');
    if (daySelector) {
      daySelector.addEventListener('change', (e) => this.handleDaySelection(e));
    }
  }

  setupUnitsDropdown() {
    const toggle = document.querySelector('.units-dropdown__toggle');
    const content = document.querySelector('.units-dropdown__content');
    
    if (toggle && content) {
      toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', !isExpanded);
      });

      // Close dropdown when clicking outside
      document.addEventListener('click', () => {
        toggle.setAttribute('aria-expanded', 'false');
      });

      content.addEventListener('click', (e) => {
        e.stopPropagation();
      });
    }
  }

  async handleSearch(e) {
    e.preventDefault();
    const searchInput = document.querySelector('.search-form__input');
    const city = searchInput.value.trim();
    
    if (!city) {
      this.showError('Please enter a city name');
      return;
    }

    this.showLoading(true);
    
    try {
      await this.fetchWeatherData(city);
      this.hideError();
    } catch (error) {
      this.showError(error.message);
    } finally {
      this.showLoading(false);
    }
  }

  async fetchWeatherData(city) {
    try {
      console.log('Fetching live weather data for:', city);
      
      const geoUrl = `${this.GEOCODING_URL}/direct?q=${encodeURIComponent(city)}&limit=1&appid=${this.API_KEY}`;
      
      const geoResponse = await fetch(geoUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      });
      
      if (!geoResponse.ok) {
        if (geoResponse.status === 401) {
          throw new Error('Invalid API key. Please get a valid key from openweathermap.org');
        }
        throw new Error(`API Error: ${geoResponse.status} - ${geoResponse.statusText}`);
      }
      
      const geoData = await geoResponse.json();
      
      if (geoData.length === 0) {
        throw new Error('City not found. Please check the spelling and try again.');
      }
      
      const { lat, lon, name, country } = geoData[0];
      this.currentCity = { name, country, lat, lon };
      
      // Fetch current weather
      const weatherUrl = `${this.BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${this.API_KEY}&units=${this.currentUnits}`;
      
      const weatherResponse = await fetch(weatherUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      });
      
      if (!weatherResponse.ok) {
        if (weatherResponse.status === 401) {
          throw new Error('Invalid API key. Please get a valid key from openweathermap.org');
        }
        throw new Error(`Weather API Error: ${weatherResponse.status} - ${weatherResponse.statusText}`);
      }
      
      this.currentWeatherData = await weatherResponse.json();
      
      // Fetch 5-day forecast
      const forecastUrl = `${this.BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${this.API_KEY}&units=${this.currentUnits}`;
      
      const forecastResponse = await fetch(forecastUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      });
      
      if (!forecastResponse.ok) {
        console.warn('Forecast data unavailable');
        this.forecastData = null;
      } else {
        this.forecastData = await forecastResponse.json();
      }
      
      // Update the UI
      this.updateCurrentWeather();
      this.updateWeatherMetrics();
      this.updateDailyForecast();
      this.updateHourlyForecast();
      
    } catch (error) {
      console.error('Weather fetch error:', error);
      throw error;
    }
  }

  bindEvents() {
    if (!this.currentWeatherData || !this.currentCity) return;
    
    const { main, weather, dt } = this.currentWeatherData;
    const { name, country } = this.currentCity;
    
    // Update city and date
    const cityElement = document.querySelector('.current-weather__city');
    const dateElement = document.querySelector('.current-weather__date');
    
    if (cityElement) {
      cityElement.textContent = `${name}, ${country}`;
    }
    
    if (dateElement) {
      const date = new Date(dt * 1000);
      dateElement.textContent = this.formatDate(date);
    }
    
    // Update temperature
    const tempElement = document.querySelector('.current-weather__temp');
    if (tempElement) {
      const temp = Math.round(main.temp);
      const unit = this.getTemperatureUnit();
      tempElement.textContent = `${temp}°${unit}`;
    }
    
    // Update weather icon
    const iconElement = document.querySelector('.current-weather__icon');
    if (iconElement && weather[0]) {
      const iconCode = weather[0].icon;
      const iconName = this.getWeatherIconName(weather[0].main, iconCode);
      iconElement.src = `./assets/images/${iconName}`;
      iconElement.alt = weather[0].description;
    }
  }

  updateWeatherMetrics() {
    if (!this.currentWeatherData) return;
    
    const { main, wind } = this.currentWeatherData;
    
    // Update feels like temperature
    const feelsLikeElement = document.querySelector('.weather-metric__value');
    if (feelsLikeElement) {
      const feelsLike = Math.round(main.feels_like);
      const unit = this.getTemperatureUnit();
      feelsLikeElement.textContent = `${feelsLike}°${unit}`;
    }
    
    // Update humidity
    const humidityElement = document.querySelectorAll('.weather-metric__value')[1];
    if (humidityElement) {
      humidityElement.textContent = `${main.humidity}%`;
    }
    
    // Update wind speed
    const windElement = document.querySelectorAll('.weather-metric__value')[2];
    if (windElement) {
      const windSpeed = this.convertWindSpeed(wind.speed);
      const windUnit = this.getWindUnit();
      windElement.textContent = `${Math.round(windSpeed)} ${windUnit}`;
    }
    
    // Update precipitation (from forecast data if available)
    const precipElement = document.querySelectorAll('.weather-metric__value')[3];
    if (precipElement) {
      let precipitation = 0;
      if (this.currentWeatherData.rain) {
        precipitation = this.currentWeatherData.rain['1h'] || this.currentWeatherData.rain['3h'] || 0;
      } else if (this.currentWeatherData.snow) {
        precipitation = this.currentWeatherData.snow['1h'] || this.currentWeatherData.snow['3h'] || 0;
      }
      
      const precipUnit = this.getPrecipitationUnit();
      const convertedPrecip = this.convertPrecipitation(precipitation);
      precipElement.textContent = `${convertedPrecip} ${precipUnit}`;
    }
  }

  updateDailyForecast() {
    if (!this.forecastData) return;
    
    const dailyData = this.processDailyForecast();
    const dailyItems = document.querySelectorAll('.daily-forecast__item');
    
    dailyData.forEach((day, index) => {
      if (index < dailyItems.length) {
        const item = dailyItems[index];
        
        // Update day
        const dayElement = item.querySelector('.daily-forecast__day');
        if (dayElement) {
          dayElement.textContent = day.day;
        }
        
        // Update icon
        const iconElement = item.querySelector('.daily-forecast__icon');
        if (iconElement) {
          const iconName = this.getWeatherIconName(day.weather, day.icon);
          iconElement.src = `./assets/images/${iconName}`;
          iconElement.alt = day.weather;
        }
        
        // Update temperatures
        const highElement = item.querySelector('.daily-forecast__high');
        const lowElement = item.querySelector('.daily-forecast__low');
        const unit = this.getTemperatureUnit();
        
        if (highElement) {
          highElement.textContent = `${Math.round(day.high)}°${unit}`;
        }
        if (lowElement) {
          lowElement.textContent = `${Math.round(day.low)}°${unit}`;
        }
      }
    });
  }

  updateHourlyForecast() {
    if (!this.forecastData) return;
    
    const hourlyData = this.processHourlyForecast();
    const hourlyItems = document.querySelectorAll('.hourly-forecast__item');
    
    hourlyData.slice(0, hourlyItems.length).forEach((hour, index) => {
      const item = hourlyItems[index];
      
      // Update time
      const timeElement = item.querySelector('.hourly-forecast__time');
      if (timeElement) {
        timeElement.textContent = hour.time;
      }
      
      // Update icon
      const iconElement = item.querySelector('.hourly-forecast__icon');
      if (iconElement) {
        const iconName = this.getWeatherIconName(hour.weather, hour.icon);
        iconElement.src = `./assets/images/${iconName}`;
        iconElement.alt = hour.weather;
      }
      
      // Update temperature
      const tempElement = item.querySelector('.hourly-forecast__temp');
      if (tempElement) {
        const unit = this.getTemperatureUnit();
        tempElement.textContent = `${Math.round(hour.temp)}°${unit}`;
      }
    });
  }

  processDailyForecast() {
    if (!this.forecastData) return [];
    
    const dailyMap = new Map();
    
    this.forecastData.list.forEach(item => {
      const date = new Date(item.dt * 1000);
      const dayKey = date.toDateString();
      
      if (!dailyMap.has(dayKey)) {
        dailyMap.set(dayKey, {
          day: this.formatDayName(date),
          high: item.main.temp_max,
          low: item.main.temp_min,
          weather: item.weather[0].main,
          icon: item.weather[0].icon,
          temps: [item.main.temp]
        });
      } else {
        const existing = dailyMap.get(dayKey);
        existing.high = Math.max(existing.high, item.main.temp_max);
        existing.low = Math.min(existing.low, item.main.temp_min);
        existing.temps.push(item.main.temp);
      }
    });
    
    return Array.from(dailyMap.values()).slice(0, 7);
  }

  processHourlyForecast() {
    if (!this.forecastData) return [];
    
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    return this.forecastData.list
      .filter(item => {
        const itemDate = new Date(item.dt * 1000);
        return itemDate >= todayStart;
      })
      .slice(0, 8)
      .map(item => ({
        time: this.formatHourTime(new Date(item.dt * 1000)),
        temp: item.main.temp,
        weather: item.weather[0].main,
        icon: item.weather[0].icon
      }));
  }

  handleTemperatureUnitChange() {
    if (this.currentWeatherData) {
      this.refreshWeatherData();
    }
  }

  handleWindUnitChange() {
    this.updateWeatherMetrics();
  }

  handlePrecipitationUnitChange() {
    this.updateWeatherMetrics();
  }

  handleDaySelection(e) {
    // This would filter hourly forecast by selected day
    // For now, we'll keep showing today's forecast
    this.updateHourlyForecast();
  }

  async refreshWeatherData() {
    if (this.currentCity) {
      this.showLoading(true);
      try {
        await this.fetchWeatherData(`${this.currentCity.name}, ${this.currentCity.country}`);
      } catch (error) {
        this.showError(error.message);
      } finally {
        this.showLoading(false);
      }
    }
  }

  // Unit conversion methods
  getTemperatureUnit() {
    const tempRadio = document.querySelector('input[name="temperature"]:checked');
    return tempRadio ? (tempRadio.value === 'celsius' ? 'C' : 'F') : 'C';
  }

  getWindUnit() {
    const windRadio = document.querySelector('input[name="wind"]:checked');
    return windRadio ? windRadio.value : 'km/h';
  }

  getPrecipitationUnit() {
    const precipRadio = document.querySelector('input[name="precipitation"]:checked');
    return precipRadio ? precipRadio.value : 'mm';
  }

  convertWindSpeed(speed) {
    const selectedUnit = this.getWindUnit();
    
    if (this.currentUnits === 'metric') {
      // Speed is in m/s, convert to km/h or mph
      if (selectedUnit === 'mph') {
        return speed * 2.237; // m/s to mph
      } else {
        return speed * 3.6; // m/s to km/h
      }
    } else {
      // Speed is in mph
      if (selectedUnit === 'kmh') {
        return speed * 1.609; // mph to km/h
      } else {
        return speed;
      }
    }
  }

  convertPrecipitation(amount) {
    const selectedUnit = this.getPrecipitationUnit();
    
    if (selectedUnit === 'inches') {
      return (amount * 0.0394).toFixed(2); // mm to inches
    }
    return Math.round(amount); // mm
  }

  // Weather icon mapping
  getWeatherIconName(condition, iconCode) {
    const iconMap = {
      'Clear': 'icon-sunny.webp',
      'Clouds': iconCode.includes('n') ? 'icon-overcast.webp' : 'icon-partly-cloudy.webp',
      'Rain': 'icon-rain.webp',
      'Drizzle': 'icon-drizzle.webp',
      'Thunderstorm': 'icon-storm.webp',
      'Snow': 'icon-snow.webp',
      'Mist': 'icon-fog.webp',
      'Fog': 'icon-fog.webp',
      'Haze': 'icon-fog.webp'
    };
    
    return iconMap[condition] || 'icon-overcast.webp';
  }

  // Utility methods
  formatDate(date) {
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('en-US', options);
  }

  formatDayName(date) {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  }

  formatHourTime(date) {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      hour12: true 
    });
  }

  // UI state management
  showLoading(show) {
    const app = document.querySelector('.app');
    if (app) {
      if (show) {
        app.classList.add('loading');
      } else {
        app.classList.remove('loading');
      }
    }
  }

  showError(message) {
    this.hideError(); // Remove any existing error
    
    const searchSection = document.querySelector('.search-section');
    if (searchSection) {
      const errorDiv = document.createElement('div');
      errorDiv.className = 'error';
      errorDiv.textContent = message;
      searchSection.appendChild(errorDiv);
      
      // Auto-hide error after 5 seconds
      setTimeout(() => {
        this.hideError();
      }, 5000);
    }
  }

  hideError() {
    const existingError = document.querySelector('.error');
    if (existingError) {
      existingError.remove();
    }
  }

  async loadDefaultWeather() {
    // Load default city (Berlin) on app start
    try {
      console.log('Loading default weather for Berlin...');
      await this.fetchWeatherData('Berlin');
      console.log('Default weather loaded successfully');
    } catch (error) {
      console.error('Failed to load default weather:', error);
      this.showError(`Failed to load default weather: ${error.message}`);
    }
  }
}

// Initialize the weather app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new WeatherApp();
});

// API Key Instructions:
// To use this weather app, you need to:
// 1. Sign up for a free account at https://openweathermap.org/api
// 2. Get your API key from the dashboard
// 3. Replace 'YOUR_API_KEY_HERE' with your actual API key
// 4. The free tier allows 1000 API calls per day, which is sufficient for testing