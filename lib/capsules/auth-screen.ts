/**
 * AuthScreen Capsule - Multi-Platform
 *
 * Complete authentication screen with login, signup, and password reset flows.
 */

import { CapsuleDefinition } from './types'

export const AuthScreenCapsule: CapsuleDefinition = {
  id: 'auth-screen',
  name: 'AuthScreen',
  description: 'Complete authentication screen with login, signup, and password reset',
  category: 'screen',
  tags: ['auth', 'login', 'signup', 'screen', 'authentication'],
  version: '1.0.0',

  props: [
    {
      name: 'mode',
      type: 'select',
      required: false,
      default: 'login',
      options: ['login', 'signup', 'forgotPassword'],
      description: 'Initial authentication mode'
    },
    {
      name: 'onLogin',
      type: 'action',
      required: true,
      description: 'Callback when user submits login'
    },
    {
      name: 'onSignup',
      type: 'action',
      required: false,
      description: 'Callback when user submits signup'
    },
    {
      name: 'onForgotPassword',
      type: 'action',
      required: false,
      description: 'Callback for forgot password'
    },
    {
      name: 'onSocialLogin',
      type: 'action',
      required: false,
      description: 'Callback for social login (provider: google|apple|github)'
    },
    {
      name: 'logo',
      type: 'string',
      required: false,
      description: 'Logo image URL'
    },
    {
      name: 'title',
      type: 'string',
      required: false,
      default: 'Welcome',
      description: 'Screen title'
    },
    {
      name: 'showSocialLogin',
      type: 'boolean',
      required: false,
      default: true,
      description: 'Show social login buttons'
    },
    {
      name: 'socialProviders',
      type: 'array',
      required: false,
      default: ['google', 'apple'],
      description: 'Social login providers to show'
    }
  ],

  platforms: {
    web: {
      framework: 'react',
      typescript: true,
      dependencies: ['react'],
      code: `
import React, { useState } from 'react'

type AuthMode = 'login' | 'signup' | 'forgotPassword'
type SocialProvider = 'google' | 'apple' | 'github'

interface AuthScreenProps {
  mode?: AuthMode
  onLogin: (email: string, password: string) => Promise<void>
  onSignup?: (email: string, password: string, name: string) => Promise<void>
  onForgotPassword?: (email: string) => Promise<void>
  onSocialLogin?: (provider: SocialProvider) => Promise<void>
  logo?: string
  title?: string
  showSocialLogin?: boolean
  socialProviders?: SocialProvider[]
}

export function AuthScreen({
  mode: initialMode = 'login',
  onLogin,
  onSignup,
  onForgotPassword,
  onSocialLogin,
  logo,
  title = 'Welcome',
  showSocialLogin = true,
  socialProviders = ['google', 'apple']
}: AuthScreenProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      if (mode === 'login') {
        await onLogin(email, password)
      } else if (mode === 'signup') {
        if (password !== confirmPassword) {
          throw new Error('Passwords do not match')
        }
        if (onSignup) {
          await onSignup(email, password, name)
        }
      } else if (mode === 'forgotPassword') {
        if (onForgotPassword) {
          await onForgotPassword(email)
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const socialIcons: Record<SocialProvider, React.ReactNode> = {
    google: (
      <svg className="w-5 h-5" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
    ),
    apple: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
      </svg>
    ),
    github: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
      </svg>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-full max-w-md">
        {/* Logo */}
        {logo && (
          <div className="flex justify-center mb-8">
            <img src={logo} alt="Logo" className="h-12 w-auto" />
          </div>
        )}

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">
              {mode === 'login' && title}
              {mode === 'signup' && 'Create Account'}
              {mode === 'forgotPassword' && 'Reset Password'}
            </h1>
            <p className="text-gray-500 mt-2">
              {mode === 'login' && 'Sign in to continue'}
              {mode === 'signup' && 'Fill in your details to get started'}
              {mode === 'forgotPassword' && "We'll send you a reset link"}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="John Doe"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="you@example.com"
                required
              />
            </div>

            {mode !== 'forgotPassword' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-12"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            )}

            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            )}

            {mode === 'login' && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setMode('forgotPassword')}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Processing...
                </span>
              ) : (
                <>
                  {mode === 'login' && 'Sign In'}
                  {mode === 'signup' && 'Create Account'}
                  {mode === 'forgotPassword' && 'Send Reset Link'}
                </>
              )}
            </button>
          </form>

          {/* Social Login */}
          {showSocialLogin && mode !== 'forgotPassword' && onSocialLogin && (
            <>
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {socialProviders.map((provider) => (
                  <button
                    key={provider}
                    onClick={() => onSocialLogin(provider)}
                    className="flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    {socialIcons[provider]}
                    <span className="capitalize">{provider}</span>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Mode Switch */}
          <div className="mt-8 text-center text-sm text-gray-600">
            {mode === 'login' && onSignup && (
              <>
                Don't have an account?{' '}
                <button
                  onClick={() => setMode('signup')}
                  className="text-blue-600 hover:text-blue-700 font-semibold"
                >
                  Sign up
                </button>
              </>
            )}
            {mode === 'signup' && (
              <>
                Already have an account?{' '}
                <button
                  onClick={() => setMode('login')}
                  className="text-blue-600 hover:text-blue-700 font-semibold"
                >
                  Sign in
                </button>
              </>
            )}
            {mode === 'forgotPassword' && (
              <button
                onClick={() => setMode('login')}
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                Back to sign in
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
`
    },

    ios: {
      framework: 'swiftui',
      minVersion: '15.0',
      dependencies: [],
      imports: ['SwiftUI', 'AuthenticationServices'],
      code: `
import SwiftUI
import AuthenticationServices

enum AuthMode {
    case login, signup, forgotPassword
}

enum SocialProvider: String, CaseIterable {
    case google, apple, github
}

struct AuthScreen: View {
    @State private var mode: AuthMode = .login
    @State private var email = ""
    @State private var password = ""
    @State private var confirmPassword = ""
    @State private var name = ""
    @State private var isLoading = false
    @State private var errorMessage: String? = nil
    @State private var showPassword = false

    var onLogin: (String, String) async throws -> Void
    var onSignup: ((String, String, String) async throws -> Void)?
    var onForgotPassword: ((String) async throws -> Void)?
    var onSocialLogin: ((SocialProvider) async throws -> Void)?
    var logo: String?
    var title: String = "Welcome"
    var showSocialLogin: Bool = true
    var socialProviders: [SocialProvider] = [.google, .apple]

    var body: some View {
        ScrollView {
            VStack(spacing: 32) {
                // Logo
                if let logo = logo {
                    AsyncImage(url: URL(string: logo)) { image in
                        image
                            .resizable()
                            .scaledToFit()
                            .frame(height: 48)
                    } placeholder: {
                        ProgressView()
                    }
                }

                // Header
                VStack(spacing: 8) {
                    Text(headerTitle)
                        .font(.title.bold())

                    Text(headerSubtitle)
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                }

                // Error Message
                if let error = errorMessage {
                    Text(error)
                        .font(.footnote)
                        .foregroundColor(.white)
                        .padding()
                        .frame(maxWidth: .infinity)
                        .background(Color.red.opacity(0.9))
                        .cornerRadius(12)
                }

                // Form
                VStack(spacing: 16) {
                    if mode == .signup {
                        HubLabTextField(
                            label: "Full Name",
                            text: $name,
                            placeholder: "John Doe"
                        )
                    }

                    HubLabTextField(
                        label: "Email",
                        text: $email,
                        placeholder: "you@example.com",
                        keyboardType: .emailAddress,
                        autocapitalization: .none
                    )

                    if mode != .forgotPassword {
                        HubLabSecureField(
                            label: "Password",
                            text: $password,
                            showPassword: $showPassword
                        )
                    }

                    if mode == .signup {
                        HubLabSecureField(
                            label: "Confirm Password",
                            text: $confirmPassword,
                            showPassword: .constant(false)
                        )
                    }

                    if mode == .login {
                        HStack {
                            Spacer()
                            Button("Forgot password?") {
                                withAnimation {
                                    mode = .forgotPassword
                                }
                            }
                            .font(.footnote)
                            .foregroundColor(.blue)
                        }
                    }
                }

                // Submit Button
                Button(action: handleSubmit) {
                    HStack {
                        if isLoading {
                            ProgressView()
                                .progressViewStyle(CircularProgressViewStyle(tint: .white))
                        }
                        Text(submitButtonTitle)
                    }
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(Color.blue)
                    .foregroundColor(.white)
                    .cornerRadius(12)
                }
                .disabled(isLoading)

                // Social Login
                if showSocialLogin && mode != .forgotPassword {
                    VStack(spacing: 16) {
                        HStack {
                            Rectangle()
                                .fill(Color.gray.opacity(0.3))
                                .frame(height: 1)
                            Text("or continue with")
                                .font(.footnote)
                                .foregroundColor(.secondary)
                            Rectangle()
                                .fill(Color.gray.opacity(0.3))
                                .frame(height: 1)
                        }

                        HStack(spacing: 12) {
                            ForEach(socialProviders, id: \\.self) { provider in
                                Button(action: { handleSocialLogin(provider) }) {
                                    HStack {
                                        socialIcon(for: provider)
                                        Text(provider.rawValue.capitalized)
                                    }
                                    .frame(maxWidth: .infinity)
                                    .padding()
                                    .background(Color(.secondarySystemBackground))
                                    .cornerRadius(12)
                                }
                            }
                        }
                    }
                }

                // Mode Switch
                HStack {
                    Text(modeSwitchText)
                        .foregroundColor(.secondary)
                    Button(modeSwitchAction) {
                        withAnimation {
                            toggleMode()
                        }
                    }
                    .fontWeight(.semibold)
                }
                .font(.footnote)
            }
            .padding(24)
        }
        .background(Color(.systemGroupedBackground))
    }

    // MARK: - Computed Properties
    private var headerTitle: String {
        switch mode {
        case .login: return title
        case .signup: return "Create Account"
        case .forgotPassword: return "Reset Password"
        }
    }

    private var headerSubtitle: String {
        switch mode {
        case .login: return "Sign in to continue"
        case .signup: return "Fill in your details to get started"
        case .forgotPassword: return "We'll send you a reset link"
        }
    }

    private var submitButtonTitle: String {
        switch mode {
        case .login: return "Sign In"
        case .signup: return "Create Account"
        case .forgotPassword: return "Send Reset Link"
        }
    }

    private var modeSwitchText: String {
        switch mode {
        case .login: return "Don't have an account?"
        case .signup: return "Already have an account?"
        case .forgotPassword: return ""
        }
    }

    private var modeSwitchAction: String {
        switch mode {
        case .login: return "Sign up"
        case .signup: return "Sign in"
        case .forgotPassword: return "Back to sign in"
        }
    }

    // MARK: - Actions
    private func handleSubmit() {
        errorMessage = nil
        isLoading = true

        Task {
            do {
                switch mode {
                case .login:
                    try await onLogin(email, password)
                case .signup:
                    guard password == confirmPassword else {
                        throw AuthError.passwordMismatch
                    }
                    try await onSignup?(email, password, name)
                case .forgotPassword:
                    try await onForgotPassword?(email)
                }
            } catch {
                errorMessage = error.localizedDescription
            }
            isLoading = false
        }
    }

    private func handleSocialLogin(_ provider: SocialProvider) {
        Task {
            do {
                try await onSocialLogin?(provider)
            } catch {
                errorMessage = error.localizedDescription
            }
        }
    }

    private func toggleMode() {
        switch mode {
        case .login:
            mode = onSignup != nil ? .signup : .login
        case .signup, .forgotPassword:
            mode = .login
        }
        errorMessage = nil
    }

    @ViewBuilder
    private func socialIcon(for provider: SocialProvider) -> some View {
        switch provider {
        case .google:
            Image(systemName: "g.circle.fill")
                .foregroundColor(.red)
        case .apple:
            Image(systemName: "apple.logo")
                .foregroundColor(.primary)
        case .github:
            Image(systemName: "chevron.left.forwardslash.chevron.right")
                .foregroundColor(.primary)
        }
    }
}

enum AuthError: LocalizedError {
    case passwordMismatch

    var errorDescription: String? {
        switch self {
        case .passwordMismatch:
            return "Passwords do not match"
        }
    }
}

// MARK: - Helper Views
struct HubLabTextField: View {
    let label: String
    @Binding var text: String
    var placeholder: String = ""
    var keyboardType: UIKeyboardType = .default
    var autocapitalization: TextInputAutocapitalization = .sentences

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text(label)
                .font(.subheadline)
                .fontWeight(.medium)
            TextField(placeholder, text: $text)
                .keyboardType(keyboardType)
                .textInputAutocapitalization(autocapitalization)
                .padding()
                .background(Color(.secondarySystemBackground))
                .cornerRadius(12)
        }
    }
}

struct HubLabSecureField: View {
    let label: String
    @Binding var text: String
    @Binding var showPassword: Bool

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text(label)
                .font(.subheadline)
                .fontWeight(.medium)
            HStack {
                if showPassword {
                    TextField("••••••••", text: $text)
                } else {
                    SecureField("••••••••", text: $text)
                }
                Button(action: { showPassword.toggle() }) {
                    Image(systemName: showPassword ? "eye.slash" : "eye")
                        .foregroundColor(.secondary)
                }
            }
            .padding()
            .background(Color(.secondarySystemBackground))
            .cornerRadius(12)
        }
    }
}

// MARK: - Preview
#Preview("Auth Screen - Login") {
    AuthScreen(
        onLogin: { email, password in
            print("Login: \\(email)")
        },
        onSignup: { email, password, name in
            print("Signup: \\(email)")
        }
    )
}

#Preview("Auth Screen - Signup") {
    AuthScreen(
        onLogin: { _, _ in },
        onSignup: { email, password, name in
            print("Signup: \\(email)")
        }
    )
}
`
    },

    android: {
      framework: 'compose',
      minSdk: 24,
      dependencies: [
        'androidx.compose.material3:material3',
        'androidx.compose.material:material-icons-extended'
      ],
      imports: [
        'androidx.compose.material3.*',
        'androidx.compose.foundation.layout.*',
        'androidx.compose.runtime.*',
        'androidx.compose.ui.*',
        'androidx.compose.material.icons.Icons',
        'androidx.compose.material.icons.filled.*'
      ],
      code: `
package com.hublab.components

import androidx.compose.animation.*
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import kotlinx.coroutines.launch

enum class AuthMode { Login, Signup, ForgotPassword }
enum class SocialProvider { Google, Apple, Github }

@Composable
fun AuthScreen(
    onLogin: suspend (email: String, password: String) -> Unit,
    onSignup: (suspend (email: String, password: String, name: String) -> Unit)? = null,
    onForgotPassword: (suspend (email: String) -> Unit)? = null,
    onSocialLogin: (suspend (provider: SocialProvider) -> Unit)? = null,
    title: String = "Welcome",
    showSocialLogin: Boolean = true,
    socialProviders: List<SocialProvider> = listOf(SocialProvider.Google, SocialProvider.Apple),
    modifier: Modifier = Modifier
) {
    var mode by remember { mutableStateOf(AuthMode.Login) }
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var confirmPassword by remember { mutableStateOf("") }
    var name by remember { mutableStateOf("") }
    var isLoading by remember { mutableStateOf(false) }
    var errorMessage by remember { mutableStateOf<String?>(null) }
    var showPassword by remember { mutableStateOf(false) }

    val scope = rememberCoroutineScope()

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
            .verticalScroll(rememberScrollState())
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Spacer(modifier = Modifier.height(48.dp))

        // Header
        Text(
            text = when (mode) {
                AuthMode.Login -> title
                AuthMode.Signup -> "Create Account"
                AuthMode.ForgotPassword -> "Reset Password"
            },
            style = MaterialTheme.typography.headlineMedium,
            color = MaterialTheme.colorScheme.onBackground
        )

        Spacer(modifier = Modifier.height(8.dp))

        Text(
            text = when (mode) {
                AuthMode.Login -> "Sign in to continue"
                AuthMode.Signup -> "Fill in your details to get started"
                AuthMode.ForgotPassword -> "We'll send you a reset link"
            },
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )

        Spacer(modifier = Modifier.height(32.dp))

        // Error Message
        AnimatedVisibility(visible = errorMessage != null) {
            Surface(
                modifier = Modifier.fillMaxWidth(),
                color = MaterialTheme.colorScheme.errorContainer,
                shape = RoundedCornerShape(12.dp)
            ) {
                Text(
                    text = errorMessage ?: "",
                    modifier = Modifier.padding(16.dp),
                    color = MaterialTheme.colorScheme.onErrorContainer,
                    style = MaterialTheme.typography.bodySmall
                )
            }
            Spacer(modifier = Modifier.height(16.dp))
        }

        // Form Card
        Surface(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(16.dp),
            tonalElevation = 2.dp
        ) {
            Column(
                modifier = Modifier.padding(20.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                // Name field (signup only)
                AnimatedVisibility(visible = mode == AuthMode.Signup) {
                    OutlinedTextField(
                        value = name,
                        onValueChange = { name = it },
                        label = { Text("Full Name") },
                        modifier = Modifier.fillMaxWidth(),
                        singleLine = true,
                        shape = RoundedCornerShape(12.dp)
                    )
                }

                // Email field
                OutlinedTextField(
                    value = email,
                    onValueChange = { email = it },
                    label = { Text("Email") },
                    modifier = Modifier.fillMaxWidth(),
                    singleLine = true,
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email),
                    shape = RoundedCornerShape(12.dp)
                )

                // Password field
                AnimatedVisibility(visible = mode != AuthMode.ForgotPassword) {
                    OutlinedTextField(
                        value = password,
                        onValueChange = { password = it },
                        label = { Text("Password") },
                        modifier = Modifier.fillMaxWidth(),
                        singleLine = true,
                        visualTransformation = if (showPassword) VisualTransformation.None else PasswordVisualTransformation(),
                        trailingIcon = {
                            IconButton(onClick = { showPassword = !showPassword }) {
                                Icon(
                                    imageVector = if (showPassword) Icons.Default.VisibilityOff else Icons.Default.Visibility,
                                    contentDescription = if (showPassword) "Hide password" else "Show password"
                                )
                            }
                        },
                        shape = RoundedCornerShape(12.dp)
                    )
                }

                // Confirm password (signup only)
                AnimatedVisibility(visible = mode == AuthMode.Signup) {
                    OutlinedTextField(
                        value = confirmPassword,
                        onValueChange = { confirmPassword = it },
                        label = { Text("Confirm Password") },
                        modifier = Modifier.fillMaxWidth(),
                        singleLine = true,
                        visualTransformation = PasswordVisualTransformation(),
                        shape = RoundedCornerShape(12.dp)
                    )
                }

                // Forgot password link
                AnimatedVisibility(visible = mode == AuthMode.Login) {
                    TextButton(
                        onClick = { mode = AuthMode.ForgotPassword },
                        modifier = Modifier.align(Alignment.End)
                    ) {
                        Text("Forgot password?")
                    }
                }

                // Submit button
                Button(
                    onClick = {
                        scope.launch {
                            isLoading = true
                            errorMessage = null
                            try {
                                when (mode) {
                                    AuthMode.Login -> onLogin(email, password)
                                    AuthMode.Signup -> {
                                        if (password != confirmPassword) {
                                            throw Exception("Passwords do not match")
                                        }
                                        onSignup?.invoke(email, password, name)
                                    }
                                    AuthMode.ForgotPassword -> onForgotPassword?.invoke(email)
                                }
                            } catch (e: Exception) {
                                errorMessage = e.message ?: "An error occurred"
                            }
                            isLoading = false
                        }
                    },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(56.dp),
                    enabled = !isLoading,
                    shape = RoundedCornerShape(12.dp)
                ) {
                    if (isLoading) {
                        CircularProgressIndicator(
                            modifier = Modifier.size(24.dp),
                            color = MaterialTheme.colorScheme.onPrimary
                        )
                    } else {
                        Text(
                            text = when (mode) {
                                AuthMode.Login -> "Sign In"
                                AuthMode.Signup -> "Create Account"
                                AuthMode.ForgotPassword -> "Send Reset Link"
                            }
                        )
                    }
                }
            }
        }

        // Social Login
        if (showSocialLogin && mode != AuthMode.ForgotPassword && onSocialLogin != null) {
            Spacer(modifier = Modifier.height(24.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically
            ) {
                HorizontalDivider(modifier = Modifier.weight(1f))
                Text(
                    text = "or continue with",
                    modifier = Modifier.padding(horizontal = 16.dp),
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
                HorizontalDivider(modifier = Modifier.weight(1f))
            }

            Spacer(modifier = Modifier.height(16.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                socialProviders.forEach { provider ->
                    OutlinedButton(
                        onClick = {
                            scope.launch {
                                try {
                                    onSocialLogin(provider)
                                } catch (e: Exception) {
                                    errorMessage = e.message
                                }
                            }
                        },
                        modifier = Modifier.weight(1f),
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        Icon(
                            imageVector = when (provider) {
                                SocialProvider.Google -> Icons.Default.Email
                                SocialProvider.Apple -> Icons.Default.Apple
                                SocialProvider.Github -> Icons.Default.Code
                            },
                            contentDescription = null,
                            modifier = Modifier.size(20.dp)
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(provider.name)
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(24.dp))

        // Mode switch
        Row(
            horizontalArrangement = Arrangement.Center,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = when (mode) {
                    AuthMode.Login -> "Don't have an account?"
                    AuthMode.Signup -> "Already have an account?"
                    AuthMode.ForgotPassword -> ""
                },
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
            TextButton(
                onClick = {
                    mode = when (mode) {
                        AuthMode.Login -> if (onSignup != null) AuthMode.Signup else AuthMode.Login
                        AuthMode.Signup, AuthMode.ForgotPassword -> AuthMode.Login
                    }
                    errorMessage = null
                }
            ) {
                Text(
                    text = when (mode) {
                        AuthMode.Login -> "Sign up"
                        AuthMode.Signup -> "Sign in"
                        AuthMode.ForgotPassword -> "Back to sign in"
                    },
                    style = MaterialTheme.typography.bodyMedium.copy(
                        color = MaterialTheme.colorScheme.primary
                    )
                )
            }
        }
    }
}

@Preview(showBackground = true)
@Composable
fun AuthScreenPreview() {
    MaterialTheme {
        AuthScreen(
            onLogin = { email, password ->
                println("Login: $email")
            },
            onSignup = { email, password, name ->
                println("Signup: $email, $name")
            },
            onForgotPassword = { email ->
                println("Forgot password: $email")
            },
            onSocialLogin = { provider ->
                println("Social login: $provider")
            }
        )
    }
}
`
    }
  },

  children: false,
  preview: '/previews/auth-screen.png'
}
