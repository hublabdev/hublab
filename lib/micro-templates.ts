/**
 * HubLab Micro-App Templates
 *
 * Plantillas pixel-perfect diseñadas para creadores no técnicos.
 * Cada template es una micro-app completa lista para personalizar.
 *
 * Filosofía: "Simple is beautiful. Every pixel matters."
 */

export interface MicroTemplate {
  id: string
  name: string
  icon: string
  category: 'productivity' | 'lifestyle' | 'social' | 'commerce' | 'utility' | 'ai' | 'creative'
  description: string
  longDescription: string
  preview: string // Color de preview
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedTime: string // "5 min", "10 min", etc.
  capsules: TemplateCapusle[]
  settings: {
    themeColor: string
    appIcon: string
    platforms: string[]
  }
  tags: string[]
  featured?: boolean
  new?: boolean
}

export interface TemplateCapusle {
  id: string
  type: string
  icon: string
  name: string
  props: Record<string, unknown>
}

// ============================================================================
// MICRO-APP TEMPLATES
// ============================================================================

export const MICRO_TEMPLATES: MicroTemplate[] = [
  // ──────────────────────────────────────────────────────────────────────────
  // PRODUCTIVITY
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: 'daily-journal',
    name: 'Daily Journal',
    icon: '📔',
    category: 'productivity',
    description: 'Beautiful journaling app with mood tracking',
    longDescription: 'A minimalist daily journal app that helps users reflect on their day, track moods, and build a gratitude practice. Perfect for mental wellness apps.',
    preview: '#8B5CF6',
    difficulty: 'beginner',
    estimatedTime: '5 min',
    featured: true,
    tags: ['journal', 'wellness', 'mood', 'gratitude'],
    settings: {
      themeColor: '#8B5CF6',
      appIcon: '📔',
      platforms: ['ios', 'android', 'web']
    },
    capsules: [
      { id: 'header_1', type: 'header', icon: '🔝', name: 'Header', props: { title: 'My Journal', showBack: false, showMenu: true } },
      { id: 'text_date', type: 'text', icon: '📝', name: 'Date', props: { content: 'Wednesday, December 4', size: 'sm', bold: false } },
      { id: 'text_greeting', type: 'text', icon: '📝', name: 'Greeting', props: { content: 'How are you feeling today?', size: 'lg', bold: true } },
      { id: 'reaction_mood', type: 'reaction', icon: '😀', name: 'Mood Selector', props: { reactions: '😊,😌,😐,😔,😤', selected: '' } },
      { id: 'textarea_entry', type: 'textarea', icon: '📄', name: 'Journal Entry', props: { placeholder: 'Write about your day...', rows: 6, maxLength: 2000 } },
      { id: 'text_gratitude', type: 'text', icon: '📝', name: 'Gratitude Label', props: { content: 'What are you grateful for?', size: 'md', bold: true } },
      { id: 'input_gratitude1', type: 'input', icon: '✏️', name: 'Gratitude 1', props: { placeholder: '1. I am grateful for...', label: '', required: false } },
      { id: 'input_gratitude2', type: 'input', icon: '✏️', name: 'Gratitude 2', props: { placeholder: '2. I appreciate...', label: '', required: false } },
      { id: 'input_gratitude3', type: 'input', icon: '✏️', name: 'Gratitude 3', props: { placeholder: '3. I am thankful for...', label: '', required: false } },
      { id: 'button_save', type: 'button', icon: '🔘', name: 'Save Entry', props: { text: 'Save Entry', variant: 'primary', disabled: false } }
    ]
  },

  {
    id: 'habit-tracker',
    name: 'Habit Tracker',
    icon: '✅',
    category: 'productivity',
    description: 'Track daily habits with streaks',
    longDescription: 'A simple yet powerful habit tracking app. Users can create habits, mark them complete daily, and watch their streaks grow. Gamification elements included.',
    preview: '#10B981',
    difficulty: 'beginner',
    estimatedTime: '5 min',
    new: true,
    tags: ['habits', 'goals', 'streak', 'productivity'],
    settings: {
      themeColor: '#10B981',
      appIcon: '✅',
      platforms: ['ios', 'android', 'web']
    },
    capsules: [
      { id: 'header_1', type: 'header', icon: '🔝', name: 'Header', props: { title: 'My Habits', showBack: false, showMenu: true } },
      { id: 'stat_streak', type: 'stat', icon: '📈', name: 'Current Streak', props: { label: 'Current Streak', value: '12 days', change: '+3', trend: 'up' } },
      { id: 'text_today', type: 'text', icon: '📝', name: 'Today Label', props: { content: "Today's Habits", size: 'lg', bold: true } },
      { id: 'checkbox_1', type: 'checkbox', icon: '☑️', name: 'Habit 1', props: { label: '🧘 Meditate 10 min', checked: true } },
      { id: 'checkbox_2', type: 'checkbox', icon: '☑️', name: 'Habit 2', props: { label: '📖 Read 20 pages', checked: true } },
      { id: 'checkbox_3', type: 'checkbox', icon: '☑️', name: 'Habit 3', props: { label: '💪 Exercise 30 min', checked: false } },
      { id: 'checkbox_4', type: 'checkbox', icon: '☑️', name: 'Habit 4', props: { label: '💧 Drink 8 glasses water', checked: false } },
      { id: 'checkbox_5', type: 'checkbox', icon: '☑️', name: 'Habit 5', props: { label: '😴 Sleep by 10pm', checked: false } },
      { id: 'progress_daily', type: 'progress', icon: '⏳', name: 'Daily Progress', props: { value: 40, showLabel: true } },
      { id: 'button_add', type: 'button', icon: '🔘', name: 'Add Habit', props: { text: '+ Add New Habit', variant: 'secondary', disabled: false } }
    ]
  },

  {
    id: 'pomodoro-timer',
    name: 'Focus Timer',
    icon: '🍅',
    category: 'productivity',
    description: 'Pomodoro technique timer',
    longDescription: 'A beautiful Pomodoro timer app with customizable work/break intervals. Includes session tracking and gentle notifications.',
    preview: '#EF4444',
    difficulty: 'beginner',
    estimatedTime: '5 min',
    tags: ['focus', 'timer', 'pomodoro', 'productivity'],
    settings: {
      themeColor: '#EF4444',
      appIcon: '🍅',
      platforms: ['ios', 'android', 'web', 'desktop']
    },
    capsules: [
      { id: 'header_1', type: 'header', icon: '🔝', name: 'Header', props: { title: 'Focus Time', showBack: false, showMenu: false } },
      { id: 'tabs_mode', type: 'tabs', icon: '📑', name: 'Timer Mode', props: { items: 'Focus,Short Break,Long Break', activeTab: 'Focus' } },
      { id: 'text_timer', type: 'text', icon: '📝', name: 'Timer Display', props: { content: '25:00', size: 'lg', bold: true } },
      { id: 'progress_timer', type: 'progress', icon: '⏳', name: 'Timer Progress', props: { value: 0, showLabel: false } },
      { id: 'button_start', type: 'button', icon: '🔘', name: 'Start Button', props: { text: 'Start Focus', variant: 'primary', disabled: false } },
      { id: 'divider_1', type: 'divider', icon: '➖', name: 'Divider', props: { orientation: 'horizontal', spacing: 'lg' } },
      { id: 'text_sessions', type: 'text', icon: '📝', name: 'Sessions Label', props: { content: "Today's Sessions", size: 'md', bold: true } },
      { id: 'stat_sessions', type: 'stat', icon: '📈', name: 'Sessions Stat', props: { label: 'Completed', value: '4 sessions', change: '100 min', trend: 'up' } },
      { id: 'text_task', type: 'text', icon: '📝', name: 'Task Label', props: { content: 'Current Task', size: 'sm', bold: false } },
      { id: 'input_task', type: 'input', icon: '✏️', name: 'Task Input', props: { placeholder: 'What are you working on?', label: '', required: false } }
    ]
  },

  {
    id: 'quick-notes',
    name: 'Quick Notes',
    icon: '📝',
    category: 'productivity',
    description: 'Minimal note-taking app',
    longDescription: 'A distraction-free notes app focused on quick capture. Features include pinning, color-coding, and search.',
    preview: '#F59E0B',
    difficulty: 'beginner',
    estimatedTime: '5 min',
    tags: ['notes', 'minimal', 'capture', 'writing'],
    settings: {
      themeColor: '#F59E0B',
      appIcon: '📝',
      platforms: ['ios', 'android', 'web', 'desktop']
    },
    capsules: [
      { id: 'header_1', type: 'header', icon: '🔝', name: 'Header', props: { title: 'Notes', showBack: false, showMenu: true } },
      { id: 'searchbar_1', type: 'searchbar', icon: '🔍', name: 'Search', props: { placeholder: 'Search notes...', showFilter: false } },
      { id: 'card_note1', type: 'card', icon: '🃏', name: 'Note 1', props: { title: '📌 Meeting Notes', description: 'Discuss Q1 roadmap with the team...' } },
      { id: 'card_note2', type: 'card', icon: '🃏', name: 'Note 2', props: { title: 'Shopping List', description: 'Milk, eggs, bread, avocados...' } },
      { id: 'card_note3', type: 'card', icon: '🃏', name: 'Note 3', props: { title: 'Book Recommendations', description: 'Atomic Habits, Deep Work...' } },
      { id: 'card_note4', type: 'card', icon: '🃏', name: 'Note 4', props: { title: 'App Ideas', description: 'Journal app, expense tracker...' } },
      { id: 'button_new', type: 'button', icon: '🔘', name: 'New Note', props: { text: '+ New Note', variant: 'primary', disabled: false } }
    ]
  },

  // ──────────────────────────────────────────────────────────────────────────
  // LIFESTYLE
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: 'expense-tracker',
    name: 'Expense Tracker',
    icon: '💰',
    category: 'lifestyle',
    description: 'Simple personal finance tracker',
    longDescription: 'Track daily expenses, set budgets, and visualize spending patterns. Clean interface optimized for quick entry.',
    preview: '#059669',
    difficulty: 'beginner',
    estimatedTime: '5 min',
    featured: true,
    tags: ['money', 'budget', 'finance', 'expenses'],
    settings: {
      themeColor: '#059669',
      appIcon: '💰',
      platforms: ['ios', 'android', 'web']
    },
    capsules: [
      { id: 'header_1', type: 'header', icon: '🔝', name: 'Header', props: { title: 'My Expenses', showBack: false, showMenu: true } },
      { id: 'stat_balance', type: 'stat', icon: '📈', name: 'Balance', props: { label: 'This Month', value: '$2,450', change: '-$350', trend: 'down' } },
      { id: 'progress_budget', type: 'progress', icon: '⏳', name: 'Budget Progress', props: { value: 68, showLabel: true } },
      { id: 'text_recent', type: 'text', icon: '📝', name: 'Recent Label', props: { content: 'Recent Transactions', size: 'md', bold: true } },
      { id: 'card_expense1', type: 'card', icon: '🃏', name: 'Expense 1', props: { title: '🛒 Groceries', description: '$45.80 • Today' } },
      { id: 'card_expense2', type: 'card', icon: '🃏', name: 'Expense 2', props: { title: '☕ Coffee Shop', description: '$6.50 • Today' } },
      { id: 'card_expense3', type: 'card', icon: '🃏', name: 'Expense 3', props: { title: '⛽ Gas Station', description: '$52.00 • Yesterday' } },
      { id: 'card_expense4', type: 'card', icon: '🃏', name: 'Expense 4', props: { title: '🍕 Restaurant', description: '$38.90 • Yesterday' } },
      { id: 'button_add', type: 'button', icon: '🔘', name: 'Add Expense', props: { text: '+ Add Expense', variant: 'primary', disabled: false } }
    ]
  },

  {
    id: 'water-reminder',
    name: 'Water Reminder',
    icon: '💧',
    category: 'lifestyle',
    description: 'Stay hydrated with reminders',
    longDescription: 'A hydration tracking app with gentle reminders. Set daily goals, track intake, and build healthy habits.',
    preview: '#0EA5E9',
    difficulty: 'beginner',
    estimatedTime: '5 min',
    tags: ['water', 'health', 'hydration', 'reminder'],
    settings: {
      themeColor: '#0EA5E9',
      appIcon: '💧',
      platforms: ['ios', 'android']
    },
    capsules: [
      { id: 'header_1', type: 'header', icon: '🔝', name: 'Header', props: { title: 'Stay Hydrated', showBack: false, showMenu: true } },
      { id: 'gauge_water', type: 'gauge', icon: '🎯', name: 'Water Gauge', props: { value: 60, min: 0, max: 100, label: '1.5L / 2.5L' } },
      { id: 'text_goal', type: 'text', icon: '📝', name: 'Goal Text', props: { content: '6 of 10 glasses today', size: 'md', bold: false } },
      { id: 'button_add250', type: 'button', icon: '🔘', name: 'Add 250ml', props: { text: '+ 250ml', variant: 'secondary', disabled: false } },
      { id: 'button_add500', type: 'button', icon: '🔘', name: 'Add 500ml', props: { text: '+ 500ml', variant: 'primary', disabled: false } },
      { id: 'divider_1', type: 'divider', icon: '➖', name: 'Divider', props: { orientation: 'horizontal', spacing: 'md' } },
      { id: 'text_history', type: 'text', icon: '📝', name: 'History Label', props: { content: "Today's Log", size: 'md', bold: true } },
      { id: 'timeline_water', type: 'timeline', icon: '📅', name: 'Water Timeline', props: { items: '9:00 AM - 250ml,11:30 AM - 500ml,1:00 PM - 250ml,3:30 PM - 500ml', orientation: 'vertical' } },
      { id: 'switch_reminder', type: 'switch', icon: '🔀', name: 'Reminder Toggle', props: { label: 'Hourly Reminders', checked: true } }
    ]
  },

  {
    id: 'mood-diary',
    name: 'Mood Diary',
    icon: '🌈',
    category: 'lifestyle',
    description: 'Track your emotional wellness',
    longDescription: 'A gentle mood tracking app that helps you understand your emotional patterns over time. Beautiful visualizations and insights.',
    preview: '#EC4899',
    difficulty: 'beginner',
    estimatedTime: '5 min',
    tags: ['mood', 'mental health', 'emotions', 'wellness'],
    settings: {
      themeColor: '#EC4899',
      appIcon: '🌈',
      platforms: ['ios', 'android', 'web']
    },
    capsules: [
      { id: 'header_1', type: 'header', icon: '🔝', name: 'Header', props: { title: 'Mood Diary', showBack: false, showMenu: true } },
      { id: 'text_check', type: 'text', icon: '📝', name: 'Check-in Label', props: { content: 'How are you feeling right now?', size: 'lg', bold: true } },
      { id: 'reaction_mood', type: 'reaction', icon: '😀', name: 'Mood Selector', props: { reactions: '😄,🙂,😐,😔,😢,😤', selected: '' } },
      { id: 'slider_energy', type: 'slider', icon: '🎚️', name: 'Energy Level', props: { label: 'Energy Level', min: 0, max: 100, value: 50 } },
      { id: 'autocomplete_tags', type: 'autocomplete', icon: '🔮', name: 'Mood Tags', props: { placeholder: 'Add tags (anxious, happy, tired...)', suggestions: 'anxious,happy,tired,stressed,calm,motivated' } },
      { id: 'textarea_note', type: 'textarea', icon: '📄', name: 'Notes', props: { placeholder: 'What made you feel this way?', rows: 3, maxLength: 500 } },
      { id: 'button_log', type: 'button', icon: '🔘', name: 'Log Mood', props: { text: 'Log My Mood', variant: 'primary', disabled: false } },
      { id: 'divider_1', type: 'divider', icon: '➖', name: 'Divider', props: { orientation: 'horizontal', spacing: 'md' } },
      { id: 'text_week', type: 'text', icon: '📝', name: 'Week Label', props: { content: 'This Week', size: 'md', bold: true } },
      { id: 'chart_mood', type: 'chart', icon: '📊', name: 'Mood Chart', props: { type: 'line', title: 'Mood Trend' } }
    ]
  },

  {
    id: 'sleep-tracker',
    name: 'Sleep Tracker',
    icon: '😴',
    category: 'lifestyle',
    description: 'Track sleep quality and patterns',
    longDescription: 'Log your sleep, track patterns, and get insights to improve your rest. Simple bedtime reminders included.',
    preview: '#6366F1',
    difficulty: 'beginner',
    estimatedTime: '5 min',
    tags: ['sleep', 'health', 'rest', 'wellness'],
    settings: {
      themeColor: '#6366F1',
      appIcon: '😴',
      platforms: ['ios', 'android']
    },
    capsules: [
      { id: 'header_1', type: 'header', icon: '🔝', name: 'Header', props: { title: 'Sleep Tracker', showBack: false, showMenu: true } },
      { id: 'stat_avg', type: 'stat', icon: '📈', name: 'Avg Sleep', props: { label: 'Avg Sleep', value: '7h 24m', change: '+18min', trend: 'up' } },
      { id: 'text_last', type: 'text', icon: '📝', name: 'Last Night Label', props: { content: 'Last Night', size: 'lg', bold: true } },
      { id: 'gauge_quality', type: 'gauge', icon: '🎯', name: 'Sleep Quality', props: { value: 82, min: 0, max: 100, label: 'Quality Score' } },
      { id: 'text_times', type: 'text', icon: '📝', name: 'Times', props: { content: '11:30 PM → 7:00 AM', size: 'md', bold: false } },
      { id: 'rating_quality', type: 'rating', icon: '⭐', name: 'Rate Sleep', props: { max: 5, value: 4, allowHalf: true } },
      { id: 'divider_1', type: 'divider', icon: '➖', name: 'Divider', props: { orientation: 'horizontal', spacing: 'md' } },
      { id: 'text_bedtime', type: 'text', icon: '📝', name: 'Bedtime Label', props: { content: 'Bedtime Goal', size: 'md', bold: true } },
      { id: 'timepicker_bed', type: 'timepicker', icon: '⏰', name: 'Bedtime', props: { label: 'Go to bed', format: '12h' } },
      { id: 'switch_reminder', type: 'switch', icon: '🔀', name: 'Reminder', props: { label: 'Bedtime Reminder', checked: true } }
    ]
  },

  // ──────────────────────────────────────────────────────────────────────────
  // SOCIAL
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: 'link-bio',
    name: 'Link in Bio',
    icon: '🔗',
    category: 'social',
    description: 'Personal link page like Linktree',
    longDescription: 'Create your own link-in-bio page. Perfect for social media profiles. Add unlimited links with custom icons and descriptions.',
    preview: '#8B5CF6',
    difficulty: 'beginner',
    estimatedTime: '3 min',
    featured: true,
    tags: ['links', 'social', 'profile', 'linktree'],
    settings: {
      themeColor: '#8B5CF6',
      appIcon: '🔗',
      platforms: ['web']
    },
    capsules: [
      { id: 'avatar_1', type: 'avatar', icon: '👤', name: 'Profile Avatar', props: { src: '', name: 'Your Name', size: 'lg', status: 'none' } },
      { id: 'text_name', type: 'text', icon: '📝', name: 'Name', props: { content: '@yourname', size: 'lg', bold: true } },
      { id: 'text_bio', type: 'text', icon: '📝', name: 'Bio', props: { content: 'Creator • Designer • Dreamer', size: 'sm', bold: false } },
      { id: 'button_link1', type: 'button', icon: '🔘', name: 'Link 1', props: { text: '🌐 My Website', variant: 'primary', disabled: false } },
      { id: 'button_link2', type: 'button', icon: '🔘', name: 'Link 2', props: { text: '📸 Instagram', variant: 'secondary', disabled: false } },
      { id: 'button_link3', type: 'button', icon: '🔘', name: 'Link 3', props: { text: '🐦 Twitter / X', variant: 'secondary', disabled: false } },
      { id: 'button_link4', type: 'button', icon: '🔘', name: 'Link 4', props: { text: '📺 YouTube', variant: 'secondary', disabled: false } },
      { id: 'button_link5', type: 'button', icon: '🔘', name: 'Link 5', props: { text: '💼 LinkedIn', variant: 'secondary', disabled: false } },
      { id: 'button_link6', type: 'button', icon: '🔘', name: 'Link 6', props: { text: '☕ Buy Me a Coffee', variant: 'secondary', disabled: false } },
      { id: 'text_footer', type: 'text', icon: '📝', name: 'Footer', props: { content: 'Made with HubLab', size: 'sm', bold: false } }
    ]
  },

  {
    id: 'event-rsvp',
    name: 'Event RSVP',
    icon: '🎉',
    category: 'social',
    description: 'Simple event invitation page',
    longDescription: 'Create beautiful event invitation pages. Share the link and collect RSVPs. Perfect for parties, weddings, meetups.',
    preview: '#F59E0B',
    difficulty: 'beginner',
    estimatedTime: '5 min',
    tags: ['event', 'invitation', 'rsvp', 'party'],
    settings: {
      themeColor: '#F59E0B',
      appIcon: '🎉',
      platforms: ['web', 'ios', 'android']
    },
    capsules: [
      { id: 'image_cover', type: 'image', icon: '🖼️', name: 'Cover Image', props: { src: '', alt: 'Event Cover', rounded: true } },
      { id: 'text_title', type: 'text', icon: '📝', name: 'Event Title', props: { content: "Sarah's Birthday Bash!", size: 'lg', bold: true } },
      { id: 'text_date', type: 'text', icon: '📝', name: 'Date', props: { content: '📅 Saturday, December 15, 2024', size: 'md', bold: false } },
      { id: 'text_time', type: 'text', icon: '📝', name: 'Time', props: { content: '🕖 7:00 PM - 11:00 PM', size: 'md', bold: false } },
      { id: 'text_location', type: 'text', icon: '📝', name: 'Location', props: { content: '📍 The Rooftop Bar, 123 Main St', size: 'md', bold: false } },
      { id: 'divider_1', type: 'divider', icon: '➖', name: 'Divider', props: { orientation: 'horizontal', spacing: 'md' } },
      { id: 'text_details', type: 'text', icon: '📝', name: 'Details', props: { content: 'Join us for an evening of fun, food, and celebration! Dress code: Casual chic.', size: 'sm', bold: false } },
      { id: 'input_name', type: 'input', icon: '✏️', name: 'Guest Name', props: { placeholder: 'Your name', label: 'Name', required: true } },
      { id: 'radio_rsvp', type: 'radio', icon: '🔘', name: 'RSVP Response', props: { label: 'Will you attend?', options: "Yes, I'll be there!,Maybe,Can't make it", selected: '' } },
      { id: 'button_submit', type: 'button', icon: '🔘', name: 'Submit RSVP', props: { text: 'Send RSVP', variant: 'primary', disabled: false } }
    ]
  },

  {
    id: 'poll-creator',
    name: 'Quick Poll',
    icon: '📊',
    category: 'social',
    description: 'Create instant polls',
    longDescription: 'Create quick polls and share them instantly. Perfect for getting opinions from friends, team decisions, or social engagement.',
    preview: '#3B82F6',
    difficulty: 'beginner',
    estimatedTime: '3 min',
    tags: ['poll', 'vote', 'survey', 'social'],
    settings: {
      themeColor: '#3B82F6',
      appIcon: '📊',
      platforms: ['web', 'ios', 'android']
    },
    capsules: [
      { id: 'header_1', type: 'header', icon: '🔝', name: 'Header', props: { title: 'Quick Poll', showBack: false, showMenu: false } },
      { id: 'text_question', type: 'text', icon: '📝', name: 'Question', props: { content: 'What should we have for team lunch?', size: 'lg', bold: true } },
      { id: 'radio_options', type: 'radio', icon: '🔘', name: 'Options', props: { label: '', options: '🍕 Pizza,🍔 Burgers,🥗 Salads,🍣 Sushi', selected: '' } },
      { id: 'button_vote', type: 'button', icon: '🔘', name: 'Vote', props: { text: 'Submit Vote', variant: 'primary', disabled: false } },
      { id: 'divider_1', type: 'divider', icon: '➖', name: 'Divider', props: { orientation: 'horizontal', spacing: 'md' } },
      { id: 'text_results', type: 'text', icon: '📝', name: 'Results Label', props: { content: 'Current Results', size: 'md', bold: true } },
      { id: 'progress_1', type: 'progress', icon: '⏳', name: 'Option 1 Progress', props: { value: 45, showLabel: true } },
      { id: 'progress_2', type: 'progress', icon: '⏳', name: 'Option 2 Progress', props: { value: 30, showLabel: true } },
      { id: 'progress_3', type: 'progress', icon: '⏳', name: 'Option 3 Progress', props: { value: 15, showLabel: true } },
      { id: 'progress_4', type: 'progress', icon: '⏳', name: 'Option 4 Progress', props: { value: 10, showLabel: true } },
      { id: 'text_votes', type: 'text', icon: '📝', name: 'Total Votes', props: { content: '42 votes', size: 'sm', bold: false } }
    ]
  },

  // ──────────────────────────────────────────────────────────────────────────
  // COMMERCE
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: 'digital-menu',
    name: 'Digital Menu',
    icon: '🍽️',
    category: 'commerce',
    description: 'QR code menu for restaurants',
    longDescription: 'Create a beautiful digital menu for your restaurant or café. Customers scan a QR code and browse your menu on their phones.',
    preview: '#DC2626',
    difficulty: 'intermediate',
    estimatedTime: '10 min',
    featured: true,
    tags: ['restaurant', 'menu', 'qrcode', 'food'],
    settings: {
      themeColor: '#DC2626',
      appIcon: '🍽️',
      platforms: ['web']
    },
    capsules: [
      { id: 'header_1', type: 'header', icon: '🔝', name: 'Header', props: { title: 'La Trattoria', showBack: false, showMenu: false } },
      { id: 'text_welcome', type: 'text', icon: '📝', name: 'Welcome', props: { content: 'Welcome! Browse our menu', size: 'md', bold: false } },
      { id: 'tabs_menu', type: 'tabs', icon: '📑', name: 'Menu Categories', props: { items: 'Starters,Mains,Desserts,Drinks', activeTab: 'Starters' } },
      { id: 'card_item1', type: 'productcard', icon: '🛍️', name: 'Item 1', props: { title: 'Bruschetta', price: 8.50, image: '', rating: 4.8 } },
      { id: 'card_item2', type: 'productcard', icon: '🛍️', name: 'Item 2', props: { title: 'Caprese Salad', price: 12.00, image: '', rating: 4.9 } },
      { id: 'card_item3', type: 'productcard', icon: '🛍️', name: 'Item 3', props: { title: 'Garlic Bread', price: 6.00, image: '', rating: 4.7 } },
      { id: 'divider_1', type: 'divider', icon: '➖', name: 'Divider', props: { orientation: 'horizontal', spacing: 'md' } },
      { id: 'text_special', type: 'text', icon: '📝', name: 'Special Label', props: { content: "🌟 Chef's Special", size: 'md', bold: true } },
      { id: 'card_special', type: 'card', icon: '🃏', name: 'Special Item', props: { title: 'Truffle Risotto', description: 'Creamy arborio rice with black truffle • $28' } },
      { id: 'text_footer', type: 'text', icon: '📝', name: 'Footer', props: { content: 'Ask your server about allergens', size: 'sm', bold: false } }
    ]
  },

  {
    id: 'tip-jar',
    name: 'Tip Jar',
    icon: '🫙',
    category: 'commerce',
    description: 'Accept tips and donations',
    longDescription: 'A simple tip jar app for creators, street performers, or anyone accepting digital tips. Connect with payment providers.',
    preview: '#10B981',
    difficulty: 'beginner',
    estimatedTime: '3 min',
    new: true,
    tags: ['tips', 'donations', 'creator', 'payment'],
    settings: {
      themeColor: '#10B981',
      appIcon: '🫙',
      platforms: ['web', 'ios', 'android']
    },
    capsules: [
      { id: 'avatar_1', type: 'avatar', icon: '👤', name: 'Creator Avatar', props: { src: '', name: 'Alex', size: 'lg', status: 'none' } },
      { id: 'text_name', type: 'text', icon: '📝', name: 'Creator Name', props: { content: 'Alex Creates', size: 'lg', bold: true } },
      { id: 'text_tagline', type: 'text', icon: '📝', name: 'Tagline', props: { content: '☕ Buy me a coffee!', size: 'md', bold: false } },
      { id: 'text_message', type: 'text', icon: '📝', name: 'Message', props: { content: 'Your support helps me create more content. Thank you!', size: 'sm', bold: false } },
      { id: 'divider_1', type: 'divider', icon: '➖', name: 'Divider', props: { orientation: 'horizontal', spacing: 'md' } },
      { id: 'button_tip1', type: 'button', icon: '🔘', name: 'Tip $3', props: { text: '☕ $3', variant: 'secondary', disabled: false } },
      { id: 'button_tip2', type: 'button', icon: '🔘', name: 'Tip $5', props: { text: '🍕 $5', variant: 'secondary', disabled: false } },
      { id: 'button_tip3', type: 'button', icon: '🔘', name: 'Tip $10', props: { text: '🎁 $10', variant: 'primary', disabled: false } },
      { id: 'input_custom', type: 'input', icon: '✏️', name: 'Custom Amount', props: { placeholder: 'Custom amount', label: '', required: false } },
      { id: 'textarea_message', type: 'textarea', icon: '📄', name: 'Optional Message', props: { placeholder: 'Leave a message (optional)', rows: 2, maxLength: 200 } },
      { id: 'button_send', type: 'button', icon: '🔘', name: 'Send Tip', props: { text: 'Send Tip 💝', variant: 'primary', disabled: false } }
    ]
  },

  {
    id: 'booking-page',
    name: 'Booking Page',
    icon: '📅',
    category: 'commerce',
    description: 'Simple appointment booking',
    longDescription: 'Let clients book appointments with you. Perfect for consultants, coaches, freelancers, and service providers.',
    preview: '#7C3AED',
    difficulty: 'intermediate',
    estimatedTime: '10 min',
    tags: ['booking', 'appointment', 'calendar', 'schedule'],
    settings: {
      themeColor: '#7C3AED',
      appIcon: '📅',
      platforms: ['web']
    },
    capsules: [
      { id: 'header_1', type: 'header', icon: '🔝', name: 'Header', props: { title: 'Book a Session', showBack: false, showMenu: false } },
      { id: 'avatar_1', type: 'avatar', icon: '👤', name: 'Provider Avatar', props: { src: '', name: 'Dr. Smith', size: 'md', status: 'none' } },
      { id: 'text_provider', type: 'text', icon: '📝', name: 'Provider Name', props: { content: 'Dr. Sarah Smith', size: 'lg', bold: true } },
      { id: 'text_title', type: 'text', icon: '📝', name: 'Title', props: { content: 'Life Coach & Wellness Consultant', size: 'sm', bold: false } },
      { id: 'divider_1', type: 'divider', icon: '➖', name: 'Divider', props: { orientation: 'horizontal', spacing: 'md' } },
      { id: 'text_select', type: 'text', icon: '📝', name: 'Select Label', props: { content: 'Select a Service', size: 'md', bold: true } },
      { id: 'dropdown_service', type: 'dropdown', icon: '📂', name: 'Service', props: { label: 'Service', options: '30min Discovery Call - Free,60min Coaching Session - $120,90min Deep Dive - $180' } },
      { id: 'calendar_1', type: 'calendar', icon: '🗓️', name: 'Calendar', props: { showWeekNumbers: false, multiSelect: false } },
      { id: 'text_times', type: 'text', icon: '📝', name: 'Times Label', props: { content: 'Available Times', size: 'md', bold: true } },
      { id: 'radio_time', type: 'radio', icon: '🔘', name: 'Time Slots', props: { label: '', options: '9:00 AM,10:30 AM,2:00 PM,4:30 PM', selected: '' } },
      { id: 'input_name', type: 'input', icon: '✏️', name: 'Your Name', props: { placeholder: 'Your name', label: 'Name', required: true } },
      { id: 'input_email', type: 'input', icon: '✏️', name: 'Email', props: { placeholder: 'your@email.com', label: 'Email', required: true } },
      { id: 'button_book', type: 'button', icon: '🔘', name: 'Book', props: { text: 'Confirm Booking', variant: 'primary', disabled: false } }
    ]
  },

  // ──────────────────────────────────────────────────────────────────────────
  // UTILITY
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: 'qr-business-card',
    name: 'Digital Card',
    icon: '📇',
    category: 'utility',
    description: 'QR code business card',
    longDescription: 'Create a digital business card with a QR code. Share your contact info instantly at networking events.',
    preview: '#1F2937',
    difficulty: 'beginner',
    estimatedTime: '3 min',
    new: true,
    tags: ['business', 'card', 'qr', 'contact'],
    settings: {
      themeColor: '#1F2937',
      appIcon: '📇',
      platforms: ['web', 'ios', 'android']
    },
    capsules: [
      { id: 'avatar_1', type: 'avatar', icon: '👤', name: 'Photo', props: { src: '', name: 'John', size: 'lg', status: 'none' } },
      { id: 'text_name', type: 'text', icon: '📝', name: 'Name', props: { content: 'John Anderson', size: 'lg', bold: true } },
      { id: 'text_title', type: 'text', icon: '📝', name: 'Title', props: { content: 'Senior Product Designer', size: 'md', bold: false } },
      { id: 'text_company', type: 'text', icon: '📝', name: 'Company', props: { content: 'Tech Company Inc.', size: 'sm', bold: false } },
      { id: 'divider_1', type: 'divider', icon: '➖', name: 'Divider', props: { orientation: 'horizontal', spacing: 'md' } },
      { id: 'text_email', type: 'text', icon: '📝', name: 'Email', props: { content: '📧 john@company.com', size: 'sm', bold: false } },
      { id: 'text_phone', type: 'text', icon: '📝', name: 'Phone', props: { content: '📱 +1 (555) 123-4567', size: 'sm', bold: false } },
      { id: 'text_website', type: 'text', icon: '📝', name: 'Website', props: { content: '🌐 www.johnanderson.com', size: 'sm', bold: false } },
      { id: 'qrcode_1', type: 'qrcode', icon: '📱', name: 'QR Code', props: { value: 'https://hublab.dev', size: 150 } },
      { id: 'text_scan', type: 'text', icon: '📝', name: 'Scan Text', props: { content: 'Scan to save contact', size: 'sm', bold: false } },
      { id: 'button_share', type: 'button', icon: '🔘', name: 'Share', props: { text: 'Share Contact', variant: 'primary', disabled: false } }
    ]
  },

  {
    id: 'countdown-timer',
    name: 'Countdown',
    icon: '⏱️',
    category: 'utility',
    description: 'Event countdown timer',
    longDescription: 'A beautiful countdown timer for your big event. Share it and let everyone know when the magic happens.',
    preview: '#DC2626',
    difficulty: 'beginner',
    estimatedTime: '3 min',
    tags: ['countdown', 'event', 'timer', 'launch'],
    settings: {
      themeColor: '#DC2626',
      appIcon: '⏱️',
      platforms: ['web']
    },
    capsules: [
      { id: 'text_event', type: 'text', icon: '📝', name: 'Event Name', props: { content: '🚀 Product Launch', size: 'lg', bold: true } },
      { id: 'text_date', type: 'text', icon: '📝', name: 'Date', props: { content: 'December 31, 2024', size: 'md', bold: false } },
      { id: 'divider_1', type: 'divider', icon: '➖', name: 'Divider', props: { orientation: 'horizontal', spacing: 'md' } },
      { id: 'counter_days', type: 'stat', icon: '📈', name: 'Days', props: { label: 'Days', value: '27', change: '', trend: 'up' } },
      { id: 'counter_hours', type: 'stat', icon: '📈', name: 'Hours', props: { label: 'Hours', value: '14', change: '', trend: 'up' } },
      { id: 'counter_mins', type: 'stat', icon: '📈', name: 'Minutes', props: { label: 'Minutes', value: '32', change: '', trend: 'up' } },
      { id: 'counter_secs', type: 'stat', icon: '📈', name: 'Seconds', props: { label: 'Seconds', value: '45', change: '', trend: 'up' } },
      { id: 'divider_2', type: 'divider', icon: '➖', name: 'Divider 2', props: { orientation: 'horizontal', spacing: 'md' } },
      { id: 'text_notify', type: 'text', icon: '📝', name: 'Notify Label', props: { content: 'Get notified when we launch!', size: 'md', bold: true } },
      { id: 'input_email', type: 'input', icon: '✏️', name: 'Email', props: { placeholder: 'your@email.com', label: '', required: true } },
      { id: 'button_notify', type: 'button', icon: '🔘', name: 'Notify Me', props: { text: 'Notify Me', variant: 'primary', disabled: false } }
    ]
  },

  {
    id: 'wifi-share',
    name: 'WiFi Share',
    icon: '📶',
    category: 'utility',
    description: 'Share WiFi with QR code',
    longDescription: 'Create a QR code to share your WiFi password. Perfect for Airbnbs, offices, and cafes. Guests just scan and connect.',
    preview: '#0EA5E9',
    difficulty: 'beginner',
    estimatedTime: '2 min',
    tags: ['wifi', 'qr', 'share', 'guest'],
    settings: {
      themeColor: '#0EA5E9',
      appIcon: '📶',
      platforms: ['web']
    },
    capsules: [
      { id: 'text_title', type: 'text', icon: '📝', name: 'Title', props: { content: '📶 Connect to WiFi', size: 'lg', bold: true } },
      { id: 'qrcode_wifi', type: 'qrcode', icon: '📱', name: 'WiFi QR', props: { value: 'WIFI:T:WPA;S:MyNetwork;P:password123;;', size: 200 } },
      { id: 'text_scan', type: 'text', icon: '📝', name: 'Scan Label', props: { content: 'Scan to connect', size: 'md', bold: false } },
      { id: 'divider_1', type: 'divider', icon: '➖', name: 'Divider', props: { orientation: 'horizontal', spacing: 'md' } },
      { id: 'text_manual', type: 'text', icon: '📝', name: 'Manual Label', props: { content: 'Or connect manually:', size: 'sm', bold: true } },
      { id: 'card_details', type: 'card', icon: '🃏', name: 'WiFi Details', props: { title: 'Network: MyNetwork', description: 'Password: ••••••••' } },
      { id: 'button_show', type: 'button', icon: '🔘', name: 'Show Password', props: { text: 'Show Password', variant: 'secondary', disabled: false } },
      { id: 'text_footer', type: 'text', icon: '📝', name: 'Footer', props: { content: 'Enjoy your stay!', size: 'sm', bold: false } }
    ]
  },

  // ──────────────────────────────────────────────────────────────────────────
  // AI POWERED
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: 'ai-chat-assistant',
    name: 'AI Chat',
    icon: '🤖',
    category: 'ai',
    description: 'Custom AI chat assistant',
    longDescription: 'Create your own AI-powered chat assistant. Customize the personality, knowledge base, and appearance. Powered by edge AI.',
    preview: '#8B5CF6',
    difficulty: 'intermediate',
    estimatedTime: '10 min',
    featured: true,
    new: true,
    tags: ['ai', 'chat', 'assistant', 'bot'],
    settings: {
      themeColor: '#8B5CF6',
      appIcon: '🤖',
      platforms: ['web', 'ios', 'android']
    },
    capsules: [
      { id: 'header_1', type: 'header', icon: '🔝', name: 'Header', props: { title: 'AI Assistant', showBack: true, showMenu: false } },
      { id: 'chatbubble_1', type: 'chatbubble', icon: '💭', name: 'AI Greeting', props: { message: 'Hello! I\'m your AI assistant. How can I help you today?', isOwn: false, timestamp: '2:30 PM' } },
      { id: 'chatbubble_2', type: 'chatbubble', icon: '💭', name: 'User Message', props: { message: 'Can you help me plan my day?', isOwn: true, timestamp: '2:31 PM' } },
      { id: 'chatbubble_3', type: 'chatbubble', icon: '💭', name: 'AI Response', props: { message: "Of course! Let me help you organize your tasks. What's on your agenda?", isOwn: false, timestamp: '2:31 PM' } },
      { id: 'loading_1', type: 'loading', icon: '⏳', name: 'Typing', props: { size: 'sm', text: 'AI is thinking...' } },
      { id: 'divider_1', type: 'divider', icon: '➖', name: 'Divider', props: { orientation: 'horizontal', spacing: 'sm' } },
      { id: 'chatbot_1', type: 'chatbot', icon: '🤖', name: 'Chat Input', props: { placeholder: 'Type your message...', welcomeMessage: '', avatar: '' } },
      { id: 'voiceinput_1', type: 'voiceinput', icon: '🎤', name: 'Voice', props: { language: 'en-US', continuous: false } }
    ]
  },

  {
    id: 'ai-translator',
    name: 'AI Translator',
    icon: '🌐',
    category: 'ai',
    description: 'Real-time translation app',
    longDescription: 'Translate text and speech in real-time. Support for 100+ languages with AI-powered accuracy.',
    preview: '#059669',
    difficulty: 'intermediate',
    estimatedTime: '5 min',
    tags: ['translation', 'language', 'ai', 'travel'],
    settings: {
      themeColor: '#059669',
      appIcon: '🌐',
      platforms: ['web', 'ios', 'android']
    },
    capsules: [
      { id: 'header_1', type: 'header', icon: '🔝', name: 'Header', props: { title: 'Translator', showBack: false, showMenu: true } },
      { id: 'dropdown_from', type: 'dropdown', icon: '📂', name: 'From Language', props: { label: 'From', options: 'Auto Detect,English,Spanish,French,German,Chinese,Japanese' } },
      { id: 'button_swap', type: 'button', icon: '🔘', name: 'Swap', props: { text: '⇄', variant: 'secondary', disabled: false } },
      { id: 'dropdown_to', type: 'dropdown', icon: '📂', name: 'To Language', props: { label: 'To', options: 'Spanish,English,French,German,Chinese,Japanese' } },
      { id: 'textarea_input', type: 'textarea', icon: '📄', name: 'Input Text', props: { placeholder: 'Enter text to translate...', rows: 4, maxLength: 1000 } },
      { id: 'voiceinput_1', type: 'voiceinput', icon: '🎤', name: 'Voice Input', props: { language: 'en-US', continuous: false } },
      { id: 'divider_1', type: 'divider', icon: '➖', name: 'Divider', props: { orientation: 'horizontal', spacing: 'md' } },
      { id: 'card_result', type: 'card', icon: '🃏', name: 'Translation', props: { title: 'Translation', description: 'Your translated text will appear here...' } },
      { id: 'texttospeech_1', type: 'texttospeech', icon: '🔊', name: 'Speak', props: { text: '', voice: 'default', rate: 1 } },
      { id: 'button_copy', type: 'button', icon: '🔘', name: 'Copy', props: { text: 'Copy Translation', variant: 'secondary', disabled: false } }
    ]
  },

  {
    id: 'ai-writer',
    name: 'AI Writer',
    icon: '✍️',
    category: 'ai',
    description: 'AI-powered writing assistant',
    longDescription: 'Get help writing anything - emails, social posts, blog articles. AI suggests, you refine.',
    preview: '#F59E0B',
    difficulty: 'intermediate',
    estimatedTime: '5 min',
    tags: ['writing', 'ai', 'content', 'copywriting'],
    settings: {
      themeColor: '#F59E0B',
      appIcon: '✍️',
      platforms: ['web', 'desktop']
    },
    capsules: [
      { id: 'header_1', type: 'header', icon: '🔝', name: 'Header', props: { title: 'AI Writer', showBack: false, showMenu: true } },
      { id: 'dropdown_type', type: 'dropdown', icon: '📂', name: 'Content Type', props: { label: 'What are you writing?', options: 'Email,Social Post,Blog Article,Product Description,Cover Letter' } },
      { id: 'dropdown_tone', type: 'dropdown', icon: '📂', name: 'Tone', props: { label: 'Tone', options: 'Professional,Casual,Friendly,Formal,Funny,Persuasive' } },
      { id: 'textarea_prompt', type: 'textarea', icon: '📄', name: 'Prompt', props: { placeholder: 'Describe what you want to write about...', rows: 3, maxLength: 500 } },
      { id: 'button_generate', type: 'button', icon: '🔘', name: 'Generate', props: { text: '✨ Generate with AI', variant: 'primary', disabled: false } },
      { id: 'divider_1', type: 'divider', icon: '➖', name: 'Divider', props: { orientation: 'horizontal', spacing: 'md' } },
      { id: 'text_result', type: 'text', icon: '📝', name: 'Result Label', props: { content: 'Generated Content', size: 'md', bold: true } },
      { id: 'textarea_output', type: 'textarea', icon: '📄', name: 'Output', props: { placeholder: 'AI-generated content will appear here...', rows: 8, maxLength: 5000 } },
      { id: 'button_copy', type: 'button', icon: '🔘', name: 'Copy', props: { text: 'Copy to Clipboard', variant: 'secondary', disabled: false } },
      { id: 'button_regenerate', type: 'button', icon: '🔘', name: 'Regenerate', props: { text: '🔄 Try Again', variant: 'secondary', disabled: false } }
    ]
  },

  // ──────────────────────────────────────────────────────────────────────────
  // CREATIVE
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: 'photo-portfolio',
    name: 'Photo Portfolio',
    icon: '📸',
    category: 'creative',
    description: 'Showcase your photography',
    longDescription: 'A stunning portfolio for photographers. Grid gallery, fullscreen lightbox, and contact form.',
    preview: '#1F2937',
    difficulty: 'beginner',
    estimatedTime: '10 min',
    tags: ['portfolio', 'photography', 'gallery', 'creative'],
    settings: {
      themeColor: '#1F2937',
      appIcon: '📸',
      platforms: ['web']
    },
    capsules: [
      { id: 'text_name', type: 'text', icon: '📝', name: 'Name', props: { content: 'Jane Doe Photography', size: 'lg', bold: true } },
      { id: 'text_tagline', type: 'text', icon: '📝', name: 'Tagline', props: { content: 'Capturing moments that matter', size: 'md', bold: false } },
      { id: 'navigation_1', type: 'navigation', icon: '🧭', name: 'Nav', props: { items: 'Gallery,About,Contact' } },
      { id: 'tabs_categories', type: 'tabs', icon: '📑', name: 'Categories', props: { items: 'All,Portraits,Nature,Events', activeTab: 'All' } },
      { id: 'gallery_1', type: 'gallery', icon: '🖼️', name: 'Gallery', props: { columns: 3, gap: 8, images: 9 } },
      { id: 'divider_1', type: 'divider', icon: '➖', name: 'Divider', props: { orientation: 'horizontal', spacing: 'lg' } },
      { id: 'text_contact', type: 'text', icon: '📝', name: 'Contact Label', props: { content: 'Get in Touch', size: 'lg', bold: true } },
      { id: 'input_name', type: 'input', icon: '✏️', name: 'Name', props: { placeholder: 'Your name', label: 'Name', required: true } },
      { id: 'input_email', type: 'input', icon: '✏️', name: 'Email', props: { placeholder: 'your@email.com', label: 'Email', required: true } },
      { id: 'textarea_message', type: 'textarea', icon: '📄', name: 'Message', props: { placeholder: 'Tell me about your project...', rows: 4, maxLength: 1000 } },
      { id: 'button_send', type: 'button', icon: '🔘', name: 'Send', props: { text: 'Send Message', variant: 'primary', disabled: false } }
    ]
  },

  {
    id: 'music-player',
    name: 'Music Player',
    icon: '🎵',
    category: 'creative',
    description: 'Mini music player interface',
    longDescription: 'A beautiful music player interface. Perfect for streaming apps, podcast players, or audio-focused products.',
    preview: '#7C3AED',
    difficulty: 'intermediate',
    estimatedTime: '10 min',
    tags: ['music', 'audio', 'player', 'streaming'],
    settings: {
      themeColor: '#7C3AED',
      appIcon: '🎵',
      platforms: ['ios', 'android', 'web', 'desktop']
    },
    capsules: [
      { id: 'image_album', type: 'image', icon: '🖼️', name: 'Album Art', props: { src: '', alt: 'Album Cover', rounded: true } },
      { id: 'text_song', type: 'text', icon: '📝', name: 'Song Title', props: { content: 'Midnight Dreams', size: 'lg', bold: true } },
      { id: 'text_artist', type: 'text', icon: '📝', name: 'Artist', props: { content: 'Luna Wave', size: 'md', bold: false } },
      { id: 'slider_progress', type: 'slider', icon: '🎚️', name: 'Progress', props: { label: '', min: 0, max: 100, value: 35 } },
      { id: 'text_time', type: 'text', icon: '📝', name: 'Time', props: { content: '1:24 / 3:45', size: 'sm', bold: false } },
      { id: 'button_prev', type: 'button', icon: '🔘', name: 'Previous', props: { text: '⏮', variant: 'secondary', disabled: false } },
      { id: 'button_play', type: 'button', icon: '🔘', name: 'Play', props: { text: '▶️', variant: 'primary', disabled: false } },
      { id: 'button_next', type: 'button', icon: '🔘', name: 'Next', props: { text: '⏭', variant: 'secondary', disabled: false } },
      { id: 'slider_volume', type: 'slider', icon: '🎚️', name: 'Volume', props: { label: '🔊', min: 0, max: 100, value: 70 } },
      { id: 'like_1', type: 'like', icon: '❤️', name: 'Like', props: { count: 1234, liked: false, showCount: true } }
    ]
  },

  {
    id: 'recipe-card',
    name: 'Recipe Card',
    icon: '🍳',
    category: 'creative',
    description: 'Share your recipes beautifully',
    longDescription: 'A gorgeous recipe card for food bloggers. Display ingredients, steps, and nutritional info in a clean layout.',
    preview: '#F97316',
    difficulty: 'beginner',
    estimatedTime: '10 min',
    tags: ['recipe', 'cooking', 'food', 'blog'],
    settings: {
      themeColor: '#F97316',
      appIcon: '🍳',
      platforms: ['web']
    },
    capsules: [
      { id: 'image_dish', type: 'image', icon: '🖼️', name: 'Dish Photo', props: { src: '', alt: 'Recipe Photo', rounded: true } },
      { id: 'text_title', type: 'text', icon: '📝', name: 'Recipe Title', props: { content: 'Creamy Tuscan Pasta', size: 'lg', bold: true } },
      { id: 'rating_1', type: 'rating', icon: '⭐', name: 'Rating', props: { max: 5, value: 4.8, allowHalf: true } },
      { id: 'text_meta', type: 'text', icon: '📝', name: 'Meta', props: { content: '⏱ 30 min • 🍽 4 servings • 🔥 450 cal', size: 'sm', bold: false } },
      { id: 'divider_1', type: 'divider', icon: '➖', name: 'Divider', props: { orientation: 'horizontal', spacing: 'md' } },
      { id: 'text_ingredients', type: 'text', icon: '📝', name: 'Ingredients Label', props: { content: 'Ingredients', size: 'md', bold: true } },
      { id: 'checkbox_1', type: 'checkbox', icon: '☑️', name: 'Ingredient 1', props: { label: '400g penne pasta', checked: false } },
      { id: 'checkbox_2', type: 'checkbox', icon: '☑️', name: 'Ingredient 2', props: { label: '2 cups heavy cream', checked: false } },
      { id: 'checkbox_3', type: 'checkbox', icon: '☑️', name: 'Ingredient 3', props: { label: '1 cup sun-dried tomatoes', checked: false } },
      { id: 'checkbox_4', type: 'checkbox', icon: '☑️', name: 'Ingredient 4', props: { label: '2 cups fresh spinach', checked: false } },
      { id: 'text_steps', type: 'text', icon: '📝', name: 'Steps Label', props: { content: 'Instructions', size: 'md', bold: true } },
      { id: 'stepper_1', type: 'stepper', icon: '👣', name: 'Steps', props: { steps: 'Boil pasta,Sauté garlic,Add cream & tomatoes,Mix in spinach,Combine & serve', current: 1 } },
      { id: 'share_1', type: 'share', icon: '🔗', name: 'Share', props: { platforms: 'pinterest,facebook,twitter', showCount: false } }
    ]
  },

  // ──────────────────────────────────────────────────────────────────────────
  // NEW TEMPLATES - More Categories
  // ──────────────────────────────────────────────────────────────────────────

  // HEALTH & FITNESS
  {
    id: 'workout-tracker',
    name: 'Workout Tracker',
    icon: '💪',
    category: 'lifestyle',
    description: 'Track your gym sessions',
    longDescription: 'A complete workout tracking app with exercise logging, sets/reps tracking, and progress visualization.',
    preview: '#EF4444',
    difficulty: 'intermediate',
    estimatedTime: '10 min',
    new: true,
    tags: ['fitness', 'gym', 'workout', 'exercise'],
    settings: {
      themeColor: '#EF4444',
      appIcon: '💪',
      platforms: ['ios', 'android', 'web']
    },
    capsules: [
      { id: 'header_1', type: 'header', icon: '🔝', name: 'Header', props: { title: 'Workout Log', showBack: false, showMenu: true } },
      { id: 'text_date', type: 'text', icon: '📝', name: 'Date', props: { content: 'Today - Chest & Triceps', size: 'lg', bold: true } },
      { id: 'stat_1', type: 'stat', icon: '📈', name: 'Duration', props: { label: 'Duration', value: '45 min', change: '', trend: 'up' } },
      { id: 'divider_1', type: 'divider', icon: '➖', name: 'Divider', props: { orientation: 'horizontal', spacing: 'md' } },
      { id: 'card_1', type: 'card', icon: '🃏', name: 'Exercise 1', props: { title: 'Bench Press', description: '4 sets × 10 reps • 80kg' } },
      { id: 'card_2', type: 'card', icon: '🃏', name: 'Exercise 2', props: { title: 'Incline Dumbbell', description: '3 sets × 12 reps • 25kg' } },
      { id: 'card_3', type: 'card', icon: '🃏', name: 'Exercise 3', props: { title: 'Tricep Dips', description: '3 sets × 15 reps • Bodyweight' } },
      { id: 'button_add', type: 'button', icon: '🔘', name: 'Add Exercise', props: { text: '+ Add Exercise', variant: 'secondary', disabled: false } },
      { id: 'button_finish', type: 'button', icon: '🔘', name: 'Finish', props: { text: 'Finish Workout', variant: 'primary', disabled: false } }
    ]
  },

  {
    id: 'meditation-app',
    name: 'Meditation',
    icon: '🧘',
    category: 'lifestyle',
    description: 'Guided meditation timer',
    longDescription: 'A calm meditation app with breathing exercises, ambient sounds, and session tracking.',
    preview: '#8B5CF6',
    difficulty: 'beginner',
    estimatedTime: '5 min',
    featured: true,
    tags: ['meditation', 'mindfulness', 'calm', 'breathing'],
    settings: {
      themeColor: '#8B5CF6',
      appIcon: '🧘',
      platforms: ['ios', 'android', 'web']
    },
    capsules: [
      { id: 'header_1', type: 'header', icon: '🔝', name: 'Header', props: { title: 'Mindful', showBack: false, showMenu: false } },
      { id: 'text_greeting', type: 'text', icon: '📝', name: 'Greeting', props: { content: 'Welcome back, take a breath', size: 'lg', bold: true } },
      { id: 'stat_streak', type: 'stat', icon: '📈', name: 'Streak', props: { label: 'Meditation Streak', value: '7 days', change: '', trend: 'up' } },
      { id: 'text_sessions', type: 'text', icon: '📝', name: 'Sessions Label', props: { content: 'Quick Sessions', size: 'md', bold: true } },
      { id: 'card_1', type: 'card', icon: '🃏', name: 'Session 1', props: { title: 'Morning Calm', description: '5 min • Breathing' } },
      { id: 'card_2', type: 'card', icon: '🃏', name: 'Session 2', props: { title: 'Focus Flow', description: '10 min • Concentration' } },
      { id: 'card_3', type: 'card', icon: '🃏', name: 'Session 3', props: { title: 'Sleep Well', description: '15 min • Relaxation' } },
      { id: 'text_timer', type: 'text', icon: '📝', name: 'Timer', props: { content: '10:00', size: 'lg', bold: true } },
      { id: 'button_start', type: 'button', icon: '🔘', name: 'Start', props: { text: 'Begin Session', variant: 'primary', disabled: false } }
    ]
  },

  {
    id: 'calorie-counter',
    name: 'Calorie Counter',
    icon: '🔥',
    category: 'lifestyle',
    description: 'Track your daily nutrition',
    longDescription: 'A simple calorie tracking app with meal logging, nutritional breakdown, and daily goals.',
    preview: '#F97316',
    difficulty: 'beginner',
    estimatedTime: '5 min',
    tags: ['calories', 'nutrition', 'diet', 'food'],
    settings: {
      themeColor: '#F97316',
      appIcon: '🔥',
      platforms: ['ios', 'android', 'web']
    },
    capsules: [
      { id: 'header_1', type: 'header', icon: '🔝', name: 'Header', props: { title: 'Calorie Tracker', showBack: false, showMenu: true } },
      { id: 'gauge_1', type: 'gauge', icon: '🎯', name: 'Daily Goal', props: { label: 'Calories', value: 65, max: 100 } },
      { id: 'text_remaining', type: 'text', icon: '📝', name: 'Remaining', props: { content: '700 cal remaining', size: 'md', bold: false } },
      { id: 'divider_1', type: 'divider', icon: '➖', name: 'Divider', props: { orientation: 'horizontal', spacing: 'md' } },
      { id: 'text_meals', type: 'text', icon: '📝', name: 'Meals Label', props: { content: "Today's Meals", size: 'md', bold: true } },
      { id: 'card_1', type: 'card', icon: '🃏', name: 'Breakfast', props: { title: '🌅 Breakfast', description: 'Oatmeal with berries • 350 cal' } },
      { id: 'card_2', type: 'card', icon: '🃏', name: 'Lunch', props: { title: '☀️ Lunch', description: 'Grilled chicken salad • 450 cal' } },
      { id: 'card_3', type: 'card', icon: '🃏', name: 'Dinner', props: { title: '🌙 Dinner', description: 'Not logged yet' } },
      { id: 'button_add', type: 'button', icon: '🔘', name: 'Add Meal', props: { text: '+ Log Meal', variant: 'primary', disabled: false } }
    ]
  },

  // FINANCE & MONEY
  {
    id: 'expense-tracker',
    name: 'Expense Tracker',
    icon: '💸',
    category: 'utility',
    description: 'Track your spending',
    longDescription: 'A clean expense tracking app with categories, charts, and budget insights.',
    preview: '#10B981',
    difficulty: 'intermediate',
    estimatedTime: '10 min',
    new: true,
    tags: ['expense', 'budget', 'money', 'finance'],
    settings: {
      themeColor: '#10B981',
      appIcon: '💸',
      platforms: ['ios', 'android', 'web']
    },
    capsules: [
      { id: 'header_1', type: 'header', icon: '🔝', name: 'Header', props: { title: 'Expenses', showBack: false, showMenu: true } },
      { id: 'stat_balance', type: 'stat', icon: '📈', name: 'Balance', props: { label: 'This Month', value: '$2,450', change: '-$320', trend: 'down' } },
      { id: 'chart_1', type: 'chart', icon: '📊', name: 'Chart', props: { type: 'bar', title: 'Weekly Spending' } },
      { id: 'text_recent', type: 'text', icon: '📝', name: 'Recent Label', props: { content: 'Recent Transactions', size: 'md', bold: true } },
      { id: 'card_1', type: 'card', icon: '🃏', name: 'Transaction 1', props: { title: '🛒 Groceries', description: '-$85.40 • Today' } },
      { id: 'card_2', type: 'card', icon: '🃏', name: 'Transaction 2', props: { title: '⛽ Gas', description: '-$45.00 • Yesterday' } },
      { id: 'card_3', type: 'card', icon: '🃏', name: 'Transaction 3', props: { title: '☕ Coffee', description: '-$5.50 • Yesterday' } },
      { id: 'button_add', type: 'button', icon: '🔘', name: 'Add', props: { text: '+ Add Expense', variant: 'primary', disabled: false } }
    ]
  },

  {
    id: 'savings-goals',
    name: 'Savings Goals',
    icon: '🎯',
    category: 'utility',
    description: 'Track your savings goals',
    longDescription: 'Visualize and track progress towards your savings goals with motivational milestones.',
    preview: '#6366F1',
    difficulty: 'beginner',
    estimatedTime: '5 min',
    tags: ['savings', 'goals', 'money', 'finance'],
    settings: {
      themeColor: '#6366F1',
      appIcon: '🎯',
      platforms: ['ios', 'android', 'web', 'desktop']
    },
    capsules: [
      { id: 'header_1', type: 'header', icon: '🔝', name: 'Header', props: { title: 'Savings Goals', showBack: false, showMenu: true } },
      { id: 'stat_total', type: 'stat', icon: '📈', name: 'Total Saved', props: { label: 'Total Saved', value: '$4,250', change: '+$350', trend: 'up' } },
      { id: 'text_goals', type: 'text', icon: '📝', name: 'Goals Label', props: { content: 'My Goals', size: 'md', bold: true } },
      { id: 'card_1', type: 'card', icon: '🃏', name: 'Goal 1', props: { title: '🏖️ Vacation', description: '$1,200 / $2,000 • 60%' } },
      { id: 'progress_1', type: 'progress', icon: '⏳', name: 'Progress 1', props: { value: 60, showLabel: false } },
      { id: 'card_2', type: 'card', icon: '🃏', name: 'Goal 2', props: { title: '💻 New Laptop', description: '$800 / $1,500 • 53%' } },
      { id: 'progress_2', type: 'progress', icon: '⏳', name: 'Progress 2', props: { value: 53, showLabel: false } },
      { id: 'card_3', type: 'card', icon: '🃏', name: 'Goal 3', props: { title: '🚗 Emergency Fund', description: '$2,250 / $5,000 • 45%' } },
      { id: 'progress_3', type: 'progress', icon: '⏳', name: 'Progress 3', props: { value: 45, showLabel: false } },
      { id: 'button_new', type: 'button', icon: '🔘', name: 'New Goal', props: { text: '+ Create New Goal', variant: 'secondary', disabled: false } }
    ]
  },

  {
    id: 'crypto-portfolio',
    name: 'Crypto Portfolio',
    icon: '₿',
    category: 'utility',
    description: 'Track your crypto holdings',
    longDescription: 'A sleek cryptocurrency portfolio tracker with real-time prices and gain/loss visualization.',
    preview: '#F59E0B',
    difficulty: 'intermediate',
    estimatedTime: '10 min',
    new: true,
    tags: ['crypto', 'bitcoin', 'portfolio', 'investment'],
    settings: {
      themeColor: '#F59E0B',
      appIcon: '₿',
      platforms: ['ios', 'android', 'web']
    },
    capsules: [
      { id: 'header_1', type: 'header', icon: '🔝', name: 'Header', props: { title: 'Crypto Portfolio', showBack: false, showMenu: true } },
      { id: 'stat_total', type: 'stat', icon: '📈', name: 'Total Value', props: { label: 'Portfolio Value', value: '$12,450', change: '+5.2%', trend: 'up' } },
      { id: 'chart_1', type: 'chart', icon: '📊', name: 'Chart', props: { type: 'line', title: '24h Performance' } },
      { id: 'text_holdings', type: 'text', icon: '📝', name: 'Holdings Label', props: { content: 'Holdings', size: 'md', bold: true } },
      { id: 'card_1', type: 'card', icon: '🃏', name: 'Bitcoin', props: { title: '₿ Bitcoin', description: '0.15 BTC • $6,450 • +3.2%' } },
      { id: 'card_2', type: 'card', icon: '🃏', name: 'Ethereum', props: { title: 'Ξ Ethereum', description: '2.5 ETH • $4,500 • +7.8%' } },
      { id: 'card_3', type: 'card', icon: '🃏', name: 'Solana', props: { title: '◎ Solana', description: '25 SOL • $1,500 • +12.1%' } },
      { id: 'button_buy', type: 'button', icon: '🔘', name: 'Buy', props: { text: 'Buy Crypto', variant: 'primary', disabled: false } }
    ]
  },

  // SOCIAL & COMMUNITY
  {
    id: 'dating-profile',
    name: 'Dating Profile',
    icon: '💕',
    category: 'social',
    description: 'Swipe-based dating app',
    longDescription: 'A Tinder-style dating app with profile cards, matching, and chat features.',
    preview: '#EC4899',
    difficulty: 'intermediate',
    estimatedTime: '10 min',
    tags: ['dating', 'social', 'match', 'swipe'],
    settings: {
      themeColor: '#EC4899',
      appIcon: '💕',
      platforms: ['ios', 'android']
    },
    capsules: [
      { id: 'header_1', type: 'header', icon: '🔝', name: 'Header', props: { title: 'Discover', showBack: false, showMenu: true } },
      { id: 'image_1', type: 'image', icon: '🖼️', name: 'Profile Photo', props: { src: '', alt: 'Profile', rounded: true } },
      { id: 'text_name', type: 'text', icon: '📝', name: 'Name', props: { content: 'Sarah, 28', size: 'lg', bold: true } },
      { id: 'text_bio', type: 'text', icon: '📝', name: 'Bio', props: { content: '☕ Coffee lover • 🎨 Artist • 🌍 Travel addict', size: 'md', bold: false } },
      { id: 'text_distance', type: 'text', icon: '📝', name: 'Distance', props: { content: '📍 5 miles away', size: 'sm', bold: false } },
      { id: 'chip_1', type: 'chip', icon: '🏷️', name: 'Interest 1', props: { label: 'Photography', selected: false } },
      { id: 'chip_2', type: 'chip', icon: '🏷️', name: 'Interest 2', props: { label: 'Hiking', selected: false } },
      { id: 'chip_3', type: 'chip', icon: '🏷️', name: 'Interest 3', props: { label: 'Music', selected: false } },
      { id: 'button_pass', type: 'button', icon: '🔘', name: 'Pass', props: { text: '✕ Pass', variant: 'secondary', disabled: false } },
      { id: 'button_like', type: 'button', icon: '🔘', name: 'Like', props: { text: '♥ Like', variant: 'primary', disabled: false } }
    ]
  },

  {
    id: 'event-app',
    name: 'Event Invite',
    icon: '🎉',
    category: 'social',
    description: 'Create event invitations',
    longDescription: 'A beautiful event invitation app with RSVP tracking, location, and attendee management.',
    preview: '#8B5CF6',
    difficulty: 'beginner',
    estimatedTime: '5 min',
    tags: ['event', 'party', 'invite', 'rsvp'],
    settings: {
      themeColor: '#8B5CF6',
      appIcon: '🎉',
      platforms: ['ios', 'android', 'web']
    },
    capsules: [
      { id: 'header_1', type: 'header', icon: '🔝', name: 'Header', props: { title: 'Event', showBack: true, showMenu: false } },
      { id: 'image_1', type: 'image', icon: '🖼️', name: 'Event Image', props: { src: '', alt: 'Event', rounded: true } },
      { id: 'text_title', type: 'text', icon: '📝', name: 'Event Title', props: { content: '🎂 Birthday Celebration!', size: 'lg', bold: true } },
      { id: 'text_date', type: 'text', icon: '📝', name: 'Date', props: { content: '📅 Saturday, Dec 15 at 7:00 PM', size: 'md', bold: false } },
      { id: 'text_location', type: 'text', icon: '📝', name: 'Location', props: { content: '📍 The Rooftop Bar, Downtown', size: 'md', bold: false } },
      { id: 'divider_1', type: 'divider', icon: '➖', name: 'Divider', props: { orientation: 'horizontal', spacing: 'md' } },
      { id: 'text_desc', type: 'text', icon: '📝', name: 'Description', props: { content: 'Join us for an unforgettable night! Dress code: Smart casual. Drinks and snacks provided.', size: 'sm', bold: false } },
      { id: 'avatar_1', type: 'avatar', icon: '👤', name: 'Host', props: { name: 'Hosted by Alex', size: 'md' } },
      { id: 'stat_rsvp', type: 'stat', icon: '📈', name: 'RSVP', props: { label: 'Attending', value: '24 guests', change: '', trend: 'up' } },
      { id: 'button_rsvp', type: 'button', icon: '🔘', name: 'RSVP', props: { text: "I'm Going!", variant: 'primary', disabled: false } }
    ]
  },

  {
    id: 'group-chat',
    name: 'Group Chat',
    icon: '💬',
    category: 'social',
    description: 'Real-time group messaging',
    longDescription: 'A modern group chat interface with typing indicators, reactions, and message threading.',
    preview: '#06B6D4',
    difficulty: 'intermediate',
    estimatedTime: '10 min',
    tags: ['chat', 'messaging', 'group', 'social'],
    settings: {
      themeColor: '#06B6D4',
      appIcon: '💬',
      platforms: ['ios', 'android', 'web', 'desktop']
    },
    capsules: [
      { id: 'header_1', type: 'header', icon: '🔝', name: 'Header', props: { title: 'Team Chat', showBack: true, showMenu: true } },
      { id: 'text_members', type: 'text', icon: '📝', name: 'Members', props: { content: '👥 5 members online', size: 'sm', bold: false } },
      { id: 'chatbubble_1', type: 'chatbubble', icon: '💭', name: 'Message 1', props: { message: 'Hey team! How is the project going?', isOwn: false } },
      { id: 'chatbubble_2', type: 'chatbubble', icon: '💭', name: 'Message 2', props: { message: 'Great progress! Just finished the design review.', isOwn: true } },
      { id: 'chatbubble_3', type: 'chatbubble', icon: '💭', name: 'Message 3', props: { message: 'Perfect! Let me share the updated mockups', isOwn: false } },
      { id: 'image_1', type: 'image', icon: '🖼️', name: 'Shared Image', props: { src: '', alt: 'Mockup', rounded: true } },
      { id: 'reaction_1', type: 'reaction', icon: '😀', name: 'Reactions', props: { reactions: '👍,❤️,🎉,🚀', selected: '' } },
      { id: 'input_message', type: 'input', icon: '✏️', name: 'Message Input', props: { placeholder: 'Type a message...', label: '', required: false } },
      { id: 'button_send', type: 'button', icon: '🔘', name: 'Send', props: { text: 'Send', variant: 'primary', disabled: false } }
    ]
  },

  // E-COMMERCE
  {
    id: 'product-detail',
    name: 'Product Page',
    icon: '🛍️',
    category: 'commerce',
    description: 'E-commerce product detail',
    longDescription: 'A complete product detail page with images, variants, reviews, and add-to-cart functionality.',
    preview: '#059669',
    difficulty: 'intermediate',
    estimatedTime: '10 min',
    featured: true,
    tags: ['ecommerce', 'product', 'shopping', 'store'],
    settings: {
      themeColor: '#059669',
      appIcon: '🛍️',
      platforms: ['ios', 'android', 'web']
    },
    capsules: [
      { id: 'header_1', type: 'header', icon: '🔝', name: 'Header', props: { title: '', showBack: true, showMenu: false } },
      { id: 'carousel_1', type: 'carousel', icon: '🎠', name: 'Product Images', props: { items: 4, autoplay: true, showDots: true } },
      { id: 'text_brand', type: 'text', icon: '📝', name: 'Brand', props: { content: 'PREMIUM BRAND', size: 'sm', bold: false } },
      { id: 'text_name', type: 'text', icon: '📝', name: 'Product Name', props: { content: 'Wireless Noise Cancelling Headphones', size: 'lg', bold: true } },
      { id: 'rating_1', type: 'rating', icon: '⭐', name: 'Rating', props: { max: 5, value: 4.8, allowHalf: true } },
      { id: 'text_price', type: 'text', icon: '📝', name: 'Price', props: { content: '$299.00', size: 'lg', bold: true } },
      { id: 'text_color', type: 'text', icon: '📝', name: 'Color Label', props: { content: 'Color: Black', size: 'sm', bold: false } },
      { id: 'chip_1', type: 'chip', icon: '🏷️', name: 'Color 1', props: { label: 'Black', selected: true } },
      { id: 'chip_2', type: 'chip', icon: '🏷️', name: 'Color 2', props: { label: 'White', selected: false } },
      { id: 'chip_3', type: 'chip', icon: '🏷️', name: 'Color 3', props: { label: 'Blue', selected: false } },
      { id: 'quantity_1', type: 'quantity', icon: '🔢', name: 'Quantity', props: { min: 1, max: 10, value: 1 } },
      { id: 'button_cart', type: 'button', icon: '🔘', name: 'Add to Cart', props: { text: 'Add to Cart', variant: 'primary', disabled: false } },
      { id: 'button_buy', type: 'button', icon: '🔘', name: 'Buy Now', props: { text: 'Buy Now', variant: 'secondary', disabled: false } }
    ]
  },

  {
    id: 'shopping-cart',
    name: 'Shopping Cart',
    icon: '🛒',
    category: 'commerce',
    description: 'E-commerce cart page',
    longDescription: 'A clean shopping cart with item management, quantity controls, and checkout summary.',
    preview: '#7C3AED',
    difficulty: 'intermediate',
    estimatedTime: '10 min',
    tags: ['ecommerce', 'cart', 'shopping', 'checkout'],
    settings: {
      themeColor: '#7C3AED',
      appIcon: '🛒',
      platforms: ['ios', 'android', 'web']
    },
    capsules: [
      { id: 'header_1', type: 'header', icon: '🔝', name: 'Header', props: { title: 'My Cart (3)', showBack: true, showMenu: false } },
      { id: 'card_1', type: 'card', icon: '🃏', name: 'Item 1', props: { title: 'Wireless Headphones', description: '$299.00 × 1' } },
      { id: 'card_2', type: 'card', icon: '🃏', name: 'Item 2', props: { title: 'USB-C Cable', description: '$19.00 × 2' } },
      { id: 'card_3', type: 'card', icon: '🃏', name: 'Item 3', props: { title: 'Phone Case', description: '$29.00 × 1' } },
      { id: 'divider_1', type: 'divider', icon: '➖', name: 'Divider', props: { orientation: 'horizontal', spacing: 'lg' } },
      { id: 'text_subtotal', type: 'text', icon: '📝', name: 'Subtotal', props: { content: 'Subtotal: $366.00', size: 'md', bold: false } },
      { id: 'text_shipping', type: 'text', icon: '📝', name: 'Shipping', props: { content: 'Shipping: FREE', size: 'md', bold: false } },
      { id: 'text_total', type: 'text', icon: '📝', name: 'Total', props: { content: 'Total: $366.00', size: 'lg', bold: true } },
      { id: 'input_coupon', type: 'input', icon: '✏️', name: 'Coupon', props: { placeholder: 'Enter coupon code', label: '', required: false } },
      { id: 'button_checkout', type: 'button', icon: '🔘', name: 'Checkout', props: { text: 'Proceed to Checkout', variant: 'primary', disabled: false } }
    ]
  },

  // AI & SMART
  {
    id: 'ai-assistant',
    name: 'AI Assistant',
    icon: '🤖',
    category: 'ai',
    description: 'ChatGPT-style AI chat',
    longDescription: 'A modern AI assistant interface with conversation history, suggestions, and voice input.',
    preview: '#10B981',
    difficulty: 'advanced',
    estimatedTime: '15 min',
    featured: true,
    new: true,
    tags: ['ai', 'chatbot', 'assistant', 'chat'],
    settings: {
      themeColor: '#10B981',
      appIcon: '🤖',
      platforms: ['ios', 'android', 'web', 'desktop']
    },
    capsules: [
      { id: 'header_1', type: 'header', icon: '🔝', name: 'Header', props: { title: 'AI Assistant', showBack: false, showMenu: true } },
      { id: 'chatbubble_1', type: 'chatbubble', icon: '💭', name: 'AI Greeting', props: { message: 'Hello! I\'m your AI assistant. How can I help you today?', isOwn: false } },
      { id: 'chatbubble_2', type: 'chatbubble', icon: '💭', name: 'User Message', props: { message: 'Can you help me write a professional email?', isOwn: true } },
      { id: 'chatbubble_3', type: 'chatbubble', icon: '💭', name: 'AI Response', props: { message: 'Of course! I\'d be happy to help. What\'s the context and who is the recipient?', isOwn: false } },
      { id: 'text_suggestions', type: 'text', icon: '📝', name: 'Suggestions Label', props: { content: 'Suggestions:', size: 'sm', bold: true } },
      { id: 'chip_1', type: 'chip', icon: '🏷️', name: 'Suggestion 1', props: { label: '✍️ Write an email', selected: false } },
      { id: 'chip_2', type: 'chip', icon: '🏷️', name: 'Suggestion 2', props: { label: '📝 Summarize text', selected: false } },
      { id: 'chip_3', type: 'chip', icon: '🏷️', name: 'Suggestion 3', props: { label: '💡 Brainstorm ideas', selected: false } },
      { id: 'input_prompt', type: 'input', icon: '✏️', name: 'Prompt', props: { placeholder: 'Ask me anything...', label: '', required: false } },
      { id: 'button_send', type: 'button', icon: '🔘', name: 'Send', props: { text: 'Send', variant: 'primary', disabled: false } }
    ]
  },

  {
    id: 'image-generator',
    name: 'AI Image Generator',
    icon: '🎨',
    category: 'ai',
    description: 'Generate images with AI',
    longDescription: 'A DALL-E style image generation app with prompt input, style selection, and gallery.',
    preview: '#EC4899',
    difficulty: 'advanced',
    estimatedTime: '15 min',
    new: true,
    tags: ['ai', 'image', 'art', 'generation'],
    settings: {
      themeColor: '#EC4899',
      appIcon: '🎨',
      platforms: ['ios', 'android', 'web']
    },
    capsules: [
      { id: 'header_1', type: 'header', icon: '🔝', name: 'Header', props: { title: 'AI Art Studio', showBack: false, showMenu: true } },
      { id: 'textarea_prompt', type: 'textarea', icon: '📄', name: 'Prompt', props: { placeholder: 'Describe the image you want to create...', rows: 3, maxLength: 500 } },
      { id: 'text_style', type: 'text', icon: '📝', name: 'Style Label', props: { content: 'Art Style', size: 'sm', bold: true } },
      { id: 'chip_1', type: 'chip', icon: '🏷️', name: 'Style 1', props: { label: 'Photorealistic', selected: true } },
      { id: 'chip_2', type: 'chip', icon: '🏷️', name: 'Style 2', props: { label: 'Digital Art', selected: false } },
      { id: 'chip_3', type: 'chip', icon: '🏷️', name: 'Style 3', props: { label: 'Oil Painting', selected: false } },
      { id: 'chip_4', type: 'chip', icon: '🏷️', name: 'Style 4', props: { label: 'Anime', selected: false } },
      { id: 'button_generate', type: 'button', icon: '🔘', name: 'Generate', props: { text: '✨ Generate Image', variant: 'primary', disabled: false } },
      { id: 'divider_1', type: 'divider', icon: '➖', name: 'Divider', props: { orientation: 'horizontal', spacing: 'md' } },
      { id: 'text_gallery', type: 'text', icon: '📝', name: 'Gallery Label', props: { content: 'Recent Creations', size: 'md', bold: true } },
      { id: 'gallery_1', type: 'gallery', icon: '🖼️', name: 'Gallery', props: { columns: 2, gap: 8, images: 4 } }
    ]
  },

  // CREATIVE & MEDIA
  {
    id: 'podcast-player',
    name: 'Podcast Player',
    icon: '🎙️',
    category: 'creative',
    description: 'Podcast listening app',
    longDescription: 'A beautiful podcast player with episode list, playback controls, and subscriptions.',
    preview: '#7C3AED',
    difficulty: 'intermediate',
    estimatedTime: '10 min',
    tags: ['podcast', 'audio', 'player', 'media'],
    settings: {
      themeColor: '#7C3AED',
      appIcon: '🎙️',
      platforms: ['ios', 'android', 'web', 'desktop']
    },
    capsules: [
      { id: 'header_1', type: 'header', icon: '🔝', name: 'Header', props: { title: 'Now Playing', showBack: true, showMenu: false } },
      { id: 'image_1', type: 'image', icon: '🖼️', name: 'Cover Art', props: { src: '', alt: 'Podcast Cover', rounded: true } },
      { id: 'text_title', type: 'text', icon: '📝', name: 'Episode Title', props: { content: 'The Future of AI', size: 'lg', bold: true } },
      { id: 'text_show', type: 'text', icon: '📝', name: 'Show Name', props: { content: 'Tech Talks Daily', size: 'md', bold: false } },
      { id: 'progress_1', type: 'progress', icon: '⏳', name: 'Playback', props: { value: 35, showLabel: false } },
      { id: 'text_time', type: 'text', icon: '📝', name: 'Time', props: { content: '12:45 / 36:20', size: 'sm', bold: false } },
      { id: 'slider_1', type: 'slider', icon: '🎚️', name: 'Speed', props: { min: 0.5, max: 2, step: 0.25, value: 1, label: 'Speed: 1x' } },
      { id: 'button_play', type: 'button', icon: '🔘', name: 'Play', props: { text: '⏸ Pause', variant: 'primary', disabled: false } },
      { id: 'text_queue', type: 'text', icon: '📝', name: 'Up Next', props: { content: 'Up Next', size: 'md', bold: true } },
      { id: 'card_1', type: 'card', icon: '🃏', name: 'Next Episode', props: { title: 'Machine Learning Basics', description: '28 min • Tech Talks Daily' } }
    ]
  },

  {
    id: 'music-player',
    name: 'Music Player',
    icon: '🎵',
    category: 'creative',
    description: 'Spotify-style music player',
    longDescription: 'A modern music player with album art, playback controls, and playlist management.',
    preview: '#1DB954',
    difficulty: 'intermediate',
    estimatedTime: '10 min',
    tags: ['music', 'player', 'audio', 'spotify'],
    settings: {
      themeColor: '#1DB954',
      appIcon: '🎵',
      platforms: ['ios', 'android', 'web', 'desktop']
    },
    capsules: [
      { id: 'header_1', type: 'header', icon: '🔝', name: 'Header', props: { title: 'Now Playing', showBack: true, showMenu: false } },
      { id: 'image_1', type: 'image', icon: '🖼️', name: 'Album Art', props: { src: '', alt: 'Album Cover', rounded: true } },
      { id: 'text_song', type: 'text', icon: '📝', name: 'Song Title', props: { content: 'Blinding Lights', size: 'lg', bold: true } },
      { id: 'text_artist', type: 'text', icon: '📝', name: 'Artist', props: { content: 'The Weeknd', size: 'md', bold: false } },
      { id: 'slider_progress', type: 'slider', icon: '🎚️', name: 'Progress', props: { min: 0, max: 100, step: 1, value: 45, label: '' } },
      { id: 'text_time', type: 'text', icon: '📝', name: 'Time', props: { content: '1:45 / 3:22', size: 'sm', bold: false } },
      { id: 'button_prev', type: 'button', icon: '🔘', name: 'Previous', props: { text: '⏮', variant: 'secondary', disabled: false } },
      { id: 'button_play', type: 'button', icon: '🔘', name: 'Play', props: { text: '⏸', variant: 'primary', disabled: false } },
      { id: 'button_next', type: 'button', icon: '🔘', name: 'Next', props: { text: '⏭', variant: 'secondary', disabled: false } },
      { id: 'slider_volume', type: 'slider', icon: '🎚️', name: 'Volume', props: { min: 0, max: 100, step: 1, value: 75, label: '🔊' } },
      { id: 'like_1', type: 'like', icon: '❤️', name: 'Like', props: { count: 0, liked: false, showCount: false } }
    ]
  },

  // UTILITY & TOOLS
  {
    id: 'qr-scanner',
    name: 'QR Scanner',
    icon: '📷',
    category: 'utility',
    description: 'Scan & create QR codes',
    longDescription: 'A fast QR code scanner with history, sharing, and QR code generation.',
    preview: '#374151',
    difficulty: 'beginner',
    estimatedTime: '5 min',
    tags: ['qr', 'scanner', 'barcode', 'utility'],
    settings: {
      themeColor: '#374151',
      appIcon: '📷',
      platforms: ['ios', 'android']
    },
    capsules: [
      { id: 'header_1', type: 'header', icon: '🔝', name: 'Header', props: { title: 'QR Scanner', showBack: false, showMenu: true } },
      { id: 'tabs_mode', type: 'tabs', icon: '📑', name: 'Mode', props: { items: 'Scan,Create', activeTab: 'Scan' } },
      { id: 'card_camera', type: 'card', icon: '🃏', name: 'Camera View', props: { title: '📷 Point camera at QR code', description: 'Scanning...' } },
      { id: 'divider_1', type: 'divider', icon: '➖', name: 'Divider', props: { orientation: 'horizontal', spacing: 'md' } },
      { id: 'text_history', type: 'text', icon: '📝', name: 'History Label', props: { content: 'Scan History', size: 'md', bold: true } },
      { id: 'card_1', type: 'card', icon: '🃏', name: 'History 1', props: { title: '🌐 Website', description: 'https://hublab.dev • Today' } },
      { id: 'card_2', type: 'card', icon: '🃏', name: 'History 2', props: { title: '📞 Contact', description: 'John Doe • Yesterday' } },
      { id: 'card_3', type: 'card', icon: '🃏', name: 'History 3', props: { title: '📱 App Link', description: 'Download App • 2 days ago' } },
      { id: 'button_create', type: 'button', icon: '🔘', name: 'Create QR', props: { text: '+ Create QR Code', variant: 'primary', disabled: false } }
    ]
  },

  {
    id: 'weather-app',
    name: 'Weather App',
    icon: '🌤️',
    category: 'utility',
    description: 'Beautiful weather forecast',
    longDescription: 'A clean weather app with current conditions, hourly forecast, and weekly outlook.',
    preview: '#0EA5E9',
    difficulty: 'beginner',
    estimatedTime: '5 min',
    tags: ['weather', 'forecast', 'utility', 'climate'],
    settings: {
      themeColor: '#0EA5E9',
      appIcon: '🌤️',
      platforms: ['ios', 'android', 'web']
    },
    capsules: [
      { id: 'header_1', type: 'header', icon: '🔝', name: 'Header', props: { title: 'Weather', showBack: false, showMenu: true } },
      { id: 'text_location', type: 'text', icon: '📝', name: 'Location', props: { content: '📍 San Francisco, CA', size: 'md', bold: false } },
      { id: 'text_temp', type: 'text', icon: '📝', name: 'Temperature', props: { content: '72°', size: 'lg', bold: true } },
      { id: 'text_condition', type: 'text', icon: '📝', name: 'Condition', props: { content: '☀️ Sunny', size: 'md', bold: false } },
      { id: 'text_feels', type: 'text', icon: '📝', name: 'Feels Like', props: { content: 'Feels like 68° • UV Index: 6', size: 'sm', bold: false } },
      { id: 'divider_1', type: 'divider', icon: '➖', name: 'Divider', props: { orientation: 'horizontal', spacing: 'md' } },
      { id: 'text_hourly', type: 'text', icon: '📝', name: 'Hourly Label', props: { content: 'Hourly Forecast', size: 'md', bold: true } },
      { id: 'card_1', type: 'card', icon: '🃏', name: 'Hour 1', props: { title: 'Now', description: '72° ☀️' } },
      { id: 'card_2', type: 'card', icon: '🃏', name: 'Hour 2', props: { title: '2 PM', description: '74° ☀️' } },
      { id: 'card_3', type: 'card', icon: '🃏', name: 'Hour 3', props: { title: '4 PM', description: '71° 🌤️' } },
      { id: 'text_weekly', type: 'text', icon: '📝', name: 'Weekly Label', props: { content: '7-Day Forecast', size: 'md', bold: true } },
      { id: 'list_1', type: 'list', icon: '📋', name: 'Weekly List', props: { items: 7, showDivider: true } }
    ]
  },

  {
    id: 'calculator',
    name: 'Calculator',
    icon: '🧮',
    category: 'utility',
    description: 'Beautiful calculator app',
    longDescription: 'A clean, modern calculator with basic and scientific modes.',
    preview: '#1F2937',
    difficulty: 'beginner',
    estimatedTime: '5 min',
    tags: ['calculator', 'math', 'utility', 'tool'],
    settings: {
      themeColor: '#1F2937',
      appIcon: '🧮',
      platforms: ['ios', 'android', 'web', 'desktop']
    },
    capsules: [
      { id: 'header_1', type: 'header', icon: '🔝', name: 'Header', props: { title: 'Calculator', showBack: false, showMenu: false } },
      { id: 'text_display', type: 'text', icon: '📝', name: 'Display', props: { content: '1,234.56', size: 'lg', bold: true } },
      { id: 'text_history', type: 'text', icon: '📝', name: 'History', props: { content: '1,200 + 34.56 =', size: 'sm', bold: false } },
      { id: 'divider_1', type: 'divider', icon: '➖', name: 'Divider', props: { orientation: 'horizontal', spacing: 'md' } },
      { id: 'button_clear', type: 'button', icon: '🔘', name: 'Clear', props: { text: 'C', variant: 'secondary', disabled: false } },
      { id: 'button_7', type: 'button', icon: '🔘', name: '7', props: { text: '7', variant: 'secondary', disabled: false } },
      { id: 'button_8', type: 'button', icon: '🔘', name: '8', props: { text: '8', variant: 'secondary', disabled: false } },
      { id: 'button_9', type: 'button', icon: '🔘', name: '9', props: { text: '9', variant: 'secondary', disabled: false } },
      { id: 'button_div', type: 'button', icon: '🔘', name: 'Divide', props: { text: '÷', variant: 'primary', disabled: false } },
      { id: 'button_equals', type: 'button', icon: '🔘', name: 'Equals', props: { text: '=', variant: 'primary', disabled: false } }
    ]
  },

  // TRAVEL & BOOKING
  {
    id: 'flight-booking',
    name: 'Flight Booking',
    icon: '✈️',
    category: 'commerce',
    description: 'Search and book flights',
    longDescription: 'A complete flight booking interface with search, results, and checkout.',
    preview: '#0369A1',
    difficulty: 'advanced',
    estimatedTime: '15 min',
    tags: ['travel', 'flight', 'booking', 'airline'],
    settings: {
      themeColor: '#0369A1',
      appIcon: '✈️',
      platforms: ['ios', 'android', 'web']
    },
    capsules: [
      { id: 'header_1', type: 'header', icon: '🔝', name: 'Header', props: { title: 'Book Flight', showBack: true, showMenu: false } },
      { id: 'tabs_trip', type: 'tabs', icon: '📑', name: 'Trip Type', props: { items: 'Round Trip,One Way', activeTab: 'Round Trip' } },
      { id: 'input_from', type: 'input', icon: '✏️', name: 'From', props: { placeholder: '✈️ From', label: 'Departure', required: true } },
      { id: 'input_to', type: 'input', icon: '✏️', name: 'To', props: { placeholder: '🛬 To', label: 'Arrival', required: true } },
      { id: 'datepicker_1', type: 'datepicker', icon: '📅', name: 'Departure Date', props: { label: 'Departure', placeholder: 'Select date' } },
      { id: 'datepicker_2', type: 'datepicker', icon: '📅', name: 'Return Date', props: { label: 'Return', placeholder: 'Select date' } },
      { id: 'dropdown_class', type: 'dropdown', icon: '📂', name: 'Class', props: { label: 'Class', options: 'Economy,Business,First', selected: 'Economy' } },
      { id: 'counter_passengers', type: 'counter', icon: '🔢', name: 'Passengers', props: { label: 'Passengers', value: 1, min: 1, max: 9 } },
      { id: 'button_search', type: 'button', icon: '🔘', name: 'Search', props: { text: '🔍 Search Flights', variant: 'primary', disabled: false } }
    ]
  },

  {
    id: 'hotel-booking',
    name: 'Hotel Booking',
    icon: '🏨',
    category: 'commerce',
    description: 'Search and book hotels',
    longDescription: 'A hotel booking app with search, filters, and room selection.',
    preview: '#DC2626',
    difficulty: 'advanced',
    estimatedTime: '15 min',
    tags: ['travel', 'hotel', 'booking', 'accommodation'],
    settings: {
      themeColor: '#DC2626',
      appIcon: '🏨',
      platforms: ['ios', 'android', 'web']
    },
    capsules: [
      { id: 'header_1', type: 'header', icon: '🔝', name: 'Header', props: { title: 'Find Hotels', showBack: true, showMenu: false } },
      { id: 'searchbar_1', type: 'searchbar', icon: '🔍', name: 'Search', props: { placeholder: '🔍 Search destination', showFilter: true } },
      { id: 'datepicker_1', type: 'datepicker', icon: '📅', name: 'Check-in', props: { label: 'Check-in', placeholder: 'Select date' } },
      { id: 'datepicker_2', type: 'datepicker', icon: '📅', name: 'Check-out', props: { label: 'Check-out', placeholder: 'Select date' } },
      { id: 'counter_rooms', type: 'counter', icon: '🔢', name: 'Rooms', props: { label: 'Rooms', value: 1, min: 1, max: 5 } },
      { id: 'divider_1', type: 'divider', icon: '➖', name: 'Divider', props: { orientation: 'horizontal', spacing: 'md' } },
      { id: 'text_results', type: 'text', icon: '📝', name: 'Results', props: { content: '156 hotels found', size: 'md', bold: true } },
      { id: 'card_1', type: 'card', icon: '🃏', name: 'Hotel 1', props: { title: '⭐⭐⭐⭐⭐ Grand Plaza Hotel', description: '$189/night • 4.8 ★ • Free WiFi' } },
      { id: 'card_2', type: 'card', icon: '🃏', name: 'Hotel 2', props: { title: '⭐⭐⭐⭐ Seaside Resort', description: '$145/night • 4.6 ★ • Pool' } },
      { id: 'card_3', type: 'card', icon: '🃏', name: 'Hotel 3', props: { title: '⭐⭐⭐ City Center Inn', description: '$89/night • 4.2 ★ • Breakfast' } }
    ]
  },

  // EDUCATION & LEARNING
  {
    id: 'language-learning',
    name: 'Language Learning',
    icon: '🌍',
    category: 'lifestyle',
    description: 'Duolingo-style language app',
    longDescription: 'A gamified language learning app with lessons, streaks, and achievements.',
    preview: '#84CC16',
    difficulty: 'intermediate',
    estimatedTime: '10 min',
    featured: true,
    tags: ['language', 'learning', 'education', 'duolingo'],
    settings: {
      themeColor: '#84CC16',
      appIcon: '🌍',
      platforms: ['ios', 'android', 'web']
    },
    capsules: [
      { id: 'header_1', type: 'header', icon: '🔝', name: 'Header', props: { title: 'Learn Spanish', showBack: false, showMenu: true } },
      { id: 'stat_streak', type: 'stat', icon: '📈', name: 'Streak', props: { label: '🔥 Day Streak', value: '15 days', change: '', trend: 'up' } },
      { id: 'progress_daily', type: 'progress', icon: '⏳', name: 'Daily Goal', props: { value: 60, showLabel: true } },
      { id: 'text_lessons', type: 'text', icon: '📝', name: 'Lessons Label', props: { content: 'Continue Learning', size: 'md', bold: true } },
      { id: 'card_1', type: 'card', icon: '🃏', name: 'Lesson 1', props: { title: '🏠 Basics 1', description: 'Complete! ★★★' } },
      { id: 'card_2', type: 'card', icon: '🃏', name: 'Lesson 2', props: { title: '🍽️ Food', description: '2/5 lessons • In Progress' } },
      { id: 'card_3', type: 'card', icon: '🃏', name: 'Lesson 3', props: { title: '🛒 Shopping', description: 'Locked • Complete Food first' } },
      { id: 'divider_1', type: 'divider', icon: '➖', name: 'Divider', props: { orientation: 'horizontal', spacing: 'md' } },
      { id: 'text_practice', type: 'text', icon: '📝', name: 'Practice Label', props: { content: 'Quick Practice', size: 'md', bold: true } },
      { id: 'button_practice', type: 'button', icon: '🔘', name: 'Practice', props: { text: '🎯 Start Practice', variant: 'primary', disabled: false } }
    ]
  },

  {
    id: 'flashcards',
    name: 'Flashcards',
    icon: '🗂️',
    category: 'lifestyle',
    description: 'Study with flashcards',
    longDescription: 'A spaced repetition flashcard app for efficient learning.',
    preview: '#F59E0B',
    difficulty: 'beginner',
    estimatedTime: '5 min',
    tags: ['flashcards', 'study', 'learning', 'memory'],
    settings: {
      themeColor: '#F59E0B',
      appIcon: '🗂️',
      platforms: ['ios', 'android', 'web', 'desktop']
    },
    capsules: [
      { id: 'header_1', type: 'header', icon: '🔝', name: 'Header', props: { title: 'Spanish Vocabulary', showBack: true, showMenu: false } },
      { id: 'progress_1', type: 'progress', icon: '⏳', name: 'Progress', props: { value: 40, showLabel: true } },
      { id: 'text_count', type: 'text', icon: '📝', name: 'Count', props: { content: 'Card 8 of 20', size: 'sm', bold: false } },
      { id: 'card_flashcard', type: 'card', icon: '🃏', name: 'Flashcard', props: { title: '¿Cómo estás?', description: 'Tap to reveal answer' } },
      { id: 'divider_1', type: 'divider', icon: '➖', name: 'Divider', props: { orientation: 'horizontal', spacing: 'lg' } },
      { id: 'text_rate', type: 'text', icon: '📝', name: 'Rate Label', props: { content: 'How well did you know this?', size: 'sm', bold: false } },
      { id: 'button_again', type: 'button', icon: '🔘', name: 'Again', props: { text: '❌ Again', variant: 'secondary', disabled: false } },
      { id: 'button_hard', type: 'button', icon: '🔘', name: 'Hard', props: { text: '😅 Hard', variant: 'secondary', disabled: false } },
      { id: 'button_good', type: 'button', icon: '🔘', name: 'Good', props: { text: '👍 Good', variant: 'secondary', disabled: false } },
      { id: 'button_easy', type: 'button', icon: '🔘', name: 'Easy', props: { text: '✅ Easy', variant: 'primary', disabled: false } }
    ]
  },

  // ============================================================================
  // BUSINESS & ENTERPRISE TEMPLATES
  // ============================================================================

  {
    id: 'crm-dashboard',
    name: 'CRM Dashboard',
    icon: '📊',
    category: 'commerce',
    description: 'Sales & customer management',
    longDescription: 'A comprehensive CRM dashboard for managing leads, deals and customers.',
    preview: '#3B82F6',
    difficulty: 'intermediate',
    estimatedTime: '15 min',
    tags: ['crm', 'sales', 'business', 'dashboard'],
    settings: {
      themeColor: '#3B82F6',
      appIcon: '📊',
      platforms: ['web', 'desktop']
    },
    capsules: [
      { id: 'header_1', type: 'header', icon: '🔝', name: 'Header', props: { title: 'Sales Dashboard', showBack: false, showMenu: true } },
      { id: 'stat_deals', type: 'stat', icon: '📈', name: 'Deals', props: { label: 'Active Deals', value: '$125,400', change: '+12%', trend: 'up' } },
      { id: 'stat_leads', type: 'stat', icon: '📈', name: 'Leads', props: { label: 'New Leads', value: '48', change: '+8', trend: 'up' } },
      { id: 'stat_won', type: 'stat', icon: '📈', name: 'Won', props: { label: 'Closed Won', value: '12', change: '+3', trend: 'up' } },
      { id: 'text_pipeline', type: 'text', icon: '📝', name: 'Pipeline', props: { content: 'Deal Pipeline', size: 'md', bold: true } },
      { id: 'card_1', type: 'card', icon: '🃏', name: 'Deal 1', props: { title: 'Enterprise Plan - Acme Corp', description: '$45,000 • Negotiation' } },
      { id: 'card_2', type: 'card', icon: '🃏', name: 'Deal 2', props: { title: 'Team License - TechStart', description: '$12,000 • Proposal Sent' } },
      { id: 'card_3', type: 'card', icon: '🃏', name: 'Deal 3', props: { title: 'Custom Solution - BigCo', description: '$68,400 • Discovery' } },
      { id: 'button_new', type: 'button', icon: '🔘', name: 'New Deal', props: { text: '+ Add New Deal', variant: 'primary', disabled: false } }
    ]
  },

  {
    id: 'inventory-manager',
    name: 'Inventory Manager',
    icon: '📦',
    category: 'commerce',
    description: 'Stock & warehouse management',
    longDescription: 'Track inventory levels, manage stock and handle warehouse operations.',
    preview: '#F59E0B',
    difficulty: 'intermediate',
    estimatedTime: '12 min',
    tags: ['inventory', 'warehouse', 'stock', 'business'],
    settings: {
      themeColor: '#F59E0B',
      appIcon: '📦',
      platforms: ['ios', 'android', 'web', 'desktop']
    },
    capsules: [
      { id: 'header_1', type: 'header', icon: '🔝', name: 'Header', props: { title: 'Inventory', showBack: false, showMenu: true } },
      { id: 'input_search', type: 'input', icon: '📝', name: 'Search', props: { placeholder: '🔍 Search products...', label: '', required: false } },
      { id: 'stat_total', type: 'stat', icon: '📈', name: 'Total', props: { label: 'Total Items', value: '2,450', change: '', trend: 'up' } },
      { id: 'stat_low', type: 'stat', icon: '📈', name: 'Low Stock', props: { label: '⚠️ Low Stock', value: '23', change: '', trend: 'down' } },
      { id: 'text_items', type: 'text', icon: '📝', name: 'Items', props: { content: 'Recent Items', size: 'md', bold: true } },
      { id: 'card_1', type: 'card', icon: '🃏', name: 'Item 1', props: { title: 'iPhone 15 Pro - Black', description: '45 in stock • $999 • SKU: IP15PB' } },
      { id: 'card_2', type: 'card', icon: '🃏', name: 'Item 2', props: { title: 'MacBook Air M3', description: '12 in stock • $1,199 • SKU: MBA3' } },
      { id: 'card_3', type: 'card', icon: '🃏', name: 'Item 3', props: { title: 'AirPods Pro 2', description: '⚠️ 3 in stock • $249 • SKU: APP2' } },
      { id: 'button_scan', type: 'button', icon: '🔘', name: 'Scan', props: { text: '📷 Scan Barcode', variant: 'primary', disabled: false } }
    ]
  },

  {
    id: 'project-kanban',
    name: 'Project Kanban',
    icon: '📋',
    category: 'productivity',
    description: 'Agile project management',
    longDescription: 'Manage projects with a Kanban board for agile workflows.',
    preview: '#8B5CF6',
    difficulty: 'intermediate',
    estimatedTime: '10 min',
    tags: ['kanban', 'agile', 'project', 'scrum'],
    settings: {
      themeColor: '#8B5CF6',
      appIcon: '📋',
      platforms: ['web', 'desktop']
    },
    capsules: [
      { id: 'header_1', type: 'header', icon: '🔝', name: 'Header', props: { title: 'Sprint 23', showBack: true, showMenu: true } },
      { id: 'progress_1', type: 'progress', icon: '⏳', name: 'Sprint Progress', props: { value: 65, showLabel: true } },
      { id: 'text_todo', type: 'text', icon: '📝', name: 'To Do', props: { content: '📌 To Do (4)', size: 'md', bold: true } },
      { id: 'card_1', type: 'card', icon: '🃏', name: 'Task 1', props: { title: 'Design new landing page', description: '🔴 High • @sarah' } },
      { id: 'card_2', type: 'card', icon: '🃏', name: 'Task 2', props: { title: 'API integration', description: '🟡 Medium • @john' } },
      { id: 'text_progress', type: 'text', icon: '📝', name: 'In Progress', props: { content: '🔄 In Progress (2)', size: 'md', bold: true } },
      { id: 'card_3', type: 'card', icon: '🃏', name: 'Task 3', props: { title: 'User authentication', description: '🔴 High • @mike • 60%' } },
      { id: 'text_done', type: 'text', icon: '📝', name: 'Done', props: { content: '✅ Done (8)', size: 'md', bold: true } },
      { id: 'card_4', type: 'card', icon: '🃏', name: 'Task 4', props: { title: 'Database schema', description: '✓ Completed yesterday' } },
      { id: 'button_add', type: 'button', icon: '🔘', name: 'Add Task', props: { text: '+ New Task', variant: 'primary', disabled: false } }
    ]
  },

  {
    id: 'hr-portal',
    name: 'HR Portal',
    icon: '👥',
    category: 'commerce',
    description: 'Employee management system',
    longDescription: 'HR dashboard for managing employees, leave requests and payroll.',
    preview: '#10B981',
    difficulty: 'advanced',
    estimatedTime: '20 min',
    tags: ['hr', 'employees', 'payroll', 'business'],
    settings: {
      themeColor: '#10B981',
      appIcon: '👥',
      platforms: ['web', 'desktop']
    },
    capsules: [
      { id: 'header_1', type: 'header', icon: '🔝', name: 'Header', props: { title: 'HR Dashboard', showBack: false, showMenu: true } },
      { id: 'stat_employees', type: 'stat', icon: '📈', name: 'Employees', props: { label: 'Total Employees', value: '156', change: '+4', trend: 'up' } },
      { id: 'stat_leave', type: 'stat', icon: '📈', name: 'On Leave', props: { label: 'On Leave Today', value: '8', change: '', trend: 'down' } },
      { id: 'text_requests', type: 'text', icon: '📝', name: 'Requests', props: { content: 'Pending Requests', size: 'md', bold: true } },
      { id: 'card_1', type: 'card', icon: '🃏', name: 'Request 1', props: { title: '🏖️ John Smith - Vacation', description: 'Dec 20-27 • 5 days • Pending' } },
      { id: 'card_2', type: 'card', icon: '🃏', name: 'Request 2', props: { title: '🏥 Sarah Wilson - Sick Leave', description: 'Dec 15 • 1 day • Pending' } },
      { id: 'card_3', type: 'card', icon: '🃏', name: 'Request 3', props: { title: '💼 Mike Chen - WFH', description: 'Dec 18-19 • 2 days • Pending' } },
      { id: 'divider_1', type: 'divider', icon: '➖', name: 'Divider', props: { orientation: 'horizontal', spacing: 'md' } },
      { id: 'text_team', type: 'text', icon: '📝', name: 'Team', props: { content: 'Team Directory', size: 'md', bold: true } },
      { id: 'button_add', type: 'button', icon: '🔘', name: 'Add Employee', props: { text: '+ Add Employee', variant: 'primary', disabled: false } }
    ]
  },

  // ============================================================================
  // HEALTH & MEDICAL TEMPLATES
  // ============================================================================

  {
    id: 'telemedicine-app',
    name: 'Telemedicine',
    icon: '🏥',
    category: 'lifestyle',
    description: 'Virtual doctor consultations',
    longDescription: 'Connect with doctors remotely for virtual consultations.',
    preview: '#06B6D4',
    difficulty: 'intermediate',
    estimatedTime: '12 min',
    tags: ['health', 'doctor', 'telemedicine', 'medical'],
    settings: {
      themeColor: '#06B6D4',
      appIcon: '🏥',
      platforms: ['ios', 'android', 'web']
    },
    capsules: [
      { id: 'header_1', type: 'header', icon: '🔝', name: 'Header', props: { title: 'HealthConnect', showBack: false, showMenu: true } },
      { id: 'text_upcoming', type: 'text', icon: '📝', name: 'Upcoming', props: { content: 'Upcoming Appointment', size: 'md', bold: true } },
      { id: 'card_appt', type: 'card', icon: '🃏', name: 'Appointment', props: { title: '👨‍⚕️ Dr. Sarah Johnson', description: 'General Practitioner • Today 2:30 PM' } },
      { id: 'button_join', type: 'button', icon: '🔘', name: 'Join', props: { text: '📹 Join Video Call', variant: 'primary', disabled: false } },
      { id: 'divider_1', type: 'divider', icon: '➖', name: 'Divider', props: { orientation: 'horizontal', spacing: 'md' } },
      { id: 'text_doctors', type: 'text', icon: '📝', name: 'Doctors', props: { content: 'Find a Doctor', size: 'md', bold: true } },
      { id: 'card_1', type: 'card', icon: '🃏', name: 'Doctor 1', props: { title: '🩺 Dr. Michael Lee', description: 'Cardiologist • ⭐ 4.9 • Next: Tomorrow' } },
      { id: 'card_2', type: 'card', icon: '🃏', name: 'Doctor 2', props: { title: '🧠 Dr. Emily Chen', description: 'Psychiatrist • ⭐ 4.8 • Next: Dec 20' } },
      { id: 'card_3', type: 'card', icon: '🃏', name: 'Doctor 3', props: { title: '🦴 Dr. James Wilson', description: 'Orthopedic • ⭐ 4.7 • Next: Dec 22' } },
      { id: 'button_book', type: 'button', icon: '🔘', name: 'Book', props: { text: '📅 Book Appointment', variant: 'secondary', disabled: false } }
    ]
  },

  {
    id: 'medication-tracker',
    name: 'Medication Tracker',
    icon: '💊',
    category: 'lifestyle',
    description: 'Track medications & reminders',
    longDescription: 'Never miss a dose with medication tracking and reminders.',
    preview: '#EF4444',
    difficulty: 'beginner',
    estimatedTime: '8 min',
    tags: ['medication', 'health', 'reminders', 'pills'],
    settings: {
      themeColor: '#EF4444',
      appIcon: '💊',
      platforms: ['ios', 'android']
    },
    capsules: [
      { id: 'header_1', type: 'header', icon: '🔝', name: 'Header', props: { title: 'My Medications', showBack: false, showMenu: true } },
      { id: 'text_today', type: 'text', icon: '📝', name: 'Today', props: { content: "Today's Schedule", size: 'md', bold: true } },
      { id: 'card_1', type: 'card', icon: '🃏', name: 'Med 1', props: { title: '💊 Vitamin D - 1000 IU', description: '☀️ Morning • 8:00 AM • ✅ Taken' } },
      { id: 'card_2', type: 'card', icon: '🃏', name: 'Med 2', props: { title: '💊 Lisinopril - 10mg', description: '🌅 Morning • 8:00 AM • ✅ Taken' } },
      { id: 'card_3', type: 'card', icon: '🃏', name: 'Med 3', props: { title: '💊 Metformin - 500mg', description: '🌙 Evening • 8:00 PM • ⏰ Upcoming' } },
      { id: 'progress_1', type: 'progress', icon: '⏳', name: 'Adherence', props: { value: 85, showLabel: true } },
      { id: 'text_adherence', type: 'text', icon: '📝', name: 'Adherence', props: { content: '85% adherence this month', size: 'sm', bold: false } },
      { id: 'divider_1', type: 'divider', icon: '➖', name: 'Divider', props: { orientation: 'horizontal', spacing: 'md' } },
      { id: 'button_add', type: 'button', icon: '🔘', name: 'Add', props: { text: '+ Add Medication', variant: 'primary', disabled: false } }
    ]
  },

  // ============================================================================
  // ENTERTAINMENT & MEDIA TEMPLATES
  // ============================================================================

  {
    id: 'streaming-app',
    name: 'Video Streaming',
    icon: '🎬',
    category: 'creative',
    description: 'Netflix-style streaming app',
    longDescription: 'A video streaming platform with categories, watchlists and personalized recommendations.',
    preview: '#DC2626',
    difficulty: 'intermediate',
    estimatedTime: '15 min',
    tags: ['streaming', 'video', 'movies', 'entertainment'],
    settings: {
      themeColor: '#DC2626',
      appIcon: '🎬',
      platforms: ['ios', 'android', 'web', 'desktop']
    },
    capsules: [
      { id: 'header_1', type: 'header', icon: '🔝', name: 'Header', props: { title: 'StreamFlix', showBack: false, showMenu: true } },
      { id: 'card_featured', type: 'card', icon: '🃏', name: 'Featured', props: { title: '🔥 The Last Kingdom', description: 'New Season • Action, Drama • ⭐ 8.7' } },
      { id: 'button_play', type: 'button', icon: '🔘', name: 'Play', props: { text: '▶️ Play Now', variant: 'primary', disabled: false } },
      { id: 'text_continue', type: 'text', icon: '📝', name: 'Continue', props: { content: 'Continue Watching', size: 'md', bold: true } },
      { id: 'card_1', type: 'card', icon: '🃏', name: 'Show 1', props: { title: 'Breaking Bad', description: 'S3 E5 • 45 min left' } },
      { id: 'card_2', type: 'card', icon: '🃏', name: 'Show 2', props: { title: 'Stranger Things', description: 'S4 E2 • 20 min left' } },
      { id: 'text_trending', type: 'text', icon: '📝', name: 'Trending', props: { content: 'Trending Now', size: 'md', bold: true } },
      { id: 'card_3', type: 'card', icon: '🃏', name: 'Show 3', props: { title: 'Wednesday', description: 'Comedy, Mystery • ⭐ 8.2' } },
      { id: 'card_4', type: 'card', icon: '🃏', name: 'Show 4', props: { title: 'The Crown', description: 'Drama, History • ⭐ 8.6' } },
      { id: 'navigation_1', type: 'navigation', icon: '🧭', name: 'Nav', props: { items: 'Home,Search,Downloads,Profile' } }
    ]
  },

  {
    id: 'podcast-app',
    name: 'Podcast App',
    icon: '🎙️',
    category: 'creative',
    description: 'Listen to podcasts',
    longDescription: 'Discover, subscribe and listen to your favorite podcasts.',
    preview: '#7C3AED',
    difficulty: 'beginner',
    estimatedTime: '10 min',
    tags: ['podcast', 'audio', 'streaming', 'entertainment'],
    settings: {
      themeColor: '#7C3AED',
      appIcon: '🎙️',
      platforms: ['ios', 'android', 'web']
    },
    capsules: [
      { id: 'header_1', type: 'header', icon: '🔝', name: 'Header', props: { title: 'Podcasts', showBack: false, showMenu: true } },
      { id: 'text_playing', type: 'text', icon: '📝', name: 'Now Playing', props: { content: 'Now Playing', size: 'sm', bold: false } },
      { id: 'card_current', type: 'card', icon: '🃏', name: 'Current', props: { title: '🎧 The Daily', description: 'NYT • Episode 1,245 • 32:15' } },
      { id: 'progress_1', type: 'progress', icon: '⏳', name: 'Progress', props: { value: 45, showLabel: false } },
      { id: 'text_queue', type: 'text', icon: '📝', name: 'Up Next', props: { content: 'Up Next', size: 'md', bold: true } },
      { id: 'card_1', type: 'card', icon: '🃏', name: 'Episode 1', props: { title: 'How I Built This', description: 'NPR • 48 min' } },
      { id: 'card_2', type: 'card', icon: '🃏', name: 'Episode 2', props: { title: 'Lex Fridman Podcast', description: '#412 • 3h 12min' } },
      { id: 'text_discover', type: 'text', icon: '📝', name: 'Discover', props: { content: 'Discover', size: 'md', bold: true } },
      { id: 'card_3', type: 'card', icon: '🃏', name: 'Podcast 1', props: { title: 'Crime Junkie', description: 'True Crime • ⭐ 4.8' } },
      { id: 'navigation_1', type: 'navigation', icon: '🧭', name: 'Nav', props: { items: 'Home,Search,Library,Profile' } }
    ]
  },

  // ============================================================================
  // REAL ESTATE & PROPERTY TEMPLATES
  // ============================================================================

  {
    id: 'property-finder',
    name: 'Property Finder',
    icon: '🏠',
    category: 'commerce',
    description: 'Find homes & apartments',
    longDescription: 'Search and discover properties for sale or rent.',
    preview: '#059669',
    difficulty: 'intermediate',
    estimatedTime: '12 min',
    tags: ['realestate', 'property', 'homes', 'rental'],
    settings: {
      themeColor: '#059669',
      appIcon: '🏠',
      platforms: ['ios', 'android', 'web']
    },
    capsules: [
      { id: 'header_1', type: 'header', icon: '🔝', name: 'Header', props: { title: 'FindHome', showBack: false, showMenu: true } },
      { id: 'input_search', type: 'input', icon: '📝', name: 'Search', props: { placeholder: '🔍 City, neighborhood, ZIP...', label: '', required: false } },
      { id: 'text_featured', type: 'text', icon: '📝', name: 'Featured', props: { content: 'Featured Listings', size: 'md', bold: true } },
      { id: 'card_1', type: 'card', icon: '🃏', name: 'Property 1', props: { title: '🏡 Modern Downtown Condo', description: '$450,000 • 2 bed • 2 bath • 1,200 sqft' } },
      { id: 'card_2', type: 'card', icon: '🃏', name: 'Property 2', props: { title: '🏠 Family Home with Pool', description: '$725,000 • 4 bed • 3 bath • 2,800 sqft' } },
      { id: 'card_3', type: 'card', icon: '🃏', name: 'Property 3', props: { title: '🏢 Luxury Penthouse', description: '$1,200,000 • 3 bed • 3 bath • 2,400 sqft' } },
      { id: 'text_nearby', type: 'text', icon: '📝', name: 'Nearby', props: { content: 'Near You', size: 'md', bold: true } },
      { id: 'card_4', type: 'card', icon: '🃏', name: 'Property 4', props: { title: '🏘️ Cozy Studio Apartment', description: '$1,800/mo • Studio • 1 bath • 500 sqft' } },
      { id: 'button_map', type: 'button', icon: '🔘', name: 'Map', props: { text: '🗺️ View Map', variant: 'secondary', disabled: false } },
      { id: 'navigation_1', type: 'navigation', icon: '🧭', name: 'Nav', props: { items: 'Search,Saved,Messages,Profile' } }
    ]
  },

  // ============================================================================
  // BOOKING & SERVICES TEMPLATES
  // ============================================================================

  {
    id: 'salon-booking',
    name: 'Salon Booking',
    icon: '💇',
    category: 'utility',
    description: 'Book beauty appointments',
    longDescription: 'Book haircuts, nails, spa and other beauty services.',
    preview: '#EC4899',
    difficulty: 'beginner',
    estimatedTime: '8 min',
    tags: ['salon', 'beauty', 'booking', 'spa'],
    settings: {
      themeColor: '#EC4899',
      appIcon: '💇',
      platforms: ['ios', 'android', 'web']
    },
    capsules: [
      { id: 'header_1', type: 'header', icon: '🔝', name: 'Header', props: { title: 'GlamBook', showBack: false, showMenu: true } },
      { id: 'text_services', type: 'text', icon: '📝', name: 'Services', props: { content: 'Our Services', size: 'md', bold: true } },
      { id: 'card_1', type: 'card', icon: '🃏', name: 'Service 1', props: { title: '✂️ Haircut & Style', description: 'From $45 • 45 min' } },
      { id: 'card_2', type: 'card', icon: '🃏', name: 'Service 2', props: { title: '💅 Manicure & Pedicure', description: 'From $60 • 60 min' } },
      { id: 'card_3', type: 'card', icon: '🃏', name: 'Service 3', props: { title: '💆 Spa Massage', description: 'From $80 • 60 min' } },
      { id: 'card_4', type: 'card', icon: '🃏', name: 'Service 4', props: { title: '🎨 Hair Coloring', description: 'From $120 • 2 hours' } },
      { id: 'divider_1', type: 'divider', icon: '➖', name: 'Divider', props: { orientation: 'horizontal', spacing: 'md' } },
      { id: 'text_upcoming', type: 'text', icon: '📝', name: 'Upcoming', props: { content: 'Your Appointment', size: 'md', bold: true } },
      { id: 'card_appt', type: 'card', icon: '🃏', name: 'Appointment', props: { title: '💇 Haircut with Sarah', description: 'Tomorrow 2:00 PM • Confirmed' } },
      { id: 'button_book', type: 'button', icon: '🔘', name: 'Book', props: { text: '📅 Book Appointment', variant: 'primary', disabled: false } }
    ]
  },

  {
    id: 'restaurant-reservation',
    name: 'Restaurant Reservation',
    icon: '🍽️',
    category: 'utility',
    description: 'Book restaurant tables',
    longDescription: 'Find and book tables at your favorite restaurants.',
    preview: '#F97316',
    difficulty: 'beginner',
    estimatedTime: '8 min',
    tags: ['restaurant', 'booking', 'food', 'dining'],
    settings: {
      themeColor: '#F97316',
      appIcon: '🍽️',
      platforms: ['ios', 'android', 'web']
    },
    capsules: [
      { id: 'header_1', type: 'header', icon: '🔝', name: 'Header', props: { title: 'TableNow', showBack: false, showMenu: true } },
      { id: 'input_search', type: 'input', icon: '📝', name: 'Search', props: { placeholder: '🔍 Restaurant, cuisine...', label: '', required: false } },
      { id: 'text_nearby', type: 'text', icon: '📝', name: 'Nearby', props: { content: 'Popular Near You', size: 'md', bold: true } },
      { id: 'card_1', type: 'card', icon: '🃏', name: 'Restaurant 1', props: { title: '🍝 Bella Italia', description: 'Italian • ⭐ 4.7 • $$$' } },
      { id: 'card_2', type: 'card', icon: '🃏', name: 'Restaurant 2', props: { title: '🍣 Sakura Sushi', description: 'Japanese • ⭐ 4.9 • $$$$' } },
      { id: 'card_3', type: 'card', icon: '🃏', name: 'Restaurant 3', props: { title: '🌮 Casa Mexicana', description: 'Mexican • ⭐ 4.5 • $$' } },
      { id: 'card_4', type: 'card', icon: '🃏', name: 'Restaurant 4', props: { title: '🍔 The Burger Joint', description: 'American • ⭐ 4.4 • $$' } },
      { id: 'divider_1', type: 'divider', icon: '➖', name: 'Divider', props: { orientation: 'horizontal', spacing: 'md' } },
      { id: 'text_reservation', type: 'text', icon: '📝', name: 'Reservation', props: { content: 'Your Reservation', size: 'md', bold: true } },
      { id: 'card_res', type: 'card', icon: '🃏', name: 'Reservation', props: { title: '🍝 Bella Italia', description: 'Tonight 7:30 PM • 4 guests' } },
      { id: 'navigation_1', type: 'navigation', icon: '🧭', name: 'Nav', props: { items: 'Explore,Reservations,Favorites,Profile' } }
    ]
  },

  // ============================================================================
  // TRAVEL & TRANSPORTATION TEMPLATES
  // ============================================================================

  {
    id: 'ride-sharing',
    name: 'Ride Sharing',
    icon: '🚗',
    category: 'utility',
    description: 'Book rides like Uber',
    longDescription: 'Request rides and track drivers in real-time.',
    preview: '#000000',
    difficulty: 'intermediate',
    estimatedTime: '12 min',
    tags: ['ride', 'taxi', 'transport', 'uber'],
    settings: {
      themeColor: '#000000',
      appIcon: '🚗',
      platforms: ['ios', 'android']
    },
    capsules: [
      { id: 'header_1', type: 'header', icon: '🔝', name: 'Header', props: { title: 'QuickRide', showBack: false, showMenu: true } },
      { id: 'input_pickup', type: 'input', icon: '📝', name: 'Pickup', props: { placeholder: '📍 Pickup location', label: '', required: true } },
      { id: 'input_dest', type: 'input', icon: '📝', name: 'Destination', props: { placeholder: '🎯 Where to?', label: '', required: true } },
      { id: 'text_rides', type: 'text', icon: '📝', name: 'Rides', props: { content: 'Choose a ride', size: 'md', bold: true } },
      { id: 'card_1', type: 'card', icon: '🃏', name: 'Ride 1', props: { title: '🚗 QuickRide X', description: '$12.50 • 4 min away • 4 seats' } },
      { id: 'card_2', type: 'card', icon: '🃏', name: 'Ride 2', props: { title: '🚙 QuickRide XL', description: '$18.00 • 7 min away • 6 seats' } },
      { id: 'card_3', type: 'card', icon: '🃏', name: 'Ride 3', props: { title: '✨ QuickRide Black', description: '$24.00 • 3 min away • Premium' } },
      { id: 'divider_1', type: 'divider', icon: '➖', name: 'Divider', props: { orientation: 'horizontal', spacing: 'md' } },
      { id: 'text_promo', type: 'text', icon: '📝', name: 'Promo', props: { content: '🎉 50% off your next ride!', size: 'sm', bold: false } },
      { id: 'button_book', type: 'button', icon: '🔘', name: 'Book', props: { text: 'Book QuickRide X - $12.50', variant: 'primary', disabled: false } },
      { id: 'navigation_1', type: 'navigation', icon: '🧭', name: 'Nav', props: { items: 'Home,Activity,Wallet,Account' } }
    ]
  },

  {
    id: 'travel-planner',
    name: 'Travel Planner',
    icon: '✈️',
    category: 'lifestyle',
    description: 'Plan your trips',
    longDescription: 'Organize itineraries, bookings and travel plans.',
    preview: '#0EA5E9',
    difficulty: 'intermediate',
    estimatedTime: '12 min',
    tags: ['travel', 'trip', 'vacation', 'itinerary'],
    settings: {
      themeColor: '#0EA5E9',
      appIcon: '✈️',
      platforms: ['ios', 'android', 'web']
    },
    capsules: [
      { id: 'header_1', type: 'header', icon: '🔝', name: 'Header', props: { title: 'TripPlan', showBack: false, showMenu: true } },
      { id: 'text_upcoming', type: 'text', icon: '📝', name: 'Upcoming', props: { content: 'Upcoming Trip', size: 'md', bold: true } },
      { id: 'card_trip', type: 'card', icon: '🃏', name: 'Trip', props: { title: '🗼 Paris Adventure', description: 'Dec 20-27 • 7 days • 3 travelers' } },
      { id: 'progress_1', type: 'progress', icon: '⏳', name: 'Planning', props: { value: 80, showLabel: true } },
      { id: 'text_itinerary', type: 'text', icon: '📝', name: 'Itinerary', props: { content: 'Itinerary', size: 'md', bold: true } },
      { id: 'card_1', type: 'card', icon: '🃏', name: 'Day 1', props: { title: 'Day 1 - Arrival', description: '✈️ Flight CDG • 🏨 Hotel Check-in' } },
      { id: 'card_2', type: 'card', icon: '🃏', name: 'Day 2', props: { title: 'Day 2 - Eiffel Tower', description: '🗼 Tour • 🍷 Wine Tasting' } },
      { id: 'card_3', type: 'card', icon: '🃏', name: 'Day 3', props: { title: 'Day 3 - Louvre', description: '🎨 Museum • 🛍️ Shopping' } },
      { id: 'button_add', type: 'button', icon: '🔘', name: 'Add', props: { text: '+ Add Activity', variant: 'secondary', disabled: false } },
      { id: 'button_new', type: 'button', icon: '🔘', name: 'New Trip', props: { text: '✈️ Plan New Trip', variant: 'primary', disabled: false } }
    ]
  },

  // ============================================================================
  // SOCIAL & COMMUNITY TEMPLATES
  // ============================================================================

  {
    id: 'community-forum',
    name: 'Community Forum',
    icon: '💬',
    category: 'social',
    description: 'Discussion community',
    longDescription: 'A community forum for discussions, Q&A and knowledge sharing.',
    preview: '#6366F1',
    difficulty: 'intermediate',
    estimatedTime: '12 min',
    tags: ['forum', 'community', 'discussion', 'social'],
    settings: {
      themeColor: '#6366F1',
      appIcon: '💬',
      platforms: ['web', 'ios', 'android']
    },
    capsules: [
      { id: 'header_1', type: 'header', icon: '🔝', name: 'Header', props: { title: 'DevTalk', showBack: false, showMenu: true } },
      { id: 'input_search', type: 'input', icon: '📝', name: 'Search', props: { placeholder: '🔍 Search discussions...', label: '', required: false } },
      { id: 'text_trending', type: 'text', icon: '📝', name: 'Trending', props: { content: '🔥 Trending', size: 'md', bold: true } },
      { id: 'card_1', type: 'card', icon: '🃏', name: 'Post 1', props: { title: 'Best practices for React 19?', description: '💬 48 replies • ⬆️ 234 • 2h ago' } },
      { id: 'card_2', type: 'card', icon: '🃏', name: 'Post 2', props: { title: 'How to structure a monorepo?', description: '💬 32 replies • ⬆️ 156 • 4h ago' } },
      { id: 'card_3', type: 'card', icon: '🃏', name: 'Post 3', props: { title: 'AI coding assistants comparison', description: '💬 89 replies • ⬆️ 412 • 6h ago' } },
      { id: 'text_recent', type: 'text', icon: '📝', name: 'Recent', props: { content: '📝 Recent', size: 'md', bold: true } },
      { id: 'card_4', type: 'card', icon: '🃏', name: 'Post 4', props: { title: 'TypeScript 5.4 features', description: '💬 12 replies • ⬆️ 67 • 1h ago' } },
      { id: 'button_post', type: 'button', icon: '🔘', name: 'New Post', props: { text: '+ New Discussion', variant: 'primary', disabled: false } },
      { id: 'navigation_1', type: 'navigation', icon: '🧭', name: 'Nav', props: { items: 'Home,Explore,Notifications,Profile' } }
    ]
  },

  {
    id: 'event-platform',
    name: 'Event Platform',
    icon: '🎉',
    category: 'social',
    description: 'Discover & join events',
    longDescription: 'Find local events, meetups and activities in your area.',
    preview: '#F43F5E',
    difficulty: 'beginner',
    estimatedTime: '10 min',
    tags: ['events', 'meetup', 'social', 'activities'],
    settings: {
      themeColor: '#F43F5E',
      appIcon: '🎉',
      platforms: ['ios', 'android', 'web']
    },
    capsules: [
      { id: 'header_1', type: 'header', icon: '🔝', name: 'Header', props: { title: 'EventHub', showBack: false, showMenu: true } },
      { id: 'text_this_week', type: 'text', icon: '📝', name: 'This Week', props: { content: 'This Week', size: 'md', bold: true } },
      { id: 'card_1', type: 'card', icon: '🃏', name: 'Event 1', props: { title: '🎸 Live Jazz Night', description: 'Sat 8 PM • Blue Note • $25' } },
      { id: 'card_2', type: 'card', icon: '🃏', name: 'Event 2', props: { title: '🎨 Art Workshop', description: 'Sun 2 PM • Gallery 42 • Free' } },
      { id: 'card_3', type: 'card', icon: '🃏', name: 'Event 3', props: { title: '💻 Tech Meetup', description: 'Wed 7 PM • TechHub • Free' } },
      { id: 'text_popular', type: 'text', icon: '📝', name: 'Popular', props: { content: 'Popular Events', size: 'md', bold: true } },
      { id: 'card_4', type: 'card', icon: '🃏', name: 'Event 4', props: { title: '🏃 City Marathon', description: 'Dec 20 • Downtown • 5K Going' } },
      { id: 'card_5', type: 'card', icon: '🃏', name: 'Event 5', props: { title: '🎄 Holiday Market', description: 'Dec 15-25 • Central Park • Free' } },
      { id: 'button_create', type: 'button', icon: '🔘', name: 'Create', props: { text: '+ Create Event', variant: 'primary', disabled: false } },
      { id: 'navigation_1', type: 'navigation', icon: '🧭', name: 'Nav', props: { items: 'Discover,My Events,Messages,Profile' } }
    ]
  },

  // ============================================================================
  // FINTECH & BANKING TEMPLATES
  // ============================================================================

  {
    id: 'banking-app',
    name: 'Mobile Banking',
    icon: '🏦',
    category: 'utility',
    description: 'Banking & payments',
    longDescription: 'Full-featured mobile banking with accounts, transfers and payments.',
    preview: '#1E3A8A',
    difficulty: 'advanced',
    estimatedTime: '15 min',
    tags: ['banking', 'finance', 'payments', 'money'],
    settings: {
      themeColor: '#1E3A8A',
      appIcon: '🏦',
      platforms: ['ios', 'android']
    },
    capsules: [
      { id: 'header_1', type: 'header', icon: '🔝', name: 'Header', props: { title: 'SecureBank', showBack: false, showMenu: true } },
      { id: 'text_balance', type: 'text', icon: '📝', name: 'Balance', props: { content: 'Total Balance', size: 'sm', bold: false } },
      { id: 'stat_main', type: 'stat', icon: '📈', name: 'Main Balance', props: { label: '', value: '$24,560.00', change: '+$1,234', trend: 'up' } },
      { id: 'text_accounts', type: 'text', icon: '📝', name: 'Accounts', props: { content: 'Accounts', size: 'md', bold: true } },
      { id: 'card_1', type: 'card', icon: '🃏', name: 'Checking', props: { title: '💳 Checking', description: '$12,450.00 • ****4521' } },
      { id: 'card_2', type: 'card', icon: '🃏', name: 'Savings', props: { title: '🏦 Savings', description: '$8,320.00 • ****7834' } },
      { id: 'card_3', type: 'card', icon: '🃏', name: 'Investment', props: { title: '📈 Investment', description: '$3,790.00 • +5.2%' } },
      { id: 'text_quick', type: 'text', icon: '📝', name: 'Quick Actions', props: { content: 'Quick Actions', size: 'md', bold: true } },
      { id: 'button_send', type: 'button', icon: '🔘', name: 'Send', props: { text: '💸 Send Money', variant: 'primary', disabled: false } },
      { id: 'button_pay', type: 'button', icon: '🔘', name: 'Pay', props: { text: '📱 Pay Bills', variant: 'secondary', disabled: false } },
      { id: 'navigation_1', type: 'navigation', icon: '🧭', name: 'Nav', props: { items: 'Home,Cards,Transfers,Profile' } }
    ]
  },

  {
    id: 'investment-tracker',
    name: 'Investment Tracker',
    icon: '📈',
    category: 'utility',
    description: 'Track your investments',
    longDescription: 'Monitor stocks, crypto and other investments in one place.',
    preview: '#16A34A',
    difficulty: 'intermediate',
    estimatedTime: '12 min',
    tags: ['investment', 'stocks', 'portfolio', 'trading'],
    settings: {
      themeColor: '#16A34A',
      appIcon: '📈',
      platforms: ['ios', 'android', 'web']
    },
    capsules: [
      { id: 'header_1', type: 'header', icon: '🔝', name: 'Header', props: { title: 'InvestPro', showBack: false, showMenu: true } },
      { id: 'stat_portfolio', type: 'stat', icon: '📈', name: 'Portfolio', props: { label: 'Portfolio Value', value: '$47,832.45', change: '+$2,341 (5.14%)', trend: 'up' } },
      { id: 'text_holdings', type: 'text', icon: '📝', name: 'Holdings', props: { content: 'Holdings', size: 'md', bold: true } },
      { id: 'card_1', type: 'card', icon: '🃏', name: 'Stock 1', props: { title: '🍎 AAPL - Apple Inc.', description: '$189.45 • +2.3% • 50 shares' } },
      { id: 'card_2', type: 'card', icon: '🃏', name: 'Stock 2', props: { title: '🔍 GOOGL - Alphabet', description: '$141.20 • +1.8% • 25 shares' } },
      { id: 'card_3', type: 'card', icon: '🃏', name: 'Stock 3', props: { title: '₿ BTC - Bitcoin', description: '$43,250 • +4.5% • 0.5 BTC' } },
      { id: 'card_4', type: 'card', icon: '🃏', name: 'Stock 4', props: { title: '⟠ ETH - Ethereum', description: '$2,280 • +3.2% • 2.5 ETH' } },
      { id: 'divider_1', type: 'divider', icon: '➖', name: 'Divider', props: { orientation: 'horizontal', spacing: 'md' } },
      { id: 'button_trade', type: 'button', icon: '🔘', name: 'Trade', props: { text: '📊 Trade', variant: 'primary', disabled: false } },
      { id: 'navigation_1', type: 'navigation', icon: '🧭', name: 'Nav', props: { items: 'Portfolio,Market,News,Account' } }
    ]
  },

  // ============================================================================
  // PROFESSIONAL SERVICES TEMPLATES
  // ============================================================================

  {
    id: 'law-firm',
    name: 'Law Firm',
    icon: '⚖️',
    category: 'commerce',
    description: 'Legal services app',
    longDescription: 'Professional law firm app for consultations and case management.',
    preview: '#1E293B',
    difficulty: 'intermediate',
    estimatedTime: '12 min',
    tags: ['legal', 'lawyer', 'law', 'professional'],
    settings: {
      themeColor: '#1E293B',
      appIcon: '⚖️',
      platforms: ['web', 'ios', 'android']
    },
    capsules: [
      { id: 'header_1', type: 'header', icon: '🔝', name: 'Header', props: { title: 'Smith & Associates', showBack: false, showMenu: true } },
      { id: 'text_welcome', type: 'text', icon: '📝', name: 'Welcome', props: { content: 'Welcome back, John', size: 'lg', bold: true } },
      { id: 'text_cases', type: 'text', icon: '📝', name: 'Cases', props: { content: 'Active Cases', size: 'md', bold: true } },
      { id: 'card_1', type: 'card', icon: '🃏', name: 'Case 1', props: { title: '📋 Contract Dispute - ABC Corp', description: 'Status: Discovery • Next: Jan 15' } },
      { id: 'card_2', type: 'card', icon: '🃏', name: 'Case 2', props: { title: '🏠 Real Estate - 123 Main St', description: 'Status: Closing • Next: Jan 20' } },
      { id: 'text_appt', type: 'text', icon: '📝', name: 'Appointments', props: { content: 'Upcoming Appointments', size: 'md', bold: true } },
      { id: 'card_3', type: 'card', icon: '🃏', name: 'Appt 1', props: { title: '👔 Meeting with Atty. Johnson', description: 'Tomorrow 2:00 PM • Video Call' } },
      { id: 'button_schedule', type: 'button', icon: '🔘', name: 'Schedule', props: { text: '📅 Schedule Consultation', variant: 'primary', disabled: false } },
      { id: 'button_docs', type: 'button', icon: '🔘', name: 'Documents', props: { text: '📄 View Documents', variant: 'secondary', disabled: false } }
    ]
  },

  {
    id: 'dental-clinic',
    name: 'Dental Clinic',
    icon: '🦷',
    category: 'lifestyle',
    description: 'Dental appointment app',
    longDescription: 'Dental clinic app for appointments and patient records.',
    preview: '#0891B2',
    difficulty: 'beginner',
    estimatedTime: '10 min',
    tags: ['dental', 'health', 'clinic', 'medical'],
    settings: {
      themeColor: '#0891B2',
      appIcon: '🦷',
      platforms: ['ios', 'android', 'web']
    },
    capsules: [
      { id: 'header_1', type: 'header', icon: '🔝', name: 'Header', props: { title: 'Smile Dental', showBack: false, showMenu: true } },
      { id: 'text_next', type: 'text', icon: '📝', name: 'Next Appt', props: { content: 'Your Next Appointment', size: 'md', bold: true } },
      { id: 'card_appt', type: 'card', icon: '🃏', name: 'Appointment', props: { title: '🦷 Routine Checkup', description: 'Dr. Sarah Chen • Jan 15, 10:00 AM' } },
      { id: 'button_reschedule', type: 'button', icon: '🔘', name: 'Reschedule', props: { text: '📅 Reschedule', variant: 'secondary', disabled: false } },
      { id: 'text_services', type: 'text', icon: '📝', name: 'Services', props: { content: 'Our Services', size: 'md', bold: true } },
      { id: 'card_1', type: 'card', icon: '🃏', name: 'Service 1', props: { title: '✨ Teeth Whitening', description: 'From $299 • 1 hour' } },
      { id: 'card_2', type: 'card', icon: '🃏', name: 'Service 2', props: { title: '🔧 Dental Implants', description: 'From $2,500 • Consultation required' } },
      { id: 'card_3', type: 'card', icon: '🃏', name: 'Service 3', props: { title: '😬 Invisalign', description: 'From $3,000 • Free consultation' } },
      { id: 'button_book', type: 'button', icon: '🔘', name: 'Book', props: { text: '📞 Book Appointment', variant: 'primary', disabled: false } }
    ]
  },

  {
    id: 'veterinary-clinic',
    name: 'Veterinary Clinic',
    icon: '🐕',
    category: 'lifestyle',
    description: 'Pet healthcare app',
    longDescription: 'Veterinary clinic app for pet appointments and health records.',
    preview: '#059669',
    difficulty: 'beginner',
    estimatedTime: '10 min',
    tags: ['vet', 'pets', 'health', 'animals'],
    settings: {
      themeColor: '#059669',
      appIcon: '🐕',
      platforms: ['ios', 'android', 'web']
    },
    capsules: [
      { id: 'header_1', type: 'header', icon: '🔝', name: 'Header', props: { title: 'PawCare Vet', showBack: false, showMenu: true } },
      { id: 'text_pets', type: 'text', icon: '📝', name: 'My Pets', props: { content: 'My Pets', size: 'md', bold: true } },
      { id: 'card_1', type: 'card', icon: '🃏', name: 'Pet 1', props: { title: '🐕 Max - Golden Retriever', description: 'Next checkup: Jan 20 • Vaccines up to date ✅' } },
      { id: 'card_2', type: 'card', icon: '🃏', name: 'Pet 2', props: { title: '🐈 Luna - Persian Cat', description: 'Next checkup: Feb 5 • Needs vaccination ⚠️' } },
      { id: 'text_upcoming', type: 'text', icon: '📝', name: 'Upcoming', props: { content: 'Upcoming Appointments', size: 'md', bold: true } },
      { id: 'card_appt', type: 'card', icon: '🃏', name: 'Appointment', props: { title: '💉 Luna - Vaccination', description: 'Dr. Wilson • Tomorrow 3:00 PM' } },
      { id: 'button_book', type: 'button', icon: '🔘', name: 'Book', props: { text: '📅 Book Appointment', variant: 'primary', disabled: false } },
      { id: 'button_emergency', type: 'button', icon: '🔘', name: 'Emergency', props: { text: '🚨 Emergency', variant: 'secondary', disabled: false } }
    ]
  },

  // ============================================================================
  // E-COMMERCE TEMPLATES
  // ============================================================================

  {
    id: 'fashion-store',
    name: 'Fashion Store',
    icon: '👗',
    category: 'commerce',
    description: 'Clothing e-commerce',
    longDescription: 'Fashion e-commerce app with product catalog and checkout.',
    preview: '#DB2777',
    difficulty: 'intermediate',
    estimatedTime: '15 min',
    tags: ['fashion', 'ecommerce', 'clothing', 'shop'],
    settings: {
      themeColor: '#DB2777',
      appIcon: '👗',
      platforms: ['ios', 'android', 'web']
    },
    capsules: [
      { id: 'header_1', type: 'header', icon: '🔝', name: 'Header', props: { title: 'LUXE Fashion', showBack: false, showMenu: true } },
      { id: 'input_search', type: 'input', icon: '📝', name: 'Search', props: { placeholder: '🔍 Search products...', label: '', required: false } },
      { id: 'text_new', type: 'text', icon: '📝', name: 'New Arrivals', props: { content: '✨ New Arrivals', size: 'md', bold: true } },
      { id: 'card_1', type: 'card', icon: '🃏', name: 'Product 1', props: { title: '👗 Silk Evening Dress', description: '$189 • XS-XL • 4 colors' } },
      { id: 'card_2', type: 'card', icon: '🃏', name: 'Product 2', props: { title: '👜 Leather Handbag', description: '$249 • 3 colors' } },
      { id: 'card_3', type: 'card', icon: '🃏', name: 'Product 3', props: { title: '👠 Designer Heels', description: '$159 • Sizes 5-10' } },
      { id: 'text_sale', type: 'text', icon: '📝', name: 'Sale', props: { content: '🔥 Winter Sale - Up to 50% Off', size: 'md', bold: true } },
      { id: 'card_4', type: 'card', icon: '🃏', name: 'Product 4', props: { title: '🧥 Wool Coat', description: '$299 $149 • Limited stock' } },
      { id: 'navigation_1', type: 'navigation', icon: '🧭', name: 'Nav', props: { items: 'Home,Categories,Cart,Profile' } }
    ]
  },

  {
    id: 'grocery-delivery',
    name: 'Grocery Delivery',
    icon: '🛒',
    category: 'commerce',
    description: 'Grocery shopping & delivery',
    longDescription: 'Grocery delivery app with categories, cart and express delivery.',
    preview: '#16A34A',
    difficulty: 'intermediate',
    estimatedTime: '12 min',
    tags: ['grocery', 'delivery', 'food', 'shopping'],
    settings: {
      themeColor: '#16A34A',
      appIcon: '🛒',
      platforms: ['ios', 'android', 'web']
    },
    capsules: [
      { id: 'header_1', type: 'header', icon: '🔝', name: 'Header', props: { title: 'FreshMart', showBack: false, showMenu: true } },
      { id: 'input_search', type: 'input', icon: '📝', name: 'Search', props: { placeholder: '🔍 Search groceries...', label: '', required: false } },
      { id: 'text_categories', type: 'text', icon: '📝', name: 'Categories', props: { content: 'Categories', size: 'md', bold: true } },
      { id: 'card_1', type: 'card', icon: '🃏', name: 'Cat 1', props: { title: '🥬 Fresh Produce', description: '234 items' } },
      { id: 'card_2', type: 'card', icon: '🃏', name: 'Cat 2', props: { title: '🥛 Dairy & Eggs', description: '156 items' } },
      { id: 'card_3', type: 'card', icon: '🃏', name: 'Cat 3', props: { title: '🥩 Meat & Seafood', description: '89 items' } },
      { id: 'card_4', type: 'card', icon: '🃏', name: 'Cat 4', props: { title: '🍞 Bakery', description: '67 items' } },
      { id: 'text_deals', type: 'text', icon: '📝', name: 'Deals', props: { content: "🏷️ Today's Deals", size: 'md', bold: true } },
      { id: 'card_5', type: 'card', icon: '🃏', name: 'Deal 1', props: { title: '🍎 Organic Apples', description: '$2.99/lb (was $4.99)' } },
      { id: 'stat_cart', type: 'stat', icon: '📈', name: 'Cart', props: { label: '🛒 Cart', value: '8 items', change: '$45.67', trend: 'up' } },
      { id: 'navigation_1', type: 'navigation', icon: '🧭', name: 'Nav', props: { items: 'Shop,Deals,Cart,Account' } }
    ]
  },

  // ============================================================================
  // EDUCATION & LEARNING TEMPLATES
  // ============================================================================

  {
    id: 'online-course',
    name: 'Online Course',
    icon: '🎓',
    category: 'lifestyle',
    description: 'Course learning platform',
    longDescription: 'Online course platform with video lessons and progress tracking.',
    preview: '#7C3AED',
    difficulty: 'intermediate',
    estimatedTime: '12 min',
    tags: ['education', 'course', 'learning', 'video'],
    settings: {
      themeColor: '#7C3AED',
      appIcon: '🎓',
      platforms: ['ios', 'android', 'web', 'desktop']
    },
    capsules: [
      { id: 'header_1', type: 'header', icon: '🔝', name: 'Header', props: { title: 'LearnPro', showBack: false, showMenu: true } },
      { id: 'text_continue', type: 'text', icon: '📝', name: 'Continue', props: { content: 'Continue Learning', size: 'md', bold: true } },
      { id: 'card_course', type: 'card', icon: '🃏', name: 'Course', props: { title: '💻 Complete Web Development', description: 'Section 5: React Hooks • 68% complete' } },
      { id: 'progress_1', type: 'progress', icon: '⏳', name: 'Progress', props: { value: 68, showLabel: true } },
      { id: 'button_continue', type: 'button', icon: '🔘', name: 'Continue', props: { text: '▶️ Continue Lesson', variant: 'primary', disabled: false } },
      { id: 'text_courses', type: 'text', icon: '📝', name: 'My Courses', props: { content: 'My Courses', size: 'md', bold: true } },
      { id: 'card_1', type: 'card', icon: '🃏', name: 'Course 1', props: { title: '📱 iOS Development with Swift', description: '45% complete • 12h remaining' } },
      { id: 'card_2', type: 'card', icon: '🃏', name: 'Course 2', props: { title: '🎨 UI/UX Design Masterclass', description: '23% complete • 8h remaining' } },
      { id: 'text_recommended', type: 'text', icon: '📝', name: 'Recommended', props: { content: 'Recommended for You', size: 'md', bold: true } },
      { id: 'card_3', type: 'card', icon: '🃏', name: 'Course 3', props: { title: '🤖 Machine Learning A-Z', description: '⭐ 4.9 • 42h • $99' } },
      { id: 'navigation_1', type: 'navigation', icon: '🧭', name: 'Nav', props: { items: 'Home,My Courses,Browse,Profile' } }
    ]
  },

  {
    id: 'kids-learning',
    name: 'Kids Learning',
    icon: '🧒',
    category: 'lifestyle',
    description: 'Educational app for kids',
    longDescription: 'Fun educational app for children with games and lessons.',
    preview: '#F59E0B',
    difficulty: 'beginner',
    estimatedTime: '10 min',
    tags: ['kids', 'education', 'games', 'learning'],
    settings: {
      themeColor: '#F59E0B',
      appIcon: '🧒',
      platforms: ['ios', 'android']
    },
    capsules: [
      { id: 'header_1', type: 'header', icon: '🔝', name: 'Header', props: { title: 'FunLearn Kids', showBack: false, showMenu: true } },
      { id: 'text_hello', type: 'text', icon: '📝', name: 'Hello', props: { content: '👋 Hi, Emma!', size: 'lg', bold: true } },
      { id: 'stat_stars', type: 'stat', icon: '📈', name: 'Stars', props: { label: '⭐ Stars', value: '245', change: '+12 today', trend: 'up' } },
      { id: 'text_daily', type: 'text', icon: '📝', name: 'Daily Challenge', props: { content: "🎯 Today's Challenge", size: 'md', bold: true } },
      { id: 'card_challenge', type: 'card', icon: '🃏', name: 'Challenge', props: { title: '🔢 Math Adventure', description: 'Complete 10 problems • Earn 50 ⭐' } },
      { id: 'text_subjects', type: 'text', icon: '📝', name: 'Subjects', props: { content: 'Choose a Subject', size: 'md', bold: true } },
      { id: 'card_1', type: 'card', icon: '🃏', name: 'Subject 1', props: { title: '🔢 Math', description: '23 lessons • Level 5' } },
      { id: 'card_2', type: 'card', icon: '🃏', name: 'Subject 2', props: { title: '📖 Reading', description: '18 stories • Level 4' } },
      { id: 'card_3', type: 'card', icon: '🃏', name: 'Subject 3', props: { title: '🔬 Science', description: '15 experiments • Level 3' } },
      { id: 'card_4', type: 'card', icon: '🃏', name: 'Subject 4', props: { title: '🎨 Art', description: '20 projects • Level 4' } }
    ]
  },

  // ============================================================================
  // COMMUNICATION & MESSAGING TEMPLATES
  // ============================================================================

  {
    id: 'team-chat',
    name: 'Team Chat',
    icon: '💼',
    category: 'productivity',
    description: 'Slack-like team messaging',
    longDescription: 'Team communication app with channels and direct messages.',
    preview: '#4F46E5',
    difficulty: 'intermediate',
    estimatedTime: '15 min',
    tags: ['chat', 'team', 'messaging', 'work'],
    settings: {
      themeColor: '#4F46E5',
      appIcon: '💼',
      platforms: ['ios', 'android', 'web', 'desktop']
    },
    capsules: [
      { id: 'header_1', type: 'header', icon: '🔝', name: 'Header', props: { title: 'TeamChat', showBack: false, showMenu: true } },
      { id: 'text_channels', type: 'text', icon: '📝', name: 'Channels', props: { content: 'Channels', size: 'md', bold: true } },
      { id: 'card_1', type: 'card', icon: '🃏', name: 'Channel 1', props: { title: '# general', description: '🔴 3 unread • Last: 2 min ago' } },
      { id: 'card_2', type: 'card', icon: '🃏', name: 'Channel 2', props: { title: '# engineering', description: 'Last: 15 min ago' } },
      { id: 'card_3', type: 'card', icon: '🃏', name: 'Channel 3', props: { title: '# design', description: '🔴 1 unread • Last: 1 hour ago' } },
      { id: 'text_dm', type: 'text', icon: '📝', name: 'DMs', props: { content: 'Direct Messages', size: 'md', bold: true } },
      { id: 'card_4', type: 'card', icon: '🃏', name: 'DM 1', props: { title: '👤 Sarah Johnson', description: '🟢 Online • "Sounds good!"' } },
      { id: 'card_5', type: 'card', icon: '🃏', name: 'DM 2', props: { title: '👤 Mike Chen', description: '⚫ Away • "Thanks for the update"' } },
      { id: 'input_msg', type: 'input', icon: '📝', name: 'Message', props: { placeholder: '💬 Type a message...', label: '', required: false } },
      { id: 'navigation_1', type: 'navigation', icon: '🧭', name: 'Nav', props: { items: 'Home,DMs,Mentions,Profile' } }
    ]
  },

  {
    id: 'video-conference',
    name: 'Video Conference',
    icon: '📹',
    category: 'productivity',
    description: 'Video meeting app',
    longDescription: 'Video conferencing app like Zoom for remote meetings.',
    preview: '#2563EB',
    difficulty: 'intermediate',
    estimatedTime: '12 min',
    tags: ['video', 'meeting', 'conference', 'zoom'],
    settings: {
      themeColor: '#2563EB',
      appIcon: '📹',
      platforms: ['ios', 'android', 'web', 'desktop']
    },
    capsules: [
      { id: 'header_1', type: 'header', icon: '🔝', name: 'Header', props: { title: 'MeetNow', showBack: false, showMenu: true } },
      { id: 'text_next', type: 'text', icon: '📝', name: 'Next Meeting', props: { content: 'Next Meeting', size: 'md', bold: true } },
      { id: 'card_meeting', type: 'card', icon: '🃏', name: 'Meeting', props: { title: '📹 Weekly Team Standup', description: 'Starting in 15 minutes • 8 participants' } },
      { id: 'button_join', type: 'button', icon: '🔘', name: 'Join', props: { text: '📹 Join Meeting', variant: 'primary', disabled: false } },
      { id: 'divider_1', type: 'divider', icon: '➖', name: 'Divider', props: { orientation: 'horizontal', spacing: 'md' } },
      { id: 'text_quick', type: 'text', icon: '📝', name: 'Quick Actions', props: { content: 'Quick Actions', size: 'md', bold: true } },
      { id: 'button_new', type: 'button', icon: '🔘', name: 'New Meeting', props: { text: '➕ New Meeting', variant: 'secondary', disabled: false } },
      { id: 'button_schedule', type: 'button', icon: '🔘', name: 'Schedule', props: { text: '📅 Schedule', variant: 'secondary', disabled: false } },
      { id: 'text_today', type: 'text', icon: '📝', name: 'Today', props: { content: "Today's Schedule", size: 'md', bold: true } },
      { id: 'card_1', type: 'card', icon: '🃏', name: 'Meeting 1', props: { title: '🎨 Design Review', description: '2:00 PM • 5 participants' } },
      { id: 'card_2', type: 'card', icon: '🃏', name: 'Meeting 2', props: { title: '💼 Client Call', description: '4:30 PM • 3 participants' } },
      { id: 'navigation_1', type: 'navigation', icon: '🧭', name: 'Nav', props: { items: 'Home,Meetings,Contacts,Settings' } }
    ]
  },

  // ============================================================================
  // SPORTS & FITNESS TEMPLATES
  // ============================================================================

  {
    id: 'sports-tracker',
    name: 'Sports Tracker',
    icon: '⚽',
    category: 'lifestyle',
    description: 'Track sports & games',
    longDescription: 'Sports tracking app for games, scores and team stats.',
    preview: '#059669',
    difficulty: 'beginner',
    estimatedTime: '10 min',
    tags: ['sports', 'tracking', 'scores', 'teams'],
    settings: {
      themeColor: '#059669',
      appIcon: '⚽',
      platforms: ['ios', 'android', 'web']
    },
    capsules: [
      { id: 'header_1', type: 'header', icon: '🔝', name: 'Header', props: { title: 'SportScore', showBack: false, showMenu: true } },
      { id: 'text_live', type: 'text', icon: '📝', name: 'Live', props: { content: '🔴 Live Games', size: 'md', bold: true } },
      { id: 'card_1', type: 'card', icon: '🃏', name: 'Game 1', props: { title: '⚽ Man United vs Chelsea', description: '2 - 1 • 67\' • Premier League' } },
      { id: 'card_2', type: 'card', icon: '🃏', name: 'Game 2', props: { title: '🏀 Lakers vs Warriors', description: '98 - 102 • Q4 5:32 • NBA' } },
      { id: 'text_upcoming', type: 'text', icon: '📝', name: 'Upcoming', props: { content: '📅 Upcoming', size: 'md', bold: true } },
      { id: 'card_3', type: 'card', icon: '🃏', name: 'Game 3', props: { title: '🎾 Djokovic vs Alcaraz', description: 'Tomorrow 8:00 PM • Australian Open' } },
      { id: 'card_4', type: 'card', icon: '🃏', name: 'Game 4', props: { title: '🏈 Chiefs vs 49ers', description: 'Sunday 6:30 PM • Super Bowl' } },
      { id: 'text_fav', type: 'text', icon: '📝', name: 'Favorites', props: { content: '⭐ Your Teams', size: 'md', bold: true } },
      { id: 'card_5', type: 'card', icon: '🃏', name: 'Team 1', props: { title: '⚽ FC Barcelona', description: 'Next: vs Real Madrid • Sat 8 PM' } },
      { id: 'navigation_1', type: 'navigation', icon: '🧭', name: 'Nav', props: { items: 'Live,Scores,News,Profile' } }
    ]
  },

  {
    id: 'gym-tracker',
    name: 'Gym Tracker',
    icon: '🏋️',
    category: 'lifestyle',
    description: 'Gym workout logging',
    longDescription: 'Gym workout tracker with exercises, sets and progress.',
    preview: '#DC2626',
    difficulty: 'intermediate',
    estimatedTime: '12 min',
    tags: ['gym', 'workout', 'fitness', 'exercise'],
    settings: {
      themeColor: '#DC2626',
      appIcon: '🏋️',
      platforms: ['ios', 'android']
    },
    capsules: [
      { id: 'header_1', type: 'header', icon: '🔝', name: 'Header', props: { title: 'GymLog', showBack: false, showMenu: true } },
      { id: 'text_today', type: 'text', icon: '📝', name: 'Today', props: { content: "Today's Workout", size: 'lg', bold: true } },
      { id: 'card_workout', type: 'card', icon: '🃏', name: 'Workout', props: { title: '💪 Push Day', description: 'Chest, Shoulders, Triceps • ~60 min' } },
      { id: 'button_start', type: 'button', icon: '🔘', name: 'Start', props: { text: '▶️ Start Workout', variant: 'primary', disabled: false } },
      { id: 'text_exercises', type: 'text', icon: '📝', name: 'Exercises', props: { content: 'Exercises', size: 'md', bold: true } },
      { id: 'card_1', type: 'card', icon: '🃏', name: 'Exercise 1', props: { title: 'Bench Press', description: '4 sets × 8-10 reps • Last: 185 lbs' } },
      { id: 'card_2', type: 'card', icon: '🃏', name: 'Exercise 2', props: { title: 'Overhead Press', description: '3 sets × 10 reps • Last: 95 lbs' } },
      { id: 'card_3', type: 'card', icon: '🃏', name: 'Exercise 3', props: { title: 'Incline Dumbbell Press', description: '3 sets × 12 reps • Last: 55 lbs' } },
      { id: 'card_4', type: 'card', icon: '🃏', name: 'Exercise 4', props: { title: 'Tricep Pushdowns', description: '3 sets × 15 reps • Last: 50 lbs' } },
      { id: 'stat_week', type: 'stat', icon: '📈', name: 'Week', props: { label: 'This Week', value: '4 workouts', change: '+1 vs last week', trend: 'up' } },
      { id: 'navigation_1', type: 'navigation', icon: '🧭', name: 'Nav', props: { items: 'Workout,History,Stats,Profile' } }
    ]
  },

  // ============================================================================
  // UTILITIES & TOOLS TEMPLATES
  // ============================================================================

  {
    id: 'password-manager',
    name: 'Password Manager',
    icon: '🔐',
    category: 'utility',
    description: 'Secure password storage',
    longDescription: 'Secure password manager with encryption and autofill.',
    preview: '#1E293B',
    difficulty: 'intermediate',
    estimatedTime: '12 min',
    tags: ['password', 'security', 'vault', 'encryption'],
    settings: {
      themeColor: '#1E293B',
      appIcon: '🔐',
      platforms: ['ios', 'android', 'web', 'desktop']
    },
    capsules: [
      { id: 'header_1', type: 'header', icon: '🔝', name: 'Header', props: { title: 'SecureVault', showBack: false, showMenu: true } },
      { id: 'input_search', type: 'input', icon: '📝', name: 'Search', props: { placeholder: '🔍 Search passwords...', label: '', required: false } },
      { id: 'text_recent', type: 'text', icon: '📝', name: 'Recent', props: { content: 'Recently Used', size: 'md', bold: true } },
      { id: 'card_1', type: 'card', icon: '🃏', name: 'Pass 1', props: { title: '🔵 Google Account', description: 'john.doe@gmail.com • Updated 2 days ago' } },
      { id: 'card_2', type: 'card', icon: '🃏', name: 'Pass 2', props: { title: '🏦 Chase Bank', description: 'john.doe • Updated 1 week ago' } },
      { id: 'card_3', type: 'card', icon: '🃏', name: 'Pass 3', props: { title: '🛒 Amazon', description: 'johndoe@email.com • Updated 2 weeks ago' } },
      { id: 'text_categories', type: 'text', icon: '📝', name: 'Categories', props: { content: 'Categories', size: 'md', bold: true } },
      { id: 'card_4', type: 'card', icon: '🃏', name: 'Cat 1', props: { title: '💼 Work', description: '12 passwords' } },
      { id: 'card_5', type: 'card', icon: '🃏', name: 'Cat 2', props: { title: '🏠 Personal', description: '24 passwords' } },
      { id: 'card_6', type: 'card', icon: '🃏', name: 'Cat 3', props: { title: '💳 Financial', description: '8 passwords' } },
      { id: 'button_add', type: 'button', icon: '🔘', name: 'Add', props: { text: '+ Add Password', variant: 'primary', disabled: false } }
    ]
  },

  {
    id: 'file-manager',
    name: 'File Manager',
    icon: '📁',
    category: 'utility',
    description: 'Cloud file storage',
    longDescription: 'Cloud file manager with storage, sharing and sync.',
    preview: '#2563EB',
    difficulty: 'intermediate',
    estimatedTime: '12 min',
    tags: ['files', 'storage', 'cloud', 'documents'],
    settings: {
      themeColor: '#2563EB',
      appIcon: '📁',
      platforms: ['ios', 'android', 'web', 'desktop']
    },
    capsules: [
      { id: 'header_1', type: 'header', icon: '🔝', name: 'Header', props: { title: 'CloudDrive', showBack: false, showMenu: true } },
      { id: 'stat_storage', type: 'stat', icon: '📈', name: 'Storage', props: { label: 'Storage Used', value: '45.2 GB', change: 'of 100 GB', trend: 'up' } },
      { id: 'progress_1', type: 'progress', icon: '⏳', name: 'Storage Bar', props: { value: 45, showLabel: false } },
      { id: 'text_recent', type: 'text', icon: '📝', name: 'Recent', props: { content: 'Recent Files', size: 'md', bold: true } },
      { id: 'card_1', type: 'card', icon: '🃏', name: 'File 1', props: { title: '📄 Q4 Report.pdf', description: '2.4 MB • Modified 2 hours ago' } },
      { id: 'card_2', type: 'card', icon: '🃏', name: 'File 2', props: { title: '🖼️ Product_Screenshots.zip', description: '45 MB • Modified yesterday' } },
      { id: 'card_3', type: 'card', icon: '🃏', name: 'File 3', props: { title: '📊 Budget_2024.xlsx', description: '1.2 MB • Modified 3 days ago' } },
      { id: 'text_folders', type: 'text', icon: '📝', name: 'Folders', props: { content: 'Folders', size: 'md', bold: true } },
      { id: 'card_4', type: 'card', icon: '🃏', name: 'Folder 1', props: { title: '📁 Documents', description: '234 files • 12.3 GB' } },
      { id: 'card_5', type: 'card', icon: '🃏', name: 'Folder 2', props: { title: '📁 Photos', description: '1,456 files • 25.6 GB' } },
      { id: 'button_upload', type: 'button', icon: '🔘', name: 'Upload', props: { text: '📤 Upload Files', variant: 'primary', disabled: false } },
      { id: 'navigation_1', type: 'navigation', icon: '🧭', name: 'Nav', props: { items: 'Files,Shared,Starred,Settings' } }
    ]
  },

  {
    id: 'vpn-app',
    name: 'VPN App',
    icon: '🔒',
    category: 'utility',
    description: 'Secure VPN connection',
    longDescription: 'VPN app for secure and private internet browsing.',
    preview: '#059669',
    difficulty: 'beginner',
    estimatedTime: '8 min',
    tags: ['vpn', 'security', 'privacy', 'network'],
    settings: {
      themeColor: '#059669',
      appIcon: '🔒',
      platforms: ['ios', 'android', 'desktop']
    },
    capsules: [
      { id: 'header_1', type: 'header', icon: '🔝', name: 'Header', props: { title: 'SecureVPN', showBack: false, showMenu: true } },
      { id: 'text_status', type: 'text', icon: '📝', name: 'Status', props: { content: '🟢 Connected', size: 'lg', bold: true } },
      { id: 'stat_ip', type: 'stat', icon: '📈', name: 'IP', props: { label: 'Your IP', value: '192.168.1.xxx', change: 'Protected', trend: 'up' } },
      { id: 'card_server', type: 'card', icon: '🃏', name: 'Server', props: { title: '🇺🇸 United States - New York', description: 'Ping: 45ms • Load: 32%' } },
      { id: 'button_disconnect', type: 'button', icon: '🔘', name: 'Disconnect', props: { text: '🔴 Disconnect', variant: 'secondary', disabled: false } },
      { id: 'text_servers', type: 'text', icon: '📝', name: 'Servers', props: { content: 'Quick Connect', size: 'md', bold: true } },
      { id: 'card_1', type: 'card', icon: '🃏', name: 'Server 1', props: { title: '🇬🇧 United Kingdom', description: 'Ping: 62ms • Load: 45%' } },
      { id: 'card_2', type: 'card', icon: '🃏', name: 'Server 2', props: { title: '🇯🇵 Japan - Tokyo', description: 'Ping: 120ms • Load: 28%' } },
      { id: 'card_3', type: 'card', icon: '🃏', name: 'Server 3', props: { title: '🇩🇪 Germany - Frankfurt', description: 'Ping: 78ms • Load: 51%' } },
      { id: 'stat_data', type: 'stat', icon: '📈', name: 'Data', props: { label: 'Data Used', value: '2.4 GB', change: 'Today', trend: 'up' } }
    ]
  }
]

// ============================================================================
// TEMPLATE CATEGORIES
// ============================================================================

export const TEMPLATE_CATEGORIES = [
  { id: 'all', name: 'All Templates', icon: '✨' },
  { id: 'featured', name: 'Featured', icon: '⭐' },
  { id: 'new', name: 'New', icon: '🆕' },
  { id: 'productivity', name: 'Productivity', icon: '📋' },
  { id: 'lifestyle', name: 'Lifestyle', icon: '🌿' },
  { id: 'social', name: 'Social', icon: '👥' },
  { id: 'commerce', name: 'Commerce', icon: '💼' },
  { id: 'utility', name: 'Utility', icon: '🔧' },
  { id: 'ai', name: 'AI Powered', icon: '🤖' },
  { id: 'creative', name: 'Creative', icon: '🎨' },
]

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function getTemplatesByCategory(category: string): MicroTemplate[] {
  if (category === 'all') return MICRO_TEMPLATES
  if (category === 'featured') return MICRO_TEMPLATES.filter(t => t.featured)
  if (category === 'new') return MICRO_TEMPLATES.filter(t => t.new)
  return MICRO_TEMPLATES.filter(t => t.category === category)
}

export function searchTemplates(query: string): MicroTemplate[] {
  const lowerQuery = query.toLowerCase()
  return MICRO_TEMPLATES.filter(t =>
    t.name.toLowerCase().includes(lowerQuery) ||
    t.description.toLowerCase().includes(lowerQuery) ||
    t.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  )
}

export function getTemplateById(id: string): MicroTemplate | undefined {
  return MICRO_TEMPLATES.find(t => t.id === id)
}
