<script setup>
defineProps({
  addonName: { type: String, required: true },
  addonSummary: { type: String, required: false },
  addonTagline: { type: String, required: false }
})
</script>

<template>
  <div class="hero">
    <div class="logo-icon">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="80" height="80">
        <defs>
          <linearGradient id="hg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#6C5CE7"/>
            <stop offset="100%" style="stop-color:#a855f7"/>
          </linearGradient>
        </defs>
        <rect width="64" height="64" rx="14" fill="url(#hg)"/>
        <text x="32" y="44" font-family="Arial,sans-serif" font-weight="bold" font-size="36" fill="white" text-anchor="middle">N</text>
      </svg>
    </div>
    <h1>{{ addonName }}</h1>
    <p class="summary">{{ addonSummary }}</p>
    <p class="tagline">{{ addonTagline }}</p>
  </div>
</template>

<style scoped>
.hero {
  text-align: center;
  padding: 2rem 0 3rem;
}

.logo-icon {
  margin-bottom: 1.25rem;
}

.hero h1 {
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, var(--primary), var(--primary-light));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.75rem;
}

.summary {
  font-size: 1.15rem;
  color: var(--font-secondary);
  max-width: 500px;
  margin: 0 auto 0.5rem;
}

.tagline {
  font-size: 0.9rem;
  color: var(--font-secondary);
  font-style: italic;
  opacity: 0.8;
}

@media (max-width: 640px) {
  .hero h1 {
    font-size: 1.75rem;
  }
  .summary {
    font-size: 1rem;
  }
}
</style>
