# Newxtbot-2 Dashboard

Nuxt 4 + Nuxt UI 4 dashboard for Newxtbot-2 Funding Rate Data Pipeline.

## Features

- 📊 Real-time funding rate monitoring
- ⚡ Workflow management (start/stop/pause/resume)
- 💰 Arbitrage opportunity detection
- 🎨 Modern UI with Nuxt UI 4
- 📱 Responsive design

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The dashboard will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

## Pages

- `/` - Dashboard overview with stats and quick actions
- `/workflows` - Manage funding rate workflows
- `/funding-rates` - View and analyze funding rates
- `/settings` - Configure dashboard and API settings

## API Integration

The dashboard connects to the Newxtbot-2 API running at `http://localhost:8000`

Available endpoints:
- `GET /health` - Health check
- `GET /workflows` - List workflows
- `POST /workflows/start` - Start new workflow
- `POST /workflows/{id}/stop` - Stop workflow
- `POST /workflows/{id}/pause` - Pause workflow
- `POST /workflows/{id}/resume` - Resume workflow

## Tech Stack

- **Framework:** Nuxt 4
- **UI Library:** Nuxt UI 4
- **State Management:** Vue Composition API
- **HTTP Client:** $fetch (ofetch)

## Project Structure

```
frontend/
├── app.vue              # App entry
├── nuxt.config.ts       # Nuxt configuration
├── pages/
│   ├── index.vue        # Dashboard
│   ├── workflows.vue    # Workflow management
│   ├── funding-rates.vue # Funding rates view
│   └── settings.vue     # Settings page
├── layouts/
│   └── default.vue      # Main layout with navigation
└── components/          # Reusable components
```

## License

MIT
