import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
    name: 'Agentic Form Filler',
    permissions: ['scripting', 'activeTab', 'storage'],
    host_permissions: [
      'http://localhost:11434/*',
      'http://127.0.0.1:11434/*',
      'https://*.ngrok-free.dev/*'
    ],
    action: {
      default_title: 'Agentic Form Filler',
    },
  },
});
