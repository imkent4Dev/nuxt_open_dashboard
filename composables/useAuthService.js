// composables/useAuthService.js
import { AuthService } from '~/services/authService'
import { StorageService } from '~/services/storageService'
import { TokenService } from '~/services/tokenService'

export const useAuthService = () => {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase

  const storageService = new StorageService()
  const authService = new AuthService(apiBase)
  const tokenService = new TokenService(storageService)

  return {
    authService,
    tokenService,
    storageService
  }
}