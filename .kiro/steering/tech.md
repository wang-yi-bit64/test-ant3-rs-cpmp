# Tech Stack

## Build System

- **Rsbuild** - Modern build tool based on Rspack
- **Rspack** - Fast bundler (Webpack alternative)
- **Package Manager**: pnpm 10.22.0

## Core Technologies

- **React 16.14.0** - Classic runtime (not automatic JSX transform)
- **Ant Design 3.26.20** - UI component library
- **Moment.js 2.30.1** - Date manipulation
- **Biome** - Linting and formatting

## Development Tools

- **Biome** - Code quality (linting + formatting)
- **Babel** - Transpilation with React preset
- **rstest** - Testing framework

## Common Commands

```bash
# Development
pnpm run dev          # Start dev server at http://localhost:3000

# Build
pnpm run build        # Production build
pnpm run preview      # Preview production build

# Code Quality
pnpm run format       # Format code with Biome
pnpm run check        # Lint and auto-fix with Biome

# Testing
pnpm run test         # Run tests with rstest
```

## Configuration

- Path alias: `@/` maps to `src/`
- React Fast Refresh enabled
- Classic JSX runtime (React 16 style)
