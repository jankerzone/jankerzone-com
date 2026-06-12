// Single source of truth for all mini-apps.
// Used by AppMarquee.vue (homepage carousel) and AppList.vue (/apps page).
// Add new apps here — colors rotate automatically (indigo → coral → amber → jade).
export const apps = [
  { g: 'Bw', name: 'Brain War 2025', path: '/brain-war', tag: 'game', desc: 'Nostalgic single-player quiz — 100 random questions to test your knowledge.', link: 'https://robsan.my.id/apps/brain-war' },
  { g: '¤', name: 'Currency Converter', path: '/converter', tag: 'tool', desc: 'Real-time exchange rates around the world.', link: 'https://robsan.my.id/apps/converter' },
  { g: '31', name: 'Simple Calendar', path: '/calendar', tag: 'tool', desc: 'National holidays, joint leave & important dates.', link: 'https://robsan.my.id/apps/calendar' },
  { g: '?', name: 'Decision Maker', path: '/decision-maker', tag: 'fun', desc: "Let the app decide when you can't.", link: 'https://robsan.my.id/apps/decision-maker' },
  { g: '{}', name: 'JSON → CSV', path: '/json-csv', tag: 'dev', desc: 'Convert JSON to CSV with advanced options.', link: 'https://robsan.my.id/apps/json-csv' },
  { g: '▣', name: 'Box Manager', path: '/pindahan', tag: 'life', desc: 'Document & organize boxes when moving house.', link: 'https://pindahan.jankerzone.com/' },
  { g: 'Rp', name: 'Money Management', path: '/tagihan', tag: 'life', desc: 'Bills & spending dashboard.', link: 'https://tagihan.jankerzone.com/' },
  { g: '⚙', name: 'Servis Rutin', path: '/servisrutin', tag: 'life', desc: 'Maintenance logs for your car, bike & gear.', link: 'https://servisrutin.jankerzone.com/' },
  { g: '✂', name: 'Cangcut Editor', path: '/cangcut', tag: 'video', desc: 'Lightweight web-based video editor, CapCut-inspired.', link: 'https://cangcut.jankerzone.com/' },
]
