# HubLab Development Plan

## Goal
Transform HubLab from a landing page into a fully functional multi-platform app generator.

## Phase 1: Enable Core Compilers (Priority 1)

### 1.1 Re-enable Platform Compilers
- Move `lib/compiler/_disabled/ios/` → `lib/compiler/ios/`
- Move `lib/compiler/_disabled/android/` → `lib/compiler/android/`
- Move `lib/compiler/_disabled/web/` → `lib/compiler/web/`
- Move `lib/compiler/_disabled/desktop/` → `lib/compiler/desktop/`
- Update `lib/compiler/index.ts` to export real compilers

### 1.2 Re-enable All Capsules
- Move `lib/capsules/_disabled/*` → `lib/capsules/`
- Update `lib/capsules/index.ts` to register all 55 capsules
- Ensure each capsule has platform-specific templates

## Phase 2: Build Dashboard UI (Priority 2)

### 2.1 Project Management
- `/dashboard` - Project list view
- `/dashboard/new` - Create new project wizard
- `/dashboard/[id]` - Project editor

### 2.2 Visual Capsule Editor
- Drag-and-drop capsule placement
- Property editor panel
- Real-time preview (web only initially)
- Capsule library browser

### 2.3 Export Interface
- Platform selection (iOS, Android, Web, Desktop)
- Download generated code as ZIP
- Code preview before download

## Phase 3: Local Storage Backend (Priority 3)

### 3.1 Client-Side Storage
- Use localStorage/IndexedDB for projects
- No server needed initially
- Export/import project JSON

### 3.2 Project Schema
```typescript
interface Project {
  id: string
  name: string
  description: string
  capsules: CapsuleInstance[]
  theme: ThemeConfig
  createdAt: Date
  updatedAt: Date
}
```

## Phase 4: Code Generation Flow (Priority 4)

### 4.1 Compilation Pipeline
1. User selects capsules and configures properties
2. User selects target platform(s)
3. Compiler generates native code
4. ZIP file created with project structure
5. User downloads and opens in Xcode/Android Studio/VS Code

### 4.2 Generated Output Structure

**iOS (SwiftUI):**
```
MyApp/
├── MyApp.xcodeproj/
├── MyApp/
│   ├── App.swift
│   ├── ContentView.swift
│   ├── Components/
│   ├── Theme/
│   └── Assets.xcassets/
└── Package.swift
```

**Android (Jetpack Compose):**
```
MyApp/
├── app/
│   ├── src/main/
│   │   ├── java/.../
│   │   │   ├── MainActivity.kt
│   │   │   ├── ui/
│   │   │   └── theme/
│   │   └── res/
│   └── build.gradle.kts
├── build.gradle.kts
└── settings.gradle.kts
```

**Web (React + Vite):**
```
my-app/
├── src/
│   ├── App.tsx
│   ├── components/
│   ├── styles/
│   └── main.tsx
├── package.json
├── vite.config.ts
└── tailwind.config.js
```

## Implementation Order

1. **Today: Phase 1** - Enable compilers and capsules
2. **Next: Phase 2.3** - Export interface (most impactful feature)
3. **Then: Phase 2.1-2.2** - Full dashboard
4. **Finally: Phase 3** - Persistence

## Success Criteria

MVP is complete when a user can:
1. Select capsules from a list
2. Configure basic properties
3. Choose target platform
4. Download working native code
5. Open in IDE and run

## Files to Create/Modify

### New Files:
- `app/dashboard/page.tsx` - Project list
- `app/dashboard/new/page.tsx` - New project
- `app/dashboard/[id]/page.tsx` - Project editor
- `app/dashboard/[id]/export/page.tsx` - Export interface
- `app/dashboard/layout.tsx` - Dashboard layout
- `lib/storage/projects.ts` - LocalStorage wrapper
- `components/editor/CapsuleLibrary.tsx` - Capsule browser
- `components/editor/PropertyEditor.tsx` - Property panel
- `components/editor/Preview.tsx` - Live preview
- `components/editor/ExportDialog.tsx` - Export modal

### Modified Files:
- `lib/compiler/index.ts` - Real compiler exports
- `lib/capsules/index.ts` - All capsule registrations
- `app/(marketing)/page.tsx` - Add "Open Editor" button
