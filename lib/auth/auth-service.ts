import { sendEmail } from '@/lib/email/mailer';
import { createClient } from '@supabase/supabase-js';

export class AuthService {
  private supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  async signUp(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify`,
      },
    });

    if (error) throw error;
    return data;
  }

  async resetPassword(email: string) {
    const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`,
    });

    if (error) throw error;

    await sendEmail({
      to: email,
      template: 'password-reset',
      data: {
        resetLink: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`
      }
    });
  }

  async verifyEmail(token: string) {
    const { error } = await this.supabase.auth.verifyOtp({
      token_hash: token,
      type: 'email',
    });

    if (error) throw error;
  }
}
