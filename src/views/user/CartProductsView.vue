<template>
  <div class="container">
    <Loading :active="isLoading" :z-index="1060"> </Loading>
    <br />
    <!-- 商品列表 -->
    <div class="mt-4">
      <table class="table align-middle">
        <thead>
          <tr>
            <th>圖片</th>
            <th>商品名稱</th>
            <th>價格</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in products" :key="item.id">
            <td style="width: 200px">
              <div
                style="
                  height: 100px;
                  background-size: cover;
                  background-position: center;
                "
                :style="{ backgroundImage: `url(${item.imageUrl})` }"
              ></div>
            </td>
            <td>
              {{ item.title }}
            </td>
            <td>
              <div class="h5" v-if="!item.price">
                {{ item.origin_price }} 元
              </div>
              <del class="h6" v-if="item.price"
                >原價 {{ item.origin_price }} 元</del
              >
              <div class="h5" v-if="item.price">
                現在只要 {{ item.price }} 元
              </div>
            </td>
            <td>
              <div class="btn-group btn-group-sm">
                <button
                  type="button"
                  class="btn btn-outline-secondary"
                  @click="getProduct(item)"
                  :disabled="loadingStatus.loadingItem === item.id"
                >
                  <span
                    class="spinner-grow spinner-grow-sm"
                    v-show="loadingStatus.loadingItem === item.id"
                  ></span>
                  查看更多
                </button>
                <button
                  type="button"
                  class="btn btn-outline-danger"
                  @click="addToCart(item.id)"
                  :disabled="loadingStatus.loadingItem === item.id"
                >
                  <span
                    class="spinner-grow spinner-grow-sm"
                    v-show="loadingStatus.loadingItem === item.id"
                  ></span>
                  加到購物車
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <CartView ref="cartView"></CartView>
  </div>
</template>

<script>
import CartView from '@/views/user/CartView.vue';
// import _ from 'lodash';

export default {
  data() {
    return {
      cartData: {
        carts: [],
      },
      products: [],
      product: {},
      productId: '',
      isLoading: false,
      loadingStatus: {
        loadingItem: '',
      },
      seed: '',
    };
  },
  components: {
    CartView,
  },
  methods: {
    getProducts() {
      this.isLoading = true;
      this.$http
        .get(
          `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/products/all`
        )
        .then((res) => {
          this.products = Object.values(res.data.products);
          this.isLoading = false;
        })
        .catch((error) => {
          this.$httpMessageState(error.response, '產品列表錯誤訊息');
        });
    },
    getProduct(item) {
      this.$router.push(`/user/product/${item.id}`);
    },
    addToCart(id, qty = 1) {
      this.isLoading = true;
      this.loadingStatus.loadingItem = id;
      const url = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/cart`;
      const cart = {
        product_id: id,
        qty,
      };
      this.$http
        .post(url, { data: cart })
        .then((response) => {
          this.$httpMessageState(response, '加入購物車增加');
          this.$refs.cartView.getCarts();
          this.loadingStatus.loadingItem = '';
          this.isLoading = false;
        })
        .catch((err) => {
          this.$httpMessageState(err.response, '購物車增加');
          this.isLoading = false;
        });
    },
  },
  mounted() {
    this.getProducts();
  },
  // watch: {
  //   seed: _.debounce((current) => {
  //     console.log(current);
  //   }, 1000),
  // },
};
</script>
