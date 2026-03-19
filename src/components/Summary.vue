<template>
  <section id="features">
    <h2>Why use this?</h2>
    <div class="features-grid">
      <div class="feature-card card">
        <div class="feature-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="17" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="17" y1="18" x2="3" y2="18"/>
          </svg>
        </div>
        <h3>Reorder Addons</h3>
        <p>Drag and drop your addons into the perfect order. Control how streams are prioritized.</p>
      </div>
      <div class="feature-card card">
        <div class="feature-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
          </svg>
        </div>
        <h3>Remove Addons</h3>
        <p>Clean up your addon list by removing the ones you no longer need.</p>
      </div>
      <div class="feature-card card">
        <div class="feature-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
        </div>
        <h3>Safe & Private</h3>
        <p>Everything runs in your browser. Your credentials go directly to Nuvio's servers over HTTPS.</p>
      </div>
    </div>

    <div class="how-section card">
      <h3>How does it work?</h3>
      <ol>
        <li>
          <strong>Sign In</strong> &mdash; Log in with your Nuvio account (the same one you use in the app).
        </li>
        <li>
          <strong>Load Addons</strong> &mdash; Fetch your current synced addon list from the cloud.
        </li>
        <li>
          <strong>Reorder &amp; Remove</strong> &mdash; Drag addons to rearrange or delete the ones you don't want.
        </li>
        <li>
          <strong>Sync</strong> &mdash; Push the updated order back to your account and restart the Nuvio app.
        </li>
      </ol>
    </div>
  </section>
</template>

<style scoped>
.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}

.feature-card {
  text-align: center;
  padding: 1.5rem 1rem;
}

.feature-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--primary), var(--primary-light));
  color: white;
  margin-bottom: 1rem;
}

.feature-card h3 {
  margin-bottom: 0.5rem;
}

.feature-card p {
  font-size: 0.875rem;
}

.how-section ol {
  padding-left: 1.5rem;
}

.how-section li {
  margin-bottom: 0.75rem;
  color: var(--font-secondary);
}

.how-section li strong {
  color: var(--font-color);
}

@media (max-width: 640px) {
  .features-grid {
    grid-template-columns: 1fr;
  }
}
</style>
