# 3D Print Viewer

A web-based 3D model viewer for 3D printing businesses. Upload and visualize STL, OBJ, GLTF, and GLB files directly in your browser.

**Live Demo:** https://bruce3d.win/

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/ad8cb974-14bc-44ea-9896-6cd612178c94" />


## Features

- **Drag & Drop Upload** - Simply drag your 3D files or click to browse
- **Multiple Formats** - Supports STL, OBJ, GLTF, and GLB files
- **Interactive Controls** - Rotate, zoom, and pan to inspect models from any angle
- **Auto-Rotate** - Toggle automatic rotation to view all sides
- **Reference Grid** - Optional grid for scale and orientation reference
- **File Info** - Displays filename and file size

## Getting Started

### Export from Onshape

<img width="1920" height="1008" alt="image" src="https://github.com/user-attachments/assets/c716daf6-1700-4c0a-bcca-9573aa575687" />


## Contribute

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Tech Stack

- [React](https://react.dev/) - UI framework
- [Vite](https://vite.dev/) - Build tool
- [Three.js](https://threejs.org/) - 3D rendering
- [React Three Fiber](https://r3f.docs.pmnd.rs/) - React renderer for Three.js
- [Drei](https://drei.docs.pmnd.rs/) - Useful helpers for R3F

## Controls

| Action | Input |
|--------|-------|
| Rotate | Drag |
| Zoom | Scroll |
| Pan | Shift + Drag |

## Deployment

Automatically deployed to GitHub Pages on push to `main` via GitHub Actions.

## License

MIT
