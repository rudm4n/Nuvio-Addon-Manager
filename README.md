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

## Deploy on HuggingFace Spaces

### 1. Fork this repo

Click **Fork** on GitHub.

### 2. Create a HuggingFace Space

1. Go to [huggingface.co/new-space](https://huggingface.co/new-space)
2. Give it a name (e.g. `nuvio-addon-manager`)
3. Select **Docker** as SDK
4. Choose **Blank** template
5. Click **Create Space**

### 3. Push the code to HuggingFace

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/Nuvio-Addon-Manager
cd Nuvio-Addon-Manager

# Add HuggingFace as remote
git remote add hf https://huggingface.co/spaces/YOUR_HF_USERNAME/nuvio-addon-manager

# Push
git push hf main
```

That's it. HuggingFace will build the Docker image and deploy automatically. The app will be live at:

```
https://YOUR_HF_USERNAME-nuvio-addon-manager.hf.space
```

No configuration needed — the Nuvio Supabase keys are already included.

### Alternative: HuggingFace GUI upload

1. Open your Space on HuggingFace
2. Go to **Files** tab
3. Click **Upload files**
4. Upload all the files from this repo
5. HuggingFace will auto-build and deploy

## Local Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```
