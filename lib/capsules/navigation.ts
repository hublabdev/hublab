/**
 * Navigation Capsule - Multi-Platform
 *
 * Navigation components including Tab Bar, Stack Navigation, and Drawer.
 */

import { CapsuleDefinition } from './types'

export const NavigationCapsule: CapsuleDefinition = {
  id: 'navigation',
  name: 'Navigation',
  description: 'Navigation components: Tab Bar, Stack, and Drawer',
  category: 'navigation',
  tags: ['navigation', 'tabs', 'router', 'menu', 'drawer'],
  version: '1.0.0',

  props: [
    {
      name: 'type',
      type: 'select',
      required: true,
      options: ['tabs', 'stack', 'drawer'],
      description: 'Navigation type'
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      description: 'Navigation items with label, icon, and route'
    },
    {
      name: 'activeIndex',
      type: 'number',
      required: false,
      default: 0,
      description: 'Currently active tab/item index'
    },
    {
      name: 'onChange',
      type: 'action',
      required: true,
      description: 'Callback when navigation changes'
    },
    {
      name: 'position',
      type: 'select',
      required: false,
      default: 'bottom',
      options: ['top', 'bottom'],
      description: 'Tab bar position (tabs only)'
    },
    {
      name: 'showLabels',
      type: 'boolean',
      required: false,
      default: true,
      description: 'Show text labels'
    }
  ],

  platforms: {
    web: {
      framework: 'react',
      typescript: true,
      dependencies: ['react'],
      code: `
import React, { useState, createContext, useContext } from 'react'

// Types
interface NavItem {
  id: string
  label: string
  icon?: React.ReactNode
  badge?: number | string
}

// Tab Bar Navigation
interface TabBarProps {
  items: NavItem[]
  activeIndex: number
  onChange: (index: number) => void
  position?: 'top' | 'bottom'
  showLabels?: boolean
}

export function TabBar({
  items,
  activeIndex,
  onChange,
  position = 'bottom',
  showLabels = true
}: TabBarProps) {
  return (
    <nav className={\`
      flex justify-around items-center
      bg-white border-gray-200
      \${position === 'bottom' ? 'border-t fixed bottom-0 left-0 right-0 pb-safe' : 'border-b'}
    \`}>
      {items.map((item, index) => (
        <button
          key={item.id}
          onClick={() => onChange(index)}
          className={\`
            flex flex-col items-center justify-center
            py-2 px-4 min-w-[64px] relative
            transition-colors duration-200
            \${activeIndex === index
              ? 'text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
            }
          \`}
        >
          {/* Badge */}
          {item.badge !== undefined && (
            <span className="absolute -top-1 right-2 min-w-[18px] h-[18px] px-1 flex items-center justify-center bg-red-500 text-white text-xs font-bold rounded-full">
              {item.badge}
            </span>
          )}

          {/* Icon */}
          {item.icon && (
            <span className={\`text-2xl \${activeIndex === index ? 'scale-110' : ''} transition-transform\`}>
              {item.icon}
            </span>
          )}

          {/* Label */}
          {showLabels && (
            <span className={\`text-xs mt-1 font-medium \${activeIndex === index ? 'font-semibold' : ''}\`}>
              {item.label}
            </span>
          )}

          {/* Active indicator */}
          {activeIndex === index && position === 'top' && (
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-blue-600 rounded-full" />
          )}
        </button>
      ))}
    </nav>
  )
}

// Stack Navigation Header
interface StackHeaderProps {
  title: string
  showBackButton?: boolean
  onBack?: () => void
  rightAction?: React.ReactNode
}

export function StackHeader({
  title,
  showBackButton = false,
  onBack,
  rightAction
}: StackHeaderProps) {
  return (
    <header className="flex items-center justify-between h-14 px-4 bg-white border-b border-gray-200">
      <div className="w-16">
        {showBackButton && (
          <button
            onClick={onBack}
            className="flex items-center text-blue-600 hover:text-blue-700"
          >
            <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        )}
      </div>

      <h1 className="text-lg font-semibold text-gray-900 truncate">
        {title}
      </h1>

      <div className="w-16 flex justify-end">
        {rightAction}
      </div>
    </header>
  )
}

// Drawer Navigation
interface DrawerProps {
  isOpen: boolean
  onClose: () => void
  items: NavItem[]
  activeIndex: number
  onChange: (index: number) => void
  header?: React.ReactNode
}

export function Drawer({
  isOpen,
  onClose,
  items,
  activeIndex,
  onChange,
  header
}: DrawerProps) {
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <aside className={\`
        fixed top-0 left-0 h-full w-72 bg-white z-50
        transform transition-transform duration-300 ease-out
        \${isOpen ? 'translate-x-0' : '-translate-x-full'}
        shadow-xl
      \`}>
        {/* Header */}
        {header && (
          <div className="p-4 border-b border-gray-200">
            {header}
          </div>
        )}

        {/* Navigation Items */}
        <nav className="py-2">
          {items.map((item, index) => (
            <button
              key={item.id}
              onClick={() => {
                onChange(index)
                onClose()
              }}
              className={\`
                w-full flex items-center gap-3 px-4 py-3
                transition-colors duration-150
                \${activeIndex === index
                  ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600'
                  : 'text-gray-700 hover:bg-gray-50'
                }
              \`}
            >
              {item.icon && (
                <span className="text-xl">{item.icon}</span>
              )}
              <span className="font-medium">{item.label}</span>
              {item.badge !== undefined && (
                <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>
      </aside>
    </>
  )
}

// Navigation Context for managing state
interface NavigationContextValue {
  currentRoute: string
  navigate: (route: string) => void
  goBack: () => void
  canGoBack: boolean
}

const NavigationContext = createContext<NavigationContextValue | null>(null)

export function useNavigation() {
  const context = useContext(NavigationContext)
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider')
  }
  return context
}

interface NavigationProviderProps {
  initialRoute: string
  children: React.ReactNode
}

export function NavigationProvider({ initialRoute, children }: NavigationProviderProps) {
  const [history, setHistory] = useState<string[]>([initialRoute])
  const currentRoute = history[history.length - 1]

  const navigate = (route: string) => {
    setHistory(prev => [...prev, route])
  }

  const goBack = () => {
    if (history.length > 1) {
      setHistory(prev => prev.slice(0, -1))
    }
  }

  return (
    <NavigationContext.Provider value={{
      currentRoute,
      navigate,
      goBack,
      canGoBack: history.length > 1
    }}>
      {children}
    </NavigationContext.Provider>
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

// MARK: - Navigation Item
struct NavItem: Identifiable {
    let id: String
    let label: String
    let systemIcon: String
    var badge: Int? = nil
}

// MARK: - Tab Bar Navigation
struct HubLabTabBar: View {
    let items: [NavItem]
    @Binding var selectedIndex: Int
    var showLabels: Bool = true

    var body: some View {
        HStack(spacing: 0) {
            ForEach(Array(items.enumerated()), id: \\.element.id) { index, item in
                Button(action: {
                    withAnimation(.spring(response: 0.3)) {
                        selectedIndex = index
                    }
                }) {
                    VStack(spacing: 4) {
                        ZStack(alignment: .topTrailing) {
                            Image(systemName: item.systemIcon)
                                .font(.system(size: 22))
                                .scaleEffect(selectedIndex == index ? 1.1 : 1.0)

                            if let badge = item.badge, badge > 0 {
                                Text(badge > 99 ? "99+" : "\\(badge)")
                                    .font(.system(size: 10, weight: .bold))
                                    .foregroundColor(.white)
                                    .padding(.horizontal, 4)
                                    .padding(.vertical, 2)
                                    .background(Color.red)
                                    .clipShape(Capsule())
                                    .offset(x: 10, y: -8)
                            }
                        }

                        if showLabels {
                            Text(item.label)
                                .font(.system(size: 10, weight: selectedIndex == index ? .semibold : .regular))
                        }
                    }
                    .foregroundColor(selectedIndex == index ? .blue : .gray)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 8)
                }
            }
        }
        .background(Color(.systemBackground))
        .overlay(
            Rectangle()
                .fill(Color(.separator))
                .frame(height: 0.5),
            alignment: .top
        )
    }
}

// MARK: - Tab View Container
struct HubLabTabView<Content: View>: View {
    let items: [NavItem]
    @Binding var selectedIndex: Int
    @ViewBuilder let content: (Int) -> Content

    var body: some View {
        VStack(spacing: 0) {
            content(selectedIndex)
                .frame(maxWidth: .infinity, maxHeight: .infinity)

            HubLabTabBar(items: items, selectedIndex: $selectedIndex)
        }
    }
}

// MARK: - Stack Navigation
struct HubLabNavigationStack<Content: View>: View {
    let title: String
    var showBackButton: Bool = false
    var onBack: (() -> Void)? = nil
    var trailingContent: AnyView? = nil
    @ViewBuilder let content: () -> Content

    var body: some View {
        NavigationView {
            content()
                .navigationTitle(title)
                .navigationBarTitleDisplayMode(.inline)
                .toolbar {
                    if showBackButton {
                        ToolbarItem(placement: .navigationBarLeading) {
                            Button(action: { onBack?() }) {
                                HStack(spacing: 4) {
                                    Image(systemName: "chevron.left")
                                    Text("Back")
                                }
                            }
                        }
                    }

                    if let trailing = trailingContent {
                        ToolbarItem(placement: .navigationBarTrailing) {
                            trailing
                        }
                    }
                }
        }
    }
}

// MARK: - Drawer / Side Menu
struct HubLabDrawer<Content: View, Menu: View>: View {
    @Binding var isOpen: Bool
    let items: [NavItem]
    @Binding var selectedIndex: Int
    @ViewBuilder let content: () -> Content
    @ViewBuilder let menuHeader: () -> Menu

    private let drawerWidth: CGFloat = 280

    var body: some View {
        ZStack(alignment: .leading) {
            // Main Content
            content()
                .frame(maxWidth: .infinity, maxHeight: .infinity)
                .offset(x: isOpen ? drawerWidth : 0)
                .disabled(isOpen)

            // Backdrop
            if isOpen {
                Color.black.opacity(0.4)
                    .ignoresSafeArea()
                    .offset(x: drawerWidth)
                    .onTapGesture {
                        withAnimation(.easeOut(duration: 0.25)) {
                            isOpen = false
                        }
                    }
            }

            // Drawer
            HStack(spacing: 0) {
                VStack(alignment: .leading, spacing: 0) {
                    // Header
                    menuHeader()
                        .padding()
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .background(Color(.secondarySystemBackground))

                    // Menu Items
                    ScrollView {
                        VStack(spacing: 0) {
                            ForEach(Array(items.enumerated()), id: \\.element.id) { index, item in
                                Button(action: {
                                    selectedIndex = index
                                    withAnimation(.easeOut(duration: 0.25)) {
                                        isOpen = false
                                    }
                                }) {
                                    HStack(spacing: 12) {
                                        Image(systemName: item.systemIcon)
                                            .font(.system(size: 20))
                                            .frame(width: 24)

                                        Text(item.label)
                                            .font(.body)

                                        Spacer()

                                        if let badge = item.badge, badge > 0 {
                                            Text("\\(badge)")
                                                .font(.caption)
                                                .foregroundColor(.white)
                                                .padding(.horizontal, 8)
                                                .padding(.vertical, 2)
                                                .background(Color.red)
                                                .clipShape(Capsule())
                                        }
                                    }
                                    .padding(.horizontal, 16)
                                    .padding(.vertical, 12)
                                    .foregroundColor(selectedIndex == index ? .blue : .primary)
                                    .background(
                                        selectedIndex == index
                                            ? Color.blue.opacity(0.1)
                                            : Color.clear
                                    )
                                }
                            }
                        }
                    }
                }
                .frame(width: drawerWidth)
                .background(Color(.systemBackground))
                .offset(x: isOpen ? 0 : -drawerWidth)

                Spacer()
            }
        }
        .animation(.easeOut(duration: 0.25), value: isOpen)
        .gesture(
            DragGesture()
                .onEnded { value in
                    if value.translation.width < -50 {
                        withAnimation(.easeOut(duration: 0.25)) {
                            isOpen = false
                        }
                    }
                }
        )
    }
}

// MARK: - Preview
#Preview("Tab Bar") {
    struct TabBarDemo: View {
        @State var selectedTab = 0

        let tabs = [
            NavItem(id: "home", label: "Home", systemIcon: "house.fill"),
            NavItem(id: "search", label: "Search", systemIcon: "magnifyingglass"),
            NavItem(id: "notifications", label: "Alerts", systemIcon: "bell.fill", badge: 5),
            NavItem(id: "profile", label: "Profile", systemIcon: "person.fill")
        ]

        var body: some View {
            HubLabTabView(items: tabs, selectedIndex: $selectedTab) { index in
                VStack {
                    Text("Tab \\(index + 1)")
                        .font(.largeTitle)
                    Text(tabs[index].label)
                        .foregroundColor(.secondary)
                }
            }
        }
    }
    return TabBarDemo()
}

#Preview("Drawer Menu") {
    struct DrawerDemo: View {
        @State var isOpen = true
        @State var selectedIndex = 0

        let menuItems = [
            NavItem(id: "home", label: "Home", systemIcon: "house"),
            NavItem(id: "settings", label: "Settings", systemIcon: "gear"),
            NavItem(id: "help", label: "Help", systemIcon: "questionmark.circle")
        ]

        var body: some View {
            HubLabDrawer(
                isOpen: $isOpen,
                items: menuItems,
                selectedIndex: $selectedIndex
            ) {
                VStack {
                    Button("Open Menu") {
                        isOpen = true
                    }
                    Text("Selected: \\(menuItems[selectedIndex].label)")
                }
            } menuHeader: {
                VStack(alignment: .leading) {
                    Image(systemName: "person.circle.fill")
                        .font(.system(size: 50))
                    Text("John Doe")
                        .font(.headline)
                    Text("john@example.com")
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
            }
        }
    }
    return DrawerDemo()
}
`
    },

    android: {
      framework: 'compose',
      minSdk: 24,
      dependencies: [
        'androidx.compose.material3:material3',
        'androidx.navigation:navigation-compose'
      ],
      imports: [
        'androidx.compose.material3.*',
        'androidx.compose.foundation.layout.*',
        'androidx.compose.runtime.*',
        'androidx.compose.ui.*',
        'androidx.navigation.compose.*'
      ],
      code: `
package com.hublab.components

import androidx.compose.animation.*
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import kotlinx.coroutines.launch

// Navigation Item
data class NavItem(
    val id: String,
    val label: String,
    val icon: ImageVector,
    val badge: Int? = null
)

// Tab Bar Navigation
@Composable
fun HubLabTabBar(
    items: List<NavItem>,
    selectedIndex: Int,
    onSelect: (Int) -> Unit,
    modifier: Modifier = Modifier,
    showLabels: Boolean = true
) {
    NavigationBar(
        modifier = modifier,
        containerColor = MaterialTheme.colorScheme.surface
    ) {
        items.forEachIndexed { index, item ->
            NavigationBarItem(
                selected = selectedIndex == index,
                onClick = { onSelect(index) },
                icon = {
                    BadgedBox(
                        badge = {
                            if (item.badge != null && item.badge > 0) {
                                Badge {
                                    Text(
                                        text = if (item.badge > 99) "99+" else item.badge.toString()
                                    )
                                }
                            }
                        }
                    ) {
                        Icon(
                            imageVector = item.icon,
                            contentDescription = item.label
                        )
                    }
                },
                label = if (showLabels) {
                    { Text(item.label) }
                } else null
            )
        }
    }
}

// Tab View Container
@Composable
fun HubLabTabView(
    items: List<NavItem>,
    selectedIndex: Int,
    onSelect: (Int) -> Unit,
    modifier: Modifier = Modifier,
    content: @Composable (Int) -> Unit
) {
    Scaffold(
        modifier = modifier,
        bottomBar = {
            HubLabTabBar(
                items = items,
                selectedIndex = selectedIndex,
                onSelect = onSelect
            )
        }
    ) { padding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
        ) {
            content(selectedIndex)
        }
    }
}

// Stack Navigation Header
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HubLabStackHeader(
    title: String,
    showBackButton: Boolean = false,
    onBack: () -> Unit = {},
    actions: @Composable RowScope.() -> Unit = {}
) {
    TopAppBar(
        title = { Text(title) },
        navigationIcon = {
            if (showBackButton) {
                IconButton(onClick = onBack) {
                    Icon(
                        imageVector = Icons.Default.ArrowBack,
                        contentDescription = "Back"
                    )
                }
            }
        },
        actions = actions
    )
}

// Drawer Navigation
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HubLabDrawer(
    items: List<NavItem>,
    selectedIndex: Int,
    onSelect: (Int) -> Unit,
    isOpen: Boolean,
    onClose: () -> Unit,
    modifier: Modifier = Modifier,
    header: @Composable () -> Unit = {},
    content: @Composable () -> Unit
) {
    val drawerState = rememberDrawerState(
        initialValue = if (isOpen) DrawerValue.Open else DrawerValue.Closed
    )
    val scope = rememberCoroutineScope()

    LaunchedEffect(isOpen) {
        if (isOpen) {
            drawerState.open()
        } else {
            drawerState.close()
        }
    }

    LaunchedEffect(drawerState.currentValue) {
        if (drawerState.currentValue == DrawerValue.Closed) {
            onClose()
        }
    }

    ModalNavigationDrawer(
        drawerState = drawerState,
        modifier = modifier,
        drawerContent = {
            ModalDrawerSheet {
                // Header
                header()

                HorizontalDivider(modifier = Modifier.padding(vertical = 8.dp))

                // Menu Items
                items.forEachIndexed { index, item ->
                    NavigationDrawerItem(
                        icon = {
                            Icon(imageVector = item.icon, contentDescription = null)
                        },
                        label = { Text(item.label) },
                        badge = if (item.badge != null && item.badge > 0) {
                            {
                                Badge {
                                    Text(item.badge.toString())
                                }
                            }
                        } else null,
                        selected = selectedIndex == index,
                        onClick = {
                            onSelect(index)
                            scope.launch {
                                drawerState.close()
                            }
                        },
                        modifier = Modifier.padding(horizontal = 12.dp)
                    )
                }
            }
        }
    ) {
        content()
    }
}

// Navigation Rail (for tablets/large screens)
@Composable
fun HubLabNavigationRail(
    items: List<NavItem>,
    selectedIndex: Int,
    onSelect: (Int) -> Unit,
    modifier: Modifier = Modifier,
    header: @Composable (() -> Unit)? = null
) {
    NavigationRail(
        modifier = modifier,
        header = header
    ) {
        items.forEachIndexed { index, item ->
            NavigationRailItem(
                selected = selectedIndex == index,
                onClick = { onSelect(index) },
                icon = {
                    BadgedBox(
                        badge = {
                            if (item.badge != null && item.badge > 0) {
                                Badge { Text(item.badge.toString()) }
                            }
                        }
                    ) {
                        Icon(imageVector = item.icon, contentDescription = item.label)
                    }
                },
                label = { Text(item.label) }
            )
        }
    }
}

@Preview(showBackground = true)
@Composable
fun HubLabTabBarPreview() {
    var selectedIndex by remember { mutableStateOf(0) }

    val items = listOf(
        NavItem("home", "Home", Icons.Default.Home),
        NavItem("search", "Search", Icons.Default.Search),
        NavItem("notifications", "Alerts", Icons.Default.Notifications, badge = 5),
        NavItem("profile", "Profile", Icons.Default.Person)
    )

    MaterialTheme {
        HubLabTabView(
            items = items,
            selectedIndex = selectedIndex,
            onSelect = { selectedIndex = it }
        ) { index ->
            Box(
                modifier = Modifier.fillMaxSize(),
                contentAlignment = Alignment.Center
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Text(
                        text = "Tab \${index + 1}",
                        style = MaterialTheme.typography.headlineMedium
                    )
                    Text(
                        text = items[index].label,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }
        }
    }
}

@Preview(showBackground = true)
@Composable
fun HubLabDrawerPreview() {
    var selectedIndex by remember { mutableStateOf(0) }
    var isOpen by remember { mutableStateOf(true) }

    val items = listOf(
        NavItem("home", "Home", Icons.Default.Home),
        NavItem("settings", "Settings", Icons.Default.Settings),
        NavItem("help", "Help", Icons.Default.Info)
    )

    MaterialTheme {
        HubLabDrawer(
            items = items,
            selectedIndex = selectedIndex,
            onSelect = { selectedIndex = it },
            isOpen = isOpen,
            onClose = { isOpen = false },
            header = {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp)
                ) {
                    Icon(
                        imageVector = Icons.Default.AccountCircle,
                        contentDescription = null,
                        modifier = Modifier.size(64.dp)
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    Text("John Doe", style = MaterialTheme.typography.titleMedium)
                    Text(
                        "john@example.com",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }
        ) {
            Column(
                modifier = Modifier.fillMaxSize(),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.Center
            ) {
                Button(onClick = { isOpen = true }) {
                    Text("Open Drawer")
                }
                Text("Selected: \${items[selectedIndex].label}")
            }
        }
    }
}
`
    }
  },

  children: true,
  slots: ['content'],
  preview: '/previews/navigation.png'
}
