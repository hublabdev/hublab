/**
 * HubLab Capsule System
 *
 * Multi-platform component definitions that generate
 * native code for iOS, Android, and Web.
 */

export * from './types'

// Export all capsules
export { ButtonCapsule } from './button'
export { TextCapsule } from './text'
export { InputCapsule } from './input'
export { CardCapsule } from './card'
export { ImageCapsule } from './image'
export { ListCapsule } from './list'
export { ModalCapsule } from './modal'
export { FormCapsule } from './form'
export { NavigationCapsule } from './navigation'
export { AuthScreenCapsule } from './auth-screen'

// Advanced UI Components
export { ChartCapsule } from './chart'
// Note: avatar, badge, and toast temporarily commented out due to build issues
// export { AvatarCapsule } from './avatar'
// export { BadgeCapsule } from './badge'
// export { ToastCapsule } from './toast'
export { SkeletonCapsule } from './skeleton'
export { SwitchCapsule } from './switch'
export { SliderCapsule } from './slider'

// Navigation & Layout
export { TabsCapsule } from './tabs'
export { AccordionCapsule } from './accordion'

// Form Controls
export { DropdownCapsule } from './dropdown'
export { DatePickerCapsule } from './datepicker'

// Feedback
export { ProgressCapsule } from './progress'
export { TooltipCapsule } from './tooltip'

// Data Display
export { TableCapsule } from './table'
export { SearchBarCapsule } from './searchbar'

// Input Controls
export { RatingCapsule } from './rating'
export { StepperCapsule } from './stepper'
export { ChipCapsule } from './chip'

// Layout
export { DividerCapsule } from './divider'

// Advanced Interactive Components
export { CalendarCapsule } from './calendar'
export { FileUploadCapsule } from './file-upload'
export { CarouselCapsule } from './carousel'
export { TimelineCapsule } from './timeline'
export { BottomSheetCapsule } from './bottom-sheet'
export { PopoverCapsule } from './popover'

// Media & Advanced Input Components
export { ColorPickerCapsule } from './color-picker'
export { RichTextEditorCapsule } from './rich-text-editor'
export { SignatureCapsule } from './signature'
export { MapCapsule } from './map'
export { VideoCapsule } from './video'
export { AudioCapsule } from './audio'

// Data Management & Business Components
export { DataTableCapsule } from './data-table'
export { KanbanCapsule } from './kanban'
export { ChatCapsule } from './chat'

// Utility & Document Components
export { QRCodeCapsule } from './qrcode'
export { ScannerCapsule } from './scanner'
export { PDFViewerCapsule } from './pdf-viewer'

// Device & Native Capabilities
export { NotificationsCapsule } from './notifications'
export { WebViewCapsule } from './webview'
export { BiometricsCapsule } from './biometrics'
export { LocationCapsule } from './location'
export { CameraCapsule } from './camera'
export { SocialShareCapsule } from './social-share'
export { ConfettiCapsule } from './confetti'

// Marketing & Business Components
export { PricingCardCapsule } from './pricing-card'
export { TestimonialCapsule } from './testimonial'
export { StatCardCapsule } from './stat-card'
export { FeatureCardCapsule } from './feature-card'
export { EmptyStateCapsule } from './empty-state'

// New Capsules (v1.1)
export { BreadcrumbCapsule } from './breadcrumb'
export { CountdownCapsule } from './countdown'
export { OTPInputCapsule } from './otp-input'
export { ParallaxCapsule } from './parallax'
export { DrawerCapsule } from './drawer'
export { FABCapsule } from './fab'
export { SegmentedControlCapsule } from './segmented-control'
export { LottieCapsule } from './lottie'
export { MarqueeCapsule } from './marquee'
export { GradientTextCapsule } from './gradient-text'

// Capsule Registry
import type { CapsuleDefinition } from './types'
import { ButtonCapsule } from './button'
import { TextCapsule } from './text'
import { InputCapsule } from './input'
import { CardCapsule } from './card'
import { ImageCapsule } from './image'
import { ListCapsule } from './list'
import { ModalCapsule } from './modal'
import { FormCapsule } from './form'
import { NavigationCapsule } from './navigation'
import { AuthScreenCapsule } from './auth-screen'
import { ChartCapsule } from './chart'
// import { AvatarCapsule } from './avatar'
// import { BadgeCapsule } from './badge'
// import { ToastCapsule } from './toast'
import { SkeletonCapsule } from './skeleton'
import { SwitchCapsule } from './switch'
import { SliderCapsule } from './slider'
import { TabsCapsule } from './tabs'
import { AccordionCapsule } from './accordion'
import { DropdownCapsule } from './dropdown'
import { DatePickerCapsule } from './datepicker'
import { ProgressCapsule } from './progress'
import { TooltipCapsule } from './tooltip'
import { TableCapsule } from './table'
import { SearchBarCapsule } from './searchbar'
import { RatingCapsule } from './rating'
import { StepperCapsule } from './stepper'
import { ChipCapsule } from './chip'
import { DividerCapsule } from './divider'
import { CalendarCapsule } from './calendar'
import { FileUploadCapsule } from './file-upload'
import { CarouselCapsule } from './carousel'
import { TimelineCapsule } from './timeline'
import { BottomSheetCapsule } from './bottom-sheet'
import { PopoverCapsule } from './popover'
import { ColorPickerCapsule } from './color-picker'
import { RichTextEditorCapsule } from './rich-text-editor'
import { SignatureCapsule } from './signature'
import { MapCapsule } from './map'
import { VideoCapsule } from './video'
import { AudioCapsule } from './audio'
import { DataTableCapsule } from './data-table'
import { KanbanCapsule } from './kanban'
import { ChatCapsule } from './chat'
import { QRCodeCapsule } from './qrcode'
import { ScannerCapsule } from './scanner'
import { PDFViewerCapsule } from './pdf-viewer'
import { NotificationsCapsule } from './notifications'
import { WebViewCapsule } from './webview'
import { BiometricsCapsule } from './biometrics'
import { LocationCapsule } from './location'
import { CameraCapsule } from './camera'
import { SocialShareCapsule } from './social-share'
import { ConfettiCapsule } from './confetti'
import { PricingCardCapsule } from './pricing-card'
import { TestimonialCapsule } from './testimonial'
import { StatCardCapsule } from './stat-card'
import { FeatureCardCapsule } from './feature-card'
import { EmptyStateCapsule } from './empty-state'
import { BreadcrumbCapsule } from './breadcrumb'
import { CountdownCapsule } from './countdown'
import { OTPInputCapsule } from './otp-input'
import { ParallaxCapsule } from './parallax'
import { DrawerCapsule } from './drawer'
import { FABCapsule } from './fab'
import { SegmentedControlCapsule } from './segmented-control'
import { LottieCapsule } from './lottie'
import { MarqueeCapsule } from './marquee'
import { GradientTextCapsule } from './gradient-text'

const capsuleRegistry = new Map<string, CapsuleDefinition>()

// Register all built-in capsules
const builtInCapsules: CapsuleDefinition[] = [
  // UI Components
  ButtonCapsule,
  TextCapsule,
  InputCapsule,
  CardCapsule,
  ImageCapsule,

  // Layout & Navigation
  ListCapsule,
  ModalCapsule,
  NavigationCapsule,

  // Forms
  FormCapsule,
  SwitchCapsule,
  SliderCapsule,

  // Screens
  AuthScreenCapsule,

  // Data Visualization
  ChartCapsule,

  // Feedback & Loading
  // ToastCapsule,
  SkeletonCapsule,
  // BadgeCapsule,
  // AvatarCapsule,
  ProgressCapsule,
  TooltipCapsule,

  // Navigation & Layout
  TabsCapsule,
  AccordionCapsule,

  // Form Controls
  DropdownCapsule,
  DatePickerCapsule,

  // Data Display
  TableCapsule,
  SearchBarCapsule,

  // Input Controls
  RatingCapsule,
  StepperCapsule,
  ChipCapsule,

  // Layout
  DividerCapsule,

  // Advanced Interactive Components
  CalendarCapsule,
  FileUploadCapsule,
  CarouselCapsule,
  TimelineCapsule,
  BottomSheetCapsule,
  PopoverCapsule,

  // Media & Advanced Input Components
  ColorPickerCapsule,
  RichTextEditorCapsule,
  SignatureCapsule,
  MapCapsule,
  VideoCapsule,
  AudioCapsule,

  // Data Management & Business Components
  DataTableCapsule,
  KanbanCapsule,
  ChatCapsule,

  // Utility & Document Components
  QRCodeCapsule,
  ScannerCapsule,
  PDFViewerCapsule,

  // Device & Native Capabilities
  NotificationsCapsule,
  WebViewCapsule,
  BiometricsCapsule,
  LocationCapsule,
  CameraCapsule,
  SocialShareCapsule,
  ConfettiCapsule,

  // Marketing & Business Components
  PricingCardCapsule,
  TestimonialCapsule,
  StatCardCapsule,
  FeatureCardCapsule,
  EmptyStateCapsule,

  // New Capsules (v1.1)
  BreadcrumbCapsule,
  CountdownCapsule,
  OTPInputCapsule,
  ParallaxCapsule,
  DrawerCapsule,
  FABCapsule,
  SegmentedControlCapsule,
  LottieCapsule,
  MarqueeCapsule,
  GradientTextCapsule,
]

builtInCapsules.forEach(capsule => {
  capsuleRegistry.set(capsule.id, capsule)
})

/**
 * Get a capsule by ID
 */
export function getCapsule(id: string): CapsuleDefinition | undefined {
  return capsuleRegistry.get(id)
}

/**
 * Get all registered capsules
 */
export function getAllCapsules(): CapsuleDefinition[] {
  return Array.from(capsuleRegistry.values())
}

/**
 * Get capsules by category
 */
export function getCapsulesByCategory(category: string): CapsuleDefinition[] {
  return getAllCapsules().filter(c => c.category === category)
}

/**
 * Get capsules by tag
 */
export function getCapsulesByTag(tag: string): CapsuleDefinition[] {
  return getAllCapsules().filter(c => c.tags.includes(tag))
}

/**
 * Register a custom capsule
 */
export function registerCapsule(capsule: CapsuleDefinition): void {
  capsuleRegistry.set(capsule.id, capsule)
}

/**
 * Unregister a capsule
 */
export function unregisterCapsule(id: string): boolean {
  return capsuleRegistry.delete(id)
}

/**
 * Check if a capsule supports a specific platform
 */
export function supportsPlatform(
  id: string,
  platform: 'web' | 'ios' | 'android' | 'desktop'
): boolean {
  const capsule = capsuleRegistry.get(id)
  return capsule?.platforms[platform] !== undefined
}

/**
 * Get all supported platforms for a capsule
 */
export function getSupportedPlatforms(id: string): string[] {
  const capsule = capsuleRegistry.get(id)
  if (!capsule) return []
  return Object.keys(capsule.platforms)
}

/**
 * Get capsule statistics
 */
export function getCapsuleStats() {
  const capsules = getAllCapsules()
  const categories = new Set(capsules.map(c => c.category))
  const tags = new Set(capsules.flatMap(c => c.tags))

  return {
    total: capsules.length,
    categories: Array.from(categories),
    tags: Array.from(tags),
    byPlatform: {
      web: capsules.filter(c => c.platforms.web).length,
      ios: capsules.filter(c => c.platforms.ios).length,
      android: capsules.filter(c => c.platforms.android).length,
      desktop: capsules.filter(c => c.platforms.desktop).length,
    }
  }
}
