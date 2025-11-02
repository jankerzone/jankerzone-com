export default {
  title: "Jankerzone",
  description: "My corner of the internet.",
  themeConfig: {
    search: {
      provider: "local",
    },
    sidebar: [
      {
        text: "Getting Started",
        items: [
          { text: "About", link: "/about" },
          { text: "Mini Apps & Tools", link: "/apps" },
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
