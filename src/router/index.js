import { createRouter, createWebHashHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'Login',
    component: () => import('../views/Login.vue'),
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('../views/Dashboard.vue'),
    children: [
      {
        path: 'products',
        name: 'Products',
        component: () => import('../views/admin/ProductsList.vue'),
      },
      {
        path: 'orders',
        name: 'Orders',
        component: () => import('../views/admin/OrdersList.vue'),
      },
      {
        path: 'coupons',
        name: 'Coupons',
        component: () => import('../views/admin/CouponsList.vue'),
      },
      {
        path: 'articles',
        component: () => import('../views/admin/ArticleList.vue'),
      },
    ],
  },
  {
    path: '/user',
    component: () => import('../views/Dashboard.vue'),
    children: [
      {
        path: 'carts',
        name: 'Carts',
        component: () => import('../views/user/CartProductsView.vue'),
      },
      {
        path: 'product/:productId',
        component: () => import('../views/user/CarProductDetail.vue'),
      },
      {
        path: 'articles',
        component: () => import('../views/user/UserArticles.vue'),
      },
      {
        path: 'article/:articleId',
        component: () => import('../views/user/UserArticle.vue'),
      },
      {
        path: 'checkout/:orderId',
        component: () => import('../views/user/Checkout.vue'),
      },
    ],
  },
  // {
  //   path: '/admin/:pathMatch(.*)*',
  //   redirect: { name: 'Login' },
  // },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue'),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
