<script setup>
import { ref, onMounted } from 'vue'
import * as supabase from '../services/supabase.js'

const email = ref('')
const password = ref('')
const statusMessage = ref('')
const statusType = ref('')
const isLoading = ref(false)
const isAuthenticated = ref(false)
const currentUser = ref(null)
const isSignUp = ref(false)
const configured = ref(supabase.isConfigured())

const emits = defineEmits(['auth-changed'])

onMounted(() => {
  const user = supabase.getCurrentUser()
  if (user) {
    isAuthenticated.value = true
    currentUser.value = user
    emits('auth-changed', true)
  }
})

async function handleAuth() {
  if (!email.value || !password.value) {
    statusMessage.value = 'Please enter email and password'
    statusType.value = 'error'
    return
  }

  isLoading.value = true
  statusMessage.value = ''

  try {
    if (isSignUp.value) {
      const result = await supabase.signUp(email.value, password.value)
      if (result.needsConfirmation) {
        statusMessage.value = 'Account created! Check your email to verify, then sign in.'
        statusType.value = 'info'
        isSignUp.value = false
      } else {
        isAuthenticated.value = true
        currentUser.value = result.user
        statusMessage.value = 'Account created and logged in!'
        statusType.value = 'success'
        emits('auth-changed', true)
      }
    } else {
      const result = await supabase.signIn(email.value, password.value)
      isAuthenticated.value = true
      currentUser.value = result.user
      statusMessage.value = 'Logged in successfully!'
      statusType.value = 'success'
      emits('auth-changed', true)
    }
  } catch (err) {
    const code = err.code?.toLowerCase?.() || ''
    if (code === 'invalid_credentials') {
      statusMessage.value = 'Invalid email or password'
    } else if (code === 'email_not_confirmed') {
      statusMessage.value = 'Email not confirmed. Check your inbox (and spam), then try again.'
    } else {
      statusMessage.value = err.message || 'Authentication failed'
    }
    statusType.value = 'error'
  } finally {
    isLoading.value = false
  }
}

async function handleSignOut() {
  await supabase.signOut()
  isAuthenticated.value = false
  currentUser.value = null
  statusMessage.value = ''
  emits('auth-changed', false)
}
</script>

<template>
  <fieldset>
    <legend>
      <span class="step-badge">1</span>
      Authenticate
    </legend>

    <div v-if="!configured" class="not-configured">
      <p>Supabase is not configured. Set <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> environment variables to enable authentication.</p>
    </div>

    <div v-else-if="isAuthenticated" class="authenticated">
      <div class="user-info">
        <div class="user-avatar">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
          </svg>
        </div>
        <div>
          <span class="user-email">{{ currentUser?.email || 'Logged in' }}</span>
          <span class="user-status">Connected</span>
        </div>
      </div>
      <button class="btn btn-secondary" @click="handleSignOut">Sign Out</button>
    </div>

    <div v-else class="auth-form">
      <div class="auth-toggle">
        <button :class="['toggle-option', { active: !isSignUp }]" @click="isSignUp = false">Sign In</button>
        <button :class="['toggle-option', { active: isSignUp }]" @click="isSignUp = true">Sign Up</button>
      </div>

      <div class="input-group">
        <input type="email" v-model="email" placeholder="Email address" @keyup.enter="handleAuth">
        <input type="password" v-model="password" placeholder="Password" @keyup.enter="handleAuth">
      </div>

      <button class="btn btn-primary full-width" @click="handleAuth" :disabled="isLoading">
        <svg v-if="isLoading" class="spin" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
        <template v-else>{{ isSignUp ? 'Create Account' : 'Sign In' }}</template>
      </button>

      <p v-if="statusMessage" :class="['status', statusType]">{{ statusMessage }}</p>
    </div>
  </fieldset>
</template>

<style scoped>
.not-configured {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 8px;
  padding: 1rem;
}

.not-configured p {
  margin: 0;
  font-size: 0.9rem;
  color: var(--danger);
}

.not-configured code {
  background: rgba(239, 68, 68, 0.15);
  padding: 0.15rem 0.4rem;
  border-radius: 4px;
  font-size: 0.8rem;
}

.authenticated {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  padding: 1rem 1.25rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary), var(--primary-light));
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-email {
  display: block;
  font-weight: 500;
  font-size: 0.925rem;
}

.user-status {
  display: block;
  font-size: 0.75rem;
  color: var(--success);
}

.btn-secondary {
  background: var(--bg-card);
  color: var(--font-color);
  border: 1px solid var(--border-color);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-family: inherit;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary:hover {
  border-color: var(--danger);
  color: var(--danger);
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.auth-toggle {
  display: flex;
  background: var(--bg-secondary);
  border-radius: 8px;
  padding: 4px;
  border: 1px solid var(--border-color);
}

.toggle-option {
  flex: 1;
  padding: 0.5rem;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: var(--font-secondary);
  font-family: inherit;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.toggle-option.active {
  background: linear-gradient(135deg, var(--primary), var(--primary-light));
  color: white;
  box-shadow: 0 2px 4px rgba(108, 92, 231, 0.3);
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.full-width {
  width: 100%;
  justify-content: center;
}

.status {
  font-size: 0.85rem;
  margin: 0;
  text-align: center;
}

.status.success { color: var(--success); }
.status.error { color: var(--danger); }
.status.info { color: var(--primary); }

.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
