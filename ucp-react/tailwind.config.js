// tailwind.config.js
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg1: "#0F172A",
        bg2: "#111827",
        accent: "#67E8F9",
        glass: "rgba(255,255,255,0.08)",
        glassBorder: "rgba(255,255,255,0.15)",
        glassHover: "rgba(255,255,255,0.12)",
      },
      boxShadow: {
        glass: "0 24px 70px rgba(0,0,0,0.35)",
        neon: "0 0 0 1px rgba(103,232,249,0.25), 0 0 35px rgba(124,58,237,0.25)",
      },
      borderRadius: {
        xl2: "20px",
        xl3: "24px",
      },
      keyframes: {
        mesh: { "0%,100%": { backgroundPosition: "0% 50%" }, "50%": { backgroundPosition: "100% 50%" } },
        floaty: { "0%,100%": { transform: "translateY(0px)" }, "50%": { transform: "translateY(-12px)" } },
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { transform: "translateY(20px)", opacity: 0 }, to: { transform: "translateY(0)", opacity: 1 } },
      },
      animation: {
        mesh: "mesh 18s ease infinite",
        floaty: "floaty 7s ease-in-out infinite",
        fadeIn: "fadeIn 0.3s ease-out",
        slideUp: "slideUp 0.4s ease-out",
      },
    },
  },
  corePlugins: { preflight: false },
  plugins: [
    function ({ addComponents, addUtilities }) {
       
      addComponents({
        ".glass-card": {
          background: "rgba(255, 255, 255, 0.08)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "scale(1.02)",
            borderColor: "rgba(255, 255, 255, 0.3)",
            boxShadow: "0 8px 40px rgba(79, 70, 229, 0.3)",
          },
        },
        ".gradient-btn": {
          background: "linear-gradient(135deg, #4F46E5, #7C3AED)",
          color: "white",
          border: "none",
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "scale(1.05)",
            boxShadow: "0 0 20px rgba(79, 70, 229, 0.4)",
          },
        },
        ".glass-btn": {
          background: "rgba(255, 255, 255, 0.08)",
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          color: "white",
          transition: "all 0.3s ease",
          "&:hover": {
            background: "rgba(255, 255, 255, 0.15)",
          },
        },
      });

      
      addUtilities({
        ".animate-fadeIn": {
          animation: "fadeIn 0.3s ease-out",
        },
        ".animate-slideUp": {
          animation: "slideUp 0.4s ease-out",
        },
      });
    },
  ],
};