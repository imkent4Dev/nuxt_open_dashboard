// ~/composables/useAuditService.js
import { useHttp } from '~/services/httpClient'
import { AuditLogService } from '~/services/auditLogService'

export const useAuditService = () => {
  const { client } = useHttp()
  return new AuditLogService(client)
}