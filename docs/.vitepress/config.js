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
              { text: "Brain War 2025", link: "/apps/brain-war" },
              { text: "Currency Converter", link: "/apps/converter" },
              { text: "Simple Calendar", link: "/apps/calendar" },
              { text: "Decision Maker", link: "/apps/decision-maker" },
              { text: "JSON to CSV", link: "/apps/json-csv" },
              { text: "Box Manager", link: "https://pindahan.jankerzone.com/" },
              {
                text: "Money Management",
                link: "https://tagihanserampangan.vercel.app/",
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
