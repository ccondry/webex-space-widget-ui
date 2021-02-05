const routes = [{
  // catch-all to redirect to home view if no route matched
  path: '*',
  redirect: '/'
}, {
  // the home page
  name: 'Home',
  path: '/',
  component: () => import(`../views/home.vue`)
}, {
  // the admin panel
  name: 'Admin',
  path: '/admin',
  component: () => import(`../views/admin.vue`)
}, {
  // complete oauth login
  name: 'Login',
  path: '/oauth',
  component: () => import(`../views/oauth.vue`)
}, {
  // agent
  name: 'Agent',
  path: '/agent',
  component: () => import(`../views/agent.vue`)
}, {
  // customer
  name: 'Customer',
  path: '/customer',
  component: () => import(`../views/customer.vue`)
}]
export default routes