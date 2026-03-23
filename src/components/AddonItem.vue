<script setup>
const props = defineProps({
  name: { type: String, required: true },
  idx: { type: Number, required: true },
  manifestURL: { type: String, required: true },
  logoURL: { type: String, required: false },
  isDeletable: { type: Boolean, default: true },
  isConfigurable: { type: Boolean, default: false }
})

const emits = defineEmits(['delete-addon'])

const defaultLogo = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2'%3E%3Cpath d='M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z'/%3E%3C/svg%3E"

function copyManifestURLToClipboard() {
  navigator.clipboard.writeText(props.manifestURL)
}

function openAddonConfigurationPage() {
  const configureURL = props.manifestURL.replace('stremio://', 'https://').replace('/manifest.json', '/configure')
  window.open(configureURL)
}

function removeAddon() {
  emits('delete-addon', props.idx)
}
</script>

<template>
  <div class="addon-item">
    <div class="addon-info">
      <div class="addon-logo">
        <img :src="logoURL || defaultLogo" :alt="name" @error="$event.target.src = defaultLogo" />
      </div>
      <div class="addon-details">
        <span class="addon-name">{{ name }}</span>
        <span class="addon-index">#{{ idx + 1 }}</span>
      </div>
    </div>
    <div class="addon-actions">
      <button class="btn-icon" title="Open addon configuration" :disabled="!isConfigurable" @click="openAddonConfigurationPage">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
        </svg>
      </button>
      <button class="btn-icon" title="Copy manifest URL" @click="copyManifestURLToClipboard">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
        </svg>
      </button>
      <button class="btn-icon delete" title="Remove addon" :disabled="!isDeletable" @click="removeAddon">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
        </svg>
      </button>
      <div class="drag-handle" title="Drag to reorder">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="9" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="19" r="1"/>
          <circle cx="15" cy="5" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="19" r="1"/>
        </svg>
      </div>
    </div>
  </div>
</template>

<style scoped>
.addon-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  margin-bottom: 0.5rem;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  cursor: grab;
  transition: all 0.2s ease;
}

.addon-item:hover {
  border-color: var(--primary);
  box-shadow: 0 2px 8px rgba(108, 92, 231, 0.1);
}

.addon-item:active {
  cursor: grabbing;
}

.addon-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
  min-width: 0;
}

.addon-logo {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  overflow: hidden;
  background: var(--bg-secondary);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.addon-logo img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.addon-details {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.addon-name {
  font-weight: 500;
  font-size: 0.925rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.addon-index {
  font-size: 0.75rem;
  color: var(--font-secondary);
}

.addon-actions {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  flex-shrink: 0;
}

.btn-icon.delete:not(:disabled):hover {
  border-color: var(--danger);
  color: var(--danger);
  background: rgba(239, 68, 68, 0.1);
}

.drag-handle {
  color: var(--font-secondary);
  opacity: 0.5;
  padding: 0.25rem;
  cursor: grab;
}

@media (max-width: 640px) {
  .addon-item {
    padding: 0.625rem 0.75rem;
  }
  .addon-logo {
    width: 36px;
    height: 36px;
  }
}
</style>
