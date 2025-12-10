// services/tokenService.js
export class TokenService {
  constructor(storageService) {
    this.storage = storageService
  }

  saveAuthData(authData) {
    this.storage.set('accessToken', authData.accessToken)
    this.storage.set('refreshToken', authData.refreshToken)
    this.storage.setJSON('user', authData.user)
  }

  getAuthData() {
    return {
      accessToken: this.storage.get('accessToken'),
      refreshToken: this.storage.get('refreshToken'),
      user: this.storage.getJSON('user')
    }
  }

  clearAuthData() {
    this.storage.remove('accessToken')
    this.storage.remove('refreshToken')
    this.storage.remove('user')
  }

  getAuthHeaders(accessToken, tokenType = 'Bearer') {
    return {
      'Authorization': `${tokenType} ${accessToken}`,
      'Content-Type': 'application/json',
      'accept': '*/*'
    }
  }
}