'use client';

import TinselLinkLogo from '@/public/TinselLinkLogo.svg';
import Image from 'next/image';
import PasswordSignIn from '@/components/auth-ui/PasswordSignIn';
import EmailSignIn from '@/components/auth-ui/EmailSignIn';
import Separator from '@/components/auth-ui/Separator';
import OauthSignIn from '@/components/auth-ui/OauthSignIn';
import ForgotPassword from '@/components/auth-ui/ForgotPassword';
import UpdatePassword from '@/components/auth-ui/UpdatePassword';
import SignUp from '@/components/auth-ui/Signup';

export default function AuthUI(props: any) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center">
          <Image
            src={TinselLinkLogo}
            alt="TinselLink Logo"
            width={180}
            height={40}
            className="mb-8"
          />
          <h2 className="text-[32px] font-bold text-zinc-950 dark:text-white">
            {props.viewProp === 'signup'
              ? 'Sign Up'
              : props.viewProp === 'forgot_password'
                ? 'Forgot Password'
                : props.viewProp === 'update_password'
                  ? 'Update Password'
                  : props.viewProp === 'email_signin'
                    ? 'Email Sign In'
                    : 'Sign In'}
          </h2>
          <p className="mt-2.5 text-center font-normal text-zinc-950 dark:text-zinc-400">
            {props.viewProp === 'signup'
              ? 'Enter your email and password to sign up!'
              : props.viewProp === 'forgot_password'
                ? 'Enter your email to get a passoword reset link!'
                : props.viewProp === 'update_password'
                  ? 'Choose a new password for your account!'
                  : props.viewProp === 'email_signin'
                    ? 'Enter your email to get a magic link!'
                    : 'Enter your email and password to sign in!'}
          </p>
        </div>

        <div className="mt-8 space-y-1">
          {props.viewProp !== 'update_password' &&
            props.viewProp !== 'signup' &&
            props.allowOauth && (
              <>
                <OauthSignIn />
                <Separator />
              </>
            )}

          {props.viewProp === 'password_signin' && (
            <PasswordSignIn
              allowEmail={props.allowEmail}
              redirectMethod={props.redirectMethod}
            />
          )}
          {props.viewProp === 'email_signin' && (
            <EmailSignIn
              allowPassword={props.allowPassword}
              redirectMethod={props.redirectMethod}
              disableButton={props.disableButton}
            />
          )}
          {props.viewProp === 'forgot_password' && (
            <ForgotPassword
              allowEmail={props.allowEmail}
              redirectMethod={props.redirectMethod}
              disableButton={props.disableButton}
            />
          )}
          {props.viewProp === 'update_password' && (
            <UpdatePassword redirectMethod={props.redirectMethod} />
          )}
          {props.viewProp === 'signup' && (
            <SignUp
              allowEmail={props.allowEmail}
              redirectMethod={props.redirectMethod}
            />
          )}
        </div>
      </div>
    </div>
  );
}
