// services/userService.js
export class UserService {
  constructor(httpClient) {
    this.http = httpClient
  }
  /**
   * Fetch paginated users list
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number (0-indexed)
   * @param {number} params.size - Items per page
   * @param {string} params.sortBy - Sort field
   * @param {string} params.sortDir - Sort direction (ASC/DESC)
   * @param {string} params.search - Search query
   */
  async getUsers(params = {}) {
    const queryParams = new URLSearchParams({
      page: params.page ?? 0,
      size: params.size ?? 10,
      sortBy: params.sortBy ?? 'id',
      sortDir: params.sortDir ?? 'DESC'
    })

    if (params.search?.trim()) {
      queryParams.append('search', params.search.trim())
    }

    const response = await this.http.get(`/api/v1/users?${queryParams}`)
    return this.http.parseResponse(response)
  }

  /**
   * Get user by ID
   */
  async getUserById(id) {
    const response = await this.http.get(`/users/${id}`)
    return this.http.parseResponse(response)
  }

  /**
   * Create new user
   */
  async createUser(userData) {
    const response = await this.http.post('/users', userData)
    return this.http.parseResponse(response)
  }

  /**
   * Update user
   */
  async updateUser(id, userData) {
    const response = await this.http.put(`/users/${id}`, userData)
    return this.http.parseResponse(response)
  }

  /**
   * Delete user
   */
  async deleteUser(id) {
    const response = await this.http.delete(`/users/${id}`)
    return this.http.parseResponse(response)
  }

  /**
   * Get current user profile
   */
  async getProfile() {
    const response = await this.http.get('/users/me')
    return this.http.parseResponse(response)
  }

  /**
   * Update current user profile
   */
  async updateProfile(userData) {
    const response = await this.http.put('/users/me', userData)
    return this.http.parseResponse(response)
  }
}

// composables/useUserService.js
export const useUserService = () => {
  const { client } = useHttp()
  return new UserService(client)
}