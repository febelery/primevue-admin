import type { Router } from 'vue-router'

const DEFAULT_TITLE = document.title

export function createTitleGuard(router: Router) {
  router.afterEach((to) => {
    console.log(to, DEFAULT_TITLE)
    const title = to.meta?.title
    if (title) {
      document.title = `${title} - ${DEFAULT_TITLE}`
    } else {
      document.title = `${DEFAULT_TITLE}`
    }
  })
}
