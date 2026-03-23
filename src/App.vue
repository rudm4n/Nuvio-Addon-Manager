<script setup>
import './assets/main.css'
import Header from './components/Header.vue'
import DarkModeToggle from './components/DarkModeToggle.vue'
import Summary from './components/Summary.vue'
import Configuration from './components/Configuration.vue'
import FAQ from './components/FAQ.vue'
import Footer from './components/Footer.vue'
</script>

<template>
  <header>
    <DarkModeToggle />
    <Header
      addonName="Nuvio Addon Manager"
      addonSummary="Effortlessly manage, reorder and remove your Nuvio addons."
      addonTagline="Take full control of your streaming experience." />
  </header>
  <main>
    <Summary />
    <Configuration />
    <FAQ />
  </main>
  <footer>
    <Footer />
  </footer>
</template>
