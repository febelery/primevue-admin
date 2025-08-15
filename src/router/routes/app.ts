import type { RouteRecordRaw } from 'vue-router'

const appRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'AppLayout',
    component: () => import('@/layouts/AppLayout.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: {
          title: '仪表板',
          icon: 'pi pi-home',
          order: 1,
        },
      },
      {
        path: 'customers',
        name: 'Customers',
        meta: {
          title: '客户管理',
          icon: 'pi pi-users',
          order: 2,
        },
        children: [
          {
            path: 'list',
            name: 'CustomersList',
            component: () => import('@/views/ComingSoon.vue'),
            meta: {
              title: '客户列表',
              icon: 'pi pi-list',
              order: 1,
            },
          },
          {
            path: 'add',
            name: 'CustomersAdd',
            component: () => import('@/views/ComingSoon.vue'),
            meta: {
              title: '添加客户',
              icon: 'pi pi-plus',
              order: 2,
            },
          },
          {
            path: 'import',
            name: 'CustomersImport',
            component: () => import('@/views/ComingSoon.vue'),
            meta: {
              title: '批量导入',
              icon: 'pi pi-upload',
              order: 3,
            },
          },
        ],
      },
      {
        path: 'products',
        name: 'Products',
        meta: {
          title: '产品管理',
          icon: 'pi pi-box',
          order: 3,
        },
        children: [
          {
            path: 'list',
            name: 'ProductsList',
            component: () => import('@/views/ComingSoon.vue'),
            meta: {
              title: '产品列表',
              icon: 'pi pi-list',
              order: 1,
            },
          },
          {
            path: 'categories',
            name: 'ProductCategories',
            meta: {
              title: '产品分类',
              icon: 'pi pi-tags',
              order: 2,
            },
            children: [
              {
                path: 'list',
                name: 'ProductCategoriesList',
                meta: {
                  title: '分类列表',
                  icon: 'pi pi-list',
                  order: 2,
                },
                children: [
                  {
                    path: 'a',
                    name: 'ProductCategoriesListA',
                    component: () => import('@/views/ComingSoon.vue'),
                    meta: {
                      title: '列表A',
                      icon: 'pi pi-list',
                      order: 1,
                    },
                  },
                  {
                    path: 'b',
                    name: 'ProductCategoriesListB',
                    component: () => import('@/views/ComingSoon.vue'),
                    meta: {
                      title: '列表B',
                      order: 2,
                    },
                  },
                ],
              },
              {
                path: 'add',
                name: 'ProductCategoriesAdd',
                component: () => import('@/views/ComingSoon.vue'),
                meta: {
                  title: '添加分类',
                  icon: 'pi pi-plus',
                  order: 1,
                },
              },
              {
                path: 'tree',
                name: 'ProductCategoriesTree',
                component: () => import('@/views/ComingSoon.vue'),
                meta: {
                  title: '分类树',
                  icon: 'pi pi-sitemap',
                  order: 3,
                },
              },
              {
                path: 'import',
                name: 'ProductCategoriesImport',
                component: () => import('@/views/ComingSoon.vue'),
                meta: {
                  title: '批量导入',
                  icon: 'pi pi-upload',
                  order: 4,
                },
              },
              {
                path: 'export',
                name: 'ProductCategoriesExport',
                component: () => import('@/views/ComingSoon.vue'),
                meta: {
                  title: '批量导出',
                  icon: 'pi pi-download',
                  order: 5,
                },
              },
              {
                path: 'settings',
                name: 'ProductCategoriesSettings',
                meta: {
                  title: '分类设置',
                  icon: 'pi pi-sliders-h',
                  order: 6,
                  hideInMenu: true, // 不在菜单中显示，只作为路由容器
                },
                children: [
                  {
                    path: 'rules',
                    name: 'ProductCategoriesRules',
                    component: () => import('@/views/ComingSoon.vue'),
                    meta: {
                      title: '分类规则',
                      icon: 'pi pi-check-square',
                      order: 1,
                    },
                  },
                  {
                    path: 'templates',
                    name: 'ProductCategoriesTemplates',
                    component: () => import('@/views/ComingSoon.vue'),
                    meta: {
                      title: '分类模板',
                      icon: 'pi pi-file',
                      order: 2,
                    },
                  },
                  {
                    path: 'permissions',
                    name: 'ProductCategoriesPermissions',
                    meta: {
                      title: '权限管理',
                      icon: 'pi pi-shield',
                      order: 3,
                      hideInMenu: true,
                    },
                    children: [
                      {
                        path: 'users',
                        name: 'ProductCategoriesUserPermissions',
                        component: () => import('@/views/ComingSoon.vue'),
                        meta: {
                          title: '用户权限',
                          icon: 'pi pi-user',
                          order: 1,
                        },
                      },
                      {
                        path: 'roles',
                        name: 'ProductCategoriesRolePermissions',
                        component: () => import('@/views/ComingSoon.vue'),
                        meta: {
                          title: '角色权限',
                          icon: 'pi pi-users',
                          order: 2,
                        },
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            path: 'inventory',
            name: 'ProductInventory',
            meta: {
              title: '库存概览',
              icon: 'pi pi-chart-bar',
              order: 3,
            },
            children: [
              {
                path: 'overview',
                name: 'ProductInventoryOverview',
                component: () => import('@/views/ComingSoon.vue'),
                meta: {
                  title: '库存总览',
                  icon: 'pi pi-chart-bar',
                  order: 1,
                },
              },
              {
                path: 'alerts',
                name: 'ProductInventoryAlerts',
                component: () => import('@/views/ComingSoon.vue'),
                meta: {
                  title: '库存预警',
                  icon: 'pi pi-exclamation-triangle',
                  order: 2,
                },
              },
            ],
          },
        ],
      },
      {
        path: 'orders',
        name: 'Orders',
        meta: {
          title: '订单管理',
          icon: 'pi pi-shopping-cart',
          order: 4,
        },
        children: [
          {
            path: 'list',
            name: 'OrdersList',
            component: () => import('@/views/ComingSoon.vue'),
            meta: {
              title: '订单列表',
              icon: 'pi pi-list',
              order: 1,
            },
          },
          {
            path: 'pending',
            name: 'OrdersPending',
            component: () => import('@/views/ComingSoon.vue'),
            meta: {
              title: '待处理订单',
              icon: 'pi pi-clock',
              order: 2,
            },
          },
        ],
      },
      {
        path: 'analytics',
        name: 'Analytics',
        meta: {
          title: '数据分析',
          icon: 'pi pi-chart-line',
          order: 5,
        },
        children: [
          {
            path: 'sales',
            name: 'AnalyticsSales',
            component: () => import('@/views/ComingSoon.vue'),
            meta: {
              title: '销售分析',
              icon: 'pi pi-chart-bar',
              order: 1,
            },
          },
          {
            path: 'users',
            name: 'AnalyticsUsers',
            component: () => import('@/views/ComingSoon.vue'),
            meta: {
              title: '用户分析',
              icon: 'pi pi-users',
              order: 2,
            },
          },
        ],
      },
      {
        path: 'settings',
        name: 'Settings',
        meta: {
          title: '系统设置',
          icon: 'pi pi-cog',
          order: 6,
        },
        children: [
          {
            path: 'general',
            name: 'SettingsGeneral',
            component: () => import('@/views/ComingSoon.vue'),
            meta: {
              title: '基本设置',
              icon: 'pi pi-sliders-h',
              order: 1,
            },
          },
          {
            path: 'users',
            name: 'SettingsUsers',
            component: () => import('@/views/ComingSoon.vue'),
            meta: {
              title: '用户管理',
              icon: 'pi pi-users',
              order: 2,
            },
          },
          {
            path: 'permissions',
            name: 'SettingsPermissions',
            component: () => import('@/views/ComingSoon.vue'),
            meta: {
              title: '权限管理',
              icon: 'pi pi-shield',
              order: 3,
            },
          },
        ],
      },
      {
        path: 'demo',
        name: 'Demo',
        meta: {
          title: '组件演示',
          icon: 'pi pi-code',
          order: 7,
        },
        children: [
          {
            path: 'user-menu',
            name: 'UserMenuDemo',
            component: () => import('@/views/demo/UserMenuDemo.vue'),
            meta: {
              title: 'UserMenu 组件',
              icon: 'pi pi-user',
              order: 1,
            },
          },
        ],
      },
      {
        path: 'help',
        name: 'Help',
        component: () => import('@/views/ComingSoon.vue'),
        meta: {
          title: '帮助中心',
          icon: 'pi pi-question-circle',
          order: 8,
        },
      },
    ],
  },
]

export default appRoutes
