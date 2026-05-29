'use client';
import { useRegister } from '@/src/hooks/useRegister';
import type { UserRole } from '@/src/types/auth.types';
import { getPasswordStrength } from '@/src/utils/validation';
import { useId, useState, type ChangeEvent, type FormEvent } from 'react';
import styles from './RegisterPage.module.css';

const STRENGTH_LABELS = ['', 'Weak', 'Fair', 'Good', 'Strong'];
const STRENGTH_COLORS = ['', '#ef4444', '#f97316', '#eab308', '#22c55e'];

export default function RegisterPage() {
    const emailId = useId();
    const nameId = useId();
    const passwordId = useId();

    const [role, setRole] = useState<UserRole>('USER');
    const [showPassword, setShowPassword] = useState(false);
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [values, setValues] = useState({ name: '', email: '', password: '' });

    const { loading, success, serverError, fieldErrors, submit } = useRegister();
    const passwordStrength = getPasswordStrength(values.password);

    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }

    function handleBlur(e: ChangeEvent<HTMLInputElement>) {
        setTouched((prev) => ({ ...prev, [e.target.name]: true }));
    }

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setTouched({ name: true, email: true, password: true });
        submit(values, role);
    }

    if (success) {
        return (
            <div className={styles.successContainer}>
                <div className={styles.successCard}>
                    <div className={styles.successIcon}>✓</div>
                    <h2 className={styles.successTitle}>Account Created</h2>
                    <p className={styles.successText}>
                        Welcome aboard! Check your email to verify your account before logging in.
                    </p>
                    <a href="/login" className={styles.loginLink}>Go to Login →</a>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            {/* Background accent */}
            <div className={styles.bgAccent} aria-hidden="true" />

            <div className={styles.container}>
                {/* Left panel */}
                <aside className={styles.aside}>
                    <div className={styles.brand}>
                        <span className={styles.brandMark}>◆</span>
                        <span className={styles.brandName}>Veloce</span>
                    </div>
                    <div className={styles.asideContent}>
                        <h1 className={styles.headline}>
                            Build something<br />
                            <em>remarkable.</em>
                        </h1>
                        <p className={styles.subline}>
                            Join thousands of users and sellers powering their business on Veloce.
                        </p>
                        <div className={styles.stats}>
                            <div className={styles.stat}>
                                <span className={styles.statNum}>12k+</span>
                                <span className={styles.statLabel}>Active Users</span>
                            </div>
                            <div className={styles.stat}>
                                <span className={styles.statNum}>3.4k</span>
                                <span className={styles.statLabel}>Sellers</span>
                            </div>
                            <div className={styles.stat}>
                                <span className={styles.statNum}>99.9%</span>
                                <span className={styles.statLabel}>Uptime</span>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Form panel */}
                <main className={styles.formPanel}>
                    <div className={styles.formCard}>
                        <header className={styles.formHeader}>
                            <h2 className={styles.formTitle}>Create account</h2>
                            <p className={styles.formSubtitle}>
                                Already have one?{' '}
                                <a href="/login" className={styles.inlineLink}>Sign in</a>
                            </p>
                        </header>

                        {/* Role toggle */}
                        <div className={styles.roleToggle} role="radiogroup" aria-label="Account type">
                            {(['USER', 'SELLER'] as UserRole[]).map((r) => (
                                <button
                                    key={r}
                                    type="button"
                                    role="radio"
                                    aria-checked={role === r}
                                    className={`${styles.roleBtn} ${role === r ? styles.roleBtnActive : ''}`}
                                    onClick={() => setRole(r)}
                                >
                                    {r === 'USER' ? '👤 Customer' : '🏪 Seller'}
                                </button>
                            ))}
                        </div>

                        <form onSubmit={handleSubmit} noValidate className={styles.form}>
                            {/* Server error */}
                            {serverError && (
                                <div className={styles.serverError} role="alert">
                                    <span className={styles.errorIcon}>!</span>
                                    {serverError}
                                </div>
                            )}

                            {/* Name field */}
                            <div className={styles.field}>
                                <label htmlFor={nameId} className={styles.label}>Full Name</label>
                                <input
                                    id={nameId}
                                    name="name"
                                    type="text"
                                    autoComplete="name"
                                    placeholder="John Doe"
                                    value={values.name}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    aria-invalid={!!(touched.name && fieldErrors.name)}
                                    aria-describedby={touched.name && fieldErrors.name ? `${nameId}-err` : undefined}
                                    className={`${styles.input} ${touched.name && fieldErrors.name ? styles.inputError : ''}`}
                                />
                                {touched.name && fieldErrors.name && (
                                    <span id={`${nameId}-err`} className={styles.fieldError} role="alert">
                                        {fieldErrors.name}
                                    </span>
                                )}
                            </div>

                            {/* Email field */}
                            <div className={styles.field}>
                                <label htmlFor={emailId} className={styles.label}>Email Address</label>
                                <input
                                    id={emailId}
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    placeholder="john@example.com"
                                    value={values.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    aria-invalid={!!(touched.email && fieldErrors.email)}
                                    aria-describedby={touched.email && fieldErrors.email ? `${emailId}-err` : undefined}
                                    className={`${styles.input} ${touched.email && fieldErrors.email ? styles.inputError : ''}`}
                                />
                                {touched.email && fieldErrors.email && (
                                    <span id={`${emailId}-err`} className={styles.fieldError} role="alert">
                                        {fieldErrors.email}
                                    </span>
                                )}
                            </div>

                            {/* Password field */}
                            <div className={styles.field}>
                                <label htmlFor={passwordId} className={styles.label}>Password</label>
                                <div className={styles.passwordWrapper}>
                                    <input
                                        id={passwordId}
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        autoComplete="new-password"
                                        placeholder="Secure@123#"
                                        value={values.password}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        aria-invalid={!!(touched.password && fieldErrors.password)}
                                        aria-describedby={`${passwordId}-strength ${touched.password && fieldErrors.password ? `${passwordId}-err` : ''}`}
                                        className={`${styles.input} ${styles.passwordInput} ${touched.password && fieldErrors.password ? styles.inputError : ''}`}
                                    />
                                    <button
                                        type="button"
                                        className={styles.eyeBtn}
                                        onClick={() => setShowPassword((v) => !v)}
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    >
                                        {showPassword ? '🙈' : '👁'}
                                    </button>
                                </div>

                                {/* Strength bar */}
                                {values.password.length > 0 && (
                                    <div className={styles.strengthWrapper} id={`${passwordId}-strength`}>
                                        <div className={styles.strengthBar}>
                                            {[1, 2, 3, 4].map((i) => (
                                                <div
                                                    key={i}
                                                    className={styles.strengthSegment}
                                                    style={{
                                                        backgroundColor: passwordStrength >= i ? STRENGTH_COLORS[passwordStrength] : undefined,
                                                    }}
                                                />
                                            ))}
                                        </div>
                                        <span
                                            className={styles.strengthLabel}
                                            style={{ color: STRENGTH_COLORS[passwordStrength] }}
                                        >
                                            {STRENGTH_LABELS[passwordStrength]}
                                        </span>
                                    </div>
                                )}

                                {touched.password && fieldErrors.password && (
                                    <span id={`${passwordId}-err`} className={styles.fieldError} role="alert">
                                        {fieldErrors.password}
                                    </span>
                                )}

                                <p className={styles.passwordHint}>
                                    Use 8+ characters with uppercase, lowercase, number &amp; symbol.
                                </p>
                            </div>

                            <button
                                type="submit"
                                className={styles.submitBtn}
                                disabled={loading}
                                aria-busy={loading}
                            >
                                {loading ? (
                                    <span className={styles.spinner} aria-label="Creating account…" />
                                ) : (
                                    `Create ${role === 'SELLER' ? 'Seller' : ''} Account →`
                                )}
                            </button>
                        </form>

                        <p className={styles.terms}>
                            By registering you agree to our{' '}
                            <a href="/terms" className={styles.termsLink}>Terms of Service</a>
                            {' '}and{' '}
                            <a href="/privacy" className={styles.termsLink}>Privacy Policy</a>.
                        </p>
                    </div>
                </main>
            </div>
        </div>
    );
}