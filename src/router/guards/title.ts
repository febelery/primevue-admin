import type { Router } from 'vue-router'

const DEFAULT_TITLE = document.title

export function createTitleGuard(router: Router) {
  router.afterEach((to) => {
    const title = to.meta?.title
    if (title) {
      document.title = `${title} - ${DEFAULT_TITLE}`
    } else {
      document.title = `${DEFAULT_TITLE}`
    }
  })
}
