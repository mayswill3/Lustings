import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { signInWithPassword } from '@/utils/auth-helpers/server';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { Input } from '../ui/input';

interface PasswordSignInProps {
  allowEmail: boolean;
  redirectMethod: string;
}

export default function PasswordSignIn({
  allowEmail,
  redirectMethod
}: PasswordSignInProps) {
  const router = redirectMethod === 'client' ? useRouter() : null;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    general: ''
  });

  const validateForm = (email: string, password: string) => {
    const newErrors = {
      email: '',
      password: '',
      general: ''
    };

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    // Validate form
    const formErrors = validateForm(email, password);
    setErrors(formErrors);

    // If there are validation errors, don't submit
    if (Object.values(formErrors).some(error => error !== '')) {
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await signInWithPassword(formData);

      // Assuming response is a string like "error=Sign%20in%20failed.&error_description=Invalid%20login%20credentials"
      if (typeof response === 'string') {
        // Decode the response
        const decodedResponse = decodeURIComponent(response);
        const params = new URLSearchParams(decodedResponse);
        const errorDescription = params.get('error_description') || 'An unexpected error occurred. Please try again.';

        setErrors({
          ...errors,
          general: errorDescription
        });
      } else if (response.ok) {
        // If response is ok, navigate to dashboard
        if (router) {
          router.push('/dashboard');
        }
      } else {
        const data = await response.json();
        setErrors({
          ...errors,
          general: data.error || 'Failed to sign in. Please try again.'
        });
      }
    } catch (error) {
      setErrors({
        ...errors,
        general: 'An unexpected error occurred. Please try again.'
      });
    }

    setIsSubmitting(false);
  };


  return (
    <div>
      <form
        noValidate={true}
        className="mb-4"
        onSubmit={handleSubmit}
      >
        <div className="grid gap-2">
          {errors.general && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{errors.general}</AlertDescription>
            </Alert>
          )}

          <div className="grid gap-1">
            <label className="text-zinc-950 dark:text-white" htmlFor="email">
              Email
            </label>
            <Input
              className={`mr-2.5 mb-2 h-full min-h-[44px] w-full px-4 py-3 focus:outline-0 dark:placeholder:text-zinc-400 ${errors.email ? 'border-red-500' : ''
                }`}
              id="email"
              placeholder="name@example.com"
              type="email"
              name="email"
              autoComplete="email"
              aria-invalid={errors.email ? 'true' : 'false'}
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
            {errors.email && (
              <p id="email-error" className="text-sm text-red-500 mt-1">
                {errors.email}
              </p>
            )}

            <label
              className="text-zinc-950 mt-2 dark:text-white"
              htmlFor="password"
            >
              Password
            </label>
            <Input
              id="password"
              placeholder="Password"
              type="password"
              name="password"
              autoComplete="current-password"
              className={`mr-2.5 mb-2 h-full min-h-[44px] w-full px-4 py-3 focus:outline-0 dark:placeholder:text-zinc-400 ${errors.password ? 'border-red-500' : ''
                }`}
              aria-invalid={errors.password ? 'true' : 'false'}
              aria-describedby={errors.password ? 'password-error' : undefined}
            />
            {errors.password && (
              <p id="password-error" className="text-sm text-red-500 mt-1">
                {errors.password}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 flex h-[unset] w-full items-center justify-center rounded-lg px-4 py-4 text-sm font-medium"
          >
            {isSubmitting ? (
              <svg
                aria-hidden="true"
                role="status"
                className="mr-2 inline h-4 w-4 animate-spin text-zinc-200 duration-500 dark:text-zinc-950"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                ></path>
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="white"
                ></path>
              </svg>
            ) : (
              'Sign in'
            )}
          </Button>
        </div>
      </form>

      <p>
        <a
          href="/dashboard/signin/forgot_password"
          className="font-medium text-zinc-950 dark:text-white text-sm"
        >
          Forgot your password?
        </a>
      </p>
      {allowEmail && (
        <p>
          <a
            href="/dashboard/signin/email_signin"
            className="font-medium text-zinc-950 dark:text-white text-sm"
          >
            Sign in via magic link
          </a>
        </p>
      )}
      <p>
        <a
          href="/dashboard/signin/signup"
          className="font-medium text-zinc-950 dark:text-white text-sm"
        >
          Don't have an account? Sign up
        </a>
      </p>
    </div>
  );
}