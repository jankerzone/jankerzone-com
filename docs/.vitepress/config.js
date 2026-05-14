export default {
  title: "Jankerzone",
  description: "My corner of the internet.",
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }]
  ],
  themeConfig: {
    search: {
      provider: "local",
    },
    sidebar: [
      {
        text: "Getting Started",
        items: [
          { text: "About", link: "/about" },
          {
            text: "Mini Apps & Tools",
            link: "/apps",
            items: [
              { text: "Brain War 2025", link: "https://robsan.my.id/apps/brain-war" },
              { text: "Currency Converter", link: "https://robsan.my.id/apps/converter" },
              { text: "Simple Calendar", link: "https://robsan.my.id/apps/calendar" },
              { text: "Decision Maker", link: "https://robsan.my.id/apps/decision-maker" },
              { text: "JSON to CSV", link: "https://robsan.my.id/apps/json-csv" },
              { text: "Servis Rutin", link: "https://servisrutin.jankerzone.com/" },
              { text: "Box Manager", link: "https://pindahan.jankerzone.com/" },
              {
                text: "Money Management",
                link: "https://tagihan.jankerzone.com/",
              },
              {
                text: "Web-based Video Editor",
                link: "https://cangcut.jankerzone.com/",
              },
            ],
          },
          { text: "Notes", link: "/notes" },
        ],
      },
      {
        text: "Getting Touch",
        items: [
          { text: "LinkedIn", link: "https://linkedin.com/in/jankerzone" },
          { text: "Twitter", link: "https://twitter.com/jankerzone" },
          { text: "Instagram", link: "https://instagram.com/jankerzone" },
        ],
      },
    ],
    nav: [
      { text: "Home", link: "/" },
      { text: "Blog", link: "https://blog.jankerzone.com" },
    ],
    footer: {
      message: "All Right Reserved",
      copyright: "© 2012 - 2025 Jankerzone",
    },
    docFooter: {
      prev: false,
      next: false,
    },
  },
};
