/**
 * HubLab Monetization System
 *
 * Provides simple, no-code monetization options for micro-app creators.
 * Supports multiple revenue models without requiring any coding knowledge.
 *
 * Philosophy: "Turn your app idea into income - no code required."
 */

// ============================================================================
// REVENUE MODELS
// ============================================================================

export interface RevenueModel {
  id: string
  name: string
  icon: string
  description: string
  features: string[]
  difficulty: 'easy' | 'medium' | 'advanced'
  estimatedSetup: string
  platforms: string[]
}

export const REVENUE_MODELS: RevenueModel[] = [
  {
    id: 'free-with-ads',
    name: 'Free with Ads',
    icon: '📺',
    description: 'Monetize through non-intrusive advertisements',
    features: [
      'Banner ads at bottom of screen',
      'Interstitial ads between screens',
      'Rewarded video ads for bonuses',
      'Native ads in content feeds'
    ],
    difficulty: 'easy',
    estimatedSetup: '5 min',
    platforms: ['ios', 'android', 'web']
  },
  {
    id: 'freemium',
    name: 'Freemium',
    icon: '🎁',
    description: 'Free basic version with premium features',
    features: [
      'Lock premium features',
      'Usage limits for free tier',
      'Premium content library',
      'Remove ads upgrade'
    ],
    difficulty: 'easy',
    estimatedSetup: '10 min',
    platforms: ['ios', 'android', 'web', 'desktop']
  },
  {
    id: 'subscription',
    name: 'Subscription',
    icon: '💳',
    description: 'Recurring revenue with monthly/yearly plans',
    features: [
      'Multiple subscription tiers',
      'Free trial period',
      'Family/team plans',
      'Auto-renewal management'
    ],
    difficulty: 'medium',
    estimatedSetup: '15 min',
    platforms: ['ios', 'android', 'web']
  },
  {
    id: 'one-time-purchase',
    name: 'Paid App',
    icon: '💰',
    description: 'One-time purchase to unlock the full app',
    features: [
      'Single purchase price',
      'No recurring charges',
      'Full feature access',
      'Lifetime updates included'
    ],
    difficulty: 'easy',
    estimatedSetup: '5 min',
    platforms: ['ios', 'android', 'desktop']
  },
  {
    id: 'in-app-purchases',
    name: 'In-App Purchases',
    icon: '🛒',
    description: 'Sell virtual goods, coins, or premium items',
    features: [
      'Virtual currency system',
      'Consumable items (coins, gems)',
      'Non-consumable unlocks',
      'Subscription upgrades'
    ],
    difficulty: 'medium',
    estimatedSetup: '20 min',
    platforms: ['ios', 'android', 'web']
  },
  {
    id: 'tips-donations',
    name: 'Tips & Donations',
    icon: '☕',
    description: 'Let users support you voluntarily',
    features: [
      'Buy me a coffee button',
      'Custom tip amounts',
      'Supporter badges',
      'Thank you messages'
    ],
    difficulty: 'easy',
    estimatedSetup: '5 min',
    platforms: ['ios', 'android', 'web', 'desktop']
  },
  {
    id: 'affiliate',
    name: 'Affiliate Links',
    icon: '🔗',
    description: 'Earn commissions from product recommendations',
    features: [
      'Product recommendations',
      'Affiliate link tracking',
      'Commission dashboard',
      'Partner integrations'
    ],
    difficulty: 'easy',
    estimatedSetup: '10 min',
    platforms: ['ios', 'android', 'web', 'desktop']
  },
  {
    id: 'marketplace',
    name: 'Marketplace',
    icon: '🏪',
    description: 'Enable transactions between users',
    features: [
      'User-to-user sales',
      'Escrow payments',
      'Platform commission',
      'Dispute resolution'
    ],
    difficulty: 'advanced',
    estimatedSetup: '30 min',
    platforms: ['ios', 'android', 'web']
  }
]

// ============================================================================
// SUBSCRIPTION TIERS
// ============================================================================

export interface SubscriptionTier {
  id: string
  name: string
  price: number
  currency: string
  interval: 'month' | 'year' | 'lifetime'
  features: string[]
  highlighted?: boolean
  savings?: string
}

export const DEFAULT_SUBSCRIPTION_TIERS: SubscriptionTier[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    currency: 'USD',
    interval: 'month',
    features: [
      'Basic features',
      'Ads supported',
      'Community support',
      'Limited storage'
    ]
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 9.99,
    currency: 'USD',
    interval: 'month',
    features: [
      'All Free features',
      'No ads',
      'Priority support',
      'Unlimited storage',
      'Advanced analytics'
    ],
    highlighted: true
  },
  {
    id: 'pro-yearly',
    name: 'Pro Yearly',
    price: 79.99,
    currency: 'USD',
    interval: 'year',
    features: [
      'All Pro features',
      'Save 33%',
      'Early access to new features',
      'Premium templates'
    ],
    savings: '33%'
  }
]

// ============================================================================
// AD CONFIGURATIONS
// ============================================================================

export interface AdConfig {
  id: string
  type: 'banner' | 'interstitial' | 'rewarded' | 'native'
  name: string
  icon: string
  description: string
  placement: string
  frequency?: string
  reward?: string
}

export const AD_TYPES: AdConfig[] = [
  {
    id: 'banner-bottom',
    type: 'banner',
    name: 'Bottom Banner',
    icon: '📱',
    description: 'Small banner at the bottom of the screen',
    placement: 'Fixed at screen bottom'
  },
  {
    id: 'banner-top',
    type: 'banner',
    name: 'Top Banner',
    icon: '⬆️',
    description: 'Small banner at the top of the screen',
    placement: 'Fixed at screen top'
  },
  {
    id: 'interstitial',
    type: 'interstitial',
    name: 'Fullscreen Ad',
    icon: '📺',
    description: 'Full screen ad between screens',
    placement: 'Between screen transitions',
    frequency: 'Every 3-5 screens'
  },
  {
    id: 'rewarded',
    type: 'rewarded',
    name: 'Rewarded Video',
    icon: '🎬',
    description: 'User chooses to watch for rewards',
    placement: 'Triggered by user action',
    reward: 'Coins, extra lives, premium content'
  },
  {
    id: 'native',
    type: 'native',
    name: 'Native Feed Ad',
    icon: '📰',
    description: 'Blends with your content feed',
    placement: 'Within content lists',
    frequency: 'Every 5-10 items'
  }
]

// ============================================================================
// IN-APP PURCHASE ITEMS
// ============================================================================

export interface IAPItem {
  id: string
  type: 'consumable' | 'non-consumable' | 'subscription'
  name: string
  price: number
  currency: string
  icon: string
  description: string
  value?: number
}

export const SAMPLE_IAP_ITEMS: IAPItem[] = [
  {
    id: 'coins-100',
    type: 'consumable',
    name: '100 Coins',
    price: 0.99,
    currency: 'USD',
    icon: '🪙',
    description: 'A handful of coins to get started',
    value: 100
  },
  {
    id: 'coins-500',
    type: 'consumable',
    name: '500 Coins',
    price: 3.99,
    currency: 'USD',
    icon: '💰',
    description: 'A bag of coins - best value!',
    value: 500
  },
  {
    id: 'coins-1000',
    type: 'consumable',
    name: '1000 Coins',
    price: 6.99,
    currency: 'USD',
    icon: '🏆',
    description: 'A chest of coins for power users',
    value: 1000
  },
  {
    id: 'remove-ads',
    type: 'non-consumable',
    name: 'Remove Ads',
    price: 2.99,
    currency: 'USD',
    icon: '🚫',
    description: 'Remove all ads permanently'
  },
  {
    id: 'premium-themes',
    type: 'non-consumable',
    name: 'Premium Themes',
    price: 1.99,
    currency: 'USD',
    icon: '🎨',
    description: 'Unlock all premium themes'
  },
  {
    id: 'lifetime-pro',
    type: 'non-consumable',
    name: 'Lifetime Pro',
    price: 29.99,
    currency: 'USD',
    icon: '👑',
    description: 'All premium features, forever'
  }
]

// ============================================================================
// MONETIZATION CAPSULES
// ============================================================================

export interface MonetizationCapsule {
  id: string
  name: string
  icon: string
  category: 'ads' | 'payments' | 'subscription' | 'iap' | 'analytics'
  description: string
  platforms: string[]
  defaultProps: Record<string, unknown>
  codePreview: {
    web: string
    ios: string
    android: string
  }
}

export const MONETIZATION_CAPSULES: MonetizationCapsule[] = [
  // Ads
  {
    id: 'ad-banner',
    name: 'Ad Banner',
    icon: '📱',
    category: 'ads',
    description: 'Display a banner ad at bottom or top of screen',
    platforms: ['ios', 'android', 'web'],
    defaultProps: {
      position: 'bottom',
      adUnitId: 'demo-ad-unit',
      testMode: true
    },
    codePreview: {
      web: `<AdBanner position="bottom" adUnitId="ca-app-pub-xxx" />`,
      ios: `AdBannerView(adUnitID: "ca-app-pub-xxx", position: .bottom)`,
      android: `AdBanner(adUnitId = "ca-app-pub-xxx", position = AdPosition.Bottom)`
    }
  },
  {
    id: 'ad-interstitial',
    name: 'Interstitial Ad',
    icon: '📺',
    category: 'ads',
    description: 'Full screen ad shown between screen transitions',
    platforms: ['ios', 'android', 'web'],
    defaultProps: {
      adUnitId: 'demo-interstitial',
      showAfterScreens: 3,
      testMode: true
    },
    codePreview: {
      web: `<InterstitialAd adUnitId="ca-app-pub-xxx" showAfter={3} />`,
      ios: `InterstitialAdManager.shared.show(afterScreens: 3)`,
      android: `InterstitialAdManager.show(afterScreens = 3)`
    }
  },
  {
    id: 'ad-rewarded',
    name: 'Rewarded Video',
    icon: '🎬',
    category: 'ads',
    description: 'User watches video to earn rewards',
    platforms: ['ios', 'android'],
    defaultProps: {
      adUnitId: 'demo-rewarded',
      rewardAmount: 50,
      rewardType: 'coins',
      testMode: true
    },
    codePreview: {
      web: `<RewardedAd adUnitId="xxx" onReward={(r) => addCoins(r.amount)} />`,
      ios: `RewardedAdView(onReward: { reward in addCoins(reward.amount) })`,
      android: `RewardedAd(onReward = { reward -> addCoins(reward.amount) })`
    }
  },

  // Payments
  {
    id: 'paywall',
    name: 'Paywall',
    icon: '🔒',
    category: 'payments',
    description: 'Beautiful paywall screen with subscription options',
    platforms: ['ios', 'android', 'web'],
    defaultProps: {
      title: 'Upgrade to Pro',
      subtitle: 'Unlock all premium features',
      tiers: DEFAULT_SUBSCRIPTION_TIERS,
      showRestoreButton: true
    },
    codePreview: {
      web: `<Paywall tiers={subscriptionTiers} onPurchase={handlePurchase} />`,
      ios: `PaywallView(tiers: subscriptionTiers, onPurchase: handlePurchase)`,
      android: `Paywall(tiers = subscriptionTiers, onPurchase = ::handlePurchase)`
    }
  },
  {
    id: 'pricing-table',
    name: 'Pricing Table',
    icon: '💰',
    category: 'payments',
    description: 'Compare subscription plans side by side',
    platforms: ['ios', 'android', 'web', 'desktop'],
    defaultProps: {
      plans: DEFAULT_SUBSCRIPTION_TIERS,
      highlightedPlan: 'pro',
      showToggle: true
    },
    codePreview: {
      web: `<PricingTable plans={plans} onSelect={handleSelect} />`,
      ios: `PricingTableView(plans: plans, onSelect: handleSelect)`,
      android: `PricingTable(plans = plans, onSelect = ::handleSelect)`
    }
  },
  {
    id: 'buy-button',
    name: 'Buy Button',
    icon: '🛒',
    category: 'payments',
    description: 'Simple button to purchase an item',
    platforms: ['ios', 'android', 'web', 'desktop'],
    defaultProps: {
      productId: 'premium_upgrade',
      price: '$9.99',
      label: 'Buy Now',
      variant: 'primary'
    },
    codePreview: {
      web: `<BuyButton productId="premium" price="$9.99" onClick={purchase} />`,
      ios: `BuyButton(productId: "premium", price: "$9.99", action: purchase)`,
      android: `BuyButton(productId = "premium", price = "$9.99", onClick = ::purchase)`
    }
  },
  {
    id: 'tip-jar',
    name: 'Tip Jar',
    icon: '☕',
    category: 'payments',
    description: 'Let users support you with tips',
    platforms: ['ios', 'android', 'web', 'desktop'],
    defaultProps: {
      amounts: [1, 3, 5, 10],
      currency: 'USD',
      message: 'Buy me a coffee!',
      thankYouMessage: 'Thank you for your support!'
    },
    codePreview: {
      web: `<TipJar amounts={[1,3,5,10]} message="Buy me a coffee!" />`,
      ios: `TipJarView(amounts: [1,3,5,10], message: "Buy me a coffee!")`,
      android: `TipJar(amounts = listOf(1,3,5,10), message = "Buy me a coffee!")`
    }
  },

  // Subscription
  {
    id: 'subscription-status',
    name: 'Subscription Status',
    icon: '📊',
    category: 'subscription',
    description: 'Show current subscription status and manage',
    platforms: ['ios', 'android', 'web'],
    defaultProps: {
      showRenewDate: true,
      showManageButton: true,
      showUpgradeOption: true
    },
    codePreview: {
      web: `<SubscriptionStatus showManageButton={true} />`,
      ios: `SubscriptionStatusView(showManageButton: true)`,
      android: `SubscriptionStatus(showManageButton = true)`
    }
  },
  {
    id: 'premium-badge',
    name: 'Premium Badge',
    icon: '👑',
    category: 'subscription',
    description: 'Show premium status badge',
    platforms: ['ios', 'android', 'web', 'desktop'],
    defaultProps: {
      variant: 'gold',
      showLabel: true,
      animate: true
    },
    codePreview: {
      web: `<PremiumBadge variant="gold" animate={true} />`,
      ios: `PremiumBadgeView(variant: .gold, animate: true)`,
      android: `PremiumBadge(variant = BadgeVariant.Gold, animate = true)`
    }
  },
  {
    id: 'feature-gate',
    name: 'Feature Gate',
    icon: '🚪',
    category: 'subscription',
    description: 'Lock content behind subscription',
    platforms: ['ios', 'android', 'web', 'desktop'],
    defaultProps: {
      requiredTier: 'pro',
      lockedMessage: 'Upgrade to Pro to unlock',
      showPaywall: true
    },
    codePreview: {
      web: `<FeatureGate requiredTier="pro">{children}</FeatureGate>`,
      ios: `FeatureGate(requiredTier: .pro) { content }`,
      android: `FeatureGate(requiredTier = Tier.Pro) { content() }`
    }
  },

  // In-App Purchases
  {
    id: 'store-item',
    name: 'Store Item',
    icon: '🏪',
    category: 'iap',
    description: 'Display a purchasable item',
    platforms: ['ios', 'android', 'web'],
    defaultProps: {
      productId: 'coins_100',
      showPrice: true,
      showDiscount: false
    },
    codePreview: {
      web: `<StoreItem productId="coins_100" onPurchase={handlePurchase} />`,
      ios: `StoreItemView(productId: "coins_100", onPurchase: handlePurchase)`,
      android: `StoreItem(productId = "coins_100", onPurchase = ::handlePurchase)`
    }
  },
  {
    id: 'coin-display',
    name: 'Coin Display',
    icon: '🪙',
    category: 'iap',
    description: 'Show user\'s virtual currency balance',
    platforms: ['ios', 'android', 'web', 'desktop'],
    defaultProps: {
      coinType: 'gold',
      showAddButton: true,
      animate: true
    },
    codePreview: {
      web: `<CoinDisplay balance={userCoins} showAddButton={true} />`,
      ios: `CoinDisplayView(balance: userCoins, showAddButton: true)`,
      android: `CoinDisplay(balance = userCoins, showAddButton = true)`
    }
  },
  {
    id: 'store-grid',
    name: 'Store Grid',
    icon: '🛍️',
    category: 'iap',
    description: 'Grid of purchasable items',
    platforms: ['ios', 'android', 'web'],
    defaultProps: {
      items: SAMPLE_IAP_ITEMS,
      columns: 3,
      showBestValue: true
    },
    codePreview: {
      web: `<StoreGrid items={iapItems} columns={3} />`,
      ios: `StoreGridView(items: iapItems, columns: 3)`,
      android: `StoreGrid(items = iapItems, columns = 3)`
    }
  },

  // Analytics
  {
    id: 'revenue-dashboard',
    name: 'Revenue Dashboard',
    icon: '📈',
    category: 'analytics',
    description: 'View your app\'s revenue analytics',
    platforms: ['web'],
    defaultProps: {
      showChart: true,
      timeRange: '30days',
      metrics: ['revenue', 'subscribers', 'churn']
    },
    codePreview: {
      web: `<RevenueDashboard timeRange="30days" metrics={['revenue', 'subscribers']} />`,
      ios: `// Available in web dashboard only`,
      android: `// Available in web dashboard only`
    }
  },
  {
    id: 'conversion-funnel',
    name: 'Conversion Funnel',
    icon: '🔄',
    category: 'analytics',
    description: 'Track user conversion from free to paid',
    platforms: ['web'],
    defaultProps: {
      stages: ['Install', 'Signup', 'Trial', 'Paid'],
      showPercentages: true
    },
    codePreview: {
      web: `<ConversionFunnel stages={stages} data={conversionData} />`,
      ios: `// Available in web dashboard only`,
      android: `// Available in web dashboard only`
    }
  }
]

// ============================================================================
// PAYMENT PROVIDERS
// ============================================================================

export interface PaymentProvider {
  id: string
  name: string
  icon: string
  description: string
  platforms: string[]
  features: string[]
  setupUrl?: string
}

export const PAYMENT_PROVIDERS: PaymentProvider[] = [
  {
    id: 'stripe',
    name: 'Stripe',
    icon: '💳',
    description: 'Accept payments globally with Stripe',
    platforms: ['web', 'ios', 'android'],
    features: [
      'Credit/debit cards',
      'Apple Pay / Google Pay',
      'ACH / Bank transfers',
      'Subscriptions',
      '135+ currencies'
    ],
    setupUrl: 'https://stripe.com'
  },
  {
    id: 'apple-iap',
    name: 'Apple In-App Purchase',
    icon: '🍎',
    description: 'Native iOS purchases through App Store',
    platforms: ['ios'],
    features: [
      'Required for iOS apps',
      'Apple Pay integration',
      'Family Sharing',
      'Subscription management',
      'Auto-renewal handling'
    ]
  },
  {
    id: 'google-play',
    name: 'Google Play Billing',
    icon: '🤖',
    description: 'Native Android purchases through Play Store',
    platforms: ['android'],
    features: [
      'Required for Android apps',
      'Google Pay integration',
      'Play Pass compatibility',
      'Subscription management',
      'Promo codes support'
    ]
  },
  {
    id: 'paypal',
    name: 'PayPal',
    icon: '🅿️',
    description: 'Accept PayPal and credit cards',
    platforms: ['web'],
    features: [
      'PayPal checkout',
      'Credit/debit cards',
      'Pay Later options',
      'Buyer protection',
      'Global reach'
    ],
    setupUrl: 'https://paypal.com/business'
  },
  {
    id: 'revenuecat',
    name: 'RevenueCat',
    icon: '🐱',
    description: 'Unified subscription platform',
    platforms: ['ios', 'android', 'web'],
    features: [
      'Cross-platform subscriptions',
      'Analytics dashboard',
      'A/B testing',
      'Web purchases',
      'Webhooks'
    ],
    setupUrl: 'https://revenuecat.com'
  }
]

// ============================================================================
// MONETIZATION STRATEGIES
// ============================================================================

export interface MonetizationStrategy {
  id: string
  name: string
  icon: string
  bestFor: string[]
  revenueModels: string[]
  pros: string[]
  cons: string[]
  examples: string[]
}

export const MONETIZATION_STRATEGIES: MonetizationStrategy[] = [
  {
    id: 'ad-supported',
    name: 'Ad-Supported Free',
    icon: '📺',
    bestFor: ['Games', 'Utilities', 'Social apps', 'News apps'],
    revenueModels: ['free-with-ads'],
    pros: [
      'Maximum user acquisition',
      'No barrier to entry',
      'Passive income',
      'Easy to implement'
    ],
    cons: [
      'Lower revenue per user',
      'Can hurt user experience',
      'Dependent on ad networks',
      'Privacy concerns'
    ],
    examples: ['Angry Birds', 'Duolingo', 'Weather apps']
  },
  {
    id: 'freemium',
    name: 'Freemium Model',
    icon: '🎁',
    bestFor: ['Productivity apps', 'SaaS', 'Creative tools'],
    revenueModels: ['freemium', 'subscription'],
    pros: [
      'Large free user base',
      'Try before you buy',
      'Higher conversion quality',
      'Viral potential'
    ],
    cons: [
      'Low conversion rates (2-5%)',
      'Support costs for free users',
      'Feature balance is tricky',
      'Competition from free alternatives'
    ],
    examples: ['Spotify', 'Evernote', 'Canva']
  },
  {
    id: 'subscription',
    name: 'Subscription Model',
    icon: '💳',
    bestFor: ['Content apps', 'Services', 'B2B tools'],
    revenueModels: ['subscription'],
    pros: [
      'Predictable recurring revenue',
      'Higher lifetime value',
      'Continuous improvement incentive',
      'Strong customer relationships'
    ],
    cons: [
      'Requires ongoing value delivery',
      'Subscription fatigue',
      'Churn management',
      'Higher expectations'
    ],
    examples: ['Netflix', 'Notion', 'Calm']
  },
  {
    id: 'hybrid',
    name: 'Hybrid (Ads + IAP)',
    icon: '🔄',
    bestFor: ['Games', 'Entertainment', 'Casual apps'],
    revenueModels: ['free-with-ads', 'in-app-purchases'],
    pros: [
      'Multiple revenue streams',
      'Maximizes all user types',
      'Flexible monetization',
      'Lower risk'
    ],
    cons: [
      'Complex implementation',
      'Can feel greedy',
      'Harder to balance',
      'More maintenance'
    ],
    examples: ['Candy Crush', 'Clash of Clans', 'YouTube']
  }
]

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function getRecommendedStrategy(appType: string): MonetizationStrategy | null {
  const strategies = MONETIZATION_STRATEGIES
  const typeMap: Record<string, string> = {
    'game': 'hybrid',
    'productivity': 'freemium',
    'social': 'ad-supported',
    'content': 'subscription',
    'utility': 'ad-supported',
    'education': 'freemium'
  }

  const strategyId = typeMap[appType.toLowerCase()] || 'freemium'
  return strategies.find(s => s.id === strategyId) || null
}

export function calculatePotentialRevenue(config: {
  model: string
  monthlyUsers: number
  conversionRate?: number
  price?: number
  adRPM?: number
}): { monthly: number; yearly: number } {
  const { model, monthlyUsers, conversionRate = 0.03, price = 9.99, adRPM = 5 } = config

  let monthly = 0

  switch (model) {
    case 'free-with-ads':
      // RPM = Revenue per 1000 ad impressions, assume 10 views/user
      monthly = (monthlyUsers * 10 * adRPM) / 1000
      break
    case 'subscription':
    case 'freemium':
      monthly = monthlyUsers * conversionRate * price
      break
    case 'one-time-purchase':
      // Assume 10% new users each month
      monthly = monthlyUsers * 0.1 * conversionRate * price
      break
    case 'in-app-purchases':
      // Assume $2 ARPU for paying users
      monthly = monthlyUsers * conversionRate * 2
      break
    default:
      monthly = monthlyUsers * conversionRate * price
  }

  return {
    monthly: Math.round(monthly * 100) / 100,
    yearly: Math.round(monthly * 12 * 100) / 100
  }
}

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency
  }).format(amount)
}
