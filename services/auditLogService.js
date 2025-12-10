// ~/services/auditLogService.js
export class AuditLogService {
  constructor(client) {
    this.client = client
    this.basePath = '/api/v1/audit-logs'
  }

  async getAuditLogs(params = {}) {
    try {
      console.log('📞 Fetching audit logs with params:', params)
      
      // Use the client's get method which returns raw Response
      const response = await this.client.get(this.basePath, { params })
      
      // ✅ Call parseResponse to get the JSON data
      const data = await this.client.parseResponse(response)
      
      console.log('✅ Parsed audit logs data:', data)
      return data
    } catch (error) {
      console.error('❌ Error in auditLogService.getAuditLogs:', error)
      throw error
    }
  }

  async getAuditLogById(id) {
    const response = await this.client.get(`${this.basePath}/${id}`)
    return await this.client.parseResponse(response)
  }
}