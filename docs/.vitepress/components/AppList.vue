<script setup>
import { ref, computed } from 'vue'
import { apps } from '../data/apps.js'

const active = ref('all')

const tags = computed(() => {
  const counts = {}
  for (const a of apps) counts[a.tag] = (counts[a.tag] || 0) + 1
  return [['all', apps.length], ...Object.entries(counts)]
})

const shown = computed(() =>
  active.value === 'all' ? apps : apps.filter((a) => a.tag === active.value)
)

// Color is tied to the app's position in the master list,
// so it stays stable while filtering.
const colorOf = (a) => `c${apps.indexOf(a) % 4}`
</script>

<template>
  <div class="jz-applist">
    <div class="jz-filters" role="tablist" aria-label="Filter apps by tag">
      <button
        v-for="[t, n] in tags"
        :key="t"
        class="jz-chip"
        :class="{ on: active === t }"
        role="tab"
        :aria-selected="active === t"
        @click="active = t"
      >
        {{ t }}<span class="n">{{ n }}</span>
      </button>
    </div>

    <div class="jz-term">
      <div class="jz-term-head">
        <span class="dots"><i></i><i></i><i></i></span>
        <span>$ ls -la ~/apps · {{ shown.length }} item{{ shown.length === 1 ? '' : 's' }}</span>
      </div>
      <a
        v-for="a in shown"
        :key="a.name"
        class="jz-row"
        :class="colorOf(a)"
        :href="a.link"
        target="_blank"
        rel="noreferrer"
      >
        <span class="glyph">{{ a.g }}</span>
        <span class="name">{{ a.name }}<span class="path">{{ a.path }}</span></span>
        <span class="tag">{{ a.tag }}</span>
        <span class="desc">{{ a.desc }}</span>
        <span class="open">open →</span>
      </a>
    </div>

    <div class="jz-footnote">
      <span class="dot"></span>all apps are free, no accounts, no tracking
    </div>
  </div>
</template>

<style scoped>
.jz-applist {
  margin-top: 28px;
}

/* ---------- filter chips ---------- */
.jz-filters {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 22px;
}
.jz-chip {
  font-family: var(--vp-font-family-mono);
  font-size: 12.5px;
  line-height: 1.4;
  padding: 6px 14px;
  border-radius: 99px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: border-color 0.15s ease, color 0.15s ease;
}
.jz-chip:hover {
  border-color: var(--vp-c-text-2);
  color: var(--vp-c-text-1);
}
.jz-chip.on {
  background: var(--vp-c-text-1);
  color: var(--vp-c-bg);
  border-color: var(--vp-c-text-1);
}
.jz-chip .n {
  opacity: 0.6;
  margin-left: 5px;
}

/* ---------- terminal window ---------- */
.jz-term {
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  background: var(--vp-c-bg-soft);
  overflow: hidden;
}
.jz-term-head {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 13px 20px;
  border-bottom: 1px solid var(--vp-c-divider);
  font-family: var(--vp-font-family-mono);
  font-size: 12.5px;
  color: var(--vp-c-text-2);
}
.jz-term-head .dots {
  display: flex;
  gap: 6px;
}
.jz-term-head .dots i {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--vp-c-divider);
}

/* ---------- rows ---------- */
.jz-row {
  display: grid;
  grid-template-columns: 36px 180px auto 1fr auto;
  gap: 14px;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid var(--vp-c-divider);
  text-decoration: none !important;
  color: var(--vp-c-text-1);
  font-weight: 400;
  transition: background 0.15s ease;
}
.jz-row:last-child {
  border-bottom: none;
}
.jz-row:hover {
  background: var(--vp-c-bg);
}
.jz-row .glyph {
  font-size: 21px;
  font-weight: 800;
  text-align: center;
  line-height: 1;
}
.jz-row .name {
  font-size: 15px;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--vp-c-text-1);
}
.jz-row .name .path {
  display: block;
  font-family: var(--vp-font-family-mono);
  font-size: 11px;
  font-weight: 400;
  color: var(--vp-c-text-3);
  margin-top: 2px;
}
.jz-row .tag {
  font-family: var(--vp-font-family-mono);
  font-size: 10px;
  letter-spacing: 0.05em;
  padding: 3px 8px;
  border-radius: 99px;
  border: 1px solid currentColor;
  opacity: 0.75;
  justify-self: start;
}
.jz-row .desc {
  font-size: 13.5px;
  line-height: 1.5;
  color: var(--vp-c-text-2);
}
.jz-row .open {
  font-family: var(--vp-font-family-mono);
  font-size: 12.5px;
  font-weight: 500;
  white-space: nowrap;
}

.jz-row.c0 .glyph, .jz-row.c0 .tag, .jz-row.c0 .open { color: var(--jz-indigo); }
.jz-row.c1 .glyph, .jz-row.c1 .tag, .jz-row.c1 .open { color: var(--jz-coral); }
.jz-row.c2 .glyph, .jz-row.c2 .tag, .jz-row.c2 .open { color: var(--jz-amber); }
.jz-row.c3 .glyph, .jz-row.c3 .tag, .jz-row.c3 .open { color: var(--jz-jade); }

/* ---------- footnote ---------- */
.jz-footnote {
  margin-top: 22px;
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
  color: var(--vp-c-text-2);
  display: flex;
  gap: 8px;
  align-items: center;
}
.jz-footnote .dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--jz-jade);
}

/* ---------- narrow screens: stack the row ---------- */
@media (max-width: 720px) {
  .jz-row {
    grid-template-columns: 36px 1fr auto;
    grid-template-areas:
      'glyph name tag'
      'glyph desc desc'
      'glyph open open';
    row-gap: 6px;
  }
  .jz-row .glyph { grid-area: glyph; align-self: start; margin-top: 2px; }
  .jz-row .name { grid-area: name; }
  .jz-row .tag { grid-area: tag; justify-self: end; }
  .jz-row .desc { grid-area: desc; }
  .jz-row .open { grid-area: open; }
}
</style>
