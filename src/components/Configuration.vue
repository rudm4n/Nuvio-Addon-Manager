<script setup>
import { ref } from 'vue'
import draggable from 'vuedraggable'
import AddonItem from './AddonItem.vue'
import Authentication from './Authentication.vue'

const stremioAPIBase = 'https://api.strem.io/api/'
const dragging = false
let stremioAuthKey = ref('')
let addons = ref([])
let loadAddonsButtonText = ref('Load Addons')
let isSyncing = ref(false)

function loadUserAddons() {
  const key = stremioAuthKey.value
  if (!key) {
    alert('Please authenticate first.')
    return
  }

  loadAddonsButtonText.value = 'Loading...'

  fetch(`${stremioAPIBase}addonCollectionGet`, {
    method: 'POST',
    body: JSON.stringify({
      type: 'AddonCollectionGet',
      authKey: key,
      update: true,
    })
  }).then((resp) => {
    resp.json().then((data) => {
      if (!('result' in data) || data.result == null) {
        alert('Failed to fetch addons. Please check your authentication.')
        return
      }
      addons.value = data.result.addons
    })
  }).catch((error) => {
    alert('Error fetching addons: ' + error.message)
  }).finally(() => {
    loadAddonsButtonText.value = 'Load Addons'
  })
}

function syncUserAddons() {
  const key = stremioAuthKey.value
  if (!key) {
    alert('Please authenticate first.')
    return
  }

  isSyncing.value = true

  fetch(`${stremioAPIBase}addonCollectionSet`, {
    method: 'POST',
    body: JSON.stringify({
      type: 'AddonCollectionSet',
      authKey: key,
      addons: addons.value,
    })
  }).then((resp) => {
    resp.json().then((data) => {
      if (!('result' in data) || data.result == null) {
        alert('Sync failed. Unknown error.')
      } else if (!data.result.success) {
        alert('Failed to sync addons: ' + data.result.error)
      } else {
        alert('Sync complete! Restart your Nuvio app to see the changes.')
      }
    })
  }).catch((error) => {
    alert('Error syncing addons: ' + error.message)
  }).finally(() => {
    isSyncing.value = false
  })
}

function removeAddon(idx) {
  addons.value.splice(idx, 1)
}

function getNestedObjectProperty(obj, path, defaultValue = null) {
  try {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj)
  } catch (e) {
    return defaultValue
  }
}

function setAuthKey(authKey) {
  stremioAuthKey.value = authKey
}
</script>

<template>
  <section id="configure">
    <h2>Configure</h2>
    <div class="card config-card">
      <form @submit.prevent>
        <Authentication :stremioAPIBase="stremioAPIBase" @auth-key="setAuthKey" />

        <fieldset>
          <legend>
            <span class="step-badge">1</span>
            Load your Addons
          </legend>
          <button class="btn btn-primary" @click="loadUserAddons">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
            </svg>
            {{ loadAddonsButtonText }}
          </button>
        </fieldset>

        <fieldset>
          <legend>
            <span class="step-badge">2</span>
            Reorder your Addons
          </legend>
          <p v-if="addons.length === 0" class="empty-state">
            No addons loaded yet. Authenticate and click "Load Addons" to get started.
          </p>
          <draggable
            v-else
            :list="addons"
            item-key="transportUrl"
            class="addon-list"
            ghost-class="ghost"
            @start="dragging = true"
            @end="dragging = false"
          >
            <template #item="{ element, index }">
              <AddonItem
                :name="element.manifest.name"
                :idx="index"
                :manifestURL="element.transportUrl"
                :logoURL="element.manifest.logo"
                :isDeletable="!getNestedObjectProperty(element, 'flags.protected', false)"
                :isConfigurable="getNestedObjectProperty(element, 'manifest.behaviorHints.configurable', false)"
                @delete-addon="removeAddon"
              />
            </template>
          </draggable>
        </fieldset>

        <fieldset v-if="addons.length > 0">
          <legend>
            <span class="step-badge">3</span>
            Sync Changes
          </legend>
          <button class="btn btn-primary" @click="syncUserAddons" :disabled="isSyncing">
            <svg v-if="isSyncing" class="spin" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            {{ isSyncing ? 'Syncing...' : 'Sync to Nuvio' }}
          </button>
        </fieldset>
      </form>
    </div>
  </section>
</template>

<style scoped>
.config-card {
  padding: 2rem;
}

.addon-list {
  background: var(--bg-secondary);
  border-radius: var(--radius);
  padding: 1rem;
  min-height: 60px;
}

.ghost {
  opacity: 0.4;
  background: var(--primary);
  border-radius: 10px;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: var(--font-secondary);
  font-style: italic;
}

.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
