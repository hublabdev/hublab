'use client'

import React, { useState } from 'react'
import type { CapsuleInstance } from './dnd-context'

interface VisualPreviewProps {
  capsules: CapsuleInstance[]
  projectName: string
  themeColor: string
  platform: 'ios' | 'android' | 'web'
}

// Render individual capsule as visual component
function RenderCapsule({ capsule, themeColor }: { capsule: CapsuleInstance; themeColor: string }) {
  const props = capsule.props || {}

  switch (capsule.type) {
    case 'button':
      return (
        <button
          className="px-4 py-2 rounded-lg text-white font-medium text-sm transition-transform active:scale-95"
          style={{ backgroundColor: props.variant === 'secondary' ? '#6B7280' : themeColor }}
          disabled={props.disabled as boolean}
        >
          {props.text as string || 'Button'}
        </button>
      )

    case 'text':
      return (
        <p
          className={`${props.size === 'lg' ? 'text-xl' : props.size === 'sm' ? 'text-xs' : 'text-sm'} ${props.bold ? 'font-bold' : ''}`}
          style={{ color: '#1F2937' }}
        >
          {props.content as string || 'Hello World'}
        </p>
      )

    case 'input':
      return (
        <input
          type="text"
          placeholder={props.placeholder as string || 'Type something...'}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
        />
      )

    case 'card':
      return (
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900">{props.title as string || 'Card Title'}</h3>
          <p className="text-gray-600 text-sm mt-1">{props.description as string || 'Card description goes here'}</p>
        </div>
      )

    case 'image':
      return (
        <div className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      )

    case 'avatar':
      return (
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium"
            style={{ backgroundColor: themeColor }}
          >
            {(props.name as string || 'U')[0]}
          </div>
          <span className="text-sm text-gray-900">{props.name as string || 'User'}</span>
        </div>
      )

    case 'badge':
      return (
        <span
          className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium text-white"
          style={{ backgroundColor: themeColor }}
        >
          {props.text as string || 'Badge'}
        </span>
      )

    case 'switch':
      return (
        <label className="flex items-center gap-3 cursor-pointer">
          <div className="relative">
            <input type="checkbox" className="sr-only peer" defaultChecked={props.checked as boolean} />
            <div className="w-10 h-6 bg-gray-300 rounded-full peer peer-checked:bg-indigo-500 transition-colors"></div>
            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow peer-checked:translate-x-4 transition-transform"></div>
          </div>
          <span className="text-sm text-gray-700">{props.label as string || 'Toggle'}</span>
        </label>
      )

    case 'progress':
      return (
        <div className="w-full">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Progress</span>
            <span>{props.value as number || 75}%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${props.value || 75}%`, backgroundColor: themeColor }}
            ></div>
          </div>
        </div>
      )

    case 'header':
      return (
        <div className="flex items-center justify-between p-3 bg-white border-b border-gray-200">
          {props.showBack && (
            <button className="p-1">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          <h1 className="text-base font-semibold text-gray-900 flex-1 text-center">{props.title as string || 'Header'}</h1>
          {props.showMenu && (
            <button className="p-1">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          )}
        </div>
      )

    case 'navigation':
    case 'tabs':
      const items = ((props.items as string) || 'Home,Search,Profile').split(',')
      return (
        <div className="flex bg-white border-t border-gray-200">
          {items.map((item, i) => (
            <button
              key={i}
              className={`flex-1 py-3 text-xs font-medium ${i === 0 ? 'text-indigo-600' : 'text-gray-500'}`}
              style={i === 0 ? { color: themeColor } : {}}
            >
              {item.trim()}
            </button>
          ))}
        </div>
      )

    case 'list':
      return (
        <div className="divide-y divide-gray-100">
          {Array.from({ length: (props.items as number) || 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 py-3">
              <div className="w-10 h-10 rounded-full bg-gray-200"></div>
              <div className="flex-1">
                <div className="h-4 w-24 bg-gray-200 rounded"></div>
                <div className="h-3 w-32 bg-gray-100 rounded mt-1"></div>
              </div>
            </div>
          ))}
        </div>
      )

    case 'chart':
      return (
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <h4 className="font-medium text-gray-900 text-sm mb-3">{props.title as string || 'Chart'}</h4>
          <div className="flex items-end gap-2 h-20">
            {[40, 65, 45, 80, 55, 70, 50].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t transition-all"
                style={{ height: `${h}%`, backgroundColor: themeColor, opacity: 0.7 + i * 0.05 }}
              ></div>
            ))}
          </div>
        </div>
      )

    case 'stat':
      return (
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-xs text-gray-500">{props.label as string || 'Total'}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{props.value as string || '1,234'}</p>
          <p className={`text-xs mt-1 ${(props.trend as string) === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {props.change as string || '+12%'}
          </p>
        </div>
      )

    case 'productcard':
      return (
        <div className="bg-white rounded-xl overflow-hidden border border-gray-100">
          <div className="h-32 bg-gray-100"></div>
          <div className="p-3">
            <h4 className="font-medium text-gray-900 text-sm">{props.title as string || 'Product'}</h4>
            <div className="flex items-center justify-between mt-2">
              <span className="font-bold" style={{ color: themeColor }}>${props.price as number || 29.99}</span>
              <div className="flex text-yellow-400 text-xs">★★★★☆</div>
            </div>
          </div>
        </div>
      )

    case 'chatbubble':
      return (
        <div className={`flex ${props.isOwn ? 'justify-end' : 'justify-start'}`}>
          <div
            className={`max-w-[70%] rounded-2xl px-4 py-2 ${
              props.isOwn
                ? 'bg-indigo-500 text-white rounded-br-md'
                : 'bg-gray-100 text-gray-900 rounded-bl-md'
            }`}
            style={props.isOwn ? { backgroundColor: themeColor } : {}}
          >
            <p className="text-sm">{props.message as string || 'Hello!'}</p>
          </div>
        </div>
      )

    case 'divider':
      return <div className="w-full h-px bg-gray-200 my-2"></div>

    case 'spacer':
      return <div style={{ height: (props.size as number) || 16 }}></div>

    default:
      return (
        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <span className="text-lg">{capsule.icon}</span>
          <span className="text-sm text-gray-600">{capsule.name}</span>
        </div>
      )
  }
}

// Phone Frame Component
function PhoneFrame({ children, platform }: { children: React.ReactNode; platform: 'ios' | 'android' | 'web' }) {
  if (platform === 'web') {
    return (
      <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-2xl overflow-hidden border border-gray-200">
        {/* Browser Chrome */}
        <div className="h-8 bg-gray-100 border-b border-gray-200 flex items-center px-3 gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
          </div>
          <div className="flex-1 mx-2">
            <div className="h-5 bg-white rounded-md border border-gray-300 px-2 flex items-center">
              <span className="text-[10px] text-gray-400">localhost:3000</span>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 min-h-[500px]">
          {children}
        </div>
      </div>
    )
  }

  return (
    <div className="relative mx-auto" style={{ width: '280px' }}>
      {/* Phone Frame */}
      <div className="relative bg-gray-900 rounded-[40px] p-2 shadow-2xl">
        {/* Dynamic Island / Notch */}
        {platform === 'ios' ? (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-full z-20"></div>
        ) : (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-4 h-4 bg-gray-800 rounded-full z-20"></div>
        )}

        {/* Screen */}
        <div className="bg-white rounded-[32px] overflow-hidden">
          {/* Status Bar */}
          <div className="h-10 bg-white flex items-center justify-between px-6 pt-2">
            <span className="text-[10px] font-medium text-gray-900">9:41</span>
            <div className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21a9 9 0 100-18 9 9 0 000 18zm0-2a7 7 0 110-14 7 7 0 010 14z" />
              </svg>
              <svg className="w-3.5 h-3.5 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
                <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3a4.237 4.237 0 00-6 0zm-4-4l2 2a7.074 7.074 0 0110 0l2-2C15.14 9.14 8.87 9.14 5 13z" />
              </svg>
              <div className="w-6 h-3 bg-gray-900 rounded-sm flex items-center justify-end pr-0.5">
                <div className="w-4 h-2 bg-green-500 rounded-sm"></div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="min-h-[500px] bg-gray-50">
            {children}
          </div>

          {/* Home Indicator */}
          {platform === 'ios' && (
            <div className="h-6 bg-white flex items-center justify-center">
              <div className="w-32 h-1 bg-gray-900 rounded-full"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function VisualPreview({ capsules, projectName, themeColor, platform }: VisualPreviewProps) {
  return (
    <PhoneFrame platform={platform}>
      <div className="p-4 space-y-3">
        {capsules.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-12 h-12 rounded-xl bg-gray-200 flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <p className="text-gray-500 text-sm font-medium">No components yet</p>
            <p className="text-gray-400 text-xs mt-1">Add capsules to see the preview</p>
          </div>
        ) : (
          capsules.map((capsule) => (
            <RenderCapsule key={capsule.id} capsule={capsule} themeColor={themeColor} />
          ))
        )}
      </div>
    </PhoneFrame>
  )
}

// Preview Panel with device switcher
export function PreviewPanel({
  capsules,
  projectName,
  themeColor,
  showCode,
  onToggleCode,
  codeContent
}: VisualPreviewProps & {
  showCode: boolean
  onToggleCode: () => void
  codeContent: string
}) {
  const [previewPlatform, setPreviewPlatform] = useState<'ios' | 'android' | 'web'>('ios')

  return (
    <div className="h-full flex flex-col bg-[#0a0a0a]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPreviewPlatform('ios')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              previewPlatform === 'ios' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'
            }`}
          >
            iOS
          </button>
          <button
            onClick={() => setPreviewPlatform('android')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              previewPlatform === 'android' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'
            }`}
          >
            Android
          </button>
          <button
            onClick={() => setPreviewPlatform('web')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              previewPlatform === 'web' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'
            }`}
          >
            Web
          </button>
        </div>

        <button
          onClick={onToggleCode}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            showCode ? 'bg-indigo-500/20 text-indigo-400' : 'text-gray-500 hover:text-white hover:bg-white/10'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
          {showCode ? 'Preview' : 'Code'}
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {showCode ? (
          <div className="bg-[#1e1e1e] rounded-xl p-4 overflow-auto h-full">
            <pre className="text-sm text-gray-300 font-mono whitespace-pre-wrap">{codeContent}</pre>
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <VisualPreview
              capsules={capsules}
              projectName={projectName}
              themeColor={themeColor}
              platform={previewPlatform}
            />
          </div>
        )}
      </div>
    </div>
  )
}
