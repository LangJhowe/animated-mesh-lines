import router from './index'

router.beforeEach((to, from, next) => {
  if (to.matched.length == 0) {
    next('/404')
  } else {
    next()
  }
})
router.afterEach((to) => {
})