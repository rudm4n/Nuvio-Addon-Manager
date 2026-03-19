---
title: Nuvio Addon Manager
emoji: 📦
colorFrom: purple
colorTo: indigo
sdk: docker
app_port: 7860
pinned: false
---

# Nuvio Addon Manager

Web-based addon manager for [Nuvio](https://github.com/tapframe/NuvioStreaming). Reorder, remove, and manage your Nuvio addons from the browser.

## Features

- Sign in with your Nuvio account
- Drag-and-drop addon reordering
- Remove unwanted addons
- Sync changes back to the cloud
- Dark/light mode
- Fully client-side (no data stored on our servers)

## Setup

### Environment Variables

Create a `.env` file based on `.env.example`:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

These should match the Supabase credentials used by your Nuvio instance.

### Development

```bash
npm install
npm run dev
```

### Build

```bash
npm run build
```

### Deploy to HuggingFace Spaces

1. Create a new Space on HuggingFace with **Docker** SDK
2. Push this repo to the Space
3. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as build secrets/variables
4. The app will be available on port 7860
