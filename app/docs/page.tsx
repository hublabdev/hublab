'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

// Documentation sections
const DOCS_SECTIONS = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: '🚀',
    description: 'Learn the basics of HubLab',
    content: `
## Welcome to HubLab

HubLab is a visual app builder that lets you create native iOS, Android, Web, and Desktop apps without writing code.

### Quick Start

1. **Open the Editor** - Go to [/app](/app) to start building
2. **Add Capsules** - Drag and drop components from the sidebar
3. **Customize** - Click on any capsule to edit its properties
4. **Preview** - See your code in real-time in the preview panel
5. **Export** - Download your native project for any platform

### Your First App

Let's create a simple app:

1. Click "Start Building" or go to \`/app\`
2. From the sidebar, drag a **Button** capsule to the canvas
3. Click the button to select it
4. In the properties panel, change the text to "Hello World"
5. Add a **Text** capsule above it
6. Your app now has a button and text!

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| \`Ctrl+Z\` | Undo |
| \`Ctrl+Y\` | Redo |
| \`Delete\` | Remove selected |
| \`Escape\` | Deselect / Close modal |

### Next Steps

- Explore [Capsules Reference](#capsules) to see all available components
- Learn about [Platform-specific features](#platforms)
- Set up [Export & Deploy](#export) to publish your app
    `
  },
  {
    id: 'capsules',
    title: 'Capsules Reference',
    icon: '📦',
    description: 'All available components',
    content: `
## Capsules Reference

Capsules are pre-built native components that you can drag and drop into your app. Each capsule generates real native code for all platforms.

### UI Components

| Capsule | Icon | Description |
|---------|------|-------------|
| Button | 🔘 | Interactive button with variants |
| Text | 📝 | Display text with styling |
| Input | ✏️ | Text input field |
| Card | 🃏 | Container with shadow and rounded corners |
| Image | 🖼️ | Display images |
| Avatar | 👤 | User profile picture |
| Badge | 🏷️ | Status indicator |

### Layout & Navigation

| Capsule | Icon | Description |
|---------|------|-------------|
| List | 📋 | Scrollable list of items |
| Modal | 🪟 | Popup overlay |
| Navigation | 🧭 | Tab or stack navigation |
| Tabs | 📑 | Tabbed interface |
| Drawer | 📥 | Side panel menu |
| Header | 🔝 | App header bar |
| Footer | 🔚 | Bottom footer |

### Forms

| Capsule | Icon | Description |
|---------|------|-------------|
| Switch | 🔀 | Toggle on/off |
| Slider | 🎚️ | Range selector |
| Dropdown | 📂 | Select from options |
| Date Picker | 📅 | Date selection |
| Checkbox | ☑️ | Multiple selection |
| Rating | ⭐ | Star rating input |

### Data & Charts

| Capsule | Icon | Description |
|---------|------|-------------|
| Chart | 📊 | Bar, line, pie charts |
| Table | 📋 | Data table |
| Progress | ⏳ | Progress indicator |
| Stat Card | 📈 | Statistics display |
| Calendar | 🗓️ | Full calendar view |

### AI Edge (Local AI)

| Capsule | Icon | Description |
|---------|------|-------------|
| AI Chat | 🦙 | Local LLM chat (Ollama, LM Studio) |
| AI Autocomplete | ✨ | AI-powered text completion |
| Content Generator | 📝 | Generate content with AI |
| Summarizer | 📋 | Summarize long text |
| Translator | 🌐 | AI translation |

### AI Providers (Cloud)

| Capsule | Icon | Description |
|---------|------|-------------|
| Google Gemini | 🔷 | Chat with Gemini 2.0 Flash |
| Mistral AI | 🌊 | Mistral Large model |
| Cohere | 🔮 | Command R+ with RAG |
| Perplexity | 🔍 | Web-connected AI search |
| Together AI | 🤝 | Llama 3.3 70B Turbo |
| DeepSeek | 🌊 | DeepSeek Chat & Coder |
| Replicate | 🔁 | Run any open model |
| Hugging Face | 🤗 | 100k+ models |
| xAI Grok | ✖️ | Grok 2 model |

### Voice & Audio

| Capsule | Icon | Description |
|---------|------|-------------|
| OpenAI TTS | 🔊 | Text-to-Speech (alloy, echo, etc) |
| OpenAI Whisper | 🎤 | Speech-to-Text cloud |
| Local Whisper | 🎤 | Offline transcription |
| ElevenLabs | 🎙️ | Ultra-realistic voices |
| Supertonic TTS | 🔊 | Local ONNX TTS |

### Image Generation

| Capsule | Icon | Description |
|---------|------|-------------|
| DALL-E 3 | 🎨 | OpenAI image generation |
| FLUX | 🌊 | Black Forest Labs FLUX.1 |
| Stable Diffusion | 🖼️ | SDXL models |
| Midjourney | 🎭 | Midjourney API |

### RAG (Chat with Documents)

| Capsule | Icon | Description |
|---------|------|-------------|
| RAG Chat | 📚 | Chat with your documents |
| Document Upload | 📤 | Upload PDF, TXT, MD, DOCX |
| Semantic Search | 🔍 | Search by meaning |
| Embeddings | 📊 | Generate vector embeddings |

### Vector Databases

| Capsule | Icon | Description |
|---------|------|-------------|
| Pinecone | 🌲 | Cloud vector database |
| Weaviate | 🔷 | Open-source vector search |
| Qdrant | 🔶 | High-performance vectors |
| ChromaDB | 🎨 | Local embedded database |
| Supabase Vector | ⚡ | pgvector integration |

### Cloud Storage

| Capsule | Icon | Description |
|---------|------|-------------|
| Google Drive | 📁 | Connect via OAuth |
| Dropbox | 📦 | File sync & share |
| OneDrive | ☁️ | Microsoft storage |
| AWS S3 | 🪣 | Object storage |
| Cloudflare R2 | 🟠 | S3-compatible CDN |

### Connections (Local Services)

| Capsule | Icon | Description |
|---------|------|-------------|
| LM Studio Chat | 🧠 | localhost:1234 |
| Ollama Chat | 🦙 | localhost:11434 |
| Supertonic Speak | 🔊 | localhost:5123 |
| WebSocket | 🔄 | Real-time bidirectional |
| REST API | 🔌 | Connect any API |

### Monetization

| Capsule | Icon | Description |
|---------|------|-------------|
| Ad Banner | 📱 | Display banner ads |
| Paywall | 🔒 | Subscription paywall |
| Buy Button | 🛒 | Purchase button |
| Tip Jar | ☕ | Accept donations |
| Premium Badge | 👑 | Show premium status |

### Auth & Security

| Capsule | Icon | Description |
|---------|------|-------------|
| Login Form | 🔐 | Email/password authentication |
| Register Form | 📝 | User registration flow |
| Social Login | 🔗 | Google, Apple, GitHub |
| Forgot Password | 🔑 | Password reset flow |
| OTP Verify | 📲 | Code verification |
| Profile Settings | 👤 | User profile management |

### Payments

| Capsule | Icon | Description |
|---------|------|-------------|
| Checkout Form | 💳 | Full checkout experience |
| Stripe Pay | 💵 | Stripe integration |
| PayPal Button | 🅿️ | PayPal checkout |
| Apple Pay | 🍎 | iOS payments |
| Google Pay | 🔷 | Android payments |
| Subscription | 🔄 | Recurring billing |

### Notifications

| Capsule | Icon | Description |
|---------|------|-------------|
| Push Notification | 🔔 | Native push (iOS/Android) |
| In-App Alert | 📣 | Modal alerts |
| Badge Counter | 🔴 | Notification badges |
| Banner Notice | 📢 | Top/bottom banners |

### Analytics

| Capsule | Icon | Description |
|---------|------|-------------|
| Analytics Card | 📈 | Dashboard overview |
| Stats Chart | 📊 | Line/bar/pie charts |
| KPI Widget | 🎯 | Key metrics display |
| Funnel Chart | 📉 | Conversion funnels |

### Location & Maps

| Capsule | Icon | Description |
|---------|------|-------------|
| Map View | 🗺️ | Interactive map |
| Current Location | 📍 | GPS location |
| Places Search | 🔎 | Search nearby places |
| Directions | 🧭 | Navigation routes |

### Internationalization

| Capsule | Icon | Description |
|---------|------|-------------|
| Language Picker | 🌍 | Multi-language selector |
| Translated Text | 🔤 | i18n text component |

### E-Commerce Advanced

| Capsule | Icon | Description |
|---------|------|-------------|
| Product Grid | 🛍️ | Grid of product cards |
| Product Detail | 📦 | Full product view |
| Product Variants | 🎨 | Size/color selectors |
| Product Reviews | ⭐ | Customer reviews |
| Shopping Cart | 🛒 | Cart with quantities |
| Checkout Flow | 💳 | Multi-step checkout |
| Order Tracking | 📍 | Shipment tracker |
| Order History | 📜 | Past orders list |
| Wishlist | ❤️ | Saved items |
| Coupon Input | 🎟️ | Discount codes |
| Size Guide | 📏 | Size chart modal |
| Stock Badge | 🏷️ | In stock indicator |

### Charts & Data Viz

| Capsule | Icon | Description |
|---------|------|-------------|
| Line Chart | 📈 | Trend visualization |
| Bar Chart | 📊 | Comparison bars |
| Pie Chart | 🥧 | Distribution circle |
| Donut Chart | 🍩 | Ring percentage |
| Area Chart | 📉 | Filled line chart |
| Scatter Plot | 🔵 | Point distribution |
| Radar Chart | 🕸️ | Multi-axis comparison |
| Heatmap | 🔥 | Density matrix |
| Treemap | 🌳 | Hierarchical data |
| Sparkline | ✨ | Inline mini chart |
| Gauge | ⏱️ | Dial indicator |
| Funnel Chart | 📉 | Conversion funnel |

### Advanced Tables

| Capsule | Icon | Description |
|---------|------|-------------|
| Data Table | 📋 | Rich data table |
| Sortable Table | 🔽 | Column sorting |
| Filterable Table | 🔍 | Column filters |
| Paginated Table | 📄 | Page navigation |
| Expandable Row | ➕ | Row details |
| Editable Cell | ✏️ | Inline editing |
| Resizable Columns | ↔️ | Drag to resize |
| Row Selection | ☑️ | Multi-select rows |

### Navigation Advanced

| Capsule | Icon | Description |
|---------|------|-------------|
| Top Navbar | 🔝 | Horizontal nav |
| Side Navbar | 📌 | Vertical nav |
| Bottom Tabs | 📱 | Mobile tab bar |
| Breadcrumbs | 🍞 | Path navigation |
| Pagination | 📖 | Page controls |
| Step Indicator | 🔢 | Progress steps |
| Tab Bar | 📑 | Segmented tabs |
| Mega Menu | 📂 | Rich dropdown |
| Context Menu | 📋 | Right-click menu |
| Command Palette | ⌘ | Keyboard shortcuts |

### Modals & Overlays

| Capsule | Icon | Description |
|---------|------|-------------|
| Modal Dialog | 🪟 | Centered popup |
| Confirmation | ✅ | Yes/No dialog |
| Action Sheet | 📋 | Bottom actions |
| Bottom Sheet | 📄 | Draggable panel |
| Fullscreen Modal | 🖥️ | Full overlay |
| Lightbox | 💡 | Image viewer |
| Popover | 💬 | Floating bubble |
| Advanced Tooltip | ℹ️ | Rich tooltips |

### Loading States

| Capsule | Icon | Description |
|---------|------|-------------|
| Spinner | 🔄 | Loading circle |
| Progress Bar | ⏳ | Linear progress |
| Progress Circle | ⭕ | Circular progress |
| Skeleton | 💀 | Content placeholder |
| Shimmer | ✨ | Loading animation |
| Pull to Refresh | 🔃 | Swipe down reload |
| Infinite Scroll | ♾️ | Auto-load more |
| Lazy Load | 🦥 | On-demand loading |

### Media Players

| Capsule | Icon | Description |
|---------|------|-------------|
| Image Gallery | 🖼️ | Photo grid |
| Carousel | 🎠 | Swipe gallery |
| Video Player | 🎬 | Video controls |
| Audio Player | 🎵 | Music player |
| PDF Viewer | 📄 | Document reader |
| Document Preview | 📑 | File preview |
| File Manager | 📁 | File browser |
| Image Cropper | ✂️ | Crop & resize |
| Image Filter | 🎨 | Photo filters |
| QR Generator | 📱 | Create QR codes |
| Barcode Scanner | 📷 | Scan barcodes |

### Social Features

| Capsule | Icon | Description |
|---------|------|-------------|
| Share Button | 📤 | Quick share |
| Social Share | 🌐 | Multi-platform |
| Like Button | ❤️ | Heart reaction |
| Bookmark | 🔖 | Save item |
| Comment Section | 💬 | Comments thread |
| Reaction Picker | 😀 | Emoji reactions |
| User Mention | @ | Tag users |
| Hashtag Link | # | Clickable tags |
| Follow Button | ➕ | Follow user |
| User Profile Card | 👤 | Mini profile |

### Chat & Messaging

| Capsule | Icon | Description |
|---------|------|-------------|
| Chat Message | 💬 | Single message |
| Chat Input | ⌨️ | Message composer |
| Chat Bubble | 🗨️ | Message bubble |
| Chat List | 📋 | Conversations |
| Typing Indicator | ⋯ | "Typing..." animation |
| Read Receipt | ✓✓ | Seen status |
| Message Reactions | 😊 | React to messages |
| Voice Message | 🎤 | Audio message |
| Attachment Picker | 📎 | File attachments |

### Onboarding

| Capsule | Icon | Description |
|---------|------|-------------|
| Onboarding Carousel | 👋 | Intro slides |
| Feature Tour | 🎯 | Guided walkthrough |
| Tooltip Guide | 💡 | Step-by-step tips |
| Checklist Progress | ✅ | Setup checklist |
| Welcome Screen | 🎉 | First-time welcome |
| Permission Request | 🔐 | Access prompts |
| What's New | 🆕 | Update notes |

### Settings & Preferences

| Capsule | Icon | Description |
|---------|------|-------------|
| Settings List | ⚙️ | Settings menu |
| Toggle Setting | 🔀 | On/off switch |
| Theme Switcher | 🌓 | Light/dark mode |
| Language Selector | 🌍 | Change language |
| Notification Settings | 🔔 | Alert preferences |
| Privacy Settings | 🔒 | Privacy controls |
| Account Settings | 👤 | Profile settings |
| Subscription Settings | 💎 | Plan management |

### Developer Tools

| Capsule | Icon | Description |
|---------|------|-------------|
| API Tester | 🔌 | REST API client |
| JSON Viewer | 📋 | Format JSON |
| Console Log | 🖥️ | Debug output |
| Network Inspector | 🌐 | Request monitor |
| Debug Panel | 🐛 | Debug tools |
| Performance Monitor | 📊 | Performance metrics |

### Education & Learning

| Capsule | Icon | Description |
|---------|------|-------------|
| Flashcard | 🎴 | Study cards |
| Quiz Question | ❓ | Multiple choice |
| Course Progress | 📚 | Learning tracker |
| Lesson Card | 📖 | Lesson preview |
| Certificate | 🏆 | Achievement badge |
| Streak Counter | 🔥 | Daily streak |
| Vocabulary Card | 📝 | Word learning |
| Interactive Tutorial | 🎮 | Hands-on guide |

### Health & Fitness

| Capsule | Icon | Description |
|---------|------|-------------|
| Step Counter | 👟 | Daily steps |
| Heart Rate | ❤️ | BPM monitor |
| Sleep Tracker | 😴 | Sleep quality |
| Water Intake | 💧 | Hydration log |
| Calorie Counter | 🍎 | Food tracker |
| Workout Card | 💪 | Exercise card |
| Meditation Timer | 🧘 | Zen timer |
| Mood Tracker | 😊 | Emotional log |
| BMI Calculator | ⚖️ | Body metrics |
| Activity Ring | ⭕ | Progress rings |

### Finance & Banking

| Capsule | Icon | Description |
|---------|------|-------------|
| Balance Card | 💰 | Account balance |
| Transaction | 📜 | Payment record |
| Expense Chart | 📊 | Spending breakdown |
| Budget Bar | 📈 | Budget progress |
| Savings Goal | 🎯 | Savings tracker |
| Crypto Ticker | ₿ | Crypto prices |
| Stock Chart | 📉 | Market data |
| Invoice | 🧾 | Bill generator |
| Payment History | 💳 | Past payments |
| Split Bill | 👥 | Bill splitter |

### Gaming & Gamification

| Capsule | Icon | Description |
|---------|------|-------------|
| Leaderboard | 🏆 | Rankings |
| Achievement Badge | 🎖️ | Unlocked badges |
| Score Display | 🎯 | Points counter |
| Lives Counter | ❤️ | Remaining lives |
| XP Bar | ⭐ | Experience progress |
| Level Badge | 🎮 | Player level |
| Game Timer | ⏱️ | Countdown timer |
| Inventory Grid | 🎒 | Item inventory |
| Health Bar | 💚 | HP indicator |
| Virtual Joystick | 🕹️ | Touch controls |

### Productivity

| Capsule | Icon | Description |
|---------|------|-------------|
| Todo List | ✅ | Task manager |
| Note Card | 📝 | Quick notes |
| Reminder | ⏰ | Alert scheduler |
| Pomodoro Timer | 🍅 | Focus timer |
| Habit Tracker | 📅 | Daily habits |
| Journal Entry | 📔 | Daily log |
| Kanban Board | 📋 | Task board |
| Calendar Event | 📆 | Event card |
| Project Card | 📁 | Project overview |
| Bookmark List | 🔖 | Saved links |
| Markdown Editor | 📝 | Rich text editor |

### Travel & Location

| Capsule | Icon | Description |
|---------|------|-------------|
| Booking Card | ✈️ | Reservation |
| Flight Status | 🛫 | Flight tracker |
| Hotel Card | 🏨 | Accommodation |
| Itinerary | 📋 | Trip plan |
| Interactive Map | 🗺️ | Full map |
| Location Pin | 📍 | Place marker |
| Places Near Me | 🔎 | Nearby search |
| Directions | 🧭 | Route guide |
| Store Locator | 🏪 | Find stores |
| Weather Widget | 🌤️ | Weather info |

### Food & Delivery

| Capsule | Icon | Description |
|---------|------|-------------|
| Menu Item | 🍔 | Food card |
| Order Summary | 🧾 | Cart total |
| Restaurant Card | 🍽️ | Restaurant info |
| Delivery Tracker | 🚚 | Order tracking |
| Recipe Card | 📜 | Cooking guide |
| Nutrition Facts | 🥗 | Calories info |
| Ingredient List | 🥕 | Recipe ingredients |
| Dietary Filter | 🌱 | Diet options |

### Music & Audio

| Capsule | Icon | Description |
|---------|------|-------------|
| Now Playing | 🎵 | Current track |
| Playlist Card | 📃 | Playlist view |
| Equalizer | 🎚️ | Audio controls |
| Podcast Card | 🎙️ | Episode card |
| Waveform | 🌊 | Audio visual |
| Lyrics Display | 📜 | Song lyrics |
| Album Art | 💿 | Cover display |
| Queue List | 📋 | Up next |

### Communication

| Capsule | Icon | Description |
|---------|------|-------------|
| Video Call | 📹 | Video chat |
| Voice Call | 📞 | Audio call |
| Screen Share | 🖥️ | Share screen |
| Chat Room | 💬 | Group chat |
| Email Compose | 📧 | Write email |
| SMS Message | 📱 | Text message |
| Contact Card | 👤 | Contact info |
| Call Controls | 📲 | Call buttons |

### AR/VR & 3D

| Capsule | Icon | Description |
|---------|------|-------------|
| AR Camera | 📷 | Augmented view |
| AR Object | 🎯 | 3D placement |
| Face Filter | 🎭 | AR effects |
| AR Surface | 📐 | Plane detection |
| AR Measure | 📏 | Distance tool |
| VR Viewer | 🥽 | 360° view |
| 3D Model | 🎨 | Model viewer |
| 3D Scene | 🌌 | 3D environment |

### Smart Home & IoT

| Capsule | Icon | Description |
|---------|------|-------------|
| Thermostat | 🌡️ | Temperature control |
| Light Control | 💡 | Smart lighting |
| Door Lock | 🔒 | Smart lock |
| Security Camera | 📷 | Video feed |
| Doorbell | 🔔 | Video doorbell |
| Sensor Status | 📡 | IoT sensor |
| Scene Control | 🎬 | Automation |
| Device Status | ⚡ | Connection status |

### Web3 & Crypto

| Capsule | Icon | Description |
|---------|------|-------------|
| Wallet Connect | 🔗 | Connect wallet |
| NFT Card | 🖼️ | NFT display |
| Token Balance | 🪙 | Crypto balance |
| Transaction Hash | 📜 | Tx details |
| Mint Button | ✨ | NFT minting |
| Gas Estimator | ⛽ | Fee estimate |
| Chain Selector | ⛓️ | Network picker |
| Swap Interface | 🔄 | Token swap |

### Real Estate

| Capsule | Icon | Description |
|---------|------|-------------|
| Property Card | 🏠 | Listing card |
| Virtual Tour | 🎥 | 360° tour |
| Mortgage Calculator | 🧮 | Loan calculator |
| Property Filter | 🔍 | Search filters |
| Agent Card | 👔 | Realtor info |
| Floor Plan | 📐 | Layout view |
| Price History | 📈 | Value trends |
| Neighborhood | 🏘️ | Area info |

### Events & Tickets

| Capsule | Icon | Description |
|---------|------|-------------|
| Event Card | 🎉 | Event preview |
| Ticket | 🎫 | Digital ticket |
| RSVP Button | ✉️ | Response |
| Countdown | ⏰ | Time remaining |
| Seat Picker | 💺 | Seat selection |
| Schedule | 📅 | Event timeline |
| Venue Map | 🗺️ | Location map |
| QR Ticket | 📱 | Scannable ticket |

### News & Content

| Capsule | Icon | Description |
|---------|------|-------------|
| News Feed | 📰 | Article list |
| Article Card | 📄 | Story preview |
| Breaking News | 🚨 | Alert banner |
| Category Tab | 📑 | Content filter |
| Save Article | 🔖 | Bookmark |
| Share Story | 📤 | Social share |
| Author Card | ✍️ | Writer info |
| Related Posts | 🔗 | Suggestions |

### Dating & Social

| Capsule | Icon | Description |
|---------|------|-------------|
| Dating Profile | 💕 | Profile card |
| Swipe Card | 👆 | Tinder-style |
| Match Alert | 💘 | Match found |
| Dating Chat | 💬 | Conversation |
| Icebreaker | 🎲 | Conversation starter |
| Super Like | ⭐ | Premium action |
| Profile Prompt | 💬 | About me |
| Distance Badge | 📍 | Proximity |

### Pets & Family

| Capsule | Icon | Description |
|---------|------|-------------|
| Pet Profile | 🐕 | Pet card |
| Pet Health | 🏥 | Vet records |
| Feeding Schedule | 🍖 | Meal times |
| Vet Appointment | 👨‍⚕️ | Vet booking |
| Pet Tracker | 📍 | GPS location |
| Family Tree | 👨‍👩‍👧 | Family view |
| Chore Chart | 📋 | Task assignments |
| Allowance | 💰 | Kids money |
| Baby Log | 👶 | Baby tracker |

### Sports & Fitness

| Capsule | Icon | Description |
|---------|------|-------------|
| Live Score | ⚽ | Match score |
| Team Card | 🏆 | Team info |
| Player Stats | 📊 | Statistics |
| Match Schedule | 📅 | Game times |
| Betting Odds | 🎰 | Odds display |
| Tournament | 🏅 | Bracket view |
| Workout Plan | 📋 | Exercise routine |
| Personal Record | 🏋️ | PR tracker |

### Automotive

| Capsule | Icon | Description |
|---------|------|-------------|
| Vehicle Card | 🚗 | Car info |
| Fuel Tracker | ⛽ | Gas log |
| Maintenance | 🔧 | Service records |
| Parking Spot | 🅿️ | Parking finder |
| EV Charging | ⚡ | Charge status |
| Trip Computer | 📊 | Drive stats |
| Insurance Card | 📄 | Policy info |
| Mileage Log | 📏 | Distance tracker |

### Legal & Professional

| Capsule | Icon | Description |
|---------|------|-------------|
| Contract | 📜 | Document view |
| e-Signature | ✍️ | Sign docs |
| Case Card | 📁 | Legal case |
| Time Entry | ⏱️ | Billable hours |
| Client Card | 👔 | Client info |
| Invoice | 🧾 | Bill client |
| Document List | 📋 | File manager |
| Meeting Notes | 📝 | Note taker |

### Integrations

| Capsule | Icon | Description |
|---------|------|-------------|
| Spotify Connect | 🎵 | Music integration |
| YouTube Player | ▶️ | Video embed |
| Discord Widget | 🎮 | Server widget |
| GitHub Activity | 🐙 | Code activity |
| Notion Embed | 📝 | Notion pages |
| Firebase Auth | 🔥 | Auth provider |
| Supabase Data | ⚡ | Database |
| Stripe Checkout | 💳 | Payment |
    `
  },
  {
    id: 'platforms',
    title: 'Platform Guide',
    icon: '📱',
    description: 'iOS, Android, Web & Desktop',
    content: `
## Platform Guide

HubLab generates native code for multiple platforms. Each platform has specific requirements and capabilities.

### iOS (SwiftUI)

**Requirements:**
- macOS with Xcode 15+
- Apple Developer Account ($99/year for App Store)

**Generated Files:**
- \`ContentView.swift\` - Main UI
- \`Assets.xcassets\` - App icons and images
- \`Info.plist\` - App configuration

**Native Features:**
- Face ID / Touch ID
- Apple Pay
- Siri Shortcuts
- HealthKit
- Widgets

### Android (Jetpack Compose)

**Requirements:**
- Android Studio Hedgehog+
- Google Play Developer Account ($25 one-time)

**Generated Files:**
- \`MainActivity.kt\` - Main activity
- \`ui/theme/\` - Material theme
- \`res/\` - Resources and icons

**Native Features:**
- Google Pay
- Biometric authentication
- Material You theming
- App widgets

### Web (React/Next.js)

**Requirements:**
- Node.js 18+
- Any web hosting (Netlify, Vercel, etc.)

**Generated Files:**
- React components
- Tailwind CSS styles
- Next.js configuration

**Features:**
- Responsive design
- PWA support
- SEO optimized
- Dark mode

### Desktop (Tauri)

**Requirements:**
- Rust toolchain
- Platform-specific SDKs

**Supported OS:**
- macOS
- Windows
- Linux

**Features:**
- Native menus
- System tray
- File system access
- Auto-updates
    `
  },
  {
    id: 'export',
    title: 'Export & Deploy',
    icon: '📤',
    description: 'Build and publish your app',
    content: `
## Export & Deploy

### Export Options

1. **Single Platform** - Export for one specific platform
2. **All Platforms** - Export for iOS, Android, Web, and Desktop

### Export Process

1. Click the **Export** button in the toolbar
2. Select your target platform(s)
3. Configure project settings (name, bundle ID, etc.)
4. Click **Download** to get your project ZIP

### iOS Deployment

\`\`\`bash
# Unzip your iOS project
unzip MyApp-ios.zip
cd MyApp

# Open in Xcode
open MyApp.xcodeproj

# Build and run on simulator or device
\`\`\`

**App Store Submission:**
1. Archive your app in Xcode
2. Upload to App Store Connect
3. Submit for review (1-3 days)

### Android Deployment

\`\`\`bash
# Unzip your Android project
unzip MyApp-android.zip
cd MyApp

# Open in Android Studio
# File > Open > Select folder

# Build APK or AAB
./gradlew assembleRelease
\`\`\`

**Play Store Submission:**
1. Generate signed AAB
2. Upload to Google Play Console
3. Submit for review (hours to days)

### Web Deployment

\`\`\`bash
# Unzip your web project
unzip MyApp-web.zip
cd MyApp

# Install dependencies
npm install

# Build for production
npm run build

# Deploy to Netlify
npx netlify-cli deploy --prod
\`\`\`

**Quick Deploy Options:**
- Netlify - Drag & drop your \`out\` folder
- Vercel - Connect your GitHub repo
- GitHub Pages - Push to \`gh-pages\` branch
    `
  },
  {
    id: 'api',
    title: 'API Reference',
    icon: '🔌',
    description: 'REST API documentation',
    content: `
## API Reference

HubLab provides REST APIs for programmatic access.

### Base URL

\`\`\`
https://hublab.dev/api
\`\`\`

### Endpoints

#### GET /api/schema

Returns all available capsules and their properties.

**Response:**
\`\`\`json
{
  "capsules": [
    {
      "id": "button",
      "name": "Button",
      "icon": "🔘",
      "category": "UI Components",
      "platforms": ["web", "ios", "android", "desktop"],
      "props": {
        "text": { "type": "string", "default": "Click Me" },
        "variant": { "type": "enum", "options": ["primary", "secondary"] }
      }
    }
  ]
}
\`\`\`

#### POST /api/ai-generate

Generate UI from natural language prompt using AI.

**Request:**
\`\`\`json
{
  "prompt": "Create a login form with email and password",
  "context": {
    "screens": []
  }
}
\`\`\`

**Response:**
\`\`\`json
{
  "capsules": [
    { "type": "input", "props": { "placeholder": "Email" } },
    { "type": "input", "props": { "placeholder": "Password", "secure": true } },
    { "type": "button", "props": { "text": "Login" } }
  ]
}
\`\`\`

#### POST /api/generate

Generate native code for a specific platform.

**Request:**
\`\`\`json
{
  "platform": "ios",
  "screens": [...],
  "settings": {
    "projectName": "MyApp",
    "bundleId": "com.example.myapp",
    "themeColor": "#6366F1"
  }
}
\`\`\`

**Response:**
Returns a ZIP file containing the native project.

### Authentication

Currently, all APIs are public. Authentication coming soon.

### Rate Limits

- 100 requests per minute per IP
- AI generation: 20 requests per minute
    `
  }
]

function DocsContent() {
  const searchParams = useSearchParams()
  const [activeSection, setActiveSection] = useState('getting-started')

  useEffect(() => {
    const section = searchParams.get('section')
    if (section && DOCS_SECTIONS.find(s => s.id === section)) {
      setActiveSection(section)
    }
  }, [searchParams])

  const currentSection = DOCS_SECTIONS.find(s => s.id === activeSection) || DOCS_SECTIONS[0]

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="border-b border-white/10 sticky top-0 bg-[#0a0a0a]/80 backdrop-blur-xl z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <img src="/logo.jpeg" alt="HubLab" className="w-10 h-10 rounded-xl object-cover" />
            <span className="text-xl font-bold">HubLab</span>
            <span className="text-sm text-gray-400 border-l border-white/10 pl-3 ml-1">Docs</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/app" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-sm font-medium transition-colors">
              Open Editor
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto flex">
        {/* Sidebar */}
        <aside className="w-64 border-r border-white/10 min-h-[calc(100vh-73px)] sticky top-[73px] p-6">
          <nav className="space-y-2">
            {DOCS_SECTIONS.map(section => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 transition-all ${
                  activeSection === section.id
                    ? 'bg-indigo-500/20 text-indigo-400'
                    : 'hover:bg-white/5 text-gray-400'
                }`}
              >
                <span className="text-xl">{section.icon}</span>
                <div>
                  <div className="font-medium text-white">{section.title}</div>
                  <div className="text-xs text-gray-500">{section.description}</div>
                </div>
              </button>
            ))}
          </nav>

          <div className="mt-8 p-4 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-xl border border-indigo-500/20">
            <div className="text-sm font-medium mb-2">Need help?</div>
            <p className="text-xs text-gray-400 mb-3">
              Ask our AI assistant in the editor or join our community.
            </p>
            <Link
              href="/app"
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              Open Editor
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 p-8 max-w-4xl">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-4xl">{currentSection.icon}</span>
              <h1 className="text-3xl font-bold">{currentSection.title}</h1>
            </div>
            <p className="text-gray-400">{currentSection.description}</p>
          </div>

          {/* Markdown-like content */}
          <div className="prose prose-invert prose-indigo max-w-none">
            <div
              className="docs-content"
              dangerouslySetInnerHTML={{
                __html: renderMarkdown(currentSection.content)
              }}
            />
          </div>
        </main>
      </div>

      {/* Styles for docs content */}
      <style jsx global>{`
        .docs-content h2 {
          font-size: 1.75rem;
          font-weight: 700;
          margin-top: 2rem;
          margin-bottom: 1rem;
          color: white;
        }
        .docs-content h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
          color: white;
        }
        .docs-content p {
          margin-bottom: 1rem;
          color: #9ca3af;
          line-height: 1.7;
        }
        .docs-content ul, .docs-content ol {
          margin-bottom: 1rem;
          padding-left: 1.5rem;
          color: #9ca3af;
        }
        .docs-content li {
          margin-bottom: 0.5rem;
        }
        .docs-content code {
          background: rgba(255,255,255,0.1);
          padding: 0.2rem 0.4rem;
          border-radius: 0.25rem;
          font-size: 0.875rem;
          color: #a5b4fc;
        }
        .docs-content pre {
          background: #1e1e1e;
          padding: 1rem;
          border-radius: 0.5rem;
          overflow-x: auto;
          margin-bottom: 1rem;
        }
        .docs-content pre code {
          background: none;
          padding: 0;
          color: #e5e7eb;
        }
        .docs-content table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 1rem;
        }
        .docs-content th, .docs-content td {
          border: 1px solid rgba(255,255,255,0.1);
          padding: 0.75rem;
          text-align: left;
        }
        .docs-content th {
          background: rgba(255,255,255,0.05);
          font-weight: 600;
          color: white;
        }
        .docs-content td {
          color: #9ca3af;
        }
        .docs-content a {
          color: #818cf8;
          text-decoration: underline;
        }
        .docs-content a:hover {
          color: #a5b4fc;
        }
        .docs-content strong {
          color: white;
          font-weight: 600;
        }
        .docs-content blockquote {
          border-left: 4px solid #6366f1;
          padding-left: 1rem;
          margin: 1rem 0;
          color: #9ca3af;
          font-style: italic;
        }
      `}</style>
    </div>
  )
}

// Loading fallback for Suspense
function DocsLoading() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
      <div className="animate-pulse flex flex-col items-center gap-4">
        <img src="/logo.jpeg" alt="HubLab" className="w-12 h-12 rounded-xl object-cover animate-pulse" />
        <div className="text-gray-400">Loading documentation...</div>
      </div>
    </div>
  )
}

// Main export with Suspense boundary
export default function DocsPage() {
  return (
    <Suspense fallback={<DocsLoading />}>
      <DocsContent />
    </Suspense>
  )
}

// Simple markdown renderer
function renderMarkdown(content: string): string {
  return content
    // Headers
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    // Bold
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // Code blocks
    .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
    // Tables
    .replace(/\|(.+)\|/g, (match) => {
      const cells = match.split('|').filter(Boolean).map(cell => cell.trim())
      if (cells.every(c => c.match(/^-+$/))) {
        return ''
      }
      const isHeader = match.includes('---')
      const tag = isHeader ? 'th' : 'td'
      return `<tr>${cells.map(c => `<${tag}>${c}</${tag}>`).join('')}</tr>`
    })
    .replace(/(<tr>.*?<\/tr>\s*)+/gs, '<table>$&</table>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    // Lists
    .replace(/^- (.*$)/gim, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\s*)+/g, '<ul>$&</ul>')
    .replace(/^\d+\. (.*$)/gim, '<li>$1</li>')
    // Paragraphs
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(?!<)(.+)$/gm, '<p>$1</p>')
    // Clean up
    .replace(/<p><\/p>/g, '')
    .replace(/<p>(<h|<ul|<ol|<pre|<table)/g, '$1')
    .replace(/(<\/h\d>|<\/ul>|<\/ol>|<\/pre>|<\/table>)<\/p>/g, '$1')
}
