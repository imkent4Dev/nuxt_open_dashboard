// services/authService.js
export class AuthService {
  constructor(apiBase) {
    this.apiBase = apiBase
  }

  async login(credentials) {
    const payload = {
      usernameOrEmail: credentials.usernameOrEmail || credentials.email || credentials.username,
      password: credentials.password
    }

    const response = await fetch(`${this.apiBase}/api/v1/auth/login`, {
      method: 'POST',
      headers: {
        'accept': '*/*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    const data = await response.json()

    if (!response.ok || !data.success || !data.data) {
      throw new Error(data.message?.en || data.message || 'Login failed')
    }

    return data.data
  }

  async logout(accessToken, tokenType = 'Bearer') {
    try {
      await fetch(`${this.apiBase}/api/v1/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `${tokenType} ${accessToken}`,
          'Content-Type': 'application/json',
          'accept': '*/*'
        }
      })
    } catch (err) {
      console.warn('Logout API call failed:', err)
    }
  }

  /**
   * Get user with roles and permissions by ID
   */
  async getUserPermissionsById(id, accessToken, tokenType = 'Bearer') {
    const response = await fetch(`${this.apiBase}/api/v1/auth/users/${id}/permissions`, {
      headers: {
        'Authorization': `${tokenType} ${accessToken}`,
        'accept': '*/*'
      }
    })
    return response.json()
  }

  /**
   * Get user with roles and permissions by username
   */
  async getUserPermissionsByUsername(username, accessToken, tokenType = 'Bearer') {
    const response = await fetch(`${this.apiBase}/api/v1/auth/users/username/${username}/permissions`, {
      headers: {
        'Authorization': `${tokenType} ${accessToken}`,
        'accept': '*/*'
      }
    })
    return response.json()
  }

  /**
   * Get only permissions list for a user
   */
  async getUserPermissionList(id, accessToken, tokenType = 'Bearer') {
    const response = await fetch(`${this.apiBase}/api/v1/auth/users/${id}/permissions/list`, {
      headers: {
        'Authorization': `${tokenType} ${accessToken}`,
        'accept': '*/*'
      }
    })
    return response.json()
  }

  /**
   * Check if a user has a specific permission
   */
  async checkPermission(payload, accessToken, tokenType = 'Bearer') {
    const response = await fetch(`${this.apiBase}/api/v1/auth/check-permission`, {
      method: 'POST',
      headers: {
        'Authorization': `${tokenType} ${accessToken}`,
        'Content-Type': 'application/json',
        'accept': '*/*'
      },
      body: JSON.stringify(payload)
    })
    return response.json()
  }

  async refreshToken(refreshToken) {
    const response = await fetch(`${this.apiBase}/api/v1/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': '*/*'
      },
      body: JSON.stringify({ refreshToken })
    })

    const data = await response.json()

    if (!data.success || !data.data) {
      throw new Error('Token refresh failed')
    }

    return data.data
  }
}
