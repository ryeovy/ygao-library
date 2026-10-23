<script setup>
import { ref } from 'vue'

const city = ref('Melbourne')
const place = ref('')
const weather = ref(null)
const error = ref('')
const loading = ref(false)

async function searchByCity() {
  const name = city.value.trim()
  if (!name) return

  loading.value = true
  error.value = ''
  weather.value = null

  try {
    const locationResponse = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(name)}&count=1&language=en&format=json`,
    )
    if (!locationResponse.ok) throw new Error('Location search failed')
    const locations = await locationResponse.json()
    const location = locations.results?.[0]
    if (!location) {
      error.value = 'City not found. Try another name.'
      return
    }

    const forecastResponse = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto`,
    )
    if (!forecastResponse.ok) throw new Error('Weather request failed')
    const forecast = await forecastResponse.json()
    if (!forecast.current) throw new Error('Current weather is unavailable')

    place.value = `${location.name}, ${location.country}`
    weather.value = forecast.current
  } catch {
    error.value = 'Could not load weather right now. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="container py-5">
    <h1>Get Weather</h1>
    <form class="row g-3 mt-2" @submit.prevent="searchByCity">
      <div class="col-sm-6 col-md-4">
        <label for="weather-city" class="form-label">City</label>
        <input id="weather-city" v-model="city" class="form-control" required />
      </div>
      <div class="col-sm-auto align-self-end">
        <button class="btn btn-primary" type="submit" :disabled="loading">
          {{ loading ? 'Searching…' : 'Search' }}
        </button>
      </div>
    </form>

    <p v-if="error" class="text-danger mt-4" role="alert">{{ error }}</p>
    <section v-if="weather" class="mt-4" aria-live="polite">
      <h2>{{ place }}</h2>
      <p>Temperature: {{ weather.temperature_2m }} °C</p>
      <p>Humidity: {{ weather.relative_humidity_2m }}%</p>
      <p>Wind speed: {{ weather.wind_speed_10m }} km/h</p>
      <p>Weather code: {{ weather.weather_code }}</p>
    </section>
    <p class="mt-4 small">Weather data: <a href="https://open-meteo.com/" target="_blank" rel="noopener">Open-Meteo</a></p>
  </main>
</template>
