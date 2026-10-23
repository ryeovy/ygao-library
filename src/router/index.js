import { createRouter, createWebHistory } from 'vue-router'
import LibraryRegistrationForm from '../components/LibraryRegistrationForm.vue'
import WeatherView from '../views/WeatherView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: LibraryRegistrationForm },
    { path: '/WeatherCheck', component: WeatherView },
  ],
})

export default router
