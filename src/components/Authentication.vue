<script setup>
import { ref } from 'vue'

const props = defineProps({
  stremioAPIBase: { type: String, required: true }
})

const authKey = ref('')
const email = ref('')
const password = ref('')
const loginStatus = ref('')
const isLoading = ref(false)
const emits = defineEmits(['auth-key'])

async function loginUserPassword() {
  if (!email.value || !password.value) {
    loginStatus.value = 'Please enter email and password'
    return
  }

  isLoading.value = true
  loginStatus.value = ''

  try {
    const resp = await fetch(`${props.stremioAPIBase}login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        authKey: null,
        email: email.value,
        password: password.value,
      })
    })
    const data = await resp.json()

    if (data.result && data.result.authKey) {
      authKey.value = data.result.authKey
      loginStatus.value = 'success'
      emitAuthKey()
    } else {
      loginStatus.value = 'Login failed. Please check your credentials.'
    }
  } catch (err) {
    loginStatus.value = 'Login failed: ' + err.message
  } finally {
    isLoading.value = false
  }
}

function emitAuthKey() {
  emits('auth-key', authKey.value.replaceAll('"', '').trim())
}
</script>

<template>
  <fieldset>
    <legend>
      <span class="step-badge">0</span>
      Authenticate
    </legend>

    <div class="auth-methods">
      <div class="auth-method">
        <label class="input-label">Login with credentials</label>
        <div class="input-row">
          <input type="email" v-model="email" placeholder="Email address" @keyup.enter="loginUserPassword">
          <input type="password" v-model="password" placeholder="Password" @keyup.enter="loginUserPassword">
          <button class="btn btn-primary" @click="loginUserPassword" :disabled="isLoading">
            <svg v-if="isLoading" class="spin" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
            <template v-else>Login</template>
          </button>
        </div>
        <p v-if="loginStatus === 'success'" class="status success">Logged in successfully!</p>
        <p v-else-if="loginStatus" class="status error">{{ loginStatus }}</p>
      </div>

      <div class="divider">
        <span>OR</span>
      </div>

      <div class="auth-method">
        <label class="input-label">Paste your Auth Key</label>
        <input type="password" v-model="authKey" @input="emitAuthKey" placeholder="Paste your Stremio AuthKey here...">
      </div>
    </div>
  </fieldset>
</template>

<style scoped>
.auth-methods {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.auth-method {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-label {
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--font-secondary);
}

.input-row {
  display: flex;
  gap: 0.5rem;
}

.input-row input {
  flex: 1;
}

.input-row .btn {
  white-space: nowrap;
  min-width: 90px;
  justify-content: center;
}

.divider {
  display: flex;
  align-items: center;
  gap: 1rem;
  color: var(--font-secondary);
  font-size: 0.85rem;
  font-weight: 500;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--border-color);
}

.status {
  font-size: 0.85rem;
  margin: 0;
}

.status.success {
  color: var(--success);
}

.status.error {
  color: var(--danger);
}

.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@media (max-width: 640px) {
  .input-row {
    flex-direction: column;
  }
}
</style>
