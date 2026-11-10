import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowRight, Eye, EyeOff, X } from "lucide-react";

export type AccessMode = "signin" | "signup" | "guide" | "reset";

export function AccountAccess({
  initialMode,
  onClose,
}: {
  initialMode: AccessMode;
  onClose: () => void;
}) {
  const [mode, setMode] = useState(initialMode);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const guide = mode === "guide";
  const signup = mode === "signup";
  const reset = mode === "reset";
  useEffect(() => {
    dialog.current?.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
      dialog.current?.close();
    };
  }, []);
  function changeMode(next: AccessMode) {
    setMode(next);
    setErrors({});
    setMessage("");
    setShowPassword(false);
    heading.current?.focus();
  }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const validation: Record<string, string> = {};
    if (signup && String(data.get("name") || "").trim().length < 2)
      validation.name = "Enter your full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(data.get("email") || "").trim()))
      validation.email = "Enter a valid email address.";
    const password = String(data.get("password") || "");
    if (!reset && password.length < (signup ? 8 : 1))
      validation.password = signup ? "Use at least 8 characters." : "Enter your password.";
    if (signup && data.get("confirm") !== password) validation.confirm = "Passwords do not match.";
    setErrors(validation);
    setMessage("");
    if (Object.keys(validation).length) {
      const field = event.currentTarget.elements.namedItem(Object.keys(validation)[0]);
      if (field instanceof HTMLElement) field.focus();
      return;
    }
    event.currentTarget.reset();
    setMessage(
      reset
        ? "Password recovery is not connected yet. No reset email was sent."
        : signup
          ? "Registration is not connected yet. No account was created and no password was saved. You can explore the separate customer demo below."
          : "Account verification is not connected yet. No sign-in occurred and your password was not saved. Use the separate demo below to preview the portal.",
    );
  }
  const field = (name: string, label: string, type = "text", autoComplete?: string) => (
    <div className="account-field" key={name}>
      <label htmlFor={`account-${name}`}>{label}</label>
      <input
        id={`account-${name}`}
        name={name}
        type={type}
        autoComplete={autoComplete}
        aria-invalid={!!errors[name]}
        aria-describedby={errors[name] ? `account-${name}-error` : undefined}
      />
      {errors[name] && (
        <small id={`account-${name}-error`} className="account-field-error">
          {errors[name]}
        </small>
      )}
    </div>
  );
  return (
    <dialog
      ref={dialog}
      className="account-dialog"
      aria-labelledby="account-title"
      onCancel={onClose}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          onClose();
        }
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          const rect = event.currentTarget.getBoundingClientRect();
          if (
            event.clientX < rect.left ||
            event.clientX > rect.right ||
            event.clientY < rect.top ||
            event.clientY > rect.bottom
          )
            onClose();
        }
      }}
    >
      <button className="account-close" aria-label="Close account access" onClick={onClose}>
        <X size={20} />
      </button>
      <p className="eyebrow">{guide ? "Approved guide access" : "Your Mombasa, made personal"}</p>
      <h2 id="account-title" ref={heading} tabIndex={-1}>
        {signup
          ? "Make yourself at home."
          : reset
            ? "A fresh start."
            : guide
              ? "Ready for your next tour?"
              : "Welcome back."}
      </h2>
      <p className="account-intro">
        {signup
          ? "Create a customer account to book experiences and keep your journeys together."
          : reset
            ? "Recover access to your customer account."
            : guide
              ? "Sign in with your operator-approved account to see your current assignments."
              : "Log in to manage your bookings and discover what's next."}
      </p>
      <div className="account-prototype-note">
        Frontend preview. Account services are not connected. Do not enter real passwords or
        sensitive information.
      </div>
      <form key={mode} className="account-form" onSubmit={submit} noValidate>
        {signup && field("name", "Full name", "text", "name")}
        {field("email", guide ? "Registered guide email" : "Email address", "email", "email")}
        {!reset && (
          <div className="account-password-wrap">
            {field(
              "password",
              "Password",
              showPassword ? "text" : "password",
              signup ? "new-password" : "current-password",
            )}
            <button
              className="account-password-toggle"
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              title={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
        )}
        {signup && field("confirm", "Confirm password", "password", "new-password")}
        {mode === "signin" && (
          <button className="account-inline" type="button" onClick={() => changeMode("reset")}>
            Forgot password?
          </button>
        )}
        <button className="button button-primary" type="submit">
          {signup
            ? "Create customer account"
            : reset
              ? "Request password reset"
              : guide
                ? "Log in as tour guide"
                : "Log in"}
          <ArrowRight size={16} />
        </button>
      </form>
      {message && (
        <p className="account-feedback" role="status">
          {message}
        </p>
      )}
      <div className="account-switch">
        {guide ? (
          <p>
            Guide access is invitation-only. Contact the operator if you haven't received an
            approved account.
          </p>
        ) : (
          <>
            <span>
              {signup
                ? "Already have an account?"
                : reset
                  ? "Remember your password?"
                  : "New to Mombasa Connect?"}
            </span>
            <button
              className="account-inline"
              onClick={() => changeMode(signup || reset ? "signin" : "signup")}
            >
              {signup || reset ? "Log in" : "Create an account"}
            </button>
          </>
        )}
      </div>
      {!reset && (
        <div className="account-demo">
          <span>Just exploring the prototype?</span>
          <a href={guide ? "/guide" : "/dashboard"}>
            {guide ? "Preview guide assignments" : "Preview customer dashboard"}
            <ArrowRight size={15} />
          </a>
          <small>Sample data only. This does not sign you in.</small>
        </div>
      )}
      {guide && (
        <button className="account-inline" onClick={() => changeMode("signin")}>
          Looking for customer login?
        </button>
      )}
    </dialog>
  );
}
