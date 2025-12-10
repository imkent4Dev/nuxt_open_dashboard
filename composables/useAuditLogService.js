// ~/composables/useAuditLogService.js
import { useHttp } from '~/services/httpClient'
import { AuditLogService } from '~/services/auditLogService'

export const useAuditLogService = () => {
  const { get, post, put, delete: del } = useHttp()  // Destructure convenience methods
  
  return {
    getAuditLogs: (params) => get('/api/v1/audit-logs', { params }),
    getAuditLogById: (id) => get(`/api/v1/audit-logs/${id}`),
    // ... other methods using the convenience methods
  }
}