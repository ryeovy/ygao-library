<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-12 col-sm-10 offset-sm-1 col-md-8 offset-md-2">
        <h1 class="text-center">User Information Form / Credentials</h1>
        <form @submit.prevent="submitForm">
          <div class="mb-3">
            <label for="username" class="form-label">Username:</label>
            <input
              id="username"
              v-model="formData.username"
              type="text"
              class="form-control"
              @blur="() => validateName(true)"
              @input="() => validateName(false)"
            />
            <div v-if="errors.username" class="text-danger">{{ errors.username }}</div>
          </div>

          <div class="mb-3">
            <label for="password" class="form-label">Password:</label>
            <input
              id="password"
              v-model="formData.password"
              type="password"
              class="form-control"
              @blur="() => validatePassword(true)"
              @input="() => validatePassword(false)"
            />
            <div v-if="errors.password" class="text-danger">{{ errors.password }}</div>
          </div>

          <div class="mb-3 form-check">
            <input
              id="isAustralian"
              v-model="formData.isAustralian"
              type="checkbox"
              class="form-check-input"
              @change="() => validateResident(true)"
            />
            <label for="isAustralian" class="form-check-label">Australian Resident?</label>
            <div v-if="errors.resident" class="text-danger">{{ errors.resident }}</div>
          </div>

          <div class="mb-3">
            <label for="gender" class="form-label">Gender</label>
            <select
              id="gender"
              v-model="formData.gender"
              class="form-select"
              @change="() => validateGender(true)"
            >
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="other">Other</option>
            </select>
            <div v-if="errors.gender" class="text-danger">{{ errors.gender }}</div>
          </div>

          <div class="mb-3">
            <label for="reason" class="form-label">Reason For Joining:</label>
            <textarea
              id="reason"
              v-model="formData.reason"
              class="form-control"
              rows="3"
              @blur="() => validateReason(true)"
              @input="() => validateReason(false)"
            ></textarea>
            <div v-if="errors.reason" class="text-danger">{{ errors.reason }}</div>
          </div>

          <button type="submit" class="btn btn-primary me-2">Submit</button>
          <button type="button" class="btn btn-secondary" @click="clearForm">Clear</button>
        </form>
      </div>
    </div>

    <DataTable v-if="submittedCards.length" :value="submittedCards" class="mt-5">
      <Column field="username" header="Username" />
      <Column field="isAustralian" header="Australian Resident" />
      <Column field="gender" header="Gender" />
      <Column field="reason" header="Reason" />
    </DataTable>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

const formData = ref({
  username: '',
  password: '',
  isAustralian: false,
  reason: '',
  gender: '',
})

const submittedCards = ref([])

const submitForm = () => {
  validateName(true)
  validatePassword(true)
  validateResident(true)
  validateGender(true)
  validateReason(true)
  if (
    !errors.value.username &&
    !errors.value.password &&
    !errors.value.resident &&
    !errors.value.gender &&
    !errors.value.reason
  ) {
    submittedCards.value.push({
      username: formData.value.username,
      isAustralian: formData.value.isAustralian,
      gender: formData.value.gender,
      reason: formData.value.reason,
    })
    clearForm()
  }
}

const clearForm = () => {
  formData.value = {
    username: '',
    password: '',
    isAustralian: false,
    reason: '',
    gender: '',
  }
}

const errors = ref({
  username: null,
  password: null,
  resident: null,
  gender: null,
  reason: null,
})

const validateName = (blur) => {
  if (formData.value.username.length < 3) {
    if (blur) errors.value.username = 'Name must be at least 3 characters'
  } else {
    errors.value.username = null
  }
}

const validatePassword = (blur) => {
  const password = formData.value.password
  const minLength = 8
  const hasUppercase = /[A-Z]/.test(password)
  const hasLowercase = /[a-z]/.test(password)
  const hasNumber = /\d/.test(password)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

  if (password.length < minLength) {
    if (blur) errors.value.password = `Password must be at least ${minLength} characters long.`
  } else if (!hasUppercase) {
    if (blur) errors.value.password = 'Password must contain at least one uppercase letter.'
  } else if (!hasLowercase) {
    if (blur) errors.value.password = 'Password must contain at least one lowercase letter.'
  } else if (!hasNumber) {
    if (blur) errors.value.password = 'Password must contain at least one number.'
  } else if (!hasSpecialChar) {
    if (blur) errors.value.password = 'Password must contain at least one special character.'
  } else {
    errors.value.password = null
  }
}

const validateResident = (blur) => {
  if (!formData.value.isAustralian) {
    if (blur) errors.value.resident = 'Australian residency is required'
  } else {
    errors.value.resident = null
  }
}

const validateGender = (blur) => {
  if (!formData.value.gender) {
    if (blur) errors.value.gender = 'Gender is required'
  } else {
    errors.value.gender = null
  }
}

const validateReason = (blur) => {
  if (!formData.value.reason) {
    if (blur) errors.value.reason = 'Reason for joining is required'
  } else {
    errors.value.reason = null
  }
}
</script>
