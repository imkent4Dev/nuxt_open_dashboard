// services/permissionService.js
export class PermissionService {
  constructor(httpClient) {
    this.http = httpClient
    this.baseUrl = '/api/v1/permissions'
  }
  
  /**
   * Get all permissions (paginated)
   */
  async getAllPermissions(params = {}) {
    const queryParams = new URLSearchParams({
      page: params.page ?? 0,
      size: params.size ?? 100,
      sortBy: params.sortBy ?? 'id',
      sortDir: params.sortDir ?? 'ASC'
    })

    if (params.search?.trim()) {
      queryParams.append('search', params.search.trim())
    }

    const response = await this.http.get(`${this.baseUrl}?${queryParams}`)
    return this.http.parseResponse(response)
  }

  /**
   * Get permission by ID
   */
  async getPermissionById(id) {
    const response = await this.http.get(`${this.baseUrl}/${id}`)
    return this.http.parseResponse(response)
  }

  /**
   * Create new permission
   */
  async createPermission(permissionData) {
    const response = await this.http.post(this.baseUrl, permissionData)
    return this.http.parseResponse(response)
  }

  /**
   * Update permission
   */
  async updatePermission(id, permissionData) {
    const response = await this.http.put(`${this.baseUrl}/${id}`, permissionData)
    return this.http.parseResponse(response)
  }

  /**
   * Delete permission
   */
  async deletePermission(id) {
    const response = await this.http.delete(`${this.baseUrl}/${id}`)
    return this.http.parseResponse(response)
  }
}