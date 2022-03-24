<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">練習地</a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav text-center">
          <li class="nav-item">
            <router-link to="/admin/products" class="nav-link"
              >產品</router-link
            >
          </li>
          <router-link to="/admin/orders" class="nav-link">訂單</router-link>
          <router-link to="/admin/coupons" class="nav-link">優惠券</router-link>
          <router-link to="/admin/articles" class="nav-link">貼文</router-link>
          <li>
            <a href="#" @click.prevent="logout" class="nav-link">登出</a>
          </li>
        </ul>
        <div class="navbar-nav ms-auto">
          <router-link to="/user/articles" class="nav-link">Blog</router-link>
          <router-link to="/user/carts" class="nav-link">購物車</router-link>
        </div>
      </div>
    </div>
  </nav>
</template>
<script>
export default {
  inject: ['emitter'],
  methods: {
    logout() {
      const api = `${process.env.VUE_APP_API}/logout`;
      this.$http
        .post(api)
        .then((response) => {
          this.$httpMessageState(response, '登出');
          if (response.data.success) {
            this.$router.push('/');
          }
        })
        .catch((error) => {
          this.$httpMessageState(error.response, '錯誤訊息');
        });
    },
  },
};
</script>
