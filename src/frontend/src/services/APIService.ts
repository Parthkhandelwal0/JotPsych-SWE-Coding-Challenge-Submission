class APIService {
  private static instance: APIService;
  private baseUrl: string;
  private appVersion: string;
  private token: string | null;

  private constructor() {
    this.baseUrl = 'http://localhost:3002';
    this.appVersion = '1.2.1'; // Starting version for testing update
    this.token = null;
  }

  public static getInstance(): APIService {
    if (!APIService.instance) {
      APIService.instance = new APIService();
    }
    return APIService.instance;
  }

  public async request(
    endpoint: string,
    method: string,
    body?: any,
    auth: boolean = false
  ): Promise<any> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'app-version': this.appVersion,
    };

    if (auth) {
      this.token = this.getToken();
      if (this.token) {
        headers['Authorization'] = `Bearer ${this.token}`;
      }
    }

    const options: RequestInit = {
      method,
      headers,
      body: body ? JSON.stringify(body) : null,
      credentials: 'include',  // Include credentials in the request
    };

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, options);
      if (!response.ok) {
        if (response.status === 426) {
          throw new Error('Please update your client application to the latest version.');
        }
        const errorData = await response.json();
        throw new Error(errorData.message || 'Network response was not ok');
      }
      return response.json();
    } catch (error) {
      console.error('Fetch error:', error);
      throw new Error('Failed to fetch');
    }
  }

  private getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  public setToken(token: string) {
    localStorage.setItem('access_token', token);
    this.token = token;
  }

  public updateAppVersion(version: string) {
    this.appVersion = version;
  }

  public async logout() {
    await this.request('/logout', 'POST', null, true);
    this.token = null;
    localStorage.removeItem('access_token');
  }
}

export default APIService.getInstance();
