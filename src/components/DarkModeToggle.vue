<script setup>
import { ref, onMounted } from 'vue'

let darkEnabled = ref(getDarkModePreference())

function getDarkModePreference() {
  const userSet = localStorage.getItem('darkMode')
  if (userSet !== null) {
    return userSet === 'true'
  }
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return true
  }
  return false
}

function toggleMode() {
  darkEnabled.value = !darkEnabled.value
  localStorage.setItem('darkMode', darkEnabled.value)
  document.body.classList.toggle('dark')
}

onMounted(() => {
  if (darkEnabled.value) {
    document.body.classList.add('dark')
  }
})
</script>

<template>
  <div class="toggle-wrapper">
    <button class="toggle-btn" @click="toggleMode" :title="darkEnabled ? 'Switch to light mode' : 'Switch to dark mode'">
      <svg v-if="darkEnabled" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="5"/>
        <line x1="12" y1="1" x2="12" y2="3"/>
        <line x1="12" y1="21" x2="12" y2="23"/>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
        <line x1="1" y1="12" x2="3" y2="12"/>
        <line x1="21" y1="12" x2="23" y2="12"/>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
      </svg>
      <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
      </svg>
    </button>
  </div>
</template>

<style scoped>
.toggle-wrapper {
  display: flex;
  justify-content: flex-end;
  padding: 1rem 0;
}

.toggle-btn {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 50%;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--font-color);
  transition: all 0.2s ease;
}

.toggle-btn:hover {
  border-color: var(--primary);
  color: var(--primary);
  transform: rotate(15deg);
}
</style>
