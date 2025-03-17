import { authenticator } from 'otplib';
import QRCode from 'qrcode';

export class MFAService {
  async setupMFA(userId: string) {
    const secret = authenticator.generateSecret();
    const otpauth = authenticator.keyuri(userId, 'YourApp', secret);
    const qrCode = await QRCode.toDataURL(otpauth);

    await this.storeMFASecret(userId, secret);
    
    return { secret, qrCode };
  }

  async verifyMFAToken(userId: string, token: string) {
    const secret = await this.getMFASecret(userId);
    return authenticator.verify({ token, secret });
  }
}
