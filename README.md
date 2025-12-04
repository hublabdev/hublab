# HubLab

**Visual App Builder** - Create native iOS, Android, Web & Desktop apps without code.

[Live Demo](https://hublab.dev) | [Documentation](#documentation) | [Capsules](#capsules) | [Templates](#templates)

```
    Your Design                    Native Apps
        |                              |
   [HubLab Editor]  ───────>   +------+------+------+
        |                      |      |      |      |
   Drag & Drop              iOS   Android  Web  Desktop
   Capsules               SwiftUI  Kotlin  React  Tauri
```

## Features

- **Visual Editor** - Drag-and-drop interface builder
- **Real Native Code** - Generates SwiftUI, Kotlin, React (not wrappers)
- **AI Assistant** - Generate UI from natural language with Groq AI
- **Multi-Screen Apps** - Create complete multi-page applications
- **Live Preview** - See code output in real-time
- **One-Click Export** - Download ready-to-compile projects
- **8 Templates** - Pre-built app templates to start fast
- **24 Capsules** - Pre-built native components

## Quick Start

Visit [hublab.dev](https://hublab.dev) and start building immediately. No account required.

### Local Development

```bash
# Clone & Install
git clone https://github.com/yourusername/hublab.git
cd hublab
npm install

# Development
npm run dev

# Build
npm run build

# Test
npm run test
```

## Documentation

### Editor Interface

```
+----------------+------------------+------------------+
|                |                  |                  |
|   Sidebar      |    Canvas        |   Properties     |
|   - Capsules   |    - Preview     |   - Config       |
|   - Screens    |    - Drag/Drop   |   - Styling      |
|   - Templates  |                  |   - Actions      |
|                |                  |                  |
+----------------+------------------+------------------+
```

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+Z` | Undo |
| `Ctrl+Y` | Redo |
| `Delete` | Remove selected capsule |
| `Escape` | Close modals / Deselect |

### AI Assistant

Click the AI button or use the chat panel to generate UI:

```
"Create a login form with email and password"
"Add a navigation bar with 4 tabs"
"Build a product card with image, title and price"
```

Powered by Groq AI for fast generation.

## Capsules

Capsules are pre-built native components. Each generates real native code for every platform.

### UI Components
| Capsule | Icon | Platforms |
|---------|------|-----------|
| Button | 🔘 | Web, iOS, Android, Desktop |
| Text | 📝 | Web, iOS, Android, Desktop |
| Input | ✏️ | Web, iOS, Android, Desktop |
| Card | 🃏 | Web, iOS, Android, Desktop |
| Image | 🖼️ | Web, iOS, Android, Desktop |

### Layout & Navigation
| Capsule | Icon | Platforms |
|---------|------|-----------|
| List | 📋 | Web, iOS, Android, Desktop |
| Modal | 🪟 | Web, iOS, Android, Desktop |
| Navigation | 🧭 | Web, iOS, Android, Desktop |
| Tabs | 📑 | Web, iOS, Android, Desktop |
| Accordion | 🪗 | Web, iOS, Android, Desktop |

### Forms
| Capsule | Icon | Platforms |
|---------|------|-----------|
| Form | 📋 | Web, iOS, Android, Desktop |
| Switch | 🔀 | Web, iOS, Android, Desktop |
| Slider | 🎚️ | Web, iOS, Android, Desktop |
| Dropdown | 📂 | Web, iOS, Android, Desktop |
| Date Picker | 📅 | Web, iOS, Android, Desktop |

### Data & Charts
| Capsule | Icon | Platforms |
|---------|------|-----------|
| Chart | 📊 | Web, iOS, Android, Desktop |
| Table | 📋 | Web, iOS, Android, Desktop |
| Progress | ⏳ | Web, iOS, Android, Desktop |

### Media
| Capsule | Icon | Platforms |
|---------|------|-----------|
| Video | 🎬 | Web, iOS, Android, Desktop |
| Audio | 🎵 | Web, iOS, Android, Desktop |
| Carousel | 🎠 | Web, iOS, Android, Desktop |

### Native APIs
| Capsule | Icon | Platforms |
|---------|------|-----------|
| Camera | 📷 | iOS, Android |
| Location | 📍 | iOS, Android |
| Biometrics | 🔐 | iOS, Android |
| Notifications | 🔔 | iOS, Android |

## Templates

Start with a pre-built template and customize:

| Template | Icon | Description | Capsules |
|----------|------|-------------|----------|
| FitTrack Pro | 💪 | Fitness app with workouts & stats | 16 |
| FoodieSpot | 🍽️ | Restaurant ordering app | 19 |
| TaskFlow | ✅ | Task manager with projects | 21 |
| Melodify | 🎵 | Music streaming player | 15 |
| SecureBank | 🏦 | Banking & finance app | 19 |
| Wanderlust | ✈️ | Travel booking app | 21 |
| ChatConnect | 💬 | Messaging app | 12 |
| CookBook | 👨‍🍳 | Recipe & meal planning | 19 |

## Export Formats

### Supported Platforms

| Platform | Framework | Output | Status |
|----------|-----------|--------|--------|
| Web | React/Next.js | `.tsx` files | Ready |
| iOS | SwiftUI | Xcode project | Ready |
| Android | Jetpack Compose | Android Studio project | Ready |
| Desktop | Tauri | Cross-platform binary | Ready |

### Generated Code Example

**iOS (SwiftUI)**
```swift
struct HomeScreen: View {
    var body: some View {
        VStack(spacing: 16) {
            HubLabButton(text: "Get Started", variant: .primary) {
                // Action
            }
            HubLabCard {
                Text("Welcome to MyApp")
            }
        }
    }
}
```

**Android (Kotlin)**
```kotlin
@Composable
fun HomeScreen() {
    Column(
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        HubLabButton(
            text = "Get Started",
            variant = ButtonVariant.Primary,
            onClick = { /* Action */ }
        )
        HubLabCard {
            Text("Welcome to MyApp")
        }
    }
}
```

**Web (React)**
```tsx
export function HomeScreen() {
    return (
        <div className="flex flex-col gap-4">
            <Button variant="primary" onClick={() => {}}>
                Get Started
            </Button>
            <Card>
                <p>Welcome to MyApp</p>
            </Card>
        </div>
    )
}
```

## Project Structure

```
hublab/
├── app/
│   ├── app/page.tsx       # Main editor
│   ├── api/               # API routes
│   │   ├── ai-generate/   # Groq AI endpoint
│   │   ├── generate/      # Code generation
│   │   └── schema/        # Capsule schema
│   └── layout.tsx
├── hublab-core/
│   ├── capsules/          # Component definitions
│   └── compiler/          # Platform compilers
│       ├── ios/           # SwiftUI generator
│       ├── android/       # Kotlin generator
│       ├── web/           # React generator
│       └── desktop/       # Tauri generator
├── lib/
│   ├── hooks/             # React hooks
│   └── store/             # State management
└── components/            # UI components
```

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **AI**: Groq API (Mixtral)
- **Export**: JSZip for project packaging
- **Deployment**: Netlify

## API Reference

### GET /api/schema

Returns all available capsules and their properties.

### POST /api/ai-generate

Generate UI from natural language prompt.

```json
{
  "prompt": "Create a profile card with avatar and name",
  "context": { "screens": [...] }
}
```

### POST /api/generate

Generate native code for a specific platform.

```json
{
  "platform": "ios",
  "screens": [...],
  "settings": {
    "projectName": "MyApp",
    "themeColor": "#6366F1"
  }
}
```

## Environment Variables

```env
# Required for AI features
GROQ_API_KEY=your_groq_api_key

# Optional
NEXT_PUBLIC_APP_URL=https://hublab.dev
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing`)
5. Open a Pull Request

### Adding New Capsules

1. Define the capsule in `hublab-core/capsules/`
2. Add platform-specific code generators
3. Register in the ALL_CAPSULES array
4. Test export for all platforms

## License

MIT License - see [LICENSE](LICENSE) for details.

---

Built with care at [hublab.dev](https://hublab.dev)
