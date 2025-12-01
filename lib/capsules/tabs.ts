/**
 * Tabs Capsule - Multi-Platform Tab Navigation
 *
 * Tabbed content navigation with multiple styles
 */

import { CapsuleDefinition } from './types'

export const TabsCapsule: CapsuleDefinition = {
  id: 'tabs',
  name: 'Tabs',
  description: 'Tabbed content navigation with multiple styles',
  category: 'navigation',
  tags: ['tabs', 'navigation', 'segmented', 'control', 'panels'],
  version: '1.0.0',
  children: true,

  props: [
    {
      name: 'value',
      type: 'string',
      required: false,
      description: 'Currently active tab (controlled)'
    },
    {
      name: 'defaultValue',
      type: 'string',
      required: false,
      description: 'Initially active tab (uncontrolled)'
    },
    {
      name: 'onChange',
      type: 'action',
      required: false,
      description: 'Callback when tab changes'
    },
    {
      name: 'variant',
      type: 'select',
      required: false,
      default: 'underline',
      description: 'Visual style of tabs',
      options: ['underline', 'pills', 'boxed', 'segmented']
    },
    {
      name: 'size',
      type: 'size',
      required: false,
      default: 'md',
      description: 'Size of tabs'
    },
    {
      name: 'fullWidth',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Tabs take full width'
    },
    {
      name: 'orientation',
      type: 'select',
      required: false,
      default: 'horizontal',
      description: 'Tab orientation',
      options: ['horizontal', 'vertical']
    },
    {
      name: 'tabs',
      type: 'array',
      required: true,
      description: 'Array of tab definitions'
    }
  ],

  platforms: {
    web: {
      framework: 'react',
      typescript: true,
      dependencies: [],
      code: `
import React, { useState, createContext, useContext, useId } from 'react'

interface Tab {
  value: string
  label: string
  icon?: React.ReactNode
  disabled?: boolean
  content?: React.ReactNode
}

interface TabsContextValue {
  activeTab: string
  setActiveTab: (value: string) => void
  variant: 'underline' | 'pills' | 'boxed' | 'segmented'
  size: 'sm' | 'md' | 'lg'
}

const TabsContext = createContext<TabsContextValue | null>(null)

function useTabsContext() {
  const context = useContext(TabsContext)
  if (!context) throw new Error('Tab components must be used within Tabs')
  return context
}

interface TabsProps {
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  variant?: 'underline' | 'pills' | 'boxed' | 'segmented'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  orientation?: 'horizontal' | 'vertical'
  tabs?: Tab[]
  children?: React.ReactNode
  className?: string
}

export function Tabs({
  value: controlledValue,
  defaultValue,
  onChange,
  variant = 'underline',
  size = 'md',
  fullWidth = false,
  orientation = 'horizontal',
  tabs,
  children,
  className = ''
}: TabsProps) {
  const [internalValue, setInternalValue] = useState(defaultValue || tabs?.[0]?.value || '')

  const isControlled = controlledValue !== undefined
  const activeTab = isControlled ? controlledValue : internalValue

  const setActiveTab = (newValue: string) => {
    if (!isControlled) {
      setInternalValue(newValue)
    }
    onChange?.(newValue)
  }

  const containerClass = orientation === 'vertical'
    ? 'flex flex-row gap-4'
    : 'flex flex-col'

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab, variant, size }}>
      <div className={\`\${containerClass} \${className}\`}>
        {tabs ? (
          <>
            <TabList fullWidth={fullWidth} orientation={orientation}>
              {tabs.map(tab => (
                <TabTrigger
                  key={tab.value}
                  value={tab.value}
                  disabled={tab.disabled}
                >
                  {tab.icon}
                  {tab.label}
                </TabTrigger>
              ))}
            </TabList>
            <div className="mt-4">
              {tabs.map(tab => (
                <TabPanel key={tab.value} value={tab.value}>
                  {tab.content}
                </TabPanel>
              ))}
            </div>
          </>
        ) : (
          children
        )}
      </div>
    </TabsContext.Provider>
  )
}

interface TabListProps {
  children: React.ReactNode
  fullWidth?: boolean
  orientation?: 'horizontal' | 'vertical'
  className?: string
}

export function TabList({
  children,
  fullWidth = false,
  orientation = 'horizontal',
  className = ''
}: TabListProps) {
  const { variant } = useTabsContext()

  const baseStyles = orientation === 'vertical'
    ? 'flex flex-col'
    : 'flex flex-row'

  const variantStyles = {
    underline: 'border-b border-gray-200 dark:border-gray-700',
    pills: 'gap-2',
    boxed: 'bg-gray-100 dark:bg-gray-800 p-1 rounded-lg gap-1',
    segmented: 'bg-gray-100 dark:bg-gray-800 p-1 rounded-lg'
  }

  return (
    <div
      role="tablist"
      className={\`
        \${baseStyles}
        \${variantStyles[variant]}
        \${fullWidth ? 'w-full' : 'w-fit'}
        \${className}
      \`}
    >
      {children}
    </div>
  )
}

interface TabTriggerProps {
  value: string
  disabled?: boolean
  children: React.ReactNode
  className?: string
}

export function TabTrigger({
  value,
  disabled = false,
  children,
  className = ''
}: TabTriggerProps) {
  const { activeTab, setActiveTab, variant, size } = useTabsContext()
  const isActive = activeTab === value

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  }

  const variantStyles = {
    underline: \`
      border-b-2 -mb-px
      \${isActive
        ? 'border-blue-600 text-blue-600'
        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
      }
    \`,
    pills: \`
      rounded-full
      \${isActive
        ? 'bg-blue-600 text-white'
        : 'text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800'
      }
    \`,
    boxed: \`
      rounded-md
      \${isActive
        ? 'bg-white dark:bg-gray-900 shadow text-gray-900 dark:text-white'
        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
      }
    \`,
    segmented: \`
      flex-1 text-center rounded-md
      \${isActive
        ? 'bg-white dark:bg-gray-900 shadow text-gray-900 dark:text-white'
        : 'text-gray-600 dark:text-gray-400'
      }
    \`
  }

  return (
    <button
      role="tab"
      aria-selected={isActive}
      aria-disabled={disabled}
      disabled={disabled}
      onClick={() => !disabled && setActiveTab(value)}
      className={\`
        flex items-center gap-2 font-medium transition-all
        focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
        \${sizeStyles[size]}
        \${variantStyles[variant]}
        \${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        \${className}
      \`}
    >
      {children}
    </button>
  )
}

interface TabPanelProps {
  value: string
  children: React.ReactNode
  className?: string
}

export function TabPanel({ value, children, className = '' }: TabPanelProps) {
  const { activeTab } = useTabsContext()

  if (activeTab !== value) return null

  return (
    <div
      role="tabpanel"
      className={\`focus:outline-none \${className}\`}
    >
      {children}
    </div>
  )
}

// Shorthand component for simple use cases
interface SimpleTabsProps {
  tabs: Tab[]
  defaultValue?: string
  onChange?: (value: string) => void
  variant?: 'underline' | 'pills' | 'boxed' | 'segmented'
  className?: string
}

export function SimpleTabs({
  tabs,
  defaultValue,
  onChange,
  variant = 'underline',
  className = ''
}: SimpleTabsProps) {
  return (
    <Tabs
      tabs={tabs}
      defaultValue={defaultValue || tabs[0]?.value}
      onChange={onChange}
      variant={variant}
      className={className}
    />
  )
}
`
    },

    ios: {
      framework: 'swiftui',
      minVersion: '15.0',
      dependencies: [],
      imports: ['SwiftUI'],
      code: `
import SwiftUI

// MARK: - Tab Item
struct TabItem: Identifiable {
    let id: String
    let label: String
    var icon: String? = nil
    var disabled: Bool = false
}

// MARK: - Tab Variant
enum TabVariant {
    case underline
    case pills
    case boxed
    case segmented
}

// MARK: - Tab Size
enum TabSize {
    case sm, md, lg

    var padding: EdgeInsets {
        switch self {
        case .sm: return EdgeInsets(top: 6, leading: 12, bottom: 6, trailing: 12)
        case .md: return EdgeInsets(top: 8, leading: 16, bottom: 8, trailing: 16)
        case .lg: return EdgeInsets(top: 12, leading: 24, bottom: 12, trailing: 24)
        }
    }

    var font: Font {
        switch self {
        case .sm: return .subheadline
        case .md: return .body
        case .lg: return .title3
        }
    }
}

// MARK: - Tabs View
struct Tabs<Content: View>: View {
    @Binding var selection: String
    let tabs: [TabItem]
    var variant: TabVariant = .underline
    var size: TabSize = .md
    var fullWidth: Bool = false
    @ViewBuilder let content: (String) -> Content

    var body: some View {
        VStack(spacing: 16) {
            tabBar
            content(selection)
        }
    }

    @ViewBuilder
    private var tabBar: some View {
        switch variant {
        case .underline:
            underlineTabBar
        case .pills:
            pillsTabBar
        case .boxed:
            boxedTabBar
        case .segmented:
            segmentedTabBar
        }
    }

    private var underlineTabBar: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 0) {
                ForEach(tabs) { tab in
                    Button {
                        if !tab.disabled {
                            withAnimation(.easeInOut(duration: 0.2)) {
                                selection = tab.id
                            }
                        }
                    } label: {
                        VStack(spacing: 8) {
                            HStack(spacing: 6) {
                                if let icon = tab.icon {
                                    Image(systemName: icon)
                                }
                                Text(tab.label)
                            }
                            .font(size.font)
                            .fontWeight(.medium)
                            .foregroundColor(selection == tab.id ? .blue : .gray)
                            .padding(size.padding)

                            Rectangle()
                                .fill(selection == tab.id ? Color.blue : Color.clear)
                                .frame(height: 2)
                        }
                    }
                    .disabled(tab.disabled)
                    .opacity(tab.disabled ? 0.5 : 1)
                }
            }
        }
        .overlay(
            Rectangle()
                .fill(Color.gray.opacity(0.2))
                .frame(height: 1),
            alignment: .bottom
        )
    }

    private var pillsTabBar: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 8) {
                ForEach(tabs) { tab in
                    Button {
                        if !tab.disabled {
                            withAnimation(.easeInOut(duration: 0.2)) {
                                selection = tab.id
                            }
                        }
                    } label: {
                        HStack(spacing: 6) {
                            if let icon = tab.icon {
                                Image(systemName: icon)
                            }
                            Text(tab.label)
                        }
                        .font(size.font)
                        .fontWeight(.medium)
                        .foregroundColor(selection == tab.id ? .white : .gray)
                        .padding(size.padding)
                        .background(selection == tab.id ? Color.blue : Color.clear)
                        .clipShape(Capsule())
                    }
                    .disabled(tab.disabled)
                    .opacity(tab.disabled ? 0.5 : 1)
                }
            }
            .padding(.horizontal, 4)
        }
    }

    private var boxedTabBar: some View {
        HStack(spacing: 4) {
            ForEach(tabs) { tab in
                Button {
                    if !tab.disabled {
                        withAnimation(.easeInOut(duration: 0.2)) {
                            selection = tab.id
                        }
                    }
                } label: {
                    HStack(spacing: 6) {
                        if let icon = tab.icon {
                            Image(systemName: icon)
                        }
                        Text(tab.label)
                    }
                    .font(size.font)
                    .fontWeight(.medium)
                    .foregroundColor(selection == tab.id ? .primary : .gray)
                    .padding(size.padding)
                    .frame(maxWidth: fullWidth ? .infinity : nil)
                    .background(selection == tab.id ? Color(.systemBackground) : Color.clear)
                    .cornerRadius(8)
                    .shadow(color: selection == tab.id ? .black.opacity(0.1) : .clear, radius: 2, y: 1)
                }
                .disabled(tab.disabled)
                .opacity(tab.disabled ? 0.5 : 1)
            }
        }
        .padding(4)
        .background(Color(.systemGray6))
        .cornerRadius(12)
    }

    private var segmentedTabBar: some View {
        Picker("", selection: $selection) {
            ForEach(tabs) { tab in
                if let icon = tab.icon {
                    Label(tab.label, systemImage: icon)
                        .tag(tab.id)
                } else {
                    Text(tab.label)
                        .tag(tab.id)
                }
            }
        }
        .pickerStyle(.segmented)
    }
}

// MARK: - Simple Tabs (without content builder)
struct SimpleTabs: View {
    @Binding var selection: String
    let tabs: [TabItem]
    var variant: TabVariant = .underline
    var size: TabSize = .md

    var body: some View {
        Tabs(selection: $selection, tabs: tabs, variant: variant, size: size) { _ in
            EmptyView()
        }
    }
}

// MARK: - Tab Content View
struct TabContent<Content: View>: View {
    let tab: String
    @Binding var selection: String
    @ViewBuilder let content: () -> Content

    var body: some View {
        if selection == tab {
            content()
                .transition(.opacity)
        }
    }
}

// MARK: - Preview
struct TabsPreview: PreviewProvider {
    struct PreviewContainer: View {
        @State private var selectedTab1 = "home"
        @State private var selectedTab2 = "photos"
        @State private var selectedTab3 = "all"

        let tabs: [TabItem] = [
            TabItem(id: "home", label: "Home", icon: "house"),
            TabItem(id: "search", label: "Search", icon: "magnifyingglass"),
            TabItem(id: "profile", label: "Profile", icon: "person"),
            TabItem(id: "settings", label: "Settings", icon: "gear", disabled: true)
        ]

        let mediaTabs: [TabItem] = [
            TabItem(id: "photos", label: "Photos"),
            TabItem(id: "videos", label: "Videos"),
            TabItem(id: "albums", label: "Albums")
        ]

        let filterTabs: [TabItem] = [
            TabItem(id: "all", label: "All"),
            TabItem(id: "active", label: "Active"),
            TabItem(id: "completed", label: "Completed")
        ]

        var body: some View {
            ScrollView {
                VStack(spacing: 32) {
                    Group {
                        Text("Underline Tabs")
                            .font(.headline)
                        Tabs(selection: $selectedTab1, tabs: tabs, variant: .underline) { tab in
                            Text("Content for \\(tab)")
                                .frame(height: 100)
                        }
                    }

                    Divider()

                    Group {
                        Text("Pills Tabs")
                            .font(.headline)
                        Tabs(selection: $selectedTab2, tabs: mediaTabs, variant: .pills, size: .sm) { tab in
                            Text("\\(tab) content")
                                .frame(height: 80)
                        }
                    }

                    Divider()

                    Group {
                        Text("Boxed Tabs")
                            .font(.headline)
                        Tabs(selection: $selectedTab2, tabs: mediaTabs, variant: .boxed, fullWidth: true) { tab in
                            Text("\\(tab) gallery")
                                .frame(height: 80)
                        }
                    }

                    Divider()

                    Group {
                        Text("Segmented Control")
                            .font(.headline)
                        Tabs(selection: $selectedTab3, tabs: filterTabs, variant: .segmented) { tab in
                            Text("Showing \\(tab) items")
                                .frame(height: 80)
                        }
                    }
                }
                .padding()
            }
        }
    }

    static var previews: some View {
        PreviewContainer()
    }
}
`
    },

    android: {
      framework: 'compose',
      minSdk: 24,
      dependencies: [
        'androidx.compose.material3:material3'
      ],
      imports: [
        'androidx.compose.animation.*',
        'androidx.compose.foundation.background',
        'androidx.compose.foundation.clickable',
        'androidx.compose.foundation.horizontalScroll',
        'androidx.compose.foundation.layout.*',
        'androidx.compose.foundation.rememberScrollState',
        'androidx.compose.foundation.shape.CircleShape',
        'androidx.compose.foundation.shape.RoundedCornerShape',
        'androidx.compose.material3.*',
        'androidx.compose.runtime.*',
        'androidx.compose.ui.Alignment',
        'androidx.compose.ui.Modifier',
        'androidx.compose.ui.draw.clip',
        'androidx.compose.ui.graphics.Color',
        'androidx.compose.ui.text.font.FontWeight',
        'androidx.compose.ui.unit.dp',
        'androidx.compose.ui.unit.sp'
      ],
      code: `
package com.hublab.capsules

import androidx.compose.animation.*
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

// Tab data class
data class TabItem(
    val id: String,
    val label: String,
    val icon: (@Composable () -> Unit)? = null,
    val disabled: Boolean = false
)

// Variants
enum class TabVariant {
    UNDERLINE, PILLS, BOXED, SEGMENTED
}

// Sizes
enum class TabSize(val paddingHorizontal: Int, val paddingVertical: Int, val fontSize: Int) {
    SM(12, 6, 14),
    MD(16, 8, 16),
    LG(24, 12, 18)
}

@Composable
fun Tabs(
    selectedTab: String,
    onTabSelected: (String) -> Unit,
    tabs: List<TabItem>,
    modifier: Modifier = Modifier,
    variant: TabVariant = TabVariant.UNDERLINE,
    size: TabSize = TabSize.MD,
    fullWidth: Boolean = false,
    content: @Composable (String) -> Unit = {}
) {
    Column(modifier = modifier) {
        when (variant) {
            TabVariant.UNDERLINE -> UnderlineTabs(selectedTab, onTabSelected, tabs, size, fullWidth)
            TabVariant.PILLS -> PillsTabs(selectedTab, onTabSelected, tabs, size)
            TabVariant.BOXED -> BoxedTabs(selectedTab, onTabSelected, tabs, size, fullWidth)
            TabVariant.SEGMENTED -> SegmentedTabs(selectedTab, onTabSelected, tabs)
        }

        Spacer(modifier = Modifier.height(16.dp))

        AnimatedContent(
            targetState = selectedTab,
            transitionSpec = {
                fadeIn() togetherWith fadeOut()
            },
            label = "tab_content"
        ) { tab ->
            content(tab)
        }
    }
}

@Composable
private fun UnderlineTabs(
    selectedTab: String,
    onTabSelected: (String) -> Unit,
    tabs: List<TabItem>,
    size: TabSize,
    fullWidth: Boolean
) {
    Column {
        Row(
            modifier = Modifier
                .let { if (fullWidth) it.fillMaxWidth() else it }
                .horizontalScroll(rememberScrollState())
        ) {
            tabs.forEach { tab ->
                Column(
                    modifier = Modifier
                        .let { if (fullWidth) it.weight(1f) else it }
                        .clickable(enabled = !tab.disabled) { onTabSelected(tab.id) }
                        .padding(
                            horizontal = size.paddingHorizontal.dp,
                            vertical = size.paddingVertical.dp
                        )
                        .alpha(if (tab.disabled) 0.5f else 1f),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        tab.icon?.invoke()
                        Text(
                            text = tab.label,
                            fontSize = size.fontSize.sp,
                            fontWeight = FontWeight.Medium,
                            color = if (selectedTab == tab.id)
                                MaterialTheme.colorScheme.primary
                            else
                                MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }

                    Spacer(modifier = Modifier.height(8.dp))

                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(2.dp)
                            .background(
                                if (selectedTab == tab.id)
                                    MaterialTheme.colorScheme.primary
                                else
                                    Color.Transparent
                            )
                    )
                }
            }
        }

        Divider(color = MaterialTheme.colorScheme.outlineVariant)
    }
}

@Composable
private fun PillsTabs(
    selectedTab: String,
    onTabSelected: (String) -> Unit,
    tabs: List<TabItem>,
    size: TabSize
) {
    Row(
        modifier = Modifier.horizontalScroll(rememberScrollState()),
        horizontalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        tabs.forEach { tab ->
            val isSelected = selectedTab == tab.id

            Row(
                modifier = Modifier
                    .clip(CircleShape)
                    .background(
                        if (isSelected)
                            MaterialTheme.colorScheme.primary
                        else
                            Color.Transparent
                    )
                    .clickable(enabled = !tab.disabled) { onTabSelected(tab.id) }
                    .padding(
                        horizontal = size.paddingHorizontal.dp,
                        vertical = size.paddingVertical.dp
                    )
                    .alpha(if (tab.disabled) 0.5f else 1f),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(6.dp)
            ) {
                tab.icon?.invoke()
                Text(
                    text = tab.label,
                    fontSize = size.fontSize.sp,
                    fontWeight = FontWeight.Medium,
                    color = if (isSelected)
                        MaterialTheme.colorScheme.onPrimary
                    else
                        MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        }
    }
}

@Composable
private fun BoxedTabs(
    selectedTab: String,
    onTabSelected: (String) -> Unit,
    tabs: List<TabItem>,
    size: TabSize,
    fullWidth: Boolean
) {
    Row(
        modifier = Modifier
            .let { if (fullWidth) it.fillMaxWidth() else it }
            .clip(RoundedCornerShape(12.dp))
            .background(MaterialTheme.colorScheme.surfaceVariant)
            .padding(4.dp),
        horizontalArrangement = Arrangement.spacedBy(4.dp)
    ) {
        tabs.forEach { tab ->
            val isSelected = selectedTab == tab.id

            Row(
                modifier = Modifier
                    .let { if (fullWidth) it.weight(1f) else it }
                    .clip(RoundedCornerShape(8.dp))
                    .background(
                        if (isSelected)
                            MaterialTheme.colorScheme.surface
                        else
                            Color.Transparent
                    )
                    .clickable(enabled = !tab.disabled) { onTabSelected(tab.id) }
                    .padding(
                        horizontal = size.paddingHorizontal.dp,
                        vertical = size.paddingVertical.dp
                    )
                    .alpha(if (tab.disabled) 0.5f else 1f),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.Center
            ) {
                tab.icon?.invoke()
                if (tab.icon != null) Spacer(modifier = Modifier.width(6.dp))
                Text(
                    text = tab.label,
                    fontSize = size.fontSize.sp,
                    fontWeight = FontWeight.Medium,
                    color = if (isSelected)
                        MaterialTheme.colorScheme.onSurface
                    else
                        MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        }
    }
}

@Composable
private fun SegmentedTabs(
    selectedTab: String,
    onTabSelected: (String) -> Unit,
    tabs: List<TabItem>
) {
    // Use Material 3 SegmentedButton when available
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(8.dp))
            .background(MaterialTheme.colorScheme.surfaceVariant)
            .padding(4.dp)
    ) {
        tabs.forEachIndexed { index, tab ->
            val isSelected = selectedTab == tab.id

            Box(
                modifier = Modifier
                    .weight(1f)
                    .clip(RoundedCornerShape(6.dp))
                    .background(
                        if (isSelected)
                            MaterialTheme.colorScheme.surface
                        else
                            Color.Transparent
                    )
                    .clickable(enabled = !tab.disabled) { onTabSelected(tab.id) }
                    .padding(vertical = 8.dp)
                    .alpha(if (tab.disabled) 0.5f else 1f),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = tab.label,
                    fontSize = 14.sp,
                    fontWeight = if (isSelected) FontWeight.SemiBold else FontWeight.Medium,
                    color = if (isSelected)
                        MaterialTheme.colorScheme.onSurface
                    else
                        MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        }
    }
}

private fun Modifier.alpha(alpha: Float): Modifier = this.then(
    Modifier.graphicsLayer(alpha = alpha)
)

private fun Modifier.graphicsLayer(alpha: Float): Modifier {
    return this
}

// Simple tabs without content
@Composable
fun TabBar(
    selectedTab: String,
    onTabSelected: (String) -> Unit,
    tabs: List<TabItem>,
    modifier: Modifier = Modifier,
    variant: TabVariant = TabVariant.UNDERLINE,
    size: TabSize = TabSize.MD,
    fullWidth: Boolean = false
) {
    when (variant) {
        TabVariant.UNDERLINE -> UnderlineTabs(selectedTab, onTabSelected, tabs, size, fullWidth)
        TabVariant.PILLS -> PillsTabs(selectedTab, onTabSelected, tabs, size)
        TabVariant.BOXED -> BoxedTabs(selectedTab, onTabSelected, tabs, size, fullWidth)
        TabVariant.SEGMENTED -> SegmentedTabs(selectedTab, onTabSelected, tabs)
    }
}
`
    }
  }
}
