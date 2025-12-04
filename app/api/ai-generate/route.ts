import { NextRequest, NextResponse } from 'next/server'

const GROQ_API_KEY = process.env.GROQ_API_KEY || ''

// Complete capsule catalog organized by category
const CAPSULE_CATALOG = {
  // UI Components
  ui: ['button', 'text', 'input', 'card', 'image', 'avatar', 'badge', 'chip', 'divider', 'spacer', 'icon', 'tooltip', 'skeleton'],
  // Layout
  layout: ['list', 'modal', 'navigation', 'tabs', 'accordion', 'drawer', 'header', 'footer', 'sidebar', 'grid', 'stack', 'scrollview', 'bottomsheet', 'stepper', 'breadcrumb'],
  // Forms
  forms: ['form', 'switch', 'slider', 'dropdown', 'datepicker', 'timepicker', 'checkbox', 'radio', 'textarea', 'searchbar', 'autocomplete', 'colorpicker', 'filepicker', 'rating', 'signature', 'otp'],
  // Data & Charts
  data: ['chart', 'table', 'progress', 'stat', 'counter', 'timeline', 'calendar', 'gauge', 'kanban'],
  // Media
  media: ['video', 'audio', 'carousel', 'gallery', 'lightbox', 'qrcode', 'barcode', 'lottie', 'threed'],
  // Feedback
  feedback: ['toast', 'alert', 'snackbar', 'loading', 'spinner', 'confetti', 'emptystate', 'errorstate'],
  // Social
  social: ['comment', 'like', 'share', 'follow', 'usercard', 'chatbubble', 'reaction', 'mention', 'social-feed', 'social-post', 'social-story', 'social-profile-header', 'social-followers', 'social-group', 'social-poll', 'social-livestream'],
  // E-commerce
  ecommerce: ['productcard', 'cart', 'checkout', 'pricetag', 'quantity', 'wishlist', 'coupon', 'review'],
  // Native
  native: ['camera', 'location', 'biometrics', 'notifications', 'haptic', 'share-native', 'contacts', 'calendar-native', 'bluetooth', 'nfc', 'healthkit', 'applepay', 'googlepay', 'siri', 'widgets'],
  // AI
  ai: ['chatbot', 'voiceinput', 'texttospeech', 'imagerecognition', 'translation', 'sentiment', 'ai-chat-local', 'ai-assistant-widget', 'ai-autocomplete', 'ai-smart-input', 'ai-content-generator', 'ai-summarizer'],
  // Monetization
  monetization: ['ad-banner', 'paywall', 'pricing-table', 'buy-button', 'tip-jar', 'subscription-status', 'premium-badge', 'feature-gate', 'store-item', 'coin-display'],
  // Auth
  auth: ['auth-login', 'auth-register', 'auth-social', 'auth-forgot', 'auth-otp-verify', 'auth-profile', 'sec-2fa', 'sec-app-lock'],
  // Payments
  payments: ['pay-checkout', 'pay-stripe', 'pay-paypal', 'pay-apple', 'pay-google', 'pay-subscription'],
  // Gaming
  gaming: ['game-leaderboard', 'game-achievements', 'game-score', 'game-lives', 'game-timer', 'game-xp', 'game-inventory', 'game-health', 'game-joystick', 'game-quiz'],
  // Productivity
  productivity: ['prod-todo', 'prod-notes', 'prod-reminder', 'prod-pomodoro', 'prod-habit', 'prod-journal', 'prod-kanban', 'prod-calendar-event', 'prod-project', 'prod-bookmark', 'prod-markdown'],
  // Health
  health: ['health-steps', 'health-heart', 'health-sleep', 'health-water', 'health-calories', 'health-weight', 'health-workout', 'health-meditation', 'health-mood', 'health-bmi'],
  // Education
  education: ['edu-flashcard', 'edu-quiz', 'edu-progress', 'edu-course', 'edu-lesson', 'edu-certificate', 'edu-streak', 'edu-vocabulary'],
  // Finance
  finance: ['fin-balance', 'fin-transaction', 'fin-expense', 'fin-budget', 'fin-savings', 'fin-crypto', 'fin-stock', 'fin-invoice'],
  // Travel
  travel: ['travel-booking', 'travel-flight', 'travel-hotel', 'travel-itinerary', 'geo-map', 'geo-location', 'geo-places', 'geo-directions'],
  // Food
  food: ['food-menu', 'food-order', 'food-restaurant', 'food-delivery', 'food-recipe', 'food-nutrition'],
  // Music
  music: ['music-player', 'music-playlist', 'music-equalizer', 'music-podcast', 'music-waveform', 'music-lyrics'],
  // Communication
  communication: ['comm-video-call', 'comm-voice-call', 'comm-screen-share', 'comm-chat-room', 'comm-email', 'comm-sms'],
  // AR/VR
  arvr: ['ar-camera', 'ar-object', 'ar-face-filter', 'ar-surface', 'ar-measure', 'vr-viewer'],
  // News
  news: ['news-feed', 'news-article', 'news-breaking', 'news-category', 'news-bookmark'],
  // Real Estate
  realestate: ['realestate-listing', 'realestate-tour', 'realestate-mortgage', 'realestate-filter', 'realestate-agent'],
  // Events
  events: ['event-calendar', 'event-ticket', 'event-rsvp', 'event-countdown', 'event-seat-picker', 'event-schedule'],
  // Documents
  documents: ['doc-pdf-viewer', 'doc-scanner', 'doc-signature', 'doc-editor', 'doc-spreadsheet', 'doc-export'],
  // Dating
  dating: ['dating-profile', 'dating-swipe', 'dating-match', 'dating-chat', 'dating-icebreaker'],
  // Family
  family: ['family-tree', 'family-chores', 'family-allowance', 'family-location', 'baby-tracker'],
  // Pets
  pets: ['pet-profile', 'pet-health', 'pet-feeding', 'pet-vet', 'pet-tracker'],
  // Sports
  sports: ['sports-score', 'sports-team', 'sports-stats', 'sports-schedule', 'sports-betting'],
  // Automotive
  automotive: ['auto-vehicle', 'auto-fuel', 'auto-maintenance', 'auto-parking', 'auto-charging'],
  // Web3
  web3: ['web3-wallet', 'web3-nft', 'web3-token', 'web3-transaction', 'web3-mint'],
  // Smart Home
  smarthome: ['iot-thermostat', 'iot-lights', 'iot-lock', 'iot-camera', 'iot-doorbell', 'iot-sensor'],
  // Integrations
  integrations: ['int-spotify', 'int-youtube', 'int-discord', 'int-github', 'int-notion', 'int-firebase', 'int-supabase', 'int-stripe'],
}

// Flatten all capsules for validation
const ALL_CAPSULES = Object.values(CAPSULE_CATALOG).flat()

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json()

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    const systemPrompt = `You are HubLab AI, an expert app designer that creates native mobile apps using pre-built capsules.

## YOUR ROLE
Help users build apps by selecting the RIGHT capsules for their needs. When users describe an app idea, suggest the best capsules to build it.

## AVAILABLE CAPSULE CATEGORIES & THEIR USE CASES

**UI Components** (button, text, input, card, image, avatar, badge, chip, icon, tooltip, skeleton)
→ Use for: Basic building blocks, any app

**Layout** (navigation, tabs, drawer, header, footer, sidebar, grid, modal, bottomsheet, accordion)
→ Use for: App structure, navigation patterns

**Forms** (form, switch, slider, dropdown, datepicker, checkbox, radio, searchbar, rating, signature, otp)
→ Use for: User input, settings, surveys

**Data & Charts** (chart, table, progress, stat, counter, timeline, calendar, gauge, kanban)
→ Use for: Dashboards, analytics, project management

**Social** (social-feed, social-post, social-story, comment, like, share, follow, usercard, chatbubble, social-poll)
→ Use for: Social networks, community apps, forums

**E-commerce** (productcard, cart, checkout, pricetag, wishlist, coupon, review)
→ Use for: Online stores, marketplaces

**Gaming** (game-leaderboard, game-achievements, game-score, game-lives, game-xp, game-health, game-joystick, game-quiz)
→ Use for: Games, gamified apps, quiz apps

**Health & Fitness** (health-steps, health-heart, health-sleep, health-water, health-calories, health-workout, health-meditation, health-mood)
→ Use for: Fitness trackers, wellness apps

**Education** (edu-flashcard, edu-quiz, edu-course, edu-lesson, edu-progress, edu-streak, edu-certificate, edu-vocabulary)
→ Use for: Learning apps, courses, language learning

**Finance** (fin-balance, fin-transaction, fin-expense, fin-budget, fin-savings, fin-crypto, fin-stock, fin-invoice)
→ Use for: Banking, budgeting, investment apps

**Productivity** (prod-todo, prod-notes, prod-reminder, prod-pomodoro, prod-habit, prod-journal, prod-kanban, prod-project, prod-bookmark)
→ Use for: Task management, note-taking, habit tracking

**Travel** (travel-booking, travel-flight, travel-hotel, travel-itinerary, geo-map, geo-location, geo-places, geo-directions)
→ Use for: Travel planning, booking, navigation

**Food** (food-menu, food-order, food-restaurant, food-delivery, food-recipe, food-nutrition)
→ Use for: Food delivery, restaurant apps, recipe apps

**Music** (music-player, music-playlist, music-equalizer, music-podcast, music-waveform, music-lyrics)
→ Use for: Music streaming, podcast apps

**Communication** (comm-video-call, comm-voice-call, comm-chat-room, comm-email, comm-sms)
→ Use for: Messaging, video conferencing

**Dating** (dating-profile, dating-swipe, dating-match, dating-chat, dating-icebreaker)
→ Use for: Dating apps, social matching

**Pets** (pet-profile, pet-health, pet-feeding, pet-vet, pet-tracker)
→ Use for: Pet care apps

**Real Estate** (realestate-listing, realestate-tour, realestate-mortgage, realestate-filter, realestate-agent)
→ Use for: Property apps, home buying

**Events** (event-calendar, event-ticket, event-rsvp, event-countdown, event-seat-picker, event-schedule)
→ Use for: Event management, ticketing

**News** (news-feed, news-article, news-breaking, news-category, news-bookmark)
→ Use for: News apps, content aggregators

**Auth & Security** (auth-login, auth-register, auth-social, auth-otp-verify, sec-2fa, sec-app-lock)
→ Use for: User authentication, security

**Monetization** (paywall, pricing-table, buy-button, tip-jar, ad-banner, premium-badge, subscription-status)
→ Use for: In-app purchases, subscriptions, ads

**AI Features** (ai-chat-local, ai-assistant-widget, ai-autocomplete, ai-summarizer, chatbot, voiceinput, texttospeech)
→ Use for: AI-powered features, chatbots

**AR/VR** (ar-camera, ar-object, ar-face-filter, ar-measure, vr-viewer)
→ Use for: Augmented reality experiences

**Smart Home** (iot-thermostat, iot-lights, iot-lock, iot-camera, iot-sensor)
→ Use for: Home automation apps

**Web3** (web3-wallet, web3-nft, web3-token, web3-transaction, web3-mint)
→ Use for: Crypto, NFT, blockchain apps

## OUTPUT FORMAT
Return ONLY valid JSON with this structure:
{
  "name": "App Name",
  "capsules": [
    { "type": "capsule-id", "props": { ... } }
  ]
}

## RULES
1. Select 5-10 capsules that make sense together
2. Always start with navigation or header for structure
3. Match capsules to the app's purpose (e.g., fitness app = health capsules)
4. Include appropriate auth if the app needs user accounts
5. Add monetization capsules if it's a commercial app
6. Props should be customized to the app's theme/purpose

## COMMON PROPS BY CAPSULE TYPE
- button: { text, variant: "primary"|"secondary"|"outline", disabled }
- text: { content, size: "sm"|"md"|"lg", bold }
- input: { placeholder, label, required }
- card: { title, description }
- navigation: { items: "comma,separated,list" }
- chart: { type: "bar"|"line"|"pie", title }
- auth-login: { showForgotPassword, showRegisterLink, providers: "email" }
- social-feed: { layout: "list"|"grid", showLikes, showComments }
- game-leaderboard: { title, maxPlayers, showRank }
- health-steps: { goal, showProgress }
- fin-balance: { balance, currency, showChange }
- prod-todo: { title, showCompleted, sortBy: "priority" }
- music-player: { showProgress, showVolume, showShuffle }

Return ONLY the JSON, no markdown, no explanation.`

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Create an app for: ${prompt}` }
        ],
        temperature: 0.7,
        max_tokens: 2048,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('Groq API error:', error)
      return NextResponse.json({ error: 'AI generation failed' }, { status: 500 })
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content

    if (!content) {
      return NextResponse.json({ error: 'No response from AI' }, { status: 500 })
    }

    // Parse the JSON response
    try {
      // Clean up potential markdown formatting
      let jsonStr = content.trim()
      if (jsonStr.startsWith('```json')) {
        jsonStr = jsonStr.slice(7)
      }
      if (jsonStr.startsWith('```')) {
        jsonStr = jsonStr.slice(3)
      }
      if (jsonStr.endsWith('```')) {
        jsonStr = jsonStr.slice(0, -3)
      }
      jsonStr = jsonStr.trim()

      const result = JSON.parse(jsonStr)

      // Validate and filter capsules to only include valid types
      if (result.capsules && Array.isArray(result.capsules)) {
        result.capsules = result.capsules.filter((c: { type: string }) =>
          ALL_CAPSULES.includes(c.type)
        )
      }

      return NextResponse.json(result)
    } catch (parseError) {
      console.error('JSON parse error:', parseError, 'Content:', content)
      // Return a fallback response
      return NextResponse.json({
        name: 'My App',
        capsules: [
          { type: 'header', props: { title: 'Welcome', showBack: false, showMenu: true } },
          { type: 'text', props: { content: 'Welcome to your app!', size: 'lg', bold: true } },
          { type: 'card', props: { title: 'Get Started', description: 'Add more components to build your app' } },
          { type: 'button', props: { text: 'Continue', variant: 'primary' } },
        ]
      })
    }

  } catch (error) {
    console.error('AI generate error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
