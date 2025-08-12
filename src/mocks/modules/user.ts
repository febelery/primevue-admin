import { buildMockApiUrl } from '@/lib/utils'
import type { User, UpdateUserParams, ChangePasswordParams } from '@/types/user'
import { UserRole, UserStatus } from '@/types/user'
import { http, HttpResponse } from 'msw'

// 模拟用户数据
const mockUser: User = {
  id: '1',
  username: 'admin',
  email: 'admin@example.com',
  firstName: '管理员',
  lastName: '用户',
  fullName: '管理员用户',
  avatar: 'https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png',
  role: UserRole.ADMIN,
  status: UserStatus.ACTIVE,
  lastLoginAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30分钟前
  createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(), // 30天前
  updatedAt: new Date().toISOString(),
  preferences: {
    theme: 'system',
    language: 'zh-CN',
    timezone: 'Asia/Shanghai',
    notifications: {
      email: true,
      push: true,
      sms: false,
    },
    privacy: {
      profileVisible: true,
      emailVisible: false,
    },
  },
}

const userHandlers = [
  // 获取当前用户信息
  http.get(buildMockApiUrl('/user/profile'), () => {
    return HttpResponse.json(mockUser)
  }),

  // 更新用户信息
  http.patch(buildMockApiUrl('/user/profile'), async ({ request }) => {
    const params = (await request.json()) as UpdateUserParams

    // 更新模拟数据
    if (params.firstName) mockUser.firstName = params.firstName
    if (params.lastName) mockUser.lastName = params.lastName
    if (params.email) mockUser.email = params.email
    if (params.avatar) mockUser.avatar = params.avatar
    if (params.preferences && mockUser.preferences) {
      mockUser.preferences = {
        ...mockUser.preferences,
        ...params.preferences,
        theme: params.preferences.theme || mockUser.preferences.theme,
        language: params.preferences.language || mockUser.preferences.language,
        timezone: params.preferences.timezone || mockUser.preferences.timezone,
      }
    }

    // 更新全名和更新时间
    mockUser.fullName = `${mockUser.firstName}${mockUser.lastName}`
    mockUser.updatedAt = new Date().toISOString()

    return HttpResponse.json(mockUser)
  }),

  // 修改密码
  http.patch(buildMockApiUrl('/user/password'), async ({ request }) => {
    const params = (await request.json()) as ChangePasswordParams

    // 模拟密码验证
    if (params.currentPassword !== 'admin123') {
      return HttpResponse.json({ message: '当前密码不正确' }, { status: 400 })
    }

    if (params.newPassword !== params.confirmPassword) {
      return HttpResponse.json({ message: '新密码和确认密码不匹配' }, { status: 400 })
    }

    if (params.newPassword.length < 6) {
      return HttpResponse.json({ message: '密码长度至少为6位' }, { status: 400 })
    }

    return HttpResponse.json(null, { status: 200 })
  }),

  // 上传头像
  http.post(buildMockApiUrl('/user/avatar'), async ({ request }) => {
    const formData = await request.formData()
    const file = formData.get('avatar') as File

    if (!file) {
      return HttpResponse.json({ message: '请选择要上传的文件' }, { status: 400 })
    }

    // 模拟文件上传，返回一个假的URL
    const mockUrl = `https://example.com/avatars/${Date.now()}-${file.name}`

    return HttpResponse.json({ url: mockUrl })
  }),

  // 退出登录
  http.post(buildMockApiUrl('/auth/logout'), () => {
    // 模拟退出登录
    return HttpResponse.json(null, { status: 200 })
  }),
]

export default userHandlers
