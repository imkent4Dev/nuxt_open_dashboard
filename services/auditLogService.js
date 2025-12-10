// ~/services/auditLogService.js
export class AuditLogService {
  constructor(httpClient) {
    this.http = httpClient
    this.baseUrl = '/api/v1/audit-logs' // Note: this should be relative to your API base
  }

  /**
   * Fetch paginated audit logs
   * @param {Object} params
   * @param {number} params.page - Page number (0-indexed)
   * @param {number} params.size - Items per page
   * @param {string} params.sortBy - Sort field
   * @param {string} params.sortDir - Sort direction (ASC/DESC)
   * @param {string} params.search - Search query
   * @param {boolean} params.success - Filter by success status
   * @param {string} params.action - Filter by action type
   * @param {string} params.resource - Filter by resource type
   * @param {string} params.startDate - Start date filter
   * @param {string} params.endDate - End date filter
   */
  async getAuditLogs(params = {}) {
    // Clean up undefined/null params
    const cleanParams = Object.entries(params).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        acc[key] = value
      }
      return acc
    }, {})

    return await this.http.get(this.baseUrl, { params: cleanParams })
  }

  /**
   * Get audit log by ID
   * @param {number} id - Audit log ID
   */
  async getAuditLogById(id) {
    return await this.http.get(`${this.baseUrl}/${id}`)
  }

  /**
   * Search audit logs with specific criteria
   * @param {Object} searchParams - Search parameters
   */
  async searchAuditLogs(searchParams) {
    return await this.http.get(`${this.baseUrl}/search`, { params: searchParams })
  }
}