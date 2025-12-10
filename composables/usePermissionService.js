// composables/usePermissionService.js
import { useHttp } from '~/services/httpClient'
import { PermissionService } from '~/services/permissionService'

export const usePermissionService = () => {
  const { client } = useHttp()
  return new PermissionService(client)
}