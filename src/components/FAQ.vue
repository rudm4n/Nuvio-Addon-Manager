<script setup>
import { ref } from 'vue'

const openIndex = ref(null)

function toggle(index) {
  openIndex.value = openIndex.value === index ? null : index
}

const faqs = [
  {
    q: 'What risks are involved?',
    a: 'This tool interacts with the Stremio API to manipulate your addon list. While generally safe, it is possible that changing addon order could affect some functionality. There is currently no built-in way to reset to a default configuration, so proceed with care.'
  },
  {
    q: 'Are my credentials safe?',
    a: 'Yes. Your credentials are sent directly from your browser to the official Stremio API (api.strem.io) over HTTPS. Nothing is stored on our servers — this is a fully client-side application. Once you refresh the page, all data is gone.'
  },
  {
    q: 'How do I get my Auth Key?',
    a: 'Login to https://web.stremio.com/ using your credentials. Open the browser developer console (F12 or Ctrl+Shift+I) and paste: JSON.parse(localStorage.getItem("profile")).auth.key — the output is your auth key.'
  },
  {
    q: 'Can I use this with Nuvio and Stremio?',
    a: 'Yes! Since Nuvio uses the same Stremio addon protocol, this tool works with both apps. Any changes you make will be reflected in both Nuvio and Stremio after restarting the app.'
  },
  {
    q: 'Can I move default catalogs?',
    a: 'Yes! You can reorder the default Cinemeta catalogs (Popular, Featured, etc.) to any position. Note that the built-in "Continue Watching" catalog cannot be moved.'
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
