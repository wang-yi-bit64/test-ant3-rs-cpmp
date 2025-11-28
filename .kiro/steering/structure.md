# Project Structure

## Directory Layout

```
src/
├── components/          # Reusable UI components
│   └── MultiDatePicker/ # Multi-date picker component
│       ├── index.jsx    # Main component
│       ├── demo.jsx     # Demo/example usage
│       ├── index.css    # Component styles
│       └── index.d.ts   # TypeScript definitions
├── pages/               # Page-level components
│   └── index.jsx        # Main page with tab navigation
├── __tests__/           # Test files
├── __mocks__/           # Mock implementations (e.g., antd)
├── App.jsx              # Root application component
├── App.css              # Global styles
└── index.jsx            # Application entry point

public/                  # Static assets
coverage/                # Test coverage reports
dist/                    # Production build output
```

## Code Organization

- **Components**: Self-contained with co-located styles, demos, and types
- **Pages**: Top-level views that compose components
- **Path Alias**: Use `@/` to import from `src/` (e.g., `import X from '@/components/X'`)
- **Mocks**: Test mocks in `__mocks__/` directory

## Style Conventions

- Single quotes for JavaScript strings (enforced by Biome)
- Space indentation (enforced by Biome)
- CSS Modules support enabled
- Component-specific styles co-located with components
