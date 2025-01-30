class KakaoClient {
  private apiKey: string;
  private apiEndpoint = 'https://kapi.kakao.com/v2/api/talk/memo/default/send';

  constructor() {
    this.apiKey = process.env.KAKAO_API_KEY!;
  }

  async sendMessage(channelId: string, message: { type: string; text: string }) {
    const response = await fetch(this.apiEndpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        template_object: JSON.stringify({
          object_type: 'text',
          text: message.text,
          link: {
            web_url: process.env.NEXT_PUBLIC_APP_URL
          }
        })
      })
    });

    if (!response.ok) {
      throw new Error(`Kakao API error: ${response.statusText}`);
    }

    return response.json();
  }
}

export const kakaoClient = new KakaoClient();
