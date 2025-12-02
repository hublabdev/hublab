/**
 * WebView Capsule - Embedded Browser
 *
 * Cross-platform embedded browser with navigation controls,
 * JavaScript injection, and communication bridge.
 */

import type { CapsuleDefinition } from './types'

export const WebViewCapsule: CapsuleDefinition = {
  id: 'webview',
  name: 'WebView',
  description: 'Embedded browser with navigation, JavaScript injection, and communication bridge',
  category: 'device',
  tags: ['webview', 'browser', 'embed', 'iframe', 'web'],
  version: '1.0.0',

  props: {
    source: {
      type: 'string',
      required: true,
      description: 'URL to load or HTML content',
    },
    sourceType: {
      type: 'string',
      default: 'url',
      description: 'Source type: url, html',
    },
    showToolbar: {
      type: 'boolean',
      default: true,
      description: 'Show navigation toolbar',
    },
    showAddressBar: {
      type: 'boolean',
      default: false,
      description: 'Show editable address bar',
    },
    allowNavigation: {
      type: 'boolean',
      default: true,
      description: 'Allow navigation to other URLs',
    },
    allowBackForward: {
      type: 'boolean',
      default: true,
      description: 'Allow back/forward navigation',
    },
    allowZoom: {
      type: 'boolean',
      default: true,
      description: 'Allow pinch-to-zoom',
    },
    allowFileAccess: {
      type: 'boolean',
      default: false,
      description: 'Allow access to local files',
    },
    javaScriptEnabled: {
      type: 'boolean',
      default: true,
      description: 'Enable JavaScript execution',
    },
    domStorageEnabled: {
      type: 'boolean',
      default: true,
      description: 'Enable DOM storage (localStorage)',
    },
    mediaPlaybackRequiresUserAction: {
      type: 'boolean',
      default: true,
      description: 'Require user action for media playback',
    },
    userAgent: {
      type: 'string',
      description: 'Custom user agent string',
    },
    injectedJavaScript: {
      type: 'string',
      description: 'JavaScript to inject after page load',
    },
    allowedHosts: {
      type: 'array',
      description: 'Whitelist of allowed hosts',
    },
    blockedHosts: {
      type: 'array',
      description: 'Blacklist of blocked hosts',
    },
    onLoadStart: {
      type: 'function',
      description: 'Callback when loading starts',
    },
    onLoadEnd: {
      type: 'function',
      description: 'Callback when loading completes',
    },
    onLoadError: {
      type: 'function',
      description: 'Callback when loading fails',
    },
    onNavigationStateChange: {
      type: 'function',
      description: 'Callback when navigation state changes',
    },
    onMessage: {
      type: 'function',
      description: 'Callback for messages from web content',
    },
  },

  platforms: {
    web: {
      dependencies: ['react', 'tailwindcss'],
      components: {
        // Full WebView with toolbar
        WebView: `
import React, { useRef, useState, useCallback, useEffect, forwardRef, useImperativeHandle } from 'react';

interface WebViewProps {
  source: string;
  sourceType?: 'url' | 'html';
  showToolbar?: boolean;
  showAddressBar?: boolean;
  allowNavigation?: boolean;
  allowBackForward?: boolean;
  javaScriptEnabled?: boolean;
  allowedHosts?: string[];
  blockedHosts?: string[];
  injectedJavaScript?: string;
  onLoadStart?: (url: string) => void;
  onLoadEnd?: (url: string) => void;
  onLoadError?: (error: Error) => void;
  onNavigationStateChange?: (state: NavigationState) => void;
  onMessage?: (message: unknown) => void;
  className?: string;
}

interface NavigationState {
  url: string;
  title: string;
  loading: boolean;
  canGoBack: boolean;
  canGoForward: boolean;
}

export interface WebViewRef {
  reload: () => void;
  goBack: () => void;
  goForward: () => void;
  stopLoading: () => void;
  injectJavaScript: (script: string) => void;
  postMessage: (message: unknown) => void;
}

export const WebView = forwardRef<WebViewRef, WebViewProps>(({
  source,
  sourceType = 'url',
  showToolbar = true,
  showAddressBar = false,
  allowNavigation = true,
  allowBackForward = true,
  javaScriptEnabled = true,
  allowedHosts = [],
  blockedHosts = [],
  injectedJavaScript,
  onLoadStart,
  onLoadEnd,
  onLoadError,
  onNavigationStateChange,
  onMessage,
  className = '',
}, ref) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [currentUrl, setCurrentUrl] = useState(sourceType === 'url' ? source : '');
  const [inputUrl, setInputUrl] = useState(sourceType === 'url' ? source : '');
  const [isLoading, setIsLoading] = useState(true);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [title, setTitle] = useState('');

  // Check if URL is allowed
  const isUrlAllowed = useCallback((url: string): boolean => {
    try {
      const urlObj = new URL(url);
      const host = urlObj.hostname;

      if (blockedHosts.length > 0 && blockedHosts.some(h => host.includes(h))) {
        return false;
      }

      if (allowedHosts.length > 0 && !allowedHosts.some(h => host.includes(h))) {
        return false;
      }

      return true;
    } catch {
      return false;
    }
  }, [allowedHosts, blockedHosts]);

  // Navigate to URL
  const navigateTo = useCallback((url: string) => {
    if (!allowNavigation) return;

    if (!isUrlAllowed(url)) {
      onLoadError?.(new Error(\`Navigation to \${url} is not allowed\`));
      return;
    }

    setCurrentUrl(url);
    setInputUrl(url);
    setHistory(prev => [...prev.slice(0, historyIndex + 1), url]);
    setHistoryIndex(prev => prev + 1);
  }, [allowNavigation, isUrlAllowed, historyIndex, onLoadError]);

  // Imperative handle
  useImperativeHandle(ref, () => ({
    reload: () => {
      if (iframeRef.current) {
        iframeRef.current.src = currentUrl;
      }
    },
    goBack: () => {
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCurrentUrl(history[newIndex]);
        setInputUrl(history[newIndex]);
      }
    },
    goForward: () => {
      if (historyIndex < history.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setCurrentUrl(history[newIndex]);
        setInputUrl(history[newIndex]);
      }
    },
    stopLoading: () => {
      if (iframeRef.current) {
        iframeRef.current.src = 'about:blank';
      }
    },
    injectJavaScript: (script: string) => {
      if (iframeRef.current?.contentWindow) {
        try {
          iframeRef.current.contentWindow.postMessage({
            type: '__WEBVIEW_INJECT__',
            script,
          }, '*');
        } catch (e) {
          console.warn('Cannot inject JavaScript:', e);
        }
      }
    },
    postMessage: (message: unknown) => {
      if (iframeRef.current?.contentWindow) {
        iframeRef.current.contentWindow.postMessage(message, '*');
      }
    },
  }), [currentUrl, history, historyIndex]);

  // Handle iframe load
  const handleLoad = useCallback(() => {
    setIsLoading(false);
    onLoadEnd?.(currentUrl);

    // Try to get title
    try {
      const iframeTitle = iframeRef.current?.contentDocument?.title || '';
      setTitle(iframeTitle);
    } catch {
      // Cross-origin restriction
    }

    // Update navigation state
    onNavigationStateChange?.({
      url: currentUrl,
      title,
      loading: false,
      canGoBack: historyIndex > 0,
      canGoForward: historyIndex < history.length - 1,
    });

    // Inject JavaScript
    if (injectedJavaScript && iframeRef.current?.contentWindow) {
      try {
        iframeRef.current.contentWindow.postMessage({
          type: '__WEBVIEW_INJECT__',
          script: injectedJavaScript,
        }, '*');
      } catch {
        // Cross-origin restriction
      }
    }
  }, [currentUrl, title, historyIndex, history, onLoadEnd, onNavigationStateChange, injectedJavaScript]);

  // Listen for messages from iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.source === iframeRef.current?.contentWindow) {
        onMessage?.(event.data);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onMessage]);

  // Handle URL form submit
  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let url = inputUrl.trim();

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    navigateTo(url);
  };

  // Initialize history
  useEffect(() => {
    if (sourceType === 'url' && source) {
      setHistory([source]);
      setHistoryIndex(0);
      onLoadStart?.(source);
    }
  }, []);

  const canGoBack = allowBackForward && historyIndex > 0;
  const canGoForward = allowBackForward && historyIndex < history.length - 1;

  return (
    <div className={\`flex flex-col bg-white dark:bg-gray-900 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 \${className}\`}>
      {/* Toolbar */}
      {showToolbar && (
        <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          {/* Navigation buttons */}
          {allowBackForward && (
            <>
              <button
                onClick={() => {
                  if (canGoBack) {
                    const newIndex = historyIndex - 1;
                    setHistoryIndex(newIndex);
                    setCurrentUrl(history[newIndex]);
                    setInputUrl(history[newIndex]);
                  }
                }}
                disabled={!canGoBack}
                className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                onClick={() => {
                  if (canGoForward) {
                    const newIndex = historyIndex + 1;
                    setHistoryIndex(newIndex);
                    setCurrentUrl(history[newIndex]);
                    setInputUrl(history[newIndex]);
                  }
                }}
                disabled={!canGoForward}
                className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Reload/Stop */}
          <button
            onClick={() => {
              if (isLoading) {
                if (iframeRef.current) iframeRef.current.src = 'about:blank';
              } else {
                if (iframeRef.current) iframeRef.current.src = currentUrl;
              }
            }}
            className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            {isLoading ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            )}
          </button>

          {/* Address bar or title */}
          {showAddressBar ? (
            <form onSubmit={handleUrlSubmit} className="flex-1">
              <input
                type="text"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                className="w-full px-3 py-1.5 text-sm bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter URL..."
              />
            </form>
          ) : (
            <div className="flex-1 px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 truncate">
              {title || currentUrl}
            </div>
          )}

          {/* Loading indicator */}
          {isLoading && (
            <div className="w-5 h-5 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
          )}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 relative">
        {sourceType === 'html' ? (
          <iframe
            ref={iframeRef}
            srcDoc={source}
            sandbox={\`allow-scripts \${javaScriptEnabled ? '' : 'allow-scripts'} allow-same-origin allow-forms allow-popups\`}
            className="w-full h-full border-0"
            onLoad={handleLoad}
          />
        ) : (
          <iframe
            ref={iframeRef}
            src={currentUrl}
            sandbox={\`allow-scripts allow-same-origin allow-forms allow-popups\`}
            className="w-full h-full border-0"
            onLoad={handleLoad}
            onError={() => onLoadError?.(new Error('Failed to load page'))}
          />
        )}

        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Loading...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

WebView.displayName = 'WebView';
`,

        // Simple iframe embed
        IframeEmbed: `
import React from 'react';

interface IframeEmbedProps {
  src: string;
  title?: string;
  width?: string | number;
  height?: string | number;
  allowFullScreen?: boolean;
  loading?: 'lazy' | 'eager';
  className?: string;
}

export const IframeEmbed: React.FC<IframeEmbedProps> = ({
  src,
  title = 'Embedded content',
  width = '100%',
  height = '400px',
  allowFullScreen = true,
  loading = 'lazy',
  className = '',
}) => {
  return (
    <div className={\`rounded-lg overflow-hidden border border-gray-200 \${className}\`}>
      <iframe
        src={src}
        title={title}
        width={width}
        height={height}
        allowFullScreen={allowFullScreen}
        loading={loading}
        className="border-0"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
      />
    </div>
  );
};
`,

        // Browser Window Frame
        BrowserFrame: `
import React from 'react';

interface BrowserFrameProps {
  url?: string;
  title?: string;
  children: React.ReactNode;
  variant?: 'macos' | 'windows' | 'minimal';
  showAddressBar?: boolean;
  className?: string;
}

export const BrowserFrame: React.FC<BrowserFrameProps> = ({
  url,
  title,
  children,
  variant = 'macos',
  showAddressBar = true,
  className = '',
}) => {
  return (
    <div className={\`rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shadow-lg \${className}\`}>
      {/* Title bar */}
      <div className={\`
        flex items-center gap-2 px-4 py-2
        \${variant === 'macos' ? 'bg-gray-100 dark:bg-gray-800' : ''}
        \${variant === 'windows' ? 'bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700' : ''}
        \${variant === 'minimal' ? 'bg-gray-50 dark:bg-gray-800' : ''}
      \`}>
        {/* Window controls */}
        {variant === 'macos' && (
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
        )}

        {variant === 'windows' && (
          <div className="flex gap-1 order-last ml-auto">
            <div className="w-8 h-6 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </div>
            <div className="w-8 h-6 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </div>
            <div className="w-8 h-6 hover:bg-red-500 hover:text-white flex items-center justify-center">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
        )}

        {/* Title/URL */}
        <div className={\`flex-1 \${variant === 'macos' ? 'text-center' : ''}\`}>
          {showAddressBar && url ? (
            <div className={\`
              flex items-center gap-2 px-3 py-1 rounded-md text-sm
              \${variant === 'macos' ? 'bg-white dark:bg-gray-700 mx-auto max-w-md' : ''}
              \${variant === 'windows' ? 'bg-gray-100 dark:bg-gray-800 flex-1' : ''}
              \${variant === 'minimal' ? 'text-gray-500' : ''}
            \`}>
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className="text-gray-600 dark:text-gray-300 truncate">{url}</span>
            </div>
          ) : (
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{title}</span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-gray-900">
        {children}
      </div>
    </div>
  );
};
`,
      },
    },

    ios: {
      dependencies: ['SwiftUI', 'WebKit'],
      minimumVersion: '15.0',
      components: {
        // Native WebView
        WebViewComponent: `
import SwiftUI
import WebKit

// MARK: - WebView Configuration
struct WebViewConfig {
    var javaScriptEnabled: Bool = true
    var domStorageEnabled: Bool = true
    var allowsBackForwardGestures: Bool = true
    var mediaPlaybackRequiresUserAction: Bool = true
    var userAgent: String?
    var injectedJavaScript: String?
    var allowedHosts: [String] = []
    var blockedHosts: [String] = []
}

// MARK: - Navigation State
struct WebViewNavigationState {
    var url: URL?
    var title: String?
    var loading: Bool
    var canGoBack: Bool
    var canGoForward: Bool
    var estimatedProgress: Double
}

// MARK: - WebView Coordinator
class WebViewCoordinator: NSObject, WKNavigationDelegate, WKScriptMessageHandler {
    var parent: WebViewRepresentable
    var config: WebViewConfig

    init(_ parent: WebViewRepresentable, config: WebViewConfig) {
        self.parent = parent
        self.config = config
    }

    // Navigation delegate
    func webView(_ webView: WKWebView, didStartProvisionalNavigation navigation: WKNavigation!) {
        parent.onLoadStart?(webView.url)
        updateState(webView)
    }

    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        parent.onLoadEnd?(webView.url)
        updateState(webView)

        // Inject JavaScript
        if let script = config.injectedJavaScript {
            webView.evaluateJavaScript(script) { _, error in
                if let error = error {
                    print("JS injection error: \\(error)")
                }
            }
        }
    }

    func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
        parent.onLoadError?(error)
        updateState(webView)
    }

    func webView(
        _ webView: WKWebView,
        decidePolicyFor navigationAction: WKNavigationAction,
        decisionHandler: @escaping (WKNavigationActionPolicy) -> Void
    ) {
        guard let url = navigationAction.request.url,
              let host = url.host else {
            decisionHandler(.allow)
            return
        }

        // Check blocked hosts
        if !config.blockedHosts.isEmpty {
            if config.blockedHosts.contains(where: { host.contains($0) }) {
                decisionHandler(.cancel)
                return
            }
        }

        // Check allowed hosts
        if !config.allowedHosts.isEmpty {
            if !config.allowedHosts.contains(where: { host.contains($0) }) {
                decisionHandler(.cancel)
                return
            }
        }

        decisionHandler(.allow)
    }

    // Script message handler
    func userContentController(
        _ userContentController: WKUserContentController,
        didReceive message: WKScriptMessage
    ) {
        parent.onMessage?(message.body)
    }

    private func updateState(_ webView: WKWebView) {
        parent.onNavigationStateChange?(WebViewNavigationState(
            url: webView.url,
            title: webView.title,
            loading: webView.isLoading,
            canGoBack: webView.canGoBack,
            canGoForward: webView.canGoForward,
            estimatedProgress: webView.estimatedProgress
        ))
    }
}

// MARK: - WebView Representable
struct WebViewRepresentable: UIViewRepresentable {
    let url: URL?
    let html: String?
    let config: WebViewConfig

    var onLoadStart: ((URL?) -> Void)?
    var onLoadEnd: ((URL?) -> Void)?
    var onLoadError: ((Error) -> Void)?
    var onNavigationStateChange: ((WebViewNavigationState) -> Void)?
    var onMessage: ((Any) -> Void)?

    @Binding var webViewRef: WKWebView?

    func makeCoordinator() -> WebViewCoordinator {
        WebViewCoordinator(self, config: config)
    }

    func makeUIView(context: Context) -> WKWebView {
        let preferences = WKPreferences()

        let configuration = WKWebViewConfiguration()
        configuration.preferences = preferences

        // Add message handler
        configuration.userContentController.add(context.coordinator, name: "nativeHandler")

        // Add bridge script
        let bridgeScript = WKUserScript(
            source: """
                window.WebViewBridge = {
                    postMessage: function(message) {
                        window.webkit.messageHandlers.nativeHandler.postMessage(message);
                    }
                };
            """,
            injectionTime: .atDocumentStart,
            forMainFrameOnly: true
        )
        configuration.userContentController.addUserScript(bridgeScript)

        let webView = WKWebView(frame: .zero, configuration: configuration)
        webView.navigationDelegate = context.coordinator
        webView.allowsBackForwardNavigationGestures = config.allowsBackForwardGestures

        if let userAgent = config.userAgent {
            webView.customUserAgent = userAgent
        }

        DispatchQueue.main.async {
            self.webViewRef = webView
        }

        return webView
    }

    func updateUIView(_ webView: WKWebView, context: Context) {
        if let url = url, webView.url != url {
            webView.load(URLRequest(url: url))
        } else if let html = html {
            webView.loadHTMLString(html, baseURL: nil)
        }
    }
}

// MARK: - WebView SwiftUI Component
struct WebView: View {
    let source: String
    var sourceType: SourceType = .url
    var showToolbar: Bool = true
    var config: WebViewConfig = WebViewConfig()

    var onLoadStart: ((URL?) -> Void)?
    var onLoadEnd: ((URL?) -> Void)?
    var onLoadError: ((Error) -> Void)?
    var onMessage: ((Any) -> Void)?

    enum SourceType {
        case url
        case html
    }

    @State private var webView: WKWebView?
    @State private var navigationState = WebViewNavigationState(
        url: nil,
        title: nil,
        loading: true,
        canGoBack: false,
        canGoForward: false,
        estimatedProgress: 0
    )

    var body: some View {
        VStack(spacing: 0) {
            // Toolbar
            if showToolbar {
                HStack(spacing: 16) {
                    // Back
                    Button(action: { webView?.goBack() }) {
                        Image(systemName: "chevron.left")
                    }
                    .disabled(!navigationState.canGoBack)

                    // Forward
                    Button(action: { webView?.goForward() }) {
                        Image(systemName: "chevron.right")
                    }
                    .disabled(!navigationState.canGoForward)

                    // Reload
                    Button(action: {
                        if navigationState.loading {
                            webView?.stopLoading()
                        } else {
                            webView?.reload()
                        }
                    }) {
                        Image(systemName: navigationState.loading ? "xmark" : "arrow.clockwise")
                    }

                    Spacer()

                    // Title/URL
                    VStack(spacing: 2) {
                        if let title = navigationState.title, !title.isEmpty {
                            Text(title)
                                .font(.caption)
                                .lineLimit(1)
                        }
                        if let url = navigationState.url?.host {
                            Text(url)
                                .font(.caption2)
                                .foregroundColor(.secondary)
                        }
                    }

                    Spacer()

                    // Share
                    Button(action: shareURL) {
                        Image(systemName: "square.and.arrow.up")
                    }
                    .disabled(navigationState.url == nil)
                }
                .padding(.horizontal)
                .padding(.vertical, 8)
                .background(Color(.systemBackground))

                // Progress bar
                if navigationState.loading {
                    ProgressView(value: navigationState.estimatedProgress)
                        .progressViewStyle(.linear)
                }

                Divider()
            }

            // WebView
            WebViewRepresentable(
                url: sourceType == .url ? URL(string: source) : nil,
                html: sourceType == .html ? source : nil,
                config: config,
                onLoadStart: onLoadStart,
                onLoadEnd: onLoadEnd,
                onLoadError: onLoadError,
                onNavigationStateChange: { state in
                    navigationState = state
                },
                onMessage: onMessage,
                webViewRef: $webView
            )
        }
    }

    private func shareURL() {
        guard let url = navigationState.url else { return }
        let activityVC = UIActivityViewController(
            activityItems: [url],
            applicationActivities: nil
        )

        if let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
           let window = windowScene.windows.first,
           let rootVC = window.rootViewController {
            rootVC.present(activityVC, animated: true)
        }
    }
}

// MARK: - Safari View
import SafariServices

struct SafariView: UIViewControllerRepresentable {
    let url: URL

    func makeUIViewController(context: Context) -> SFSafariViewController {
        SFSafariViewController(url: url)
    }

    func updateUIViewController(_ uiViewController: SFSafariViewController, context: Context) {}
}

// MARK: - Usage Example
struct WebViewExample: View {
    @State private var showSafari = false

    var body: some View {
        WebView(
            source: "https://apple.com",
            sourceType: .url,
            showToolbar: true,
            config: WebViewConfig(
                javaScriptEnabled: true,
                allowsBackForwardGestures: true
            ),
            onLoadEnd: { url in
                print("Loaded: \\(url?.absoluteString ?? "unknown")")
            },
            onMessage: { message in
                print("Message: \\(message)")
            }
        )
        .sheet(isPresented: $showSafari) {
            SafariView(url: URL(string: "https://apple.com")!)
        }
    }
}
`,
      },
    },

    android: {
      dependencies: [
        'androidx.compose.ui:ui',
        'androidx.compose.material3:material3',
        'com.google.accompanist:accompanist-webview:0.32.0',
      ],
      minimumSdk: 24,
      components: {
        // Compose WebView
        WebViewComponent: `
package com.hublab.capsules.webview

import android.annotation.SuppressLint
import android.graphics.Bitmap
import android.webkit.*
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.compose.ui.viewinterop.AndroidView
import com.google.accompanist.web.*

// Data classes
data class WebViewConfig(
    val javaScriptEnabled: Boolean = true,
    val domStorageEnabled: Boolean = true,
    val allowFileAccess: Boolean = false,
    val mediaPlaybackRequiresUserGesture: Boolean = true,
    val userAgent: String? = null,
    val injectedJavaScript: String? = null,
    val allowedHosts: List<String> = emptyList(),
    val blockedHosts: List<String> = emptyList()
)

data class NavigationState(
    val url: String = "",
    val title: String = "",
    val loading: Boolean = false,
    val canGoBack: Boolean = false,
    val canGoForward: Boolean = false,
    val progress: Float = 0f
)

// WebView Composable
@SuppressLint("SetJavaScriptEnabled")
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun WebView(
    source: String,
    modifier: Modifier = Modifier,
    sourceType: SourceType = SourceType.URL,
    showToolbar: Boolean = true,
    config: WebViewConfig = WebViewConfig(),
    onLoadStart: (String) -> Unit = {},
    onLoadEnd: (String) -> Unit = {},
    onLoadError: (String) -> Unit = {},
    onNavigationStateChange: (NavigationState) -> Unit = {},
    onMessage: (String) -> Unit = {}
) {
    val context = LocalContext.current
    var webView by remember { mutableStateOf<android.webkit.WebView?>(null) }
    var navState by remember { mutableStateOf(NavigationState()) }

    // Create WebView client
    val webViewClient = remember {
        object : WebViewClient() {
            override fun onPageStarted(view: android.webkit.WebView?, url: String?, favicon: Bitmap?) {
                url?.let {
                    onLoadStart(it)
                    navState = navState.copy(url = it, loading = true)
                }
            }

            override fun onPageFinished(view: android.webkit.WebView?, url: String?) {
                url?.let {
                    onLoadEnd(it)
                    navState = navState.copy(
                        url = it,
                        title = view?.title ?: "",
                        loading = false,
                        canGoBack = view?.canGoBack() ?: false,
                        canGoForward = view?.canGoForward() ?: false
                    )
                    onNavigationStateChange(navState)

                    // Inject JavaScript
                    config.injectedJavaScript?.let { script ->
                        view?.evaluateJavascript(script, null)
                    }
                }
            }

            override fun onReceivedError(
                view: android.webkit.WebView?,
                request: WebResourceRequest?,
                error: WebResourceError?
            ) {
                error?.description?.toString()?.let { onLoadError(it) }
            }

            override fun shouldOverrideUrlLoading(
                view: android.webkit.WebView?,
                request: WebResourceRequest?
            ): Boolean {
                val url = request?.url?.toString() ?: return false
                val host = request.url?.host ?: return false

                // Check blocked hosts
                if (config.blockedHosts.isNotEmpty()) {
                    if (config.blockedHosts.any { host.contains(it) }) {
                        return true
                    }
                }

                // Check allowed hosts
                if (config.allowedHosts.isNotEmpty()) {
                    if (!config.allowedHosts.any { host.contains(it) }) {
                        return true
                    }
                }

                return false
            }
        }
    }

    val webChromeClient = remember {
        object : WebChromeClient() {
            override fun onProgressChanged(view: android.webkit.WebView?, newProgress: Int) {
                navState = navState.copy(progress = newProgress / 100f)
            }

            override fun onReceivedTitle(view: android.webkit.WebView?, title: String?) {
                navState = navState.copy(title = title ?: "")
            }
        }
    }

    Column(modifier = modifier.fillMaxSize()) {
        // Toolbar
        if (showToolbar) {
            TopAppBar(
                title = {
                    Column {
                        Text(
                            text = navState.title.ifEmpty { "Loading..." },
                            style = MaterialTheme.typography.titleSmall,
                            maxLines = 1
                        )
                        Text(
                            text = navState.url.takeIf { it.isNotEmpty() }
                                ?.let { java.net.URL(it).host } ?: "",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                            maxLines = 1
                        )
                    }
                },
                navigationIcon = {
                    Row {
                        IconButton(
                            onClick = { webView?.goBack() },
                            enabled = navState.canGoBack
                        ) {
                            Icon(Icons.Default.ArrowBack, "Back")
                        }
                        IconButton(
                            onClick = { webView?.goForward() },
                            enabled = navState.canGoForward
                        ) {
                            Icon(Icons.Default.ArrowForward, "Forward")
                        }
                    }
                },
                actions = {
                    IconButton(
                        onClick = {
                            if (navState.loading) {
                                webView?.stopLoading()
                            } else {
                                webView?.reload()
                            }
                        }
                    ) {
                        Icon(
                            if (navState.loading) Icons.Default.Close else Icons.Default.Refresh,
                            if (navState.loading) "Stop" else "Reload"
                        )
                    }
                }
            )

            // Progress bar
            if (navState.loading) {
                LinearProgressIndicator(
                    progress = { navState.progress },
                    modifier = Modifier.fillMaxWidth()
                )
            }
        }

        // WebView
        AndroidView(
            modifier = Modifier.fillMaxSize(),
            factory = { ctx ->
                android.webkit.WebView(ctx).apply {
                    webViewClient = webViewClient
                    this.webChromeClient = webChromeClient

                    settings.apply {
                        javaScriptEnabled = config.javaScriptEnabled
                        domStorageEnabled = config.domStorageEnabled
                        allowFileAccess = config.allowFileAccess
                        mediaPlaybackRequiresUserGesture = config.mediaPlaybackRequiresUserGesture
                        config.userAgent?.let { userAgentString = it }
                    }

                    // Add JavaScript interface
                    addJavascriptInterface(
                        object {
                            @JavascriptInterface
                            fun postMessage(message: String) {
                                onMessage(message)
                            }
                        },
                        "NativeBridge"
                    )

                    webView = this

                    when (sourceType) {
                        SourceType.URL -> loadUrl(source)
                        SourceType.HTML -> loadDataWithBaseURL(null, source, "text/html", "UTF-8", null)
                    }
                }
            },
            update = { view ->
                // Update if needed
            }
        )
    }
}

enum class SourceType {
    URL, HTML
}

// Simple WebView without toolbar
@SuppressLint("SetJavaScriptEnabled")
@Composable
fun SimpleWebView(
    url: String,
    modifier: Modifier = Modifier,
    javaScriptEnabled: Boolean = true
) {
    AndroidView(
        modifier = modifier,
        factory = { context ->
            android.webkit.WebView(context).apply {
                settings.javaScriptEnabled = javaScriptEnabled
                settings.domStorageEnabled = true
                webViewClient = WebViewClient()
                loadUrl(url)
            }
        }
    )
}

// In-App Browser
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun InAppBrowser(
    url: String,
    onDismiss: () -> Unit,
    modifier: Modifier = Modifier
) {
    var currentUrl by remember { mutableStateOf(url) }
    var title by remember { mutableStateOf("") }
    var canGoBack by remember { mutableStateOf(false) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text(title.ifEmpty { "Loading..." }, maxLines = 1)
                        Text(
                            text = currentUrl.takeIf { it.isNotEmpty() }
                                ?.let { try { java.net.URL(it).host } catch (_: Exception) { it } } ?: "",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                            maxLines = 1
                        )
                    }
                },
                navigationIcon = {
                    IconButton(onClick = onDismiss) {
                        Icon(Icons.Default.Close, "Close")
                    }
                },
                actions = {
                    IconButton(onClick = { /* Open in browser */ }) {
                        Icon(Icons.Default.OpenInBrowser, "Open in browser")
                    }
                }
            )
        }
    ) { padding ->
        WebView(
            source = url,
            modifier = modifier.padding(padding),
            showToolbar = false,
            onNavigationStateChange = { state ->
                currentUrl = state.url
                title = state.title
                canGoBack = state.canGoBack
            }
        )
    }
}
`,
      },
    },

    desktop: {
      dependencies: ['tauri', 'react', 'tailwindcss'],
      components: {
        // Desktop WebView (Tauri)
        DesktopWebView: `
import React, { useRef, useState, useCallback, useEffect, forwardRef, useImperativeHandle } from 'react';

interface DesktopWebViewProps {
  source: string;
  showToolbar?: boolean;
  showAddressBar?: boolean;
  className?: string;
}

declare global {
  interface Window {
    __TAURI__?: {
      shell: {
        open: (url: string) => Promise<void>;
      };
    };
  }
}

export const DesktopWebView = forwardRef<any, DesktopWebViewProps>(({
  source,
  showToolbar = true,
  showAddressBar = true,
  className = '',
}, ref) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [currentUrl, setCurrentUrl] = useState(source);
  const [inputUrl, setInputUrl] = useState(source);
  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [history, setHistory] = useState<string[]>([source]);
  const [historyIndex, setHistoryIndex] = useState(0);

  useImperativeHandle(ref, () => ({
    reload: () => {
      if (iframeRef.current) {
        iframeRef.current.src = currentUrl;
      }
    },
    goBack: () => {
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCurrentUrl(history[newIndex]);
        setInputUrl(history[newIndex]);
      }
    },
    goForward: () => {
      if (historyIndex < history.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setCurrentUrl(history[newIndex]);
        setInputUrl(history[newIndex]);
      }
    },
    navigate: (url: string) => {
      setCurrentUrl(url);
      setInputUrl(url);
      setHistory(prev => [...prev.slice(0, historyIndex + 1), url]);
      setHistoryIndex(prev => prev + 1);
    },
  }), [currentUrl, history, historyIndex]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let url = inputUrl.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    setCurrentUrl(url);
    setHistory(prev => [...prev.slice(0, historyIndex + 1), url]);
    setHistoryIndex(prev => prev + 1);
  };

  const openExternal = async () => {
    if (window.__TAURI__) {
      await window.__TAURI__.shell.open(currentUrl);
    } else {
      window.open(currentUrl, '_blank');
    }
  };

  const canGoBack = historyIndex > 0;
  const canGoForward = historyIndex < history.length - 1;

  return (
    <div className={\`flex flex-col h-full bg-white dark:bg-gray-900 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 \${className}\`}>
      {showToolbar && (
        <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          {/* Navigation */}
          <div className="flex items-center">
            <button
              onClick={() => {
                if (canGoBack) {
                  const newIndex = historyIndex - 1;
                  setHistoryIndex(newIndex);
                  setCurrentUrl(history[newIndex]);
                  setInputUrl(history[newIndex]);
                }
              }}
              disabled={!canGoBack}
              className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50"
              title="Back"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={() => {
                if (canGoForward) {
                  const newIndex = historyIndex + 1;
                  setHistoryIndex(newIndex);
                  setCurrentUrl(history[newIndex]);
                  setInputUrl(history[newIndex]);
                }
              }}
              disabled={!canGoForward}
              className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50"
              title="Forward"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <button
              onClick={() => {
                if (isLoading) {
                  if (iframeRef.current) iframeRef.current.src = 'about:blank';
                  setIsLoading(false);
                } else {
                  if (iframeRef.current) iframeRef.current.src = currentUrl;
                }
              }}
              className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
              title={isLoading ? 'Stop' : 'Reload'}
            >
              {isLoading ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              )}
            </button>
          </div>

          {/* Address bar */}
          {showAddressBar && (
            <form onSubmit={handleSubmit} className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  className="w-full px-4 py-1.5 pr-10 text-sm bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter URL..."
                />
                {isLoading && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="w-4 h-4 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                  </div>
                )}
              </div>
            </form>
          )}

          {/* Actions */}
          <button
            onClick={openExternal}
            className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
            title="Open in browser"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </button>
        </div>
      )}

      {/* WebView content */}
      <div className="flex-1 relative">
        <iframe
          ref={iframeRef}
          src={currentUrl}
          className="w-full h-full border-0"
          onLoad={() => setIsLoading(false)}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
        />
      </div>
    </div>
  );
});

DesktopWebView.displayName = 'DesktopWebView';
`,
      },
    },
  },

  examples: [
    {
      title: 'Basic WebView',
      description: 'WebView with navigation toolbar',
      code: `
<WebView
  source="https://example.com"
  showToolbar={true}
  showAddressBar={true}
  onLoadEnd={(url) => console.log('Loaded:', url)}
/>
`,
    },
    {
      title: 'HTML Content',
      description: 'WebView with inline HTML',
      code: `
<WebView
  source="<h1>Hello World</h1><p>This is inline HTML</p>"
  sourceType="html"
  showToolbar={false}
/>
`,
    },
    {
      title: 'With JavaScript Bridge',
      description: 'WebView with message handler',
      code: `
<WebView
  source="https://app.example.com"
  injectedJavaScript={\`
    window.sendToNative = (data) => {
      window.WebViewBridge.postMessage(JSON.stringify(data));
    };
  \`}
  onMessage={(msg) => handleMessage(msg)}
/>
`,
    },
    {
      title: 'Browser Frame',
      description: 'Decorative browser window',
      code: `
<BrowserFrame url="https://myapp.com" variant="macos">
  <div className="p-4">
    <h1>Your content here</h1>
  </div>
</BrowserFrame>
`,
    },
  ],
}
