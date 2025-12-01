# HubLab

**Universal App Compiler** - Generate native iOS, Android, and Web apps from a single prompt.

```
Prompt: "Shopping list app with family sync"
                    |
               [HubLab]
                    |
    +---------------+---------------+
    |               |               |
   Web            iOS           Android
 (React)       (SwiftUI)   (Jetpack Compose)
    |               |               |
 Vercel        App Store       Play Store
```

## Key Differentiator

**We generate REAL native code**, not wrappers:

| Feature | HubLab | Flutter | React Native |
|---------|--------|---------|--------------|
| 100% Native Code | Yes | No (Dart) | No (JS Bridge) |
| Native Performance | Yes | ~90% | ~80% |
| Full Native API Access | Yes | Partial | Partial |
| Native Look & Feel | Yes | Custom | Custom |

## Quick Start

```bash
# Install
npm install

# Development
npm run dev

# Build
npm run build
```

## API Usage

### Export Native Apps

```http
POST /api/v1/projects/{id}/export-native
Content-Type: application/json

{
  "targets": [
    {
      "platform": "ios",
      "options": {
        "bundleId": "com.mycompany.myapp",
        "minVersion": "15.0"
      }
    },
    {
      "platform": "android",
      "options": {
        "packageName": "com.mycompany.myapp",
        "minSdk": 24
      }
    }
  ]
}
```

### Response

```json
{
  "success": true,
  "exports": [
    {
      "platform": "ios",
      "downloadUrl": "https://storage.hublab.dev/exports/.../MyApp-ios.zip",
      "fileCount": 15
    },
    {
      "platform": "android",
      "downloadUrl": "https://storage.hublab.dev/exports/.../MyApp-android.zip",
      "fileCount": 22
    }
  ]
}
```

## Generated Output

### iOS (SwiftUI)

```
MyApp/
├── MyAppApp.swift          # Entry point
├── ContentView.swift       # Root view
├── Theme/Colors.swift      # Theme colors
├── Components/             # Native SwiftUI components
│   └── HubLabButton.swift
├── Screens/
│   └── HomeScreen.swift
├── Assets.xcassets/
├── Info.plist
└── Package.swift
```

### Android (Jetpack Compose)

```
app/src/main/
├── java/com/myapp/
│   ├── MainActivity.kt
│   ├── ui/theme/
│   │   ├── Color.kt
│   │   ├── Theme.kt
│   │   └── Type.kt
│   ├── ui/components/      # Native Compose components
│   │   └── HubLabButton.kt
│   └── ui/screens/
│       └── HomeScreen.kt
├── res/values/
├── AndroidManifest.xml
└── build.gradle.kts
```

## Architecture

```
lib/
├── capsules/           # Multi-platform component definitions
│   ├── types.ts        # Capsule type system
│   └── button.ts       # Example: Button with Web/iOS/Android code
│
├── compiler/           # Platform-specific compilers
│   ├── base.ts         # Base compiler classes
│   ├── ios/            # SwiftUI code generator
│   ├── android/        # Jetpack Compose code generator
│   └── web/            # React code generator
│
└── types/              # API type definitions
    └── api.ts
```

## Capsule System

Each capsule contains **native code for every platform**:

```typescript
const ButtonCapsule = {
  id: 'button',
  props: [
    { name: 'text', type: 'string', required: true },
    { name: 'variant', type: 'select', options: ['primary', 'secondary'] },
    { name: 'onPress', type: 'action', required: true }
  ],

  platforms: {
    web: {
      framework: 'react',
      code: `function Button({ text, variant, onPress }) { ... }`
    },
    ios: {
      framework: 'swiftui',
      code: `struct HubLabButton: View { ... }`
    },
    android: {
      framework: 'compose',
      code: `@Composable fun HubLabButton(...) { ... }`
    }
  }
}
```

## Supported Platforms

### Export Formats

| Platform | Framework | Status |
|----------|-----------|--------|
| Web | React/Next.js | Ready |
| Web | Vue | Ready |
| iOS | SwiftUI | Ready |
| iOS | UIKit | Planned |
| Android | Jetpack Compose | Ready |
| Android | XML | Planned |
| Desktop | Tauri | Planned |
| Desktop | Electron | Planned |

### Deploy Targets

| Platform | Target | Status |
|----------|--------|--------|
| Web | Vercel | Ready |
| Web | Netlify | Ready |
| iOS | App Store Connect | Planned |
| iOS | TestFlight | Planned |
| Android | Google Play | Planned |
| Android | Firebase Distribution | Planned |

## Roadmap

### Phase 1: Core Capsules (Current)
- [ ] Button, Text, Input, Card, List, Image
- [ ] Form components
- [ ] Navigation components

### Phase 2: Compilation Testing
- [ ] Xcode build verification
- [ ] Android Studio build verification
- [ ] CI/CD for native builds

### Phase 3: Store Integration
- [ ] App Store Connect API
- [ ] Google Play Developer API
- [ ] Automated signing/provisioning

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing`)
5. Open a Pull Request

## License

MIT License - see [LICENSE](LICENSE) for details.

---

Built with care by [HubLab](https://hublab.dev)
