# Authentication Execution Flow Deep Dive

> **What:** Line-by-line execution flow for Login and Register workflows.
> **Why:** Demonstrates two different approaches to forms (`react-hook-form` vs. controlled components) and exactly how auth context is synchronized with local storage and routing.

---

## 1. Login Flow (Using `react-hook-form`)

`Login.jsx` utilizes `react-hook-form` for uncontrolled, high-performance input validation.

### Keystroke and Validation Flow

```text
User types in Email field
↓
`react-hook-form` registers the input via `{...register("email", { required, pattern })}`
↓
User clicks away (blur)
↓
`mode: "onTouched"` configuration triggers validation rules.
↓
If invalid: 
  └─ `errors.email` object is populated.
  └─ Component Re-renders.
  └─ `<div id="email-error">` appears with red text.
```

### Submit Execution Flow

```text
User clicks "Sign In"
↓
`react-hook-form` intercepts `onSubmit`.
↓
Validates all registered fields.
↓
If valid, calls custom `onSubmit(data)` with `{ email, password }`.
↓
`setLoading(true)` → Sign In button shows spinner.
↓
`loginService(data)` executes.
  └─ Calls Axios POST `/auth/login`.
↓
Backend validates credentials.

--- IF SUCCESS (200 OK) ---
↓
Response parsed by `apiAdapter.js`.
↓
Component receives `{ token, user }`.
↓
Component calls `login(token, user)` from `useAuth()` (AuthContext).
  └─ AuthContext sets `localStorage.setItem('ss_token', token)`.
  └─ AuthContext updates `token` and `user` state.
↓
React Router detects `isAuthenticated = true` in `<ProtectedRoute>`.
↓
`toast.success("Logged in successfully!")`
↓
`navigate(from || ROLE_HOME[user.role] || "/", { replace: true })`
↓
Browser redirects to Admin, Staff, or Customer dashboard (replacing history).

--- IF UNVERIFIED EMAIL ERROR (403 or 400) ---
↓
`catch(err)` block evaluates:
  └─ `err.message.toLowerCase().includes("verif")`
↓
Condition matches.
↓
`setShowUnverifiedModal(true)`
↓
`<ResendOtp />` modal mounts.
```

---

## 2. Register Flow (Using Controlled Components)

`Register.jsx` uses standard React state (`useState(formData)`) for two-way binding. This allows for complex real-time side-effects (like the Password Strength meter and real-time Confirm Password check).

### Keystroke and Real-Time Validation Flow

```text
User types in "Confirm Password"
↓
`onChange={handleChange}` fires.
↓
Extracts `name="confirmPassword"`, `value="Typing..."`
↓
`setFormData` updates state.
↓
Inside `handleChange`, conditional logic checks:
  `if (name === 'confirmPassword' || name === 'password')`
↓
Compares `password` vs `confirmPassword`.
  - If they do NOT match: `setErrors({ confirmPassword: 'Passwords do not match.' })`
  - If they MATCH: `setErrors({ confirmPassword: '' })`
↓
Component Re-renders immediately.
↓
UI shows green "Passwords match!" or red error text instantly.
```

### Password Strength Meter Flow

```text
User types in "Password"
↓
Component Re-renders due to `formData.password` state update.
↓
`<PasswordStrength password={formData.password} />` component re-evaluates:
  1. Score = 0
  2. Length >= 6 ? Score++
  3. Length >= 10 ? Score++
  4. Has UpperCase ? Score++
  5. Has Number ? Score++
  6. Has Special Char ? Score++
↓
Maps `score` (0-5) to a color (Red → Orange → Yellow → Green → Emerald).
↓
Renders 5 flex-bars. Bars index < score get colored, rest get gray.
```

### Submit Execution Flow

```text
User clicks "Register for free"
↓
`handleSubmit(e)` fires (standard React event).
↓
`e.preventDefault()` stops page reload.
↓
`validate()` function executes manually:
  └─ Checks regex for mobile number.
  └─ Checks regex for email.
  └─ Checks complex regex for password.
  └─ Returns `errs` object.
↓
If `Object.keys(errs).length > 0`:
  └─ `setErrors(errs)`
  └─ Return early (stops execution).
↓
If Valid:
  1. `setLoading(true)`
  2. Builds `payload`: Trims whitespace, prefixes `+91` to `mobileNumber` if missing.
  3. `registerService(payload)`
↓
Axios POST `/auth/register` executes.

--- IF SUCCESS ---
↓
`toast.success("Account created! Redirecting to verify email and phone...")`
↓
`setTimeout(..., 2200)` starts.
↓
Waits 2.2 seconds.
↓
`navigate("/verify-otp", { state: { registered: true, email: payload.email } })`
↓
Redirects to OTP screen.
```
