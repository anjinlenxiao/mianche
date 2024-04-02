import delay from '../utils/delay'
interface User {
  code: string
  name: string
}
const getUserData = (): User[] => {
  const count = 4
  return Array(count)
    .fill(0)
    .map(() => {
      return {
        code: '0',
        name: (Math.random() + 1).toString(36).substring(7),
      }
    })
}

const query = (params: Partial<User & { orgId: string }>) => {
  return delay(getUserData())
}

const userApi = {
  query,
}

export default userApi
