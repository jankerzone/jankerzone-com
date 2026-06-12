<script setup>
import DefaultTheme from 'vitepress/theme'
import AppMarquee from '../components/AppMarquee.vue'

const { Layout } = DefaultTheme
</script>

<template>
  <Layout>
    <!-- Custom "Playroom" hero: replaces name/text/tagline only.
         Actions still come from index.md frontmatter. -->
    <template #home-hero-info>
      <div class="jz-hero">
        <div class="jz-kicker">
          <img src="/images/profile.jpg" alt="Robsan" />
          <span>Robsan · builder of small things</span>
          <span class="jz-dot"></span>
        </div>
        <h1 class="jz-name">
          <span class="jz-hi">Hello,<i></i></span>
          <span class="jz-world">World.</span>
        </h1>
        <p class="jz-sub">
          This is my corner of the internet. I write, build, and tinker with
          tech — currently <code>9 apps</code>, <code>3 notes</code>, and counting.
        </p>
      </div>
    </template>

    <!-- App carousel between hero and feature cards -->
    <template #home-hero-after>
      <AppMarquee />
    </template>
  </Layout>
</template>
