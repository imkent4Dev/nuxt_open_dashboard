import { useHttp } from "~/services/httpClient"
import { UserService } from "~/services/userService"

export const useUserService = () => {
  const { client } = useHttp()
  return new UserService(client)
}