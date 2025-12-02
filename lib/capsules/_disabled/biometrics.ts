/**
 * Biometrics Capsule - Biometric Authentication
 *
 * Cross-platform biometric authentication using
 * Face ID, Touch ID, fingerprint, and face recognition.
 */

import type { CapsuleDefinition } from './types'

export const BiometricsCapsule: CapsuleDefinition = {
  id: 'biometrics',
  name: 'Biometrics',
  description: 'Biometric authentication with Face ID, Touch ID, and fingerprint support',
  category: 'device',
  tags: ['biometrics', 'authentication', 'security', 'faceid', 'touchid', 'fingerprint'],
  version: '1.0.0',

  props: {
    reason: {
      type: 'string',
      default: 'Authenticate to continue',
      description: 'Reason shown to user for authentication',
    },
    title: {
      type: 'string',
      description: 'Title for the authentication dialog',
    },
    subtitle: {
      type: 'string',
      description: 'Subtitle for the authentication dialog',
    },
    fallbackLabel: {
      type: 'string',
      default: 'Use Passcode',
      description: 'Label for fallback authentication option',
    },
    cancelLabel: {
      type: 'string',
      default: 'Cancel',
      description: 'Label for cancel button',
    },
    allowFallback: {
      type: 'boolean',
      default: true,
      description: 'Allow password/PIN fallback if biometrics fails',
    },
    allowDeviceCredentials: {
      type: 'boolean',
      default: true,
      description: 'Allow device credentials (PIN/pattern/password)',
    },
    confirmationRequired: {
      type: 'boolean',
      default: true,
      description: 'Require explicit confirmation (Android)',
    },
    invalidatedByBiometricEnrollment: {
      type: 'boolean',
      default: true,
      description: 'Invalidate key when new biometric is enrolled',
    },
    onSuccess: {
      type: 'function',
      description: 'Callback on successful authentication',
    },
    onError: {
      type: 'function',
      description: 'Callback on authentication error',
    },
    onCancel: {
      type: 'function',
      description: 'Callback when user cancels',
    },
  },

  platforms: {
    web: {
      dependencies: ['react', 'tailwindcss'],
      components: {
        // WebAuthn Biometric Hook
        useBiometrics: `
import { useState, useCallback } from 'react';

interface BiometricOptions {
  reason?: string;
  timeout?: number;
  userVerification?: 'required' | 'preferred' | 'discouraged';
}

interface BiometricResult {
  success: boolean;
  credentialId?: string;
  error?: string;
}

interface UseBiometricsReturn {
  isAvailable: boolean;
  isEnrolled: boolean;
  biometryType: 'face' | 'fingerprint' | 'none';
  authenticate: (options?: BiometricOptions) => Promise<BiometricResult>;
  register: (userId: string, options?: BiometricOptions) => Promise<BiometricResult>;
  isAuthenticating: boolean;
}

export function useBiometrics(): UseBiometricsReturn {
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Check WebAuthn availability
  const isAvailable = typeof window !== 'undefined' &&
    window.PublicKeyCredential !== undefined &&
    typeof window.PublicKeyCredential === 'function';

  // Check platform authenticator
  const checkEnrollment = useCallback(async (): Promise<boolean> => {
    if (!isAvailable) return false;
    try {
      return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    } catch {
      return false;
    }
  }, [isAvailable]);

  // Detect biometry type (simplified - real detection would need more work)
  const getBiometryType = (): 'face' | 'fingerprint' | 'none' => {
    if (!isAvailable) return 'none';

    // Check for iOS/macOS (likely Face ID or Touch ID)
    const isApple = /iPhone|iPad|iPod|Mac/i.test(navigator.userAgent);
    if (isApple) {
      // Face ID on iPhone X and later
      if (/iPhone1[0-9]|iPhone[2-9][0-9]/i.test(navigator.userAgent)) {
        return 'face';
      }
      return 'fingerprint'; // Touch ID
    }

    // Most Android devices have fingerprint
    if (/Android/i.test(navigator.userAgent)) {
      return 'fingerprint';
    }

    return 'none';
  };

  // Register credential
  const register = useCallback(async (
    userId: string,
    options: BiometricOptions = {}
  ): Promise<BiometricResult> => {
    if (!isAvailable) {
      return { success: false, error: 'WebAuthn not available' };
    }

    setIsAuthenticating(true);

    try {
      const challenge = crypto.getRandomValues(new Uint8Array(32));

      const credential = await navigator.credentials.create({
        publicKey: {
          challenge,
          rp: {
            name: window.location.hostname,
            id: window.location.hostname,
          },
          user: {
            id: new TextEncoder().encode(userId),
            name: userId,
            displayName: userId,
          },
          pubKeyCredParams: [
            { alg: -7, type: 'public-key' },  // ES256
            { alg: -257, type: 'public-key' }, // RS256
          ],
          authenticatorSelection: {
            authenticatorAttachment: 'platform',
            userVerification: options.userVerification || 'required',
            residentKey: 'preferred',
          },
          timeout: options.timeout || 60000,
        },
      }) as PublicKeyCredential;

      const credentialId = btoa(String.fromCharCode(...new Uint8Array(credential.rawId)));

      return { success: true, credentialId };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Registration failed',
      };
    } finally {
      setIsAuthenticating(false);
    }
  }, [isAvailable]);

  // Authenticate
  const authenticate = useCallback(async (
    options: BiometricOptions = {}
  ): Promise<BiometricResult> => {
    if (!isAvailable) {
      return { success: false, error: 'WebAuthn not available' };
    }

    setIsAuthenticating(true);

    try {
      const challenge = crypto.getRandomValues(new Uint8Array(32));

      const assertion = await navigator.credentials.get({
        publicKey: {
          challenge,
          rpId: window.location.hostname,
          userVerification: options.userVerification || 'required',
          timeout: options.timeout || 60000,
        },
      }) as PublicKeyCredential;

      const credentialId = btoa(String.fromCharCode(...new Uint8Array(assertion.rawId)));

      return { success: true, credentialId };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Authentication failed',
      };
    } finally {
      setIsAuthenticating(false);
    }
  }, [isAvailable]);

  return {
    isAvailable,
    isEnrolled: isAvailable, // Simplified
    biometryType: getBiometryType(),
    authenticate,
    register,
    isAuthenticating,
  };
}
`,

        // Biometric Button Component
        BiometricButton: `
import React, { useState } from 'react';
import { useBiometrics } from './useBiometrics';

interface BiometricButtonProps {
  onSuccess?: (credentialId?: string) => void;
  onError?: (error: string) => void;
  reason?: string;
  label?: string;
  className?: string;
}

export const BiometricButton: React.FC<BiometricButtonProps> = ({
  onSuccess,
  onError,
  reason = 'Verify your identity',
  label,
  className = '',
}) => {
  const { isAvailable, biometryType, authenticate, isAuthenticating } = useBiometrics();
  const [error, setError] = useState<string | null>(null);

  const handleAuthenticate = async () => {
    setError(null);
    const result = await authenticate({ reason });

    if (result.success) {
      onSuccess?.(result.credentialId);
    } else {
      setError(result.error || 'Authentication failed');
      onError?.(result.error || 'Authentication failed');
    }
  };

  const getIcon = () => {
    switch (biometryType) {
      case 'face':
        return (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'fingerprint':
        return (
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.81 4.47c-.08 0-.16-.02-.23-.06C15.66 3.42 14 3 12.01 3c-1.98 0-3.86.47-5.57 1.41-.24.13-.54.04-.68-.2-.13-.24-.04-.55.2-.68C7.82 2.52 9.86 2 12.01 2c2.13 0 3.99.47 6.03 1.52.25.13.34.43.21.67-.09.18-.26.28-.44.28zM3.5 9.72c-.1 0-.2-.03-.29-.09-.23-.16-.28-.47-.12-.7.99-1.4 2.25-2.5 3.75-3.27C9.98 4.04 14 4.03 17.15 5.65c1.5.77 2.76 1.86 3.75 3.25.16.22.11.54-.12.7-.23.16-.54.11-.7-.12-.9-1.26-2.04-2.25-3.39-2.94-2.87-1.47-6.54-1.47-9.4.01-1.36.7-2.5 1.7-3.4 2.96-.08.14-.23.21-.39.21zm6.25 12.07c-.13 0-.26-.05-.35-.15-.87-.87-1.34-1.43-2.01-2.64-.69-1.23-1.05-2.73-1.05-4.34 0-2.97 2.54-5.39 5.66-5.39s5.66 2.42 5.66 5.39c0 .28-.22.5-.5.5s-.5-.22-.5-.5c0-2.42-2.09-4.39-4.66-4.39-2.57 0-4.66 1.97-4.66 4.39 0 1.44.32 2.77.93 3.85.64 1.15 1.08 1.64 1.85 2.42.19.2.19.51 0 .71-.11.1-.24.15-.37.15zm7.17-1.85c-1.19 0-2.24-.3-3.1-.89-1.49-1.01-2.38-2.65-2.38-4.39 0-.28.22-.5.5-.5s.5.22.5.5c0 1.41.72 2.74 1.94 3.56.71.48 1.54.71 2.54.71.24 0 .64-.03 1.04-.1.27-.05.53.13.58.41.05.27-.13.53-.41.58-.57.11-1.07.12-1.21.12zM14.91 22c-.04 0-.09-.01-.13-.02-1.59-.44-2.63-1.03-3.72-2.1-1.4-1.39-2.17-3.24-2.17-5.22 0-1.62 1.38-2.94 3.08-2.94 1.7 0 3.08 1.32 3.08 2.94 0 1.07.93 1.94 2.08 1.94s2.08-.87 2.08-1.94c0-3.77-3.25-6.83-7.25-6.83-2.84 0-5.44 1.58-6.61 4.03-.39.81-.59 1.76-.59 2.8 0 .78.07 2.01.67 3.61.1.26-.03.55-.29.64-.26.1-.55-.04-.64-.29-.49-1.31-.73-2.61-.73-3.96 0-1.2.23-2.29.68-3.24 1.33-2.79 4.28-4.6 7.51-4.6 4.55 0 8.25 3.51 8.25 7.83 0 1.62-1.38 2.94-3.08 2.94s-3.08-1.32-3.08-2.94c0-1.07-.93-1.94-2.08-1.94s-2.08.87-2.08 1.94c0 1.71.66 3.31 1.87 4.51.95.94 1.86 1.46 3.27 1.85.27.07.42.35.35.61-.05.23-.26.38-.47.38z"/>
          </svg>
        );
      default:
        return (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        );
    }
  };

  const getLabel = () => {
    if (label) return label;
    switch (biometryType) {
      case 'face': return 'Sign in with Face ID';
      case 'fingerprint': return 'Sign in with Fingerprint';
      default: return 'Sign in with Biometrics';
    }
  };

  if (!isAvailable) {
    return null;
  }

  return (
    <div className={\`\${className}\`}>
      <button
        onClick={handleAuthenticate}
        disabled={isAuthenticating}
        className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-medium hover:bg-gray-800 dark:hover:bg-gray-100 disabled:opacity-50 transition-colors"
      >
        {isAuthenticating ? (
          <div className="w-6 h-6 border-2 border-current/30 border-t-current rounded-full animate-spin" />
        ) : (
          getIcon()
        )}
        <span>{isAuthenticating ? 'Authenticating...' : getLabel()}</span>
      </button>

      {error && (
        <p className="mt-2 text-sm text-red-500 text-center">{error}</p>
      )}
    </div>
  );
};
`,

        // Biometric Setup Component
        BiometricSetup: `
import React, { useState, useEffect } from 'react';
import { useBiometrics } from './useBiometrics';

interface BiometricSetupProps {
  userId: string;
  onSetupComplete?: (credentialId: string) => void;
  onSkip?: () => void;
  className?: string;
}

export const BiometricSetup: React.FC<BiometricSetupProps> = ({
  userId,
  onSetupComplete,
  onSkip,
  className = '',
}) => {
  const { isAvailable, biometryType, register, isAuthenticating } = useBiometrics();
  const [step, setStep] = useState<'intro' | 'setup' | 'success' | 'error'>('intro');
  const [error, setError] = useState<string | null>(null);

  const handleSetup = async () => {
    setStep('setup');
    setError(null);

    const result = await register(userId);

    if (result.success) {
      setStep('success');
      onSetupComplete?.(result.credentialId!);
    } else {
      setError(result.error || 'Setup failed');
      setStep('error');
    }
  };

  const getBiometryName = () => {
    switch (biometryType) {
      case 'face': return 'Face ID';
      case 'fingerprint': return 'Fingerprint';
      default: return 'Biometrics';
    }
  };

  const getBiometryIcon = () => {
    switch (biometryType) {
      case 'face':
        return (
          <svg className="w-20 h-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'fingerprint':
        return (
          <svg className="w-20 h-20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.81 4.47c-.08 0-.16-.02-.23-.06C15.66 3.42 14 3 12.01 3c-1.98 0-3.86.47-5.57 1.41-.24.13-.54.04-.68-.2-.13-.24-.04-.55.2-.68C7.82 2.52 9.86 2 12.01 2c2.13 0 3.99.47 6.03 1.52.25.13.34.43.21.67-.09.18-.26.28-.44.28z"/>
          </svg>
        );
      default:
        return (
          <svg className="w-20 h-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        );
    }
  };

  if (!isAvailable) {
    return null;
  }

  return (
    <div className={\`text-center p-8 \${className}\`}>
      {step === 'intro' && (
        <>
          <div className="mx-auto w-24 h-24 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6">
            {getBiometryIcon()}
          </div>

          <h2 className="text-2xl font-bold mb-2">Enable {getBiometryName()}</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-sm mx-auto">
            Sign in quickly and securely using {getBiometryName().toLowerCase()} instead of your password.
          </p>

          <div className="space-y-3 max-w-xs mx-auto">
            <button
              onClick={handleSetup}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
            >
              Enable {getBiometryName()}
            </button>

            {onSkip && (
              <button
                onClick={onSkip}
                className="w-full px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Not now
              </button>
            )}
          </div>
        </>
      )}

      {step === 'setup' && (
        <>
          <div className="mx-auto w-24 h-24 flex items-center justify-center mb-6">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          </div>

          <h2 className="text-2xl font-bold mb-2">Setting up {getBiometryName()}</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Follow the prompts to complete setup...
          </p>
        </>
      )}

      {step === 'success' && (
        <>
          <div className="mx-auto w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 mb-6">
            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h2 className="text-2xl font-bold mb-2">{getBiometryName()} Enabled</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            You can now sign in using {getBiometryName().toLowerCase()}.
          </p>
        </>
      )}

      {step === 'error' && (
        <>
          <div className="mx-auto w-24 h-24 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center text-red-600 dark:text-red-400 mb-6">
            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>

          <h2 className="text-2xl font-bold mb-2">Setup Failed</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>

          <div className="space-y-3 max-w-xs mx-auto">
            <button
              onClick={() => setStep('intro')}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>

            {onSkip && (
              <button
                onClick={onSkip}
                className="w-full px-6 py-3 text-gray-600 dark:text-gray-400"
              >
                Skip for now
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};
`,
      },
    },

    ios: {
      dependencies: ['SwiftUI', 'LocalAuthentication'],
      minVersion: '15.0',
      components: {
        // Native Biometric Authentication
        BiometricAuth: `
import SwiftUI
import LocalAuthentication

// MARK: - Biometric Type
enum BiometricType {
    case none
    case touchID
    case faceID

    var name: String {
        switch self {
        case .none: return "None"
        case .touchID: return "Touch ID"
        case .faceID: return "Face ID"
        }
    }

    var icon: String {
        switch self {
        case .none: return "lock.fill"
        case .touchID: return "touchid"
        case .faceID: return "faceid"
        }
    }
}

// MARK: - Biometric Manager
@MainActor
class BiometricManager: ObservableObject {
    static let shared = BiometricManager()

    @Published var isAvailable = false
    @Published var biometricType: BiometricType = .none
    @Published var isAuthenticating = false

    private let context = LAContext()

    init() {
        checkAvailability()
    }

    func checkAvailability() {
        var error: NSError?
        isAvailable = context.canEvaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, error: &error)

        if isAvailable {
            switch context.biometryType {
            case .touchID:
                biometricType = .touchID
            case .faceID:
                biometricType = .faceID
            default:
                biometricType = .none
            }
        } else {
            biometricType = .none
        }
    }

    func authenticate(
        reason: String = "Verify your identity",
        fallbackTitle: String? = nil
    ) async -> Result<Bool, Error> {
        let context = LAContext()
        context.localizedFallbackTitle = fallbackTitle ?? "Use Passcode"
        context.localizedCancelTitle = "Cancel"

        var error: NSError?
        guard context.canEvaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, error: &error) else {
            if let error = error {
                return .failure(error)
            }
            return .failure(NSError(domain: "BiometricAuth", code: -1, userInfo: [NSLocalizedDescriptionKey: "Biometrics not available"]))
        }

        isAuthenticating = true
        defer { isAuthenticating = false }

        do {
            let success = try await context.evaluatePolicy(
                .deviceOwnerAuthenticationWithBiometrics,
                localizedReason: reason
            )
            return .success(success)
        } catch {
            return .failure(error)
        }
    }

    func authenticateWithFallback(
        reason: String = "Verify your identity"
    ) async -> Result<Bool, Error> {
        let context = LAContext()

        var error: NSError?
        guard context.canEvaluatePolicy(.deviceOwnerAuthentication, error: &error) else {
            if let error = error {
                return .failure(error)
            }
            return .failure(NSError(domain: "BiometricAuth", code: -1, userInfo: [NSLocalizedDescriptionKey: "Authentication not available"]))
        }

        isAuthenticating = true
        defer { isAuthenticating = false }

        do {
            let success = try await context.evaluatePolicy(
                .deviceOwnerAuthentication,
                localizedReason: reason
            )
            return .success(success)
        } catch {
            return .failure(error)
        }
    }
}

// MARK: - Biometric Button View
struct BiometricButton: View {
    @StateObject private var manager = BiometricManager.shared

    let reason: String
    var label: String?
    var onSuccess: (() -> Void)?
    var onError: ((Error) -> Void)?

    init(
        reason: String = "Verify your identity",
        label: String? = nil,
        onSuccess: (() -> Void)? = nil,
        onError: ((Error) -> Void)? = nil
    ) {
        self.reason = reason
        self.label = label
        self.onSuccess = onSuccess
        self.onError = onError
    }

    var body: some View {
        if manager.isAvailable {
            Button(action: authenticate) {
                HStack(spacing: 12) {
                    if manager.isAuthenticating {
                        ProgressView()
                            .tint(.white)
                    } else {
                        Image(systemName: manager.biometricType.icon)
                            .font(.title2)
                    }

                    Text(buttonLabel)
                        .fontWeight(.semibold)
                }
                .frame(maxWidth: .infinity)
                .padding()
                .background(Color.primary)
                .foregroundColor(Color(.systemBackground))
                .cornerRadius(14)
            }
            .disabled(manager.isAuthenticating)
        }
    }

    private var buttonLabel: String {
        if manager.isAuthenticating {
            return "Authenticating..."
        }
        return label ?? "Sign in with \\(manager.biometricType.name)"
    }

    private func authenticate() {
        Task {
            let result = await manager.authenticate(reason: reason)

            switch result {
            case .success:
                onSuccess?()
            case .failure(let error):
                onError?(error)
            }
        }
    }
}

// MARK: - Biometric Setup View
struct BiometricSetupView: View {
    @StateObject private var manager = BiometricManager.shared
    @State private var setupComplete = false
    @State private var error: String?

    var onComplete: (() -> Void)?
    var onSkip: (() -> Void)?

    var body: some View {
        VStack(spacing: 24) {
            Spacer()

            // Icon
            ZStack {
                Circle()
                    .fill(Color.blue.opacity(0.1))
                    .frame(width: 120, height: 120)

                Image(systemName: manager.biometricType.icon)
                    .font(.system(size: 48))
                    .foregroundColor(.blue)
            }

            // Title
            VStack(spacing: 8) {
                Text("Enable \\(manager.biometricType.name)")
                    .font(.title)
                    .fontWeight(.bold)

                Text("Sign in quickly and securely using \\(manager.biometricType.name.lowercased()).")
                    .font(.body)
                    .foregroundColor(.secondary)
                    .multilineTextAlignment(.center)
                    .padding(.horizontal, 32)
            }

            Spacer()

            // Buttons
            VStack(spacing: 12) {
                Button(action: setupBiometrics) {
                    HStack {
                        Image(systemName: manager.biometricType.icon)
                        Text("Enable \\(manager.biometricType.name)")
                    }
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(Color.blue)
                    .foregroundColor(.white)
                    .cornerRadius(14)
                }

                if let onSkip = onSkip {
                    Button("Not now") {
                        onSkip()
                    }
                    .foregroundColor(.secondary)
                }
            }
            .padding(.horizontal)

            if let error = error {
                Text(error)
                    .font(.caption)
                    .foregroundColor(.red)
            }
        }
        .padding()
    }

    private func setupBiometrics() {
        Task {
            let result = await manager.authenticate(
                reason: "Verify to enable \\(manager.biometricType.name)"
            )

            switch result {
            case .success:
                setupComplete = true
                onComplete?()
            case .failure(let err):
                error = err.localizedDescription
            }
        }
    }
}

// MARK: - Protected Content Modifier
struct BiometricProtectedModifier: ViewModifier {
    @StateObject private var manager = BiometricManager.shared
    @State private var isUnlocked = false
    @State private var showError = false
    @State private var errorMessage = ""

    let reason: String
    let fallbackView: AnyView?

    func body(content: Content) -> some View {
        Group {
            if isUnlocked {
                content
            } else if let fallback = fallbackView {
                fallback
            } else {
                LockedView(
                    biometricType: manager.biometricType,
                    isAuthenticating: manager.isAuthenticating,
                    onUnlock: authenticate
                )
            }
        }
        .alert("Authentication Failed", isPresented: $showError) {
            Button("Try Again", action: authenticate)
            Button("Cancel", role: .cancel) {}
        } message: {
            Text(errorMessage)
        }
        .onAppear {
            if manager.isAvailable {
                authenticate()
            }
        }
    }

    private func authenticate() {
        Task {
            let result = await manager.authenticate(reason: reason)

            switch result {
            case .success(let success):
                isUnlocked = success
            case .failure(let error):
                errorMessage = error.localizedDescription
                showError = true
            }
        }
    }
}

struct LockedView: View {
    let biometricType: BiometricType
    let isAuthenticating: Bool
    let onUnlock: () -> Void

    var body: some View {
        VStack(spacing: 20) {
            Image(systemName: "lock.fill")
                .font(.system(size: 60))
                .foregroundColor(.secondary)

            Text("Content Locked")
                .font(.title2)
                .fontWeight(.semibold)

            Text("Authenticate to view this content")
                .foregroundColor(.secondary)

            Button(action: onUnlock) {
                HStack {
                    if isAuthenticating {
                        ProgressView()
                    } else {
                        Image(systemName: biometricType.icon)
                    }
                    Text("Unlock")
                }
                .padding(.horizontal, 24)
                .padding(.vertical, 12)
                .background(Color.blue)
                .foregroundColor(.white)
                .cornerRadius(10)
            }
            .disabled(isAuthenticating)
        }
    }
}

extension View {
    func biometricProtected(
        reason: String = "Verify your identity",
        fallback: AnyView? = nil
    ) -> some View {
        modifier(BiometricProtectedModifier(reason: reason, fallbackView: fallback))
    }
}

// MARK: - Usage Example
struct BiometricExampleView: View {
    @State private var isAuthenticated = false
    @State private var showSetup = false

    var body: some View {
        VStack(spacing: 20) {
            if isAuthenticated {
                Text("Welcome!")
                    .font(.largeTitle)
            } else {
                BiometricButton(
                    reason: "Sign in to your account",
                    onSuccess: {
                        isAuthenticated = true
                    },
                    onError: { error in
                        print("Auth error: \\(error)")
                    }
                )
            }
        }
        .padding()
        .sheet(isPresented: $showSetup) {
            BiometricSetupView(
                onComplete: { showSetup = false },
                onSkip: { showSetup = false }
            )
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
        'androidx.biometric:biometric:1.2.0-alpha05',
      ],
      minSdk: 24,
      components: {
        // Compose Biometric Authentication
        BiometricAuth: `
package com.hublab.capsules.biometrics

import android.os.Build
import androidx.biometric.BiometricManager
import androidx.biometric.BiometricManager.Authenticators
import androidx.biometric.BiometricPrompt
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.core.content.ContextCompat
import androidx.fragment.app.FragmentActivity

// Biometric Types
enum class BiometricType {
    NONE,
    FINGERPRINT,
    FACE,
    IRIS
}

// Biometric State
sealed class BiometricState {
    object Idle : BiometricState()
    object Authenticating : BiometricState()
    object Success : BiometricState()
    data class Error(val message: String) : BiometricState()
}

// Biometric Helper
object BiometricHelper {
    fun getBiometricType(context: android.content.Context): BiometricType {
        val biometricManager = BiometricManager.from(context)

        return when (biometricManager.canAuthenticate(Authenticators.BIOMETRIC_STRONG)) {
            BiometricManager.BIOMETRIC_SUCCESS -> {
                // Check for specific biometric types
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
                    BiometricType.FINGERPRINT // Default to fingerprint
                } else {
                    BiometricType.FINGERPRINT
                }
            }
            else -> BiometricType.NONE
        }
    }

    fun isAvailable(context: android.content.Context): Boolean {
        val biometricManager = BiometricManager.from(context)
        return biometricManager.canAuthenticate(
            Authenticators.BIOMETRIC_STRONG or Authenticators.DEVICE_CREDENTIAL
        ) == BiometricManager.BIOMETRIC_SUCCESS
    }

    fun authenticate(
        activity: FragmentActivity,
        title: String = "Authenticate",
        subtitle: String = "Verify your identity",
        negativeButtonText: String = "Cancel",
        allowDeviceCredential: Boolean = true,
        onSuccess: () -> Unit,
        onError: (String) -> Unit,
        onCancel: () -> Unit = {}
    ) {
        val executor = ContextCompat.getMainExecutor(activity)

        val callback = object : BiometricPrompt.AuthenticationCallback() {
            override fun onAuthenticationSucceeded(result: BiometricPrompt.AuthenticationResult) {
                onSuccess()
            }

            override fun onAuthenticationError(errorCode: Int, errString: CharSequence) {
                if (errorCode == BiometricPrompt.ERROR_USER_CANCELED ||
                    errorCode == BiometricPrompt.ERROR_NEGATIVE_BUTTON) {
                    onCancel()
                } else {
                    onError(errString.toString())
                }
            }

            override fun onAuthenticationFailed() {
                // Called when biometric is valid but not recognized
                // Don't call onError here - let user retry
            }
        }

        val biometricPrompt = BiometricPrompt(activity, executor, callback)

        val promptInfoBuilder = BiometricPrompt.PromptInfo.Builder()
            .setTitle(title)
            .setSubtitle(subtitle)

        if (allowDeviceCredential) {
            promptInfoBuilder.setAllowedAuthenticators(
                Authenticators.BIOMETRIC_STRONG or Authenticators.DEVICE_CREDENTIAL
            )
        } else {
            promptInfoBuilder
                .setNegativeButtonText(negativeButtonText)
                .setAllowedAuthenticators(Authenticators.BIOMETRIC_STRONG)
        }

        biometricPrompt.authenticate(promptInfoBuilder.build())
    }
}

// Biometric Button Composable
@Composable
fun BiometricButton(
    modifier: Modifier = Modifier,
    title: String = "Authenticate",
    subtitle: String = "Verify your identity",
    buttonLabel: String? = null,
    onSuccess: () -> Unit,
    onError: (String) -> Unit = {},
    onCancel: () -> Unit = {}
) {
    val context = LocalContext.current
    val activity = context as? FragmentActivity
    var state by remember { mutableStateOf<BiometricState>(BiometricState.Idle) }
    val biometricType = remember { BiometricHelper.getBiometricType(context) }
    val isAvailable = remember { BiometricHelper.isAvailable(context) }

    if (!isAvailable || activity == null) {
        return
    }

    val icon = when (biometricType) {
        BiometricType.FINGERPRINT -> Icons.Default.Fingerprint
        BiometricType.FACE -> Icons.Default.Face
        else -> Icons.Default.Lock
    }

    val label = buttonLabel ?: when (biometricType) {
        BiometricType.FINGERPRINT -> "Sign in with Fingerprint"
        BiometricType.FACE -> "Sign in with Face"
        else -> "Sign in with Biometrics"
    }

    Button(
        onClick = {
            state = BiometricState.Authenticating
            BiometricHelper.authenticate(
                activity = activity,
                title = title,
                subtitle = subtitle,
                onSuccess = {
                    state = BiometricState.Success
                    onSuccess()
                },
                onError = { error ->
                    state = BiometricState.Error(error)
                    onError(error)
                },
                onCancel = {
                    state = BiometricState.Idle
                    onCancel()
                }
            )
        },
        modifier = modifier.fillMaxWidth(),
        enabled = state != BiometricState.Authenticating
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.Center
        ) {
            if (state == BiometricState.Authenticating) {
                CircularProgressIndicator(
                    modifier = Modifier.size(24.dp),
                    color = MaterialTheme.colorScheme.onPrimary
                )
            } else {
                Icon(
                    imageVector = icon,
                    contentDescription = null,
                    modifier = Modifier.size(24.dp)
                )
            }

            Spacer(modifier = Modifier.width(12.dp))

            Text(
                text = if (state == BiometricState.Authenticating) "Authenticating..." else label,
                fontWeight = FontWeight.SemiBold
            )
        }
    }

    // Show error if any
    if (state is BiometricState.Error) {
        Text(
            text = (state as BiometricState.Error).message,
            color = MaterialTheme.colorScheme.error,
            style = MaterialTheme.typography.bodySmall,
            modifier = Modifier.padding(top = 8.dp)
        )
    }
}

// Biometric Setup Screen
@Composable
fun BiometricSetupScreen(
    onComplete: () -> Unit,
    onSkip: (() -> Unit)? = null
) {
    val context = LocalContext.current
    val activity = context as? FragmentActivity
    val biometricType = remember { BiometricHelper.getBiometricType(context) }
    var state by remember { mutableStateOf<BiometricState>(BiometricState.Idle) }

    val biometricName = when (biometricType) {
        BiometricType.FINGERPRINT -> "Fingerprint"
        BiometricType.FACE -> "Face Recognition"
        else -> "Biometrics"
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Spacer(modifier = Modifier.weight(1f))

        // Icon
        Box(
            modifier = Modifier
                .size(120.dp)
                .clip(CircleShape)
                .background(MaterialTheme.colorScheme.primaryContainer),
            contentAlignment = Alignment.Center
        ) {
            Icon(
                imageVector = when (biometricType) {
                    BiometricType.FINGERPRINT -> Icons.Default.Fingerprint
                    BiometricType.FACE -> Icons.Default.Face
                    else -> Icons.Default.Lock
                },
                contentDescription = null,
                modifier = Modifier.size(60.dp),
                tint = MaterialTheme.colorScheme.primary
            )
        }

        Spacer(modifier = Modifier.height(32.dp))

        // Title
        Text(
            text = "Enable $biometricName",
            style = MaterialTheme.typography.headlineMedium,
            fontWeight = FontWeight.Bold
        )

        Spacer(modifier = Modifier.height(12.dp))

        // Description
        Text(
            text = "Sign in quickly and securely using \${biometricName.lowercase()}.",
            style = MaterialTheme.typography.bodyLarge,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
            textAlign = TextAlign.Center,
            modifier = Modifier.padding(horizontal = 32.dp)
        )

        Spacer(modifier = Modifier.weight(1f))

        // Buttons
        Column(
            modifier = Modifier.fillMaxWidth(),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            Button(
                onClick = {
                    if (activity != null) {
                        state = BiometricState.Authenticating
                        BiometricHelper.authenticate(
                            activity = activity,
                            title = "Enable $biometricName",
                            subtitle = "Verify to enable $biometricName sign-in",
                            onSuccess = {
                                state = BiometricState.Success
                                onComplete()
                            },
                            onError = { error ->
                                state = BiometricState.Error(error)
                            },
                            onCancel = {
                                state = BiometricState.Idle
                            }
                        )
                    }
                },
                modifier = Modifier.fillMaxWidth(),
                enabled = state != BiometricState.Authenticating
            ) {
                if (state == BiometricState.Authenticating) {
                    CircularProgressIndicator(
                        modifier = Modifier.size(24.dp),
                        color = MaterialTheme.colorScheme.onPrimary
                    )
                } else {
                    Icon(
                        imageVector = when (biometricType) {
                            BiometricType.FINGERPRINT -> Icons.Default.Fingerprint
                            else -> Icons.Default.Lock
                        },
                        contentDescription = null
                    )
                }
                Spacer(modifier = Modifier.width(8.dp))
                Text("Enable $biometricName")
            }

            onSkip?.let { skip ->
                TextButton(
                    onClick = skip,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text("Not now")
                }
            }
        }

        // Error message
        if (state is BiometricState.Error) {
            Spacer(modifier = Modifier.height(12.dp))
            Text(
                text = (state as BiometricState.Error).message,
                color = MaterialTheme.colorScheme.error,
                style = MaterialTheme.typography.bodySmall
            )
        }
    }
}

// Extension to get background color
@Composable
private fun Modifier.background(color: androidx.compose.ui.graphics.Color) =
    this.then(Modifier.drawBehind { drawRect(color) })

private fun Modifier.drawBehind(onDraw: androidx.compose.ui.graphics.drawscope.DrawScope.() -> Unit) =
    this.then(androidx.compose.ui.draw.drawBehind(onDraw))
`,
      },
    },

    desktop: {
      dependencies: ['tauri', 'react', 'tailwindcss'],
      components: {
        // Desktop Biometrics (Windows Hello / Touch ID)
        DesktopBiometrics: `
import React, { useState, useCallback, useEffect } from 'react';

interface BiometricResult {
  success: boolean;
  error?: string;
}

interface UseDesktopBiometricsReturn {
  isAvailable: boolean;
  biometryType: 'fingerprint' | 'face' | 'none';
  authenticate: (reason?: string) => Promise<BiometricResult>;
  isAuthenticating: boolean;
}

declare global {
  interface Window {
    __TAURI__?: {
      invoke: (cmd: string, args?: unknown) => Promise<unknown>;
    };
  }
}

export function useDesktopBiometrics(): UseDesktopBiometricsReturn {
  const [isAvailable, setIsAvailable] = useState(false);
  const [biometryType, setBiometryType] = useState<'fingerprint' | 'face' | 'none'>('none');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  useEffect(() => {
    // Check WebAuthn availability as fallback
    if ('PublicKeyCredential' in window) {
      PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
        .then(available => {
          setIsAvailable(available);
          if (available) {
            // Detect platform
            const isMac = /Mac/i.test(navigator.userAgent);
            const isWindows = /Windows/i.test(navigator.userAgent);

            if (isMac) {
              setBiometryType('fingerprint'); // Touch ID
            } else if (isWindows) {
              setBiometryType('face'); // Windows Hello (could be face or fingerprint)
            }
          }
        })
        .catch(() => setIsAvailable(false));
    }
  }, []);

  const authenticate = useCallback(async (reason?: string): Promise<BiometricResult> => {
    if (!isAvailable) {
      return { success: false, error: 'Biometrics not available' };
    }

    setIsAuthenticating(true);

    try {
      // Try Tauri native biometrics first
      if (window.__TAURI__) {
        const result = await window.__TAURI__.invoke('authenticate_biometric', {
          reason: reason || 'Verify your identity',
        });
        return { success: result === true };
      }

      // Fall back to WebAuthn
      const challenge = crypto.getRandomValues(new Uint8Array(32));

      await navigator.credentials.get({
        publicKey: {
          challenge,
          rpId: window.location.hostname,
          userVerification: 'required',
          timeout: 60000,
        },
      });

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Authentication failed',
      };
    } finally {
      setIsAuthenticating(false);
    }
  }, [isAvailable]);

  return {
    isAvailable,
    biometryType,
    authenticate,
    isAuthenticating,
  };
}

// Biometric Button Component
interface BiometricButtonProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  reason?: string;
  label?: string;
  className?: string;
}

export const BiometricButton: React.FC<BiometricButtonProps> = ({
  onSuccess,
  onError,
  reason,
  label,
  className = '',
}) => {
  const { isAvailable, biometryType, authenticate, isAuthenticating } = useDesktopBiometrics();
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    setError(null);
    const result = await authenticate(reason);

    if (result.success) {
      onSuccess?.();
    } else {
      setError(result.error || 'Authentication failed');
      onError?.(result.error || 'Authentication failed');
    }
  };

  const getIcon = () => {
    if (biometryType === 'fingerprint') {
      return (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.81 4.47c-.08 0-.16-.02-.23-.06C15.66 3.42 14 3 12.01 3c-1.98 0-3.86.47-5.57 1.41-.24.13-.54.04-.68-.2-.13-.24-.04-.55.2-.68C7.82 2.52 9.86 2 12.01 2c2.13 0 3.99.47 6.03 1.52.25.13.34.43.21.67-.09.18-.26.28-.44.28z"/>
        </svg>
      );
    }
    return (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
  };

  const getLabel = () => {
    if (label) return label;
    if (biometryType === 'fingerprint') return 'Sign in with Touch ID';
    if (biometryType === 'face') return 'Sign in with Windows Hello';
    return 'Sign in with Biometrics';
  };

  if (!isAvailable) {
    return null;
  }

  return (
    <div className={className}>
      <button
        onClick={handleClick}
        disabled={isAuthenticating}
        className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-medium hover:bg-gray-800 dark:hover:bg-gray-100 disabled:opacity-50 transition-colors"
      >
        {isAuthenticating ? (
          <div className="w-6 h-6 border-2 border-current/30 border-t-current rounded-full animate-spin" />
        ) : (
          getIcon()
        )}
        <span>{isAuthenticating ? 'Authenticating...' : getLabel()}</span>
      </button>

      {error && (
        <p className="mt-2 text-sm text-red-500 text-center">{error}</p>
      )}
    </div>
  );
};

// Protected Content Wrapper
interface ProtectedContentProps {
  children: React.ReactNode;
  reason?: string;
  fallback?: React.ReactNode;
  className?: string;
}

export const ProtectedContent: React.FC<ProtectedContentProps> = ({
  children,
  reason = 'Verify your identity to view this content',
  fallback,
  className = '',
}) => {
  const { isAvailable, authenticate, isAuthenticating, biometryType } = useDesktopBiometrics();
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUnlock = async () => {
    setError(null);
    const result = await authenticate(reason);

    if (result.success) {
      setIsUnlocked(true);
    } else {
      setError(result.error || 'Authentication failed');
    }
  };

  if (isUnlocked) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <div className={\`flex flex-col items-center justify-center p-12 \${className}\`}>
      <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
        <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      </div>

      <h3 className="text-xl font-semibold mb-2">Content Locked</h3>
      <p className="text-gray-500 mb-6 text-center max-w-sm">{reason}</p>

      {isAvailable && (
        <button
          onClick={handleUnlock}
          disabled={isAuthenticating}
          className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isAuthenticating ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
            </svg>
          )}
          <span>{isAuthenticating ? 'Unlocking...' : 'Unlock'}</span>
        </button>
      )}

      {error && (
        <p className="mt-4 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};
`,
      },
    },
  },

  examples: [
    {
      title: 'Biometric Button',
      description: 'Simple biometric authentication button',
      code: `
<BiometricButton
  reason="Sign in to your account"
  onSuccess={() => navigateToHome()}
  onError={(error) => showError(error)}
/>
`,
    },
    {
      title: 'Check Availability',
      description: 'Check biometric availability with hook',
      code: `
const { isAvailable, biometryType, authenticate } = useBiometrics();

if (isAvailable) {
  const result = await authenticate({ reason: 'Verify identity' });
  if (result.success) {
    // Authenticated!
  }
}
`,
    },
    {
      title: 'Biometric Setup',
      description: 'Setup screen for enabling biometrics',
      code: `
<BiometricSetup
  userId={currentUser.id}
  onSetupComplete={(credentialId) => {
    saveCredential(credentialId);
    showSuccess('Biometrics enabled!');
  }}
  onSkip={() => navigateToHome()}
/>
`,
    },
    {
      title: 'Protected Content',
      description: 'Content that requires biometric unlock',
      code: `
<ProtectedContent
  reason="Authenticate to view sensitive data"
  fallback={<LockedPlaceholder />}
>
  <SensitiveData />
</ProtectedContent>
`,
    },
  ],
}
