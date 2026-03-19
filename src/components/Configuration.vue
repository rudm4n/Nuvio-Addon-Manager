<script setup>
import { ref } from 'vue'
import draggable from 'vuedraggable'
import AddonItem from './AddonItem.vue'
import Authentication from './Authentication.vue'
import * as supabase from '../services/supabase.js'

const dragging = false
let addons = ref([])
let isLoadingAddons = ref(false)
let isSyncing = ref(false)
let isAuthenticated = ref(supabase.isLoggedIn())

function onAuthChanged(loggedIn) {
  isAuthenticated.value = loggedIn
  if (!loggedIn) {
    addons.value = []
  }
}

async function loadAddons() {
  if (!isAuthenticated.value) {
    alert('Please sign in first.')
    return
  }

  isLoadingAddons.value = true
  try {
    addons.value = await supabase.fetchAddons()
  } catch (err) {
    alert('Failed to load addons: ' + err.message)
  } finally {
    isLoadingAddons.value = false
  }
}

async function syncAddons() {
  if (!isAuthenticated.value) {
    alert('Please sign in first.')
    return
  }

  isSyncing.value = true
  try {
    await supabase.syncAddons(addons.value)
    alert('Sync complete! Restart your Nuvio app to see the changes.')
  } catch (err) {
    alert('Sync failed: ' + err.message)
  } finally {
    isSyncing.value = false
  }
}

function removeAddon(idx) {
  addons.value.splice(idx, 1)
}

function getAddonName(addon) {
  return addon.manifest?.name || addon.manifest?.id || extractNameFromUrl(addon.url)
}

function getAddonLogo(addon) {
  return addon.manifest?.logo || ''
}

function isConfigurable(addon) {
  return addon.manifest?.behaviorHints?.configurable || false
}

function extractNameFromUrl(url) {
  try {
    const u = new URL(url)
    return u.hostname + u.pathname.replace('/manifest.json', '')
  } catch {
    return url
  }
}
</script>

<template>
  <section id="configure">
    <h2>Configure</h2>
    <div class="card config-card">
      <form @submit.prevent>
        <Authentication @auth-changed="onAuthChanged" />

        <fieldset>
          <legend>
            <span class="step-badge">2</span>
            Load your Addons
          </legend>
          <button class="btn btn-primary" @click="loadAddons" :disabled="!isAuthenticated || isLoadingAddons">
            <svg v-if="isLoadingAddons" class="spin" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
            </svg>
            {{ isLoadingAddons ? 'Loading...' : 'Load Addons' }}
          </button>
        </fieldset>

        <fieldset>
          <legend>
            <span class="step-badge">3</span>
            Reorder your Addons
          </legend>
          <p v-if="addons.length === 0" class="empty-state">
            No addons loaded yet. Sign in and click "Load Addons" to get started.
          </p>
          <draggable
            v-else
            :list="addons"
            item-key="url"
            class="addon-list"
            ghost-class="ghost"
            @start="dragging = true"
            @end="dragging = false"
          >
            <template #item="{ element, index }">
              <AddonItem
                :name="getAddonName(element)"
                :idx="index"
                :manifestURL="element.url"
                :logoURL="getAddonLogo(element)"
                :isDeletable="true"
                :isConfigurable="isConfigurable(element)"
                @delete-addon="removeAddon"
              />
            </template>
          </draggable>
        </fieldset>

        <fieldset v-if="addons.length > 0">
          <legend>
            <span class="step-badge">4</span>
            Sync Changes
          </legend>
          <button class="btn btn-primary" @click="syncAddons" :disabled="isSyncing">
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
