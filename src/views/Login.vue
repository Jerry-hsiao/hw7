<template>
  <div class="container mt-5">
    <Loading :active="isLoading" :z-index="1060"></Loading>
    <form class="row justify-content-center" @submit.prevent="login">
      <div class="col-md-6">
        <h1 class="h3 mb-3 font-weight-normal">請先登入</h1>
        <div class="mb-3">
          <label for="InputEmail" class="sr-only form-label"
            >Email address</label
          >
          <input
            type="email"
            class="form-control"
            id="InputEmail"
            placeholder="Please enter email address"
            v-model="user.username"
            required
            autofocus
          />
          <!-- <div id="emailHelp" class="form-text">Please enter email address</div> -->
        </div>
        <div class="mb-3">
          <label for="InputPassword" class="sr-only form-label">Password</label>
          <input
            type="password"
            class="form-control"
            id="InputPassword"
            placeholder="Please enter your password"
            v-model="user.password"
            required
            autocomplete
          />
          <!-- <div id="passwordHelp" class="form-text">
            Please enter your password
          </div> -->
        </div>
        <div class="text-end mt-4">
          <button type="submit" class="btn btn-primary">登入</button>
        </div>
      </div>
    </form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      user: {
        username: '',
        password: '',
      },
      isLoading: false,
    };
  },
  methods: {
    login() {
      this.isLoading = true;
      this.$http
        .post(`${process.env.VUE_APP_API}/admin/signin`, this.user)
        .then((res) => {
          const { token, expired } = res.data;
          document.cookie = `hexToken=${token}; expires=${new Date(expired)};`;
          this.$router.push('/admin/products');
          this.isLoading = false;
        })
        .catch((error) => {
          this.isLoading = false;
          this.$httpMessageState(error.response, '登入');
        });
    },
  },
  mounted() {},
};
</script>
