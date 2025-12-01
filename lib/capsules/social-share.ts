/**
 * Social Share Capsule - Share to Social Networks
 *
 * Cross-platform sharing with native share sheet,
 * social media deep links, and clipboard support.
 */

import type { CapsuleDefinition } from './types'

export const SocialShareCapsule: CapsuleDefinition = {
  id: 'social-share',
  name: 'Social Share',
  description: 'Native sharing with social media integration and clipboard support',
  category: 'device',
  tags: ['share', 'social', 'clipboard', 'twitter', 'facebook', 'whatsapp'],
  version: '1.0.0',

  props: {
    title: {
      type: 'string',
      description: 'Title to share',
    },
    text: {
      type: 'string',
      description: 'Text content to share',
    },
    url: {
      type: 'string',
      description: 'URL to share',
    },
    image: {
      type: 'string',
      description: 'Image URL to share',
    },
    hashtags: {
      type: 'array',
      description: 'Hashtags for social sharing',
    },
    via: {
      type: 'string',
      description: 'Attribution (e.g., Twitter handle)',
    },
    useNativeShare: {
      type: 'boolean',
      default: true,
      description: 'Use native share sheet when available',
    },
    platforms: {
      type: 'array',
      description: 'Platforms to show: twitter, facebook, whatsapp, linkedin, email, copy',
    },
    onShare: {
      type: 'function',
      description: 'Callback when share is initiated',
    },
    onError: {
      type: 'function',
      description: 'Callback when share fails',
    },
  },

  platforms: {
    web: {
      dependencies: ['react', 'tailwindcss'],
      components: {
        useShare: `
import { useCallback, useState } from 'react';

interface ShareData {
  title?: string;
  text?: string;
  url?: string;
  files?: File[];
}

interface UseShareReturn {
  share: (data: ShareData) => Promise<boolean>;
  canShare: boolean;
  canShareFiles: boolean;
  copyToClipboard: (text: string) => Promise<boolean>;
}

export function useShare(): UseShareReturn {
  const canShare = typeof navigator !== 'undefined' && !!navigator.share;
  const canShareFiles = canShare && !!navigator.canShare;

  const share = useCallback(async (data: ShareData): Promise<boolean> => {
    if (canShare) {
      try {
        await navigator.share(data);
        return true;
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('Share failed:', err);
        }
        return false;
      }
    }

    // Fallback: copy URL to clipboard
    if (data.url) {
      return copyToClipboard(data.url);
    }
    if (data.text) {
      return copyToClipboard(data.text);
    }

    return false;
  }, [canShare]);

  const copyToClipboard = useCallback(async (text: string): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      const success = document.execCommand('copy');
      document.body.removeChild(textarea);
      return success;
    }
  }, []);

  return { share, canShare, canShareFiles, copyToClipboard };
}
`,

        ShareButton: `
import React, { useState } from 'react';
import { useShare } from './useShare';

interface ShareButtonProps {
  title?: string;
  text?: string;
  url?: string;
  variant?: 'icon' | 'button' | 'fab';
  label?: string;
  onShare?: () => void;
  onError?: (error: string) => void;
  className?: string;
}

export const ShareButton: React.FC<ShareButtonProps> = ({
  title,
  text,
  url,
  variant = 'button',
  label = 'Share',
  onShare,
  onError,
  className = '',
}) => {
  const { share, canShare } = useShare();
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async () => {
    setIsSharing(true);
    const success = await share({ title, text, url });
    setIsSharing(false);

    if (success) {
      onShare?.();
    } else if (!canShare) {
      onError?.('Sharing not supported');
    }
  };

  const icon = (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
    </svg>
  );

  if (variant === 'icon') {
    return (
      <button
        onClick={handleShare}
        disabled={isSharing}
        className={\`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 \${className}\`}
      >
        {icon}
      </button>
    );
  }

  if (variant === 'fab') {
    return (
      <button
        onClick={handleShare}
        disabled={isSharing}
        className={\`fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 disabled:opacity-50 \${className}\`}
      >
        {icon}
      </button>
    );
  }

  return (
    <button
      onClick={handleShare}
      disabled={isSharing}
      className={\`flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 \${className}\`}
    >
      {icon}
      {label}
    </button>
  );
};
`,

        SocialShareButtons: `
import React, { useState } from 'react';

interface ShareConfig {
  title?: string;
  text?: string;
  url?: string;
  hashtags?: string[];
  via?: string;
}

interface SocialShareButtonsProps extends ShareConfig {
  platforms?: ('twitter' | 'facebook' | 'linkedin' | 'whatsapp' | 'telegram' | 'email' | 'copy')[];
  size?: 'sm' | 'md' | 'lg';
  variant?: 'filled' | 'outline' | 'ghost';
  showLabels?: boolean;
  onShare?: (platform: string) => void;
  className?: string;
}

export const SocialShareButtons: React.FC<SocialShareButtonsProps> = ({
  title = '',
  text = '',
  url = '',
  hashtags = [],
  via = '',
  platforms = ['twitter', 'facebook', 'linkedin', 'whatsapp', 'copy'],
  size = 'md',
  variant = 'filled',
  showLabels = false,
  onShare,
  className = '',
}) => {
  const [copied, setCopied] = useState(false);
  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(text);
  const encodedTitle = encodeURIComponent(title);
  const hashtagString = hashtags.join(',');

  const shareUrls: Record<string, string> = {
    twitter: \`https://twitter.com/intent/tweet?text=\${encodedText}&url=\${encodedUrl}\${hashtags.length ? \`&hashtags=\${hashtagString}\` : ''}\${via ? \`&via=\${via}\` : ''}\`,
    facebook: \`https://www.facebook.com/sharer/sharer.php?u=\${encodedUrl}\`,
    linkedin: \`https://www.linkedin.com/sharing/share-offsite/?url=\${encodedUrl}\`,
    whatsapp: \`https://wa.me/?text=\${encodedText}%20\${encodedUrl}\`,
    telegram: \`https://t.me/share/url?url=\${encodedUrl}&text=\${encodedText}\`,
    email: \`mailto:?subject=\${encodedTitle}&body=\${encodedText}%0A%0A\${encodedUrl}\`,
  };

  const platformConfig: Record<string, { icon: React.ReactNode; label: string; color: string }> = {
    twitter: {
      label: 'Twitter',
      color: '#1DA1F2',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
    },
    facebook: {
      label: 'Facebook',
      color: '#1877F2',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
    },
    linkedin: {
      label: 'LinkedIn',
      color: '#0A66C2',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      ),
    },
    whatsapp: {
      label: 'WhatsApp',
      color: '#25D366',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      ),
    },
    telegram: {
      label: 'Telegram',
      color: '#0088CC',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
        </svg>
      ),
    },
    email: {
      label: 'Email',
      color: '#EA4335',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    copy: {
      label: copied ? 'Copied!' : 'Copy Link',
      color: '#6B7280',
      icon: copied ? (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
    },
  };

  const handleShare = async (platform: string) => {
    if (platform === 'copy') {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // Fallback
      }
    } else {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
    onShare?.(platform);
  };

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  return (
    <div className={\`flex flex-wrap gap-2 \${className}\`}>
      {platforms.map(platform => {
        const config = platformConfig[platform];
        if (!config) return null;

        return (
          <button
            key={platform}
            onClick={() => handleShare(platform)}
            className={\`
              flex items-center gap-2 rounded-full transition-all
              \${sizeClasses[size]}
              \${variant === 'filled' ? 'text-white' : ''}
              \${variant === 'outline' ? 'border-2' : ''}
              \${variant === 'ghost' ? 'hover:bg-gray-100 dark:hover:bg-gray-800' : ''}
              \${showLabels ? 'px-4 w-auto' : 'justify-center'}
            \`}
            style={{
              backgroundColor: variant === 'filled' ? config.color : 'transparent',
              borderColor: variant === 'outline' ? config.color : 'transparent',
              color: variant !== 'filled' ? config.color : undefined,
            }}
            title={config.label}
          >
            {config.icon}
            {showLabels && <span className="text-sm font-medium">{config.label}</span>}
          </button>
        );
      })}
    </div>
  );
};
`,
      },
    },

    ios: {
      dependencies: ['SwiftUI'],
      minimumVersion: '15.0',
      components: {
        ShareSheet: `
import SwiftUI

struct ShareSheet: UIViewControllerRepresentable {
    let items: [Any]
    var excludedActivityTypes: [UIActivity.ActivityType]?

    func makeUIViewController(context: Context) -> UIActivityViewController {
        let controller = UIActivityViewController(
            activityItems: items,
            applicationActivities: nil
        )
        controller.excludedActivityTypes = excludedActivityTypes
        return controller
    }

    func updateUIViewController(_ uiViewController: UIActivityViewController, context: Context) {}
}

struct ShareButton: View {
    let title: String?
    let text: String?
    let url: URL?
    var label: String = "Share"
    var iconOnly: Bool = false

    @State private var showShareSheet = false

    var body: some View {
        Button(action: { showShareSheet = true }) {
            if iconOnly {
                Image(systemName: "square.and.arrow.up")
            } else {
                Label(label, systemImage: "square.and.arrow.up")
            }
        }
        .sheet(isPresented: $showShareSheet) {
            ShareSheet(items: shareItems)
        }
    }

    private var shareItems: [Any] {
        var items: [Any] = []
        if let title = title { items.append(title) }
        if let text = text { items.append(text) }
        if let url = url { items.append(url) }
        return items
    }
}

struct SocialShareButtons: View {
    let url: URL
    let text: String

    var body: some View {
        HStack(spacing: 16) {
            // Twitter
            Link(destination: twitterURL) {
                Image("twitter")
                    .resizable()
                    .frame(width: 40, height: 40)
            }

            // Facebook
            Link(destination: facebookURL) {
                Image("facebook")
                    .resizable()
                    .frame(width: 40, height: 40)
            }

            // WhatsApp
            Link(destination: whatsappURL) {
                Image("whatsapp")
                    .resizable()
                    .frame(width: 40, height: 40)
            }

            // Native share
            ShareLink(item: url) {
                Image(systemName: "ellipsis.circle.fill")
                    .resizable()
                    .frame(width: 40, height: 40)
            }
        }
    }

    private var twitterURL: URL {
        let encoded = text.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) ?? ""
        return URL(string: "https://twitter.com/intent/tweet?text=\\(encoded)&url=\\(url.absoluteString)")!
    }

    private var facebookURL: URL {
        URL(string: "https://www.facebook.com/sharer/sharer.php?u=\\(url.absoluteString)")!
    }

    private var whatsappURL: URL {
        let encoded = "\\(text) \\(url.absoluteString)".addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) ?? ""
        return URL(string: "https://wa.me/?text=\\(encoded)")!
    }
}
`,
      },
    },

    android: {
      dependencies: [
        'androidx.compose.ui:ui',
        'androidx.compose.material3:material3',
      ],
      minimumSdk: 24,
      components: {
        ShareHelper: `
package com.hublab.capsules.share

import android.content.Context
import android.content.Intent
import android.net.Uri
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Share
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp

object ShareHelper {
    fun share(
        context: Context,
        title: String? = null,
        text: String? = null,
        url: String? = null
    ) {
        val shareText = buildString {
            text?.let { append(it) }
            if (text != null && url != null) append("\\n\\n")
            url?.let { append(it) }
        }

        val intent = Intent(Intent.ACTION_SEND).apply {
            type = "text/plain"
            putExtra(Intent.EXTRA_TEXT, shareText)
            title?.let { putExtra(Intent.EXTRA_SUBJECT, it) }
        }

        context.startActivity(Intent.createChooser(intent, "Share via"))
    }

    fun shareToTwitter(context: Context, text: String, url: String) {
        val tweetUrl = "https://twitter.com/intent/tweet?text=\${Uri.encode(text)}&url=\${Uri.encode(url)}"
        context.startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(tweetUrl)))
    }

    fun shareToFacebook(context: Context, url: String) {
        val fbUrl = "https://www.facebook.com/sharer/sharer.php?u=\${Uri.encode(url)}"
        context.startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(fbUrl)))
    }

    fun shareToWhatsApp(context: Context, text: String, url: String) {
        val waUrl = "https://wa.me/?text=\${Uri.encode("$text $url")}"
        context.startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(waUrl)))
    }
}

@Composable
fun ShareButton(
    text: String? = null,
    url: String? = null,
    title: String? = null,
    label: String = "Share"
) {
    val context = LocalContext.current

    Button(onClick = { ShareHelper.share(context, title, text, url) }) {
        Icon(Icons.Default.Share, contentDescription = null)
        Spacer(modifier = Modifier.width(8.dp))
        Text(label)
    }
}

@Composable
fun SocialShareRow(
    text: String,
    url: String
) {
    val context = LocalContext.current

    Row(
        horizontalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        // Twitter
        IconButton(
            onClick = { ShareHelper.shareToTwitter(context, text, url) },
            modifier = Modifier.size(48.dp)
        ) {
            // Twitter icon
        }

        // Facebook
        IconButton(
            onClick = { ShareHelper.shareToFacebook(context, url) },
            modifier = Modifier.size(48.dp)
        ) {
            // Facebook icon
        }

        // WhatsApp
        IconButton(
            onClick = { ShareHelper.shareToWhatsApp(context, text, url) },
            modifier = Modifier.size(48.dp)
        ) {
            // WhatsApp icon
        }

        // Native share
        IconButton(
            onClick = { ShareHelper.share(context, null, text, url) },
            modifier = Modifier.size(48.dp)
        ) {
            Icon(Icons.Default.Share, "Share")
        }
    }
}
`,
      },
    },

    desktop: {
      dependencies: ['tauri', 'react', 'tailwindcss'],
      components: {
        DesktopShare: `
import React, { useState } from 'react';

interface DesktopShareProps {
  title?: string;
  text?: string;
  url?: string;
  onShare?: (platform: string) => void;
}

export const DesktopShare: React.FC<DesktopShareProps> = ({
  title,
  text,
  url,
  onShare,
}) => {
  const [copied, setCopied] = useState(false);

  const shareUrls = {
    twitter: \`https://twitter.com/intent/tweet?text=\${encodeURIComponent(text || '')}&url=\${encodeURIComponent(url || '')}\`,
    facebook: \`https://www.facebook.com/sharer/sharer.php?u=\${encodeURIComponent(url || '')}\`,
    linkedin: \`https://www.linkedin.com/sharing/share-offsite/?url=\${encodeURIComponent(url || '')}\`,
    email: \`mailto:?subject=\${encodeURIComponent(title || '')}&body=\${encodeURIComponent(\`\${text || ''}\\n\\n\${url || ''}\`})\`,
  };

  const handleShare = (platform: string) => {
    if (platform === 'copy') {
      navigator.clipboard.writeText(url || text || '');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else {
      window.open(shareUrls[platform as keyof typeof shareUrls], '_blank');
    }
    onShare?.(platform);
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={() => handleShare('twitter')}
        className="p-2 bg-[#1DA1F2] text-white rounded-lg hover:opacity-90"
      >
        Twitter
      </button>
      <button
        onClick={() => handleShare('facebook')}
        className="p-2 bg-[#1877F2] text-white rounded-lg hover:opacity-90"
      >
        Facebook
      </button>
      <button
        onClick={() => handleShare('copy')}
        className="p-2 bg-gray-600 text-white rounded-lg hover:opacity-90"
      >
        {copied ? 'Copied!' : 'Copy'}
      </button>
    </div>
  );
};
`,
      },
    },
  },

  examples: [
    {
      title: 'Share Button',
      description: 'Native share button',
      code: `
<ShareButton
  title="Check this out!"
  text="Amazing content"
  url="https://example.com"
  onShare={() => analytics.track('shared')}
/>
`,
    },
    {
      title: 'Social Share Buttons',
      description: 'Share to specific platforms',
      code: `
<SocialShareButtons
  url="https://example.com/article"
  text="Great article!"
  platforms={['twitter', 'facebook', 'whatsapp', 'copy']}
  showLabels={false}
/>
`,
    },
  ],
}
