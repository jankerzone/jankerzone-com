<script setup>
import { apps } from '../data/apps.js'

// Track is doubled so the loop is seamless (animates -50%).
const track = [...apps, ...apps]
</script>

<template>
  <section class="jz-marquee-zone" aria-label="Mini apps">
    <div class="jz-marquee-label">
      <h2>$ ls ~/apps</h2>
      <span># hover to pause</span>
    </div>
    <div class="jz-marquee">
      <div class="jz-marquee-track">
        <a
          v-for="(a, i) in track"
          :key="i"
          class="jz-tile"
          :class="`c${i % 4}`"
          :href="a.link"
          target="_blank"
          rel="noreferrer"
          :tabindex="i < apps.length ? 0 : -1"
          :aria-hidden="i >= apps.length"
        >
          <span class="tag">{{ a.tag }}</span>
          <span class="glyph">{{ a.g }}</span>
          <h4>{{ a.name }}</h4>
          <p>{{ a.desc }}</p>
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.jz-marquee-zone {
  padding: 8px 0 16px;
}

.jz-marquee-label {
  display: flex;
  align-items: baseline;
  gap: 14px;
  max-width: 1152px;
  margin: 0 auto;
  padding: 0 24px 18px;
}
@media (min-width: 640px) { .jz-marquee-label { padding-left: 48px; padding-right: 48px; } }
@media (min-width: 960px) { .jz-marquee-label { padding-left: 64px; padding-right: 64px; } }

.jz-marquee-label h2 {
  font-family: var(--vp-font-family-mono);
  font-size: 16px;
  font-weight: 500;
  margin: 0;
  border: none;
  padding: 0;
  color: var(--vp-c-text-1);
}
.jz-marquee-label span {
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
  color: var(--vp-c-text-3);
}

.jz-marquee {
  overflow: hidden;
}
.jz-marquee-track {
  display: flex;
  gap: 18px;
  width: max-content;
  padding: 6px 9px;
  animation: jz-scroll 36s linear infinite;
}
.jz-marquee:hover .jz-marquee-track,
.jz-marquee:focus-within .jz-marquee-track {
  animation-play-state: paused;
}
@keyframes jz-scroll {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
@media (prefers-reduced-motion: reduce) {
  .jz-marquee { overflow-x: auto; }
  .jz-marquee-track { animation: none; }
}

.jz-tile {
  width: 230px;
  height: 190px;
  flex: none;
  border-radius: 14px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  position: relative;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-1);
  text-decoration: none;
  transition: transform 0.2s ease, border-color 0.2s ease;
}
.jz-tile:nth-child(8n + 1) { transform: rotate(-0.8deg); }
.jz-tile:nth-child(8n + 4) { transform: rotate(0.9deg); }
.jz-tile:hover { transform: rotate(0deg) translateY(-3px); }

.jz-tile .glyph {
  font-size: 34px;
  line-height: 1;
  font-weight: 800;
  margin-bottom: auto;
}
.jz-tile h4 {
  margin: 0 0 4px;
  font-size: 17px;
  font-weight: 600;
  letter-spacing: -0.01em;
}
.jz-tile p {
  margin: 0;
  font-size: 12.5px;
  line-height: 1.45;
  color: var(--vp-c-text-2);
}
.jz-tile .tag {
  position: absolute;
  top: 16px;
  right: 16px;
  font-family: var(--vp-font-family-mono);
  font-size: 10px;
  letter-spacing: 0.05em;
  padding: 3px 8px;
  border-radius: 99px;
  border: 1px solid currentColor;
  opacity: 0.75;
}

.jz-tile.c0 .glyph, .jz-tile.c0 .tag { color: var(--jz-indigo); }
.jz-tile.c1 .glyph, .jz-tile.c1 .tag { color: var(--jz-coral); }
.jz-tile.c2 .glyph, .jz-tile.c2 .tag { color: var(--jz-amber); }
.jz-tile.c3 .glyph, .jz-tile.c3 .tag { color: var(--jz-jade); }
.jz-tile.c0:hover { border-color: var(--jz-indigo); }
.jz-tile.c1:hover { border-color: var(--jz-coral); }
.jz-tile.c2:hover { border-color: var(--jz-amber); }
.jz-tile.c3:hover { border-color: var(--jz-jade); }
</style>
