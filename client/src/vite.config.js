// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import svgr from "vite-plugin-svgr";

// export default defineConfig({
//   plugins: [
//     react(),
//     svgr({
//       include: "**/*.svg?react",
//       svgrOptions: { icon: true, svgo: true },
//     }),
//   ],
// });

// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [
    react(),
    svgr({
      // añadimos ambos patrones para que SVGR intercepte
      include: ['**/*.svg?react', '**/*.svg?import&react'],
      svgrOptions: { icon: true, svgo: true }
    }),
  ],
});