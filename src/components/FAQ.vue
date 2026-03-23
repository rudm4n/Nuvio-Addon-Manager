<script setup>
import { ref } from 'vue'

const openIndex = ref(null)

function toggle(index) {
  openIndex.value = openIndex.value === index ? null : index
}

const faqs = [
  {
    q: 'Do I need a Nuvio account?',
    a: 'Yes. This tool connects to Nuvio\'s cloud backend (Supabase) to manage your synced addons. You need the same account you use in the Nuvio app. If you don\'t have cloud sync enabled, this tool won\'t be able to see your addons.'
  },
  {
    q: 'Are my credentials safe?',
    a: 'Yes. Your credentials are sent directly from your browser to Nuvio\'s Supabase backend over HTTPS. This is a fully client-side application — nothing passes through or is stored on any intermediate server. Once you close the page, your session is gone.'
  },
  {
    q: 'What happens after I sync?',
    a: 'After syncing, the new addon order is saved to the cloud. Next time you open the Nuvio app, it will pull the updated addon list during startup sync. You may need to restart the app to see the changes.'
  },
  {
    q: 'Will this affect my Stremio addons too?',
    a: 'No. Nuvio has its own separate addon management system. Changes made here only affect your Nuvio addon list, not your Stremio installation.'
  },
  {
    q: 'What if I don\'t see all my addons?',
    a: 'This tool only shows addons that have been synced to the cloud. If you installed addons while not logged in, or before enabling sync, they may only exist locally on your device. Open the Nuvio app, sign in, and trigger a sync to upload them first.'
  }
]
</script>

<template>
  <section id="faq">
    <h2>Frequently Asked Questions</h2>
    <div class="faq-list">
      <div v-for="(faq, index) in faqs" :key="index" class="faq-item card" :class="{ open: openIndex === index }">
        <button class="faq-question" @click="toggle(index)">
          <span>{{ faq.q }}</span>
          <svg class="chevron" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </button>
        <div class="faq-answer" v-show="openIndex === index">
          <p>{{ faq.a }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.faq-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.faq-item {
  padding: 0;
  overflow: hidden;
}

.faq-question {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  background: none;
  border: none;
  font-family: inherit;
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--font-color);
  cursor: pointer;
  text-align: left;
}

.faq-question:hover {
  color: var(--primary);
}

.chevron {
  transition: transform 0.2s ease;
  flex-shrink: 0;
  color: var(--font-secondary);
}

.faq-item.open .chevron {
  transform: rotate(180deg);
}

.faq-answer {
  padding: 0 1.25rem 1rem;
}

.faq-answer p {
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.7;
}
</style>
