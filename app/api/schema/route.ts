import { NextResponse } from 'next/server'

/**
 * HubLab Project JSON Schema
 *
 * This schema defines the structure for AI-generated HubLab projects.
 * AI assistants can use this schema to generate valid project specifications
 * that compile to native iOS, Android, Web, and Desktop apps.
 */

const schema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'HubLab Project Schema',
  description: 'Schema for AI-generated multi-platform app projects',
  version: '1.0.0',

  definitions: {
    // Prop types that can be used in capsule instances
    PropType: {
      enum: ['string', 'number', 'boolean', 'color', 'size', 'spacing', 'icon', 'image', 'action', 'array', 'object', 'select', 'slot']
    },

    // Target platforms
    Platform: {
      enum: ['web', 'ios', 'android', 'desktop']
    },

    // Theme configuration
    ThemeConfig: {
      type: 'object',
      required: ['name', 'colors'],
      properties: {
        name: { type: 'string', description: 'Theme name' },
        colors: {
          type: 'object',
          required: ['primary', 'secondary', 'background', 'text'],
          properties: {
            primary: { type: 'string', pattern: '^#[0-9A-Fa-f]{6}$', description: 'Primary brand color' },
            secondary: { type: 'string', pattern: '^#[0-9A-Fa-f]{6}$', description: 'Secondary color' },
            accent: { type: 'string', pattern: '^#[0-9A-Fa-f]{6}$' },
            background: { type: 'string', pattern: '^#[0-9A-Fa-f]{6}$' },
            surface: { type: 'string', pattern: '^#[0-9A-Fa-f]{6}$' },
            error: { type: 'string', pattern: '^#[0-9A-Fa-f]{6}$', default: '#EF4444' },
            success: { type: 'string', pattern: '^#[0-9A-Fa-f]{6}$', default: '#22C55E' },
            warning: { type: 'string', pattern: '^#[0-9A-Fa-f]{6}$', default: '#F59E0B' },
            text: {
              type: 'object',
              properties: {
                primary: { type: 'string', pattern: '^#[0-9A-Fa-f]{6}$' },
                secondary: { type: 'string', pattern: '^#[0-9A-Fa-f]{6}$' },
                disabled: { type: 'string', pattern: '^#[0-9A-Fa-f]{6}$' }
              }
            }
          }
        },
        typography: {
          type: 'object',
          properties: {
            fontFamily: { type: 'string', default: 'Inter' },
            headingFont: { type: 'string' },
            monoFont: { type: 'string' },
            scale: { enum: ['compact', 'normal', 'large'], default: 'normal' }
          }
        },
        spacing: { enum: ['compact', 'normal', 'relaxed'], default: 'normal' },
        borderRadius: { enum: ['none', 'sm', 'md', 'lg', 'full'], default: 'md' },
        shadows: { type: 'boolean', default: true }
      }
    },

    // Capsule instance in the app tree
    CapsuleInstance: {
      type: 'object',
      required: ['id', 'capsuleId', 'props'],
      properties: {
        id: {
          type: 'string',
          description: 'Unique identifier for this capsule instance',
          pattern: '^[a-z][a-z0-9-]*$'
        },
        capsuleId: {
          type: 'string',
          description: 'ID of the capsule type to use',
          enum: [
            'button', 'text', 'input', 'card', 'image', 'list', 'modal', 'form',
            'navigation', 'auth-screen', 'chart', 'skeleton', 'switch', 'slider',
            'tabs', 'accordion', 'dropdown', 'datepicker', 'progress', 'tooltip',
            'table', 'searchbar', 'rating', 'stepper', 'chip', 'divider',
            'calendar', 'file-upload', 'carousel', 'timeline', 'bottom-sheet',
            'popover', 'color-picker', 'rich-text-editor', 'signature', 'map',
            'video', 'audio', 'data-table', 'kanban', 'chat', 'qrcode', 'scanner',
            'pdf-viewer', 'notifications', 'webview', 'biometrics', 'location',
            'camera', 'social-share'
          ]
        },
        props: {
          type: 'object',
          description: 'Props for the capsule (varies by capsule type)',
          additionalProperties: true
        },
        children: {
          type: 'array',
          items: { $ref: '#/definitions/CapsuleInstance' },
          description: 'Child capsules (for container capsules)'
        },
        slots: {
          type: 'object',
          additionalProperties: {
            type: 'array',
            items: { $ref: '#/definitions/CapsuleInstance' }
          },
          description: 'Named slots for complex layouts'
        }
      }
    },

    // Screen definition
    Screen: {
      type: 'object',
      required: ['id', 'name', 'root'],
      properties: {
        id: { type: 'string', pattern: '^[a-z][a-z0-9-]*$' },
        name: { type: 'string', description: 'Display name for the screen' },
        path: { type: 'string', description: 'URL path for web routing' },
        root: { $ref: '#/definitions/CapsuleInstance' },
        params: {
          type: 'array',
          items: { type: 'string' },
          description: 'Route parameters'
        }
      }
    }
  },

  // Main project schema
  type: 'object',
  required: ['name', 'version', 'targets', 'screens', 'theme'],
  properties: {
    // Project metadata
    name: {
      type: 'string',
      description: 'Project name (used for app bundle)',
      pattern: '^[A-Za-z][A-Za-z0-9 -]*$',
      minLength: 2,
      maxLength: 50
    },
    description: {
      type: 'string',
      description: 'Brief description of the app',
      maxLength: 500
    },
    version: {
      type: 'string',
      pattern: '^\\d+\\.\\d+\\.\\d+$',
      default: '1.0.0',
      description: 'Semantic version'
    },

    // Target platforms
    targets: {
      type: 'array',
      items: { $ref: '#/definitions/Platform' },
      minItems: 1,
      uniqueItems: true,
      description: 'Platforms to generate code for'
    },

    // Screens
    screens: {
      type: 'array',
      items: { $ref: '#/definitions/Screen' },
      minItems: 1,
      description: 'App screens/pages'
    },

    // Navigation
    navigation: {
      type: 'object',
      properties: {
        type: { enum: ['stack', 'tabs', 'drawer'], default: 'stack' },
        initialScreen: { type: 'string', description: 'ID of initial screen' }
      }
    },

    // Theme
    theme: { $ref: '#/definitions/ThemeConfig' },

    // Platform-specific config
    platformConfig: {
      type: 'object',
      properties: {
        web: {
          type: 'object',
          properties: {
            framework: { enum: ['react', 'vue', 'svelte'], default: 'react' },
            typescript: { type: 'boolean', default: true },
            styling: { enum: ['tailwind', 'css-modules', 'styled-components'], default: 'tailwind' }
          }
        },
        ios: {
          type: 'object',
          required: ['bundleId'],
          properties: {
            bundleId: { type: 'string', pattern: '^[a-z][a-z0-9]*(\\.[a-z][a-z0-9]*)*$' },
            teamId: { type: 'string' },
            minVersion: { type: 'string', default: '15.0' }
          }
        },
        android: {
          type: 'object',
          required: ['packageName'],
          properties: {
            packageName: { type: 'string', pattern: '^[a-z][a-z0-9]*(\\.[a-z][a-z0-9]*)*$' },
            minSdk: { type: 'integer', minimum: 24, default: 26 },
            targetSdk: { type: 'integer', default: 34 }
          }
        },
        desktop: {
          type: 'object',
          properties: {
            targets: {
              type: 'array',
              items: { enum: ['macos', 'windows', 'linux'] },
              default: ['macos', 'windows', 'linux']
            }
          }
        }
      }
    }
  },

  // Example projects for AI reference
  examples: [
    {
      name: 'Simple Todo App',
      description: 'A basic todo list application',
      version: '1.0.0',
      targets: ['web', 'ios', 'android'],
      theme: {
        name: 'Default',
        colors: {
          primary: '#6366F1',
          secondary: '#8B5CF6',
          background: '#FFFFFF',
          surface: '#F9FAFB',
          text: {
            primary: '#111827',
            secondary: '#6B7280'
          }
        }
      },
      screens: [
        {
          id: 'home',
          name: 'Home',
          path: '/',
          root: {
            id: 'home-container',
            capsuleId: 'card',
            props: {
              title: 'My Tasks',
              padding: 'normal'
            },
            children: [
              {
                id: 'task-input',
                capsuleId: 'input',
                props: {
                  placeholder: 'Add a new task...',
                  onChange: 'handleInputChange'
                }
              },
              {
                id: 'add-button',
                capsuleId: 'button',
                props: {
                  text: 'Add Task',
                  variant: 'primary',
                  onPress: 'handleAddTask'
                }
              },
              {
                id: 'task-list',
                capsuleId: 'list',
                props: {
                  items: '$tasks',
                  separator: true
                }
              }
            ]
          }
        }
      ]
    },
    {
      name: 'Fitness Tracker',
      description: 'Track workouts and steps',
      version: '1.0.0',
      targets: ['ios', 'android'],
      navigation: {
        type: 'tabs',
        initialScreen: 'dashboard'
      },
      theme: {
        name: 'Fitness',
        colors: {
          primary: '#10B981',
          secondary: '#3B82F6',
          background: '#0F172A',
          surface: '#1E293B',
          text: {
            primary: '#F1F5F9',
            secondary: '#94A3B8'
          }
        }
      },
      screens: [
        {
          id: 'dashboard',
          name: 'Dashboard',
          root: {
            id: 'stats-container',
            capsuleId: 'card',
            props: { elevation: 'md' },
            children: [
              {
                id: 'steps-chart',
                capsuleId: 'chart',
                props: {
                  type: 'line',
                  data: '$weeklySteps',
                  showLegend: false
                }
              },
              {
                id: 'step-progress',
                capsuleId: 'progress',
                props: {
                  value: '$todaySteps',
                  variant: 'circular',
                  showLabel: true
                }
              }
            ]
          }
        },
        {
          id: 'workouts',
          name: 'Workouts',
          root: {
            id: 'workout-list',
            capsuleId: 'list',
            props: {
              items: '$workouts',
              selectable: true
            }
          }
        }
      ],
      platformConfig: {
        ios: { bundleId: 'com.example.fitnesstracker' },
        android: { packageName: 'com.example.fitnesstracker' }
      }
    }
  ]
}

export async function GET() {
  return NextResponse.json(schema, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600'
    }
  })
}
