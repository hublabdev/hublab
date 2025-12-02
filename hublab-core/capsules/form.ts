/**
 * Form Capsule - Multi-Platform
 *
 * Form container with validation, submission handling, and field management.
 */

import { CapsuleDefinition } from './types'

export const FormCapsule: CapsuleDefinition = {
  id: 'form',
  name: 'Form',
  description: 'Form container with validation and submission handling',
  category: 'input',
  tags: ['form', 'validation', 'input', 'submit'],
  version: '1.0.0',

  props: [
    {
      name: 'onSubmit',
      type: 'action',
      required: true,
      description: 'Callback when form is submitted with valid data'
    },
    {
      name: 'initialValues',
      type: 'object',
      required: false,
      default: {},
      description: 'Initial form field values'
    },
    {
      name: 'validateOnChange',
      type: 'boolean',
      required: false,
      default: true,
      description: 'Validate fields on change'
    },
    {
      name: 'validateOnBlur',
      type: 'boolean',
      required: false,
      default: true,
      description: 'Validate fields on blur'
    },
    {
      name: 'spacing',
      type: 'select',
      required: false,
      default: 'md',
      options: ['sm', 'md', 'lg'],
      description: 'Spacing between form fields'
    }
  ],

  platforms: {
    web: {
      framework: 'react',
      typescript: true,
      dependencies: ['react'],
      code: `
import React, { createContext, useContext, useState, useCallback, FormEvent } from 'react'

// Types
interface FieldState {
  value: any
  error: string | null
  touched: boolean
}

interface FormState {
  [key: string]: FieldState
}

type ValidationRule = (value: any, formValues: Record<string, any>) => string | null

interface FormContextValue {
  values: Record<string, any>
  errors: Record<string, string | null>
  touched: Record<string, boolean>
  isSubmitting: boolean
  isValid: boolean
  setValue: (name: string, value: any) => void
  setTouched: (name: string) => void
  registerField: (name: string, rules?: ValidationRule[]) => void
  validateField: (name: string) => boolean
}

const FormContext = createContext<FormContextValue | null>(null)

export function useForm() {
  const context = useContext(FormContext)
  if (!context) {
    throw new Error('useForm must be used within a Form component')
  }
  return context
}

interface FormProps {
  children: React.ReactNode
  onSubmit: (values: Record<string, any>) => void | Promise<void>
  initialValues?: Record<string, any>
  validateOnChange?: boolean
  validateOnBlur?: boolean
  spacing?: 'sm' | 'md' | 'lg'
}

export function Form({
  children,
  onSubmit,
  initialValues = {},
  validateOnChange = true,
  validateOnBlur = true,
  spacing = 'md'
}: FormProps) {
  const [formState, setFormState] = useState<FormState>(() => {
    const state: FormState = {}
    Object.keys(initialValues).forEach(key => {
      state[key] = { value: initialValues[key], error: null, touched: false }
    })
    return state
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [fieldRules] = useState<Map<string, ValidationRule[]>>(new Map())

  const values = Object.fromEntries(
    Object.entries(formState).map(([k, v]) => [k, v.value])
  )

  const errors = Object.fromEntries(
    Object.entries(formState).map(([k, v]) => [k, v.error])
  )

  const touched = Object.fromEntries(
    Object.entries(formState).map(([k, v]) => [k, v.touched])
  )

  const isValid = Object.values(formState).every(f => !f.error)

  const validateField = useCallback((name: string): boolean => {
    const rules = fieldRules.get(name) || []
    const value = formState[name]?.value

    for (const rule of rules) {
      const error = rule(value, values)
      if (error) {
        setFormState(prev => ({
          ...prev,
          [name]: { ...prev[name], error }
        }))
        return false
      }
    }

    setFormState(prev => ({
      ...prev,
      [name]: { ...prev[name], error: null }
    }))
    return true
  }, [formState, values, fieldRules])

  const setValue = useCallback((name: string, value: any) => {
    setFormState(prev => ({
      ...prev,
      [name]: { ...prev[name], value, touched: true }
    }))

    if (validateOnChange) {
      setTimeout(() => validateField(name), 0)
    }
  }, [validateOnChange, validateField])

  const setTouched = useCallback((name: string) => {
    setFormState(prev => ({
      ...prev,
      [name]: { ...prev[name], touched: true }
    }))

    if (validateOnBlur) {
      validateField(name)
    }
  }, [validateOnBlur, validateField])

  const registerField = useCallback((name: string, rules: ValidationRule[] = []) => {
    fieldRules.set(name, rules)
    if (!formState[name]) {
      setFormState(prev => ({
        ...prev,
        [name]: { value: initialValues[name] ?? '', error: null, touched: false }
      }))
    }
  }, [initialValues, formState, fieldRules])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    // Validate all fields
    let allValid = true
    fieldRules.forEach((_, name) => {
      if (!validateField(name)) {
        allValid = false
      }
    })

    if (!allValid) return

    setIsSubmitting(true)
    try {
      await onSubmit(values)
    } finally {
      setIsSubmitting(false)
    }
  }

  const spacingClasses = {
    sm: 'space-y-2',
    md: 'space-y-4',
    lg: 'space-y-6'
  }

  return (
    <FormContext.Provider value={{
      values,
      errors,
      touched,
      isSubmitting,
      isValid,
      setValue,
      setTouched,
      registerField,
      validateField
    }}>
      <form onSubmit={handleSubmit} className={spacingClasses[spacing]}>
        {children}
      </form>
    </FormContext.Provider>
  )
}

// Field wrapper component
interface FieldProps {
  name: string
  label?: string
  required?: boolean
  rules?: ValidationRule[]
  children: (props: {
    value: any
    onChange: (value: any) => void
    onBlur: () => void
    error: string | null
    touched: boolean
  }) => React.ReactNode
}

export function Field({ name, label, required, rules = [], children }: FieldProps) {
  const form = useForm()

  React.useEffect(() => {
    const allRules = [...rules]
    if (required) {
      allRules.unshift((value) => {
        if (!value || (typeof value === 'string' && !value.trim())) {
          return 'This field is required'
        }
        return null
      })
    }
    form.registerField(name, allRules)
  }, [name, required, rules, form])

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {children({
        value: form.values[name] ?? '',
        onChange: (value) => form.setValue(name, value),
        onBlur: () => form.setTouched(name),
        error: form.touched[name] ? form.errors[name] : null,
        touched: form.touched[name] ?? false
      })}
    </div>
  )
}

// Common validation rules
export const validators = {
  required: (message = 'This field is required') => (value: any) => {
    if (!value || (typeof value === 'string' && !value.trim())) {
      return message
    }
    return null
  },

  email: (message = 'Invalid email address') => (value: string) => {
    if (value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}$/i.test(value)) {
      return message
    }
    return null
  },

  minLength: (min: number, message?: string) => (value: string) => {
    if (value && value.length < min) {
      return message ?? \`Must be at least \${min} characters\`
    }
    return null
  },

  maxLength: (max: number, message?: string) => (value: string) => {
    if (value && value.length > max) {
      return message ?? \`Must be no more than \${max} characters\`
    }
    return null
  },

  pattern: (regex: RegExp, message: string) => (value: string) => {
    if (value && !regex.test(value)) {
      return message
    }
    return null
  },

  match: (fieldName: string, message = 'Fields must match') => (
    value: any,
    formValues: Record<string, any>
  ) => {
    if (value !== formValues[fieldName]) {
      return message
    }
    return null
  }
}

// Submit button with loading state
interface SubmitButtonProps {
  children: React.ReactNode
  className?: string
}

export function SubmitButton({ children, className = '' }: SubmitButtonProps) {
  const { isSubmitting, isValid } = useForm()

  return (
    <button
      type="submit"
      disabled={isSubmitting || !isValid}
      className={\`
        w-full py-3 px-4 rounded-xl font-semibold
        transition-all duration-200
        \${isSubmitting || !isValid
          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
          : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98]'
        }
        \${className}
      \`}
    >
      {isSubmitting ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="animate-spin h-5 w-5\" viewBox="0 0 24 24">
            <circle className="opacity-25\" cx="12\" cy="12\" r="10\" stroke="currentColor\" strokeWidth="4\" fill="none" />
            <path className="opacity-75\" fill="currentColor\" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Processing...
        </span>
      ) : (
        children
      )}
    </button>
  )
}
`
    },

    ios: {
      framework: 'swiftui',
      minVersion: '15.0',
      dependencies: [],
      imports: ['SwiftUI', 'Combine'],
      code: `
import SwiftUI
import Combine

// MARK: - Form View Model
class FormViewModel: ObservableObject {
    @Published var values: [String: Any] = [:]
    @Published var errors: [String: String] = [:]
    @Published var touched: Set<String> = []
    @Published var isSubmitting = false

    private var rules: [String: [(Any, [String: Any]) -> String?]] = [:]
    private var initialValues: [String: Any]

    var isValid: Bool {
        errors.values.allSatisfy { $0.isEmpty }
    }

    init(initialValues: [String: Any] = [:]) {
        self.initialValues = initialValues
        self.values = initialValues
    }

    func registerField(_ name: String, rules: [(Any, [String: Any]) -> String?] = []) {
        self.rules[name] = rules
        if values[name] == nil {
            values[name] = initialValues[name] ?? ""
        }
    }

    func setValue(_ name: String, value: Any) {
        values[name] = value
        touched.insert(name)
        validateField(name)
    }

    func setTouched(_ name: String) {
        touched.insert(name)
        validateField(name)
    }

    @discardableResult
    func validateField(_ name: String) -> Bool {
        guard let fieldRules = rules[name] else { return true }

        for rule in fieldRules {
            if let error = rule(values[name] ?? "", values) {
                errors[name] = error
                return false
            }
        }

        errors[name] = ""
        return true
    }

    func validateAll() -> Bool {
        var allValid = true
        for name in rules.keys {
            touched.insert(name)
            if !validateField(name) {
                allValid = false
            }
        }
        return allValid
    }

    func reset() {
        values = initialValues
        errors = [:]
        touched = []
        isSubmitting = false
    }
}

// MARK: - Form Container
struct HubLabForm<Content: View>: View {
    @StateObject private var viewModel: FormViewModel
    let onSubmit: ([String: Any]) async -> Void
    let spacing: CGFloat
    @ViewBuilder let content: (FormViewModel) -> Content

    init(
        initialValues: [String: Any] = [:],
        spacing: Spacing = .md,
        onSubmit: @escaping ([String: Any]) async -> Void,
        @ViewBuilder content: @escaping (FormViewModel) -> Content
    ) {
        self._viewModel = StateObject(wrappedValue: FormViewModel(initialValues: initialValues))
        self.onSubmit = onSubmit
        self.spacing = spacing.value
        self.content = content
    }

    enum Spacing {
        case sm, md, lg

        var value: CGFloat {
            switch self {
            case .sm: return 8
            case .md: return 16
            case .lg: return 24
            }
        }
    }

    var body: some View {
        VStack(spacing: spacing) {
            content(viewModel)
        }
    }

    func submit() {
        guard viewModel.validateAll() else { return }

        viewModel.isSubmitting = true
        Task {
            await onSubmit(viewModel.values)
            await MainActor.run {
                viewModel.isSubmitting = false
            }
        }
    }
}

// MARK: - Form Field
struct FormField<Content: View>: View {
    let name: String
    let label: String?
    let required: Bool
    @ObservedObject var form: FormViewModel
    @ViewBuilder let content: (Binding<String>, Bool) -> Content

    init(
        name: String,
        label: String? = nil,
        required: Bool = false,
        form: FormViewModel,
        @ViewBuilder content: @escaping (Binding<String>, Bool) -> Content
    ) {
        self.name = name
        self.label = label
        self.required = required
        self.form = form
        self.content = content
    }

    var hasError: Bool {
        form.touched.contains(name) && !(form.errors[name]?.isEmpty ?? true)
    }

    var errorMessage: String? {
        guard hasError else { return nil }
        return form.errors[name]
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            if let label = label {
                HStack(spacing: 2) {
                    Text(label)
                        .font(.subheadline)
                        .fontWeight(.medium)
                    if required {
                        Text("*")
                            .foregroundColor(.red)
                    }
                }
            }

            content(
                Binding(
                    get: { form.values[name] as? String ?? "" },
                    set: { form.setValue(name, value: $0) }
                ),
                hasError
            )

            if let error = errorMessage {
                Text(error)
                    .font(.caption)
                    .foregroundColor(.red)
            }
        }
        .onAppear {
            var rules: [(Any, [String: Any]) -> String?] = []
            if required {
                rules.append { value, _ in
                    let str = value as? String ?? ""
                    return str.trimmingCharacters(in: .whitespaces).isEmpty ? "This field is required" : nil
                }
            }
            form.registerField(name, rules: rules)
        }
    }
}

// MARK: - Submit Button
struct FormSubmitButton: View {
    @ObservedObject var form: FormViewModel
    let title: String
    let action: () -> Void

    var body: some View {
        Button(action: {
            guard form.validateAll() else { return }
            action()
        }) {
            HStack {
                if form.isSubmitting {
                    ProgressView()
                        .progressViewStyle(CircularProgressViewStyle(tint: .white))
                        .scaleEffect(0.8)
                }
                Text(form.isSubmitting ? "Processing..." : title)
            }
            .frame(maxWidth: .infinity)
            .padding()
            .background(form.isValid && !form.isSubmitting ? Color.blue : Color.gray)
            .foregroundColor(.white)
            .cornerRadius(12)
        }
        .disabled(!form.isValid || form.isSubmitting)
    }
}

// MARK: - Validators
enum FormValidators {
    static func required(_ message: String = "This field is required") -> (Any, [String: Any]) -> String? {
        { value, _ in
            let str = value as? String ?? ""
            return str.trimmingCharacters(in: .whitespaces).isEmpty ? message : nil
        }
    }

    static func email(_ message: String = "Invalid email address") -> (Any, [String: Any]) -> String? {
        { value, _ in
            guard let str = value as? String, !str.isEmpty else { return nil }
            let emailRegex = "[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\\\.[A-Za-z]{2,}"
            let predicate = NSPredicate(format: "SELF MATCHES %@", emailRegex)
            return predicate.evaluate(with: str) ? nil : message
        }
    }

    static func minLength(_ min: Int, message: String? = nil) -> (Any, [String: Any]) -> String? {
        { value, _ in
            guard let str = value as? String, !str.isEmpty else { return nil }
            return str.count < min ? (message ?? "Must be at least \\(min) characters") : nil
        }
    }

    static func match(_ fieldName: String, message: String = "Fields must match") -> (Any, [String: Any]) -> String? {
        { value, formValues in
            let str = value as? String ?? ""
            let other = formValues[fieldName] as? String ?? ""
            return str == other ? nil : message
        }
    }
}

// MARK: - Preview
#Preview("Form Demo") {
    struct FormDemo: View {
        @StateObject var form = FormViewModel(initialValues: ["email": ""])

        var body: some View {
            NavigationView {
                ScrollView {
                    VStack(spacing: 20) {
                        FormField(name: "email", label: "Email", required: true, form: form) { value, hasError in
                            TextField("Enter email", text: value)
                                .textFieldStyle(RoundedBorderTextFieldStyle())
                                .overlay(
                                    RoundedRectangle(cornerRadius: 8)
                                        .stroke(hasError ? Color.red : Color.clear, lineWidth: 1)
                                )
                        }

                        FormField(name: "password", label: "Password", required: true, form: form) { value, hasError in
                            SecureField("Enter password", text: value)
                                .textFieldStyle(RoundedBorderTextFieldStyle())
                        }

                        FormSubmitButton(form: form, title: "Sign In") {
                            print("Form submitted:", form.values)
                        }
                    }
                    .padding()
                }
                .navigationTitle("Sign In")
            }
        }
    }
    return FormDemo()
}
`
    },

    android: {
      framework: 'compose',
      minSdk: 24,
      dependencies: ['androidx.compose.material3:material3'],
      imports: [
        'androidx.compose.material3.*',
        'androidx.compose.foundation.layout.*',
        'androidx.compose.runtime.*',
        'androidx.compose.ui.*'
      ],
      code: `
package com.hublab.components

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import kotlinx.coroutines.launch

// Form State
class FormState(
    initialValues: Map<String, Any> = emptyMap()
) {
    var values by mutableStateOf(initialValues.toMutableMap())
        private set
    var errors by mutableStateOf<Map<String, String?>>(emptyMap())
        private set
    var touched by mutableStateOf<Set<String>>(emptySet())
        private set
    var isSubmitting by mutableStateOf(false)
        private set

    private val rules = mutableMapOf<String, List<(Any?, Map<String, Any>) -> String?>>()
    private val initialValues = initialValues.toMap()

    val isValid: Boolean
        get() = errors.values.all { it.isNullOrEmpty() }

    fun registerField(name: String, fieldRules: List<(Any?, Map<String, Any>) -> String?> = emptyList()) {
        rules[name] = fieldRules
        if (!values.containsKey(name)) {
            values = values.toMutableMap().apply {
                put(name, initialValues[name] ?: "")
            }
        }
    }

    fun setValue(name: String, value: Any) {
        values = values.toMutableMap().apply { put(name, value) }
        touched = touched + name
        validateField(name)
    }

    fun setTouched(name: String) {
        touched = touched + name
        validateField(name)
    }

    fun validateField(name: String): Boolean {
        val fieldRules = rules[name] ?: return true
        val value = values[name]

        for (rule in fieldRules) {
            val error = rule(value, values)
            if (error != null) {
                errors = errors.toMutableMap().apply { put(name, error) }
                return false
            }
        }

        errors = errors.toMutableMap().apply { put(name, null) }
        return true
    }

    fun validateAll(): Boolean {
        var allValid = true
        rules.keys.forEach { name ->
            touched = touched + name
            if (!validateField(name)) {
                allValid = false
            }
        }
        return allValid
    }

    fun setSubmitting(submitting: Boolean) {
        isSubmitting = submitting
    }

    fun reset() {
        values = initialValues.toMutableMap()
        errors = emptyMap()
        touched = emptySet()
        isSubmitting = false
    }
}

@Composable
fun rememberFormState(initialValues: Map<String, Any> = emptyMap()): FormState {
    return remember { FormState(initialValues) }
}

// Form Container
enum class FormSpacing(val value: Dp) {
    Sm(8.dp), Md(16.dp), Lg(24.dp)
}

@Composable
fun HubLabForm(
    state: FormState,
    onSubmit: suspend (Map<String, Any>) -> Unit,
    modifier: Modifier = Modifier,
    spacing: FormSpacing = FormSpacing.Md,
    content: @Composable ColumnScope.() -> Unit
) {
    val scope = rememberCoroutineScope()

    Column(
        modifier = modifier,
        verticalArrangement = Arrangement.spacedBy(spacing.value)
    ) {
        content()
    }
}

// Form Field
@Composable
fun FormField(
    name: String,
    state: FormState,
    label: String? = null,
    required: Boolean = false,
    rules: List<(Any?, Map<String, Any>) -> String?> = emptyList(),
    content: @Composable (
        value: String,
        onValueChange: (String) -> Unit,
        isError: Boolean
    ) -> Unit
) {
    val hasError = state.touched.contains(name) && !state.errors[name].isNullOrEmpty()
    val errorMessage = if (hasError) state.errors[name] else null

    LaunchedEffect(name) {
        val allRules = buildList {
            if (required) {
                add { value: Any?, _ ->
                    val str = value as? String ?: ""
                    if (str.trim().isEmpty()) "This field is required" else null
                }
            }
            addAll(rules)
        }
        state.registerField(name, allRules)
    }

    Column {
        if (label != null) {
            Row {
                Text(
                    text = label,
                    style = MaterialTheme.typography.labelMedium
                )
                if (required) {
                    Text(
                        text = " *",
                        color = MaterialTheme.colorScheme.error,
                        style = MaterialTheme.typography.labelMedium
                    )
                }
            }
            Spacer(modifier = Modifier.height(4.dp))
        }

        content(
            state.values[name] as? String ?: "",
            { state.setValue(name, it) },
            hasError
        )

        if (errorMessage != null) {
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = errorMessage,
                color = MaterialTheme.colorScheme.error,
                style = MaterialTheme.typography.bodySmall
            )
        }
    }
}

// Submit Button
@Composable
fun FormSubmitButton(
    state: FormState,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    text: String = "Submit"
) {
    Button(
        onClick = {
            if (state.validateAll()) {
                onClick()
            }
        },
        modifier = modifier.fillMaxWidth(),
        enabled = state.isValid && !state.isSubmitting
    ) {
        if (state.isSubmitting) {
            CircularProgressIndicator(
                modifier = Modifier.size(20.dp),
                color = MaterialTheme.colorScheme.onPrimary,
                strokeWidth = 2.dp
            )
            Spacer(modifier = Modifier.width(8.dp))
            Text("Processing...")
        } else {
            Text(text)
        }
    }
}

// Common Validators
object FormValidators {
    fun required(message: String = "This field is required"): (Any?, Map<String, Any>) -> String? = { value, _ ->
        val str = value as? String ?: ""
        if (str.trim().isEmpty()) message else null
    }

    fun email(message: String = "Invalid email address"): (Any?, Map<String, Any>) -> String? = { value, _ ->
        val str = value as? String ?: ""
        if (str.isNotEmpty() && !android.util.Patterns.EMAIL_ADDRESS.matcher(str).matches()) {
            message
        } else null
    }

    fun minLength(min: Int, message: String? = null): (Any?, Map<String, Any>) -> String? = { value, _ ->
        val str = value as? String ?: ""
        if (str.isNotEmpty() && str.length < min) {
            message ?: "Must be at least $min characters"
        } else null
    }

    fun maxLength(max: Int, message: String? = null): (Any?, Map<String, Any>) -> String? = { value, _ ->
        val str = value as? String ?: ""
        if (str.isNotEmpty() && str.length > max) {
            message ?: "Must be no more than $max characters"
        } else null
    }

    fun match(fieldName: String, message: String = "Fields must match"): (Any?, Map<String, Any>) -> String? = { value, formValues ->
        val str = value as? String ?: ""
        val other = formValues[fieldName] as? String ?: ""
        if (str != other) message else null
    }
}

@Preview(showBackground = true)
@Composable
fun HubLabFormPreview() {
    val formState = rememberFormState(
        initialValues = mapOf("email" to "", "password" to "")
    )
    val scope = rememberCoroutineScope()

    MaterialTheme {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp)
        ) {
            HubLabForm(
                state = formState,
                onSubmit = { values ->
                    println("Form submitted: $values")
                }
            ) {
                FormField(
                    name = "email",
                    state = formState,
                    label = "Email",
                    required = true,
                    rules = listOf(FormValidators.email())
                ) { value, onValueChange, isError ->
                    OutlinedTextField(
                        value = value,
                        onValueChange = onValueChange,
                        modifier = Modifier.fillMaxWidth(),
                        isError = isError,
                        placeholder = { Text("Enter email") }
                    )
                }

                FormField(
                    name = "password",
                    state = formState,
                    label = "Password",
                    required = true,
                    rules = listOf(FormValidators.minLength(8))
                ) { value, onValueChange, isError ->
                    OutlinedTextField(
                        value = value,
                        onValueChange = onValueChange,
                        modifier = Modifier.fillMaxWidth(),
                        isError = isError,
                        placeholder = { Text("Enter password") }
                    )
                }

                Spacer(modifier = Modifier.height(8.dp))

                FormSubmitButton(
                    state = formState,
                    text = "Sign In",
                    onClick = {
                        scope.launch {
                            formState.setSubmitting(true)
                            // Simulate API call
                            kotlinx.coroutines.delay(2000)
                            println("Form values: \${formState.values}")
                            formState.setSubmitting(false)
                        }
                    }
                )
            }
        }
    }
}
`
    }
  },

  children: true,
  slots: ['fields'],
  preview: '/previews/form.png'
}
