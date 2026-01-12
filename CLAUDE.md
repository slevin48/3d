# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server (http://localhost:5173)
npm run build    # Production build to dist/
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

## Deployment

Automatically deployed to GitHub Pages on push to `main` via GitHub Actions.

## Architecture

This is a 3D model viewer for 3D printing businesses built with React, Vite, and Three.js (via React Three Fiber).

### Core Components

- **App.jsx** - Main app, manages file state and switches between upload/viewer screens
- **FileUpload.jsx** - Drag-and-drop file upload supporting STL, OBJ, GLTF, GLB formats
- **ModelViewer.jsx** - Three.js canvas setup with lighting, orbit controls, grid, and environment
- **Model.jsx** - Parses and renders 3D models using Three.js loaders (STLLoader, OBJLoader, GLTFLoader)

### Data Flow

1. User uploads file via FileUpload → file read as ArrayBuffer/text
2. File data passed to ModelViewer → Model component
3. Model.jsx selects appropriate Three.js loader based on file extension
4. Model auto-centered and scaled to fit viewport

### Key Libraries

- `@react-three/fiber` - React renderer for Three.js
- `@react-three/drei` - Helper components (OrbitControls, Environment, Grid, Center)
- `three` - 3D loaders from `three/examples/jsm/loaders/`
