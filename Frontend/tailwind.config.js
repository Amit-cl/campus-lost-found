export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0b0f16",
        panel: "#131a25",
        panelSoft: "#1d2636",
        muted: "#98a2b8",
        gold: "#f5ae44",
        cream: "#f3eee7",
      },
      fontFamily: {
        display: ['Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: "0 20px 80px rgba(245, 174, 68, 0.12)",
      },
    },
  },
  plugins: [],
};
