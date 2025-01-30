export class EmailVerificationSystem {
  async sendVerificationEmail(userId: string, email: string) {
    const token = await this.generateVerificationToken(userId);
    
    await sendEmail({
      to: email,
      template: 'email-verification',
      data: {
        verificationLink: `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`
      }
    });
  }

  async verifyEmail(token: string) {
    const userId = await this.validateVerificationToken(token);
    if (!userId) throw new Error('Invalid verification token');

    await this.markEmailAsVerified(userId);
  }
}
