// services/roleService.js
export class RoleService {
  constructor(httpClient) {
    this.http = httpClient
    this.baseUrl = '/api/v1/roles'
  }
  
  /**
   * Get all roles with permissions
   */
  async getAllRoles() {
    const response = await this.http.get(this.baseUrl)
    return this.http.parseResponse(response)
  }

  /**
   * Get role by ID
   */
  async getRoleById(id) {
    const response = await this.http.get(`${this.baseUrl}/${id}`)
    return this.http.parseResponse(response)
  }

  /**
   * Create new role
   */
  async createRole(roleData) {
    const response = await this.http.post(this.baseUrl, roleData)
    return this.http.parseResponse(response)
  }

  /**
   * Update role
   */
  async updateRole(id, roleData) {
    const response = await this.http.put(`${this.baseUrl}/${id}`, roleData)
    return this.http.parseResponse(response)
  }

  /**
   * Delete role
   */
  async deleteRole(id) {
    const response = await this.http.delete(`${this.baseUrl}/${id}`)
    return this.http.parseResponse(response)
  }

  async assignPermissions(roleId, permissionIds) {
    const response = await this.http.post(`${this.baseUrl}/${roleId}/permissions`, { permissionIds })
    return this.http.parseResponse(response)
  }

  /**
   * Update role permissions
   */
  async updateRolePermissions(roleId, permissionIds) {
    const response = await this.http.put(`${this.baseUrl}/${roleId}/permissions`, { permissionIds })
    return this.http.parseResponse(response)
  }

  /**
   * Get role permissions
   */
  async getRolePermissions(roleId) {
    const response = await this.http.get(`${this.baseUrl}/${roleId}/permissions`)
    return this.http.parseResponse(response)
  }

  /**
   * Remove permission from role
   */
  async removePermissionFromRole(roleId, permissionId) {
    const response = await this.http.delete(`${this.baseUrl}/${roleId}/permissions/${permissionId}`)
    return this.http.parseResponse(response)
  }
}