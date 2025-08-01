import { createTitleGuard } from './title'
import type { Router } from 'vue-router'

export default function createRouteGuard(router: Router) {
  createTitleGuard(router)
}
