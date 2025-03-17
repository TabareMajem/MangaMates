import liff from '@line/liff';

export class LiffService {
  private initialized = false;

  async initialize(liffId?: string): Promise<void> {
    if (this.initialized) return;

    try {
      await liff.init({
        liffId: liffId ?? process.env.NEXT_PUBLIC_LIFF_ID!,
        withLoginOnExternalBrowser: true,
      });
      this.initialized = true;
    } catch (error) {
      console.error('LIFF Initialization failed', error);
      throw error;
    }
  }

  async getProfile() {
    if (!liff.isLoggedIn()) {
      throw new Error('User is not logged in');
    }

    try {
      const profile = await liff.getProfile();
      return {
        userId: profile.userId,
        displayName: profile.displayName,
        pictureUrl: profile.pictureUrl,
        statusMessage: profile.statusMessage,
      };
    } catch (error) {
      console.error('Failed to get LIFF profile', error);
      throw error;
    }
  }

  login() {
    if (!liff.isLoggedIn()) {
      liff.login();
    }
  }

  logout() {
    if (liff.isLoggedIn()) {
      liff.logout();
    }
  }

  isInClient() {
    return liff.isInClient();
  }

  closeWindow() {
    liff.closeWindow();
  }
}

export const defaultLiffService = new LiffService();
