import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: '首页',
        meta: { title: '首页', icon: 'shouye', affix: true }
      }
    ]
  },

  {
    path: '/product_manage',
    component: Layout,
    redirect: '/product_manage',
    alwaysShow: true,
    name: '内容管理',
    meta: { title: '内容管理', icon: 'neirongguanli', affix: true },
    children: [
      {
        path: 'shop_catetory',
        component: () => import('@/views/product_manage/shop_catetory'),
        name: '店铺分类',
        meta: {
          title: '店铺分类',
        }
      },

      {
        path: 'edit_service',
        component: () => import('@/views/product_manage/edit_service'),
        hidden: true,
        name: '修改服务管理',
        meta: {
          title: '修改服务管理',
        }
      },
      {
        path: 'service_manage',
        component: () => import('@/views/product_manage/service_manage'),
        name: '服务管理',
        meta: {
          title: '服务管理'
        }
      },
      {
        path: 'editcooperation',
        component: () => import('@/views/product_manage/editcooperation'),
        hidden: true,
        name: '合作客户示例',
        meta: {
          title: '合作客户示例'
        }
      },
      {
        path: 'cooperation_case',
        component: () => import('@/views/product_manage/cooperation_case'),
        name: '合作客户示例管理',
        meta: {
          title: '合作客户示例管理'
        }
      },
      {
        path: 'lastIssueManage',
        component: () => import('@/views/product_manage/lastIssueManage'),
        name: '上刊画面管理',
        meta: {
          title: '上刊画面管理'
        }
      },
      {
        path: 'caseManage',
        component: () => import('@/views/product_manage/caseManage'),
        name: '媒体案例管理',
        meta: {
          title: '媒体案例管理'
        }
      },
      {
        path: 'biogManage',
        component: () => import('@/views/product_manage/biogManage'),
        name: '媒主传记管理',
        meta: {
          title: '媒主传记管理'
        }
      },
      {
        path: 'addLastIssueImage',
        hidden: true,
        component: () => import('@/views/product_manage/components/addLastIssue'),
        name: '添加上刊图片',
        meta: {
          title: '添加上刊图片'
        }
      },
      {
        path: 'addLastIssueVideo',
        hidden: true,
        component: () => import('@/views/product_manage/components/addLastIssue'),
        name: '添加上刊视频',
        meta: {
          title: '添加上刊视频'
        }
      },
      {
        path: 'editLastIssueImage',
        hidden: true,
        component: () => import('@/views/product_manage/components/addLastIssue'),
        name: '编辑上刊图片',
        meta: {
          title: '编辑上刊图片'
        }
      },
      {
        path: 'editLastIssueVideo',
        hidden: true,
        component: () => import('@/views/product_manage/components/addLastIssue'),
        name: '编辑上刊视频',
        meta: {
          title: '编辑上刊视频'
        }
      },
      {
        path: 'addMedia',
        hidden: true,
        component: () => import('@/views/product_manage/components/addMedia'),
        name: '发布媒体案例',
        meta: {
          title: '发布媒体案例'
        }
      },
      {
        path: 'addBiography',
        hidden: true,
        component: () => import('@/views/product_manage/components/addMedia'),
        name: '发布媒主传记',
        meta: {
          title: '发布媒主传记'
        }
      }
    ]
  },

  {
    path: '/shop_manage',
    component: Layout,
    redirect: '/shop_manage',
    alwaysShow: true,
    name: '店铺信息设置',
    meta: { title: '店铺信息设置', icon: 'dianpu', affix: true },
    children: [
      {
        path: 'shop_manage_set',
        component: () => import('@/views/shop_manage/shop_manage_set'),
        name: '店铺个性化设置',
        meta: {
          title: '店铺个性化设置'
        }
      },
      {
        path: 'customer_manage',
        component: () => import('@/views/shop_manage/customer_manage'),
        name: '客服管理',
        meta: {
          title: '客服管理'
        }
      }
    ]
  },
  {
    path: '/order_manage',
    component: Layout,
    redirect: '/order_manage',
    alwaysShow: true,
    name: '订单管理',
    meta: { title: '订单管理', icon: 'dingdanguanli', affix: true },
    children: [
      {
        path: 'my_transaction',
        component: () => import('@/views/order_manage/my_transaction'),
        name: '我的交易',
        meta: {
          title: '我的交易'
        }
      },
      {
        path: 'order_refund',
        component: () => import('@/views/order_manage/order_refund'),
        name: '我的退款',
        meta: {
          title: '我的退款'
        }
      },
      {
        path: 'order_evaluate',
        component: () => import('@/views/order_manage/order_evaluate'),
        name: '我的评价',
        meta: {
          title: '我的评价'
        }
      },
      {
        path: 'orderInvoice',
        component: () => import('@/views/orderInvoice'),
        name: '订单发票',
        meta: {
          title: '订单发票'
        }
      }
    ]
  },
  {
    path: '/capital_manage',
    component: Layout,
    redirect: '/capital_manage',
    alwaysShow: true,
    name: '资金管理',
    meta: { title: '资金管理', icon: 'zijinguanli', affix: true },
    children: [
      {
        path: 'Transaction_Details',
        component: () => import('@/views/capital_manage/Transaction_Details'),
        name: '交易结算明细',
        meta: {
          title: '交易结算明细'
        }
      },
      {
        path: 'paymentBalance',
        component: () => import('@/views/capital_manage/paymentBalance'),
        name: '代付账户余额明细',
        meta: {
          title: '代付账户余额明细'
        }
      }
    ]
  },
  {
    path: '/help',
    component: Layout,
    redirect: '/help',
    alwaysShow: true,
    name: '违规举报',
    meta: { title: '违规举报', icon: 'weiguijubao', affix: true },
    children: [
      {
        path: 'reportManage',
        component: () => import('@/views/help/reportManage'),
        name: '我的举报',
        meta: {
          title: '我的举报'
        }
      }
    ]
  },
  {
    path: '*',
    redirect: '/login',
    hidden: true
  }
]
export const asyncRoutes = []

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

const route = new Router({// shopadmin
  mode: 'history', // 后端支持可开
  base: '/shopadmin',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})
export default route
