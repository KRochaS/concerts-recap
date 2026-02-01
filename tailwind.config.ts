export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    extend: {
      colors: {
        "background-primary": "#050505",
        "background-secondary": "#0F0F10",
        "background-tertiary": "#19191A",
        "content-body": "#CDCBCC",
        "content-placeholder": "#827D7F",
        "content-headline": "#B2B2B2",
        "border-primary": "#19191A",
        "border-secondary": "#323234",
        "border-tertiary": "#97979B",
        "accent-purple": "#4B2DBB",
        "accent-green": "#87BB2D",
        "accent-pink": "#B5446B",
      },

      backgroundImage: {
        stripes:
          "linear-gradient(to bottom, rgba(50, 50, 50, 0.8), rgba(50, 50, 50, 0.8) 12.5%, transparent 12.5%, transparent)",
      },

      fontSize: {
        "5xl": "2.5rem",
      },

      backgroundSize: {
        stripes: "100% 8px",
      },

      blur: {
        full: "194px",
      },
    },
  },

  plugins: [],
};
