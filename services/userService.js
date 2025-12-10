// services/userService.js
export class UserService {
  constructor(httpClient) {
    this.http = httpClient
    this.baseUrl = '/api/v1/users' // Define base URL
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

    const response = await this.http.get(`${this.baseUrl}?${queryParams}`)
    return this.http.parseResponse(response)
  }

  /**
   * Get user by ID
   */
  async getUserById(id) {
    const response = await this.http.get(`${this.baseUrl}/${id}`)
    return this.http.parseResponse(response)
  }

  /**
   * Create new user
   */
  async createUser(userData) {
    const response = await this.http.post(this.baseUrl, userData)
    return this.http.parseResponse(response)
  }

  /**
   * Update user
   */
  async updateUser(id, userData) {
    const response = await this.http.put(`${this.baseUrl}/${id}`, userData)
    return this.http.parseResponse(response)
  }

  /**
   * Delete user
   */
  async deleteUser(id) {
    const response = await this.http.delete(`${this.baseUrl}/${id}`)
    return this.http.parseResponse(response)
  }

  /**
   * Get current user profile
   */
  async getProfile() {
    const response = await this.http.get(`${this.baseUrl}/me`)
    return this.http.parseResponse(response)
  }

  /**
   * Update current user profile
   */
  async updateProfile(userData) {
    const response = await this.http.put(`${this.baseUrl}/me`, userData)
    return this.http.parseResponse(response)
  }

  async updateUser(id, userData) {
    const response = await this.http.put(`${this.baseUrl}/${id}`, userData)
    return this.http.parseResponse(response)
  }

  /**
   * Assign roles to user
   */
  async assignRoles(userId, roleIds) {
    const response = await this.http.post(`${this.baseUrl}/${userId}/roles`, { roleIds })
    return this.http.parseResponse(response)
  }

  /**
   * Update user roles
   */
  async updateUserRoles(userId, roleIds) {
    const response = await this.http.put(`${this.baseUrl}/${userId}/roles`, { roleIds })
    return this.http.parseResponse(response)
  }

  /**
   * Get user roles
   */
  async getUserRoles(userId) {
    const response = await this.http.get(`${this.baseUrl}/${userId}/roles`)
    return this.http.parseResponse(response)
  }

}