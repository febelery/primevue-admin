<template>
  <div class="relative flex min-h-screen items-center justify-center p-4">
    <!-- 动态背景 -->
    <div class="absolute inset-0 z-0">
      <!-- 基础渐变背景 -->
      <div
        class="from-surface-50 via-surface-100 to-surface-50 dark:from-surface-950 dark:via-surface-900 dark:to-surface-950 absolute inset-0 bg-gradient-to-br"
      ></div>

      <!-- 动态光晕效果 -->
      <div
        class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(var(--p-primary-500),0.1)_0%,transparent_70%)]"
      ></div>

      <!-- 浮动装饰元素 -->
      <div
        class="bg-primary/20 absolute top-1/4 left-1/4 h-32 w-32 animate-pulse rounded-full blur-xl"
        style="animation-delay: 0.5s; animation-duration: 4s"
      ></div>
      <div
        class="bg-primary/15 absolute top-1/3 right-1/4 h-24 w-24 animate-pulse rounded-full blur-xl"
        style="animation-delay: 1s; animation-duration: 3s"
      ></div>
      <div
        class="bg-primary/10 absolute bottom-1/4 left-1/3 h-28 w-28 animate-pulse rounded-full blur-xl"
        style="animation-delay: 1.5s; animation-duration: 5s"
      ></div>

      <!-- 大型背景装饰 -->
      <div
        class="bg-primary/5 absolute top-0 left-1/2 h-96 w-96 -translate-x-1/2 transform rounded-full blur-3xl"
      ></div>
      <div
        class="bg-primary/5 absolute right-1/3 bottom-0 h-80 w-80 translate-x-1/3 transform rounded-full blur-3xl"
      ></div>
    </div>

    <!-- 登录卡片容器 -->
    <Motion
      :initial="{ opacity: 0, y: 50, scale: 0.95 }"
      :animate="{ opacity: 1, y: 0, scale: 1 }"
      :transition="{ duration: 0.8, ease: 'easeOut' }"
      class="relative z-10 w-full max-w-md"
    >
      <div
        class="border-surface-200/50 bg-surface-0/80 dark:border-surface-700/50 dark:bg-surface-900/80 hover:shadow-3xl overflow-hidden rounded-2xl border shadow-2xl backdrop-blur-xl transition-all duration-500"
      >
        <!-- 顶部装饰条 -->
        <div class="from-primary via-primary-400 to-primary h-2 bg-gradient-to-r"></div>

        <!-- 卡片内容 -->
        <div class="p-8">
          <Motion
            :initial="{ opacity: 0, y: 20 }"
            :animate="{ opacity: 1, y: 0 }"
            :transition="{ duration: 0.6, delay: 0.2 }"
            class="mb-8 text-center"
          >
            <div
              class="from-primary to-primary-600 mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br shadow-lg transition-transform duration-300 hover:scale-110"
            >
              <i class="pi pi-lock text-primary-contrast text-2xl"></i>
            </div>
            <h1 class="text-surface-900 dark:text-surface-0 mb-2 text-2xl font-bold">欢迎回来</h1>
            <p class="text-surface-600 dark:text-surface-400">请登录您的账户</p>
          </Motion>

          <!-- 登录表单 -->
          <Motion
            :initial="{ opacity: 0, y: 20 }"
            :animate="{ opacity: 1, y: 0 }"
            :transition="{ duration: 0.6, delay: 0.4 }"
          >
            <Form
              v-slot="$form"
              :initialValues="initialValues"
              :resolver="resolver"
              @submit="onFormSubmit"
              class="space-y-6"
            >
              <!-- 用户名输入 -->
              <div class="space-y-2">
                <label
                  for="username"
                  class="text-surface-700 dark:text-surface-300 block text-sm font-medium"
                >
                  用户名
                </label>
                <InputGroup>
                  <InputGroupAddon>
                    <i class="pi pi-user text-surface-500"></i>
                  </InputGroupAddon>
                  <InputText
                    id="username"
                    name="username"
                    type="text"
                    placeholder="请输入用户名"
                    fluid
                    :invalid="$form.username?.invalid"
                  />
                </InputGroup>
                <Transition name="fade">
                  <Message
                    v-if="$form.username?.invalid"
                    severity="error"
                    size="small"
                    variant="simple"
                    class="mt-1"
                  >
                    {{ $form.username.error?.message }}
                  </Message>
                </Transition>
              </div>

              <!-- 密码输入 -->
              <div class="space-y-2">
                <label
                  for="password"
                  class="text-surface-700 dark:text-surface-300 block text-sm font-medium"
                >
                  密码
                </label>
                <InputGroup>
                  <InputGroupAddon>
                    <i class="pi pi-lock text-surface-500"></i>
                  </InputGroupAddon>
                  <Password
                    id="password"
                    name="password"
                    placeholder="请输入密码"
                    toggleMask
                    fluid
                    :invalid="$form.password?.invalid"
                  />
                </InputGroup>
                <Transition name="fade">
                  <Message
                    v-if="$form.password?.invalid"
                    severity="error"
                    size="small"
                    variant="simple"
                    class="mt-1"
                  >
                    {{ $form.password.error?.message }}
                  </Message>
                </Transition>
              </div>

              <!-- 登录按钮 -->
              <div class="pt-4">
                <Button
                  type="submit"
                  :label="isLoading ? '登录中...' : '登 录'"
                  icon="pi pi-sign-in"
                  class="h-12 w-full text-base font-medium"
                  :loading="isLoading"
                  :disabled="isLoading || !isFormValid($form)"
                  :severity="isFormValid($form) ? 'primary' : 'secondary'"
                  :class="{
                    'border-0 bg-gradient-to-r': isFormValid($form) && !isLoading,
                    'cursor-not-allowed opacity-50': !isFormValid($form) || isLoading,
                  }"
                />
              </div>
            </Form>
          </Motion>

          <!-- 底部链接 -->
          <Motion
            :initial="{ opacity: 0, y: 20 }"
            :animate="{ opacity: 1, y: 0 }"
            :transition="{ duration: 0.6, delay: 0.6 }"
            class="mt-8 text-center"
          >
            <p class="text-surface-600 dark:text-surface-400 text-sm">
              还没有账户？
              <a
                href="#"
                class="text-primary hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors duration-300"
              >
                立即注册
              </a>
            </p>
          </Motion>
        </div>
      </div>
    </Motion>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import InputGroup from 'primevue/inputgroup'
import InputGroupAddon from 'primevue/inputgroupaddon'
import { useToast } from 'primevue/usetoast'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { z } from 'zod'

const toast = useToast()
const router = useRouter()
const userStore = useUserStore()

// 定义登录表单的 Zod 验证模式
const loginSchema = z.object({
  username: z
    .string()
    .min(1, { message: '请输入用户名' })
    .min(3, { message: '用户名至少需要3个字符' })
    .max(50, { message: '用户名不能超过50个字符' }),
  password: z
    .string()
    .min(1, { message: '请输入密码' })
    .min(6, { message: '密码至少需要6个字符' })
    .max(100, { message: '密码不能超过100个字符' }),
})

type LoginFormData = z.infer<typeof loginSchema>

const initialValues = reactive<LoginFormData>({
  username: '',
  password: '',
})

const resolver = zodResolver(loginSchema)

const isLoading = ref(false)

const isFormValid = (form: any) => {
  return form.username?.valid && form.password?.valid
}

const onFormSubmit = async ({ valid, values }: { valid: boolean; values: LoginFormData }) => {
  if (!valid) {
    toast.add({
      severity: 'error',
      summary: '表单验证失败',
      detail: '请检查输入的信息',
      life: 3000,
    })
    return
  }

  isLoading.value = true

  try {
    // 调用用户存储的登录方法
    const result = await userStore.login(values)

    if (result.needOtp) {
      // 如果需要 OTP 验证，这里可以跳转到 OTP 验证页面
      // 或者显示 OTP 输入框
      toast.add({
        severity: 'info',
        summary: '需要二次验证',
        detail: '请输入验证码',
        life: 5000,
      })
    } else {
      // 登录成功，跳转到首页
      toast.add({
        severity: 'success',
        summary: '登录成功',
        detail: `欢迎你，${values.username}！`,
        life: 3000,
      })

      // 跳转到首页或用户之前访问的页面
      await router.push('/')
    }
  } catch (error: any) {
    // 显示错误信息
    const errorMessage = error?.data?.message || error?.message || '登录失败，请重试'
    toast.add({
      severity: 'error',
      summary: '登录失败',
      detail: errorMessage,
      life: 5000,
    })
  } finally {
    isLoading.value = false
  }
}
</script>
