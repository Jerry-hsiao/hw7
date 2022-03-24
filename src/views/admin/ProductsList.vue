<template>
  <div class="container">
    <Loading :active="isLoading" :z-index="1060"></Loading>
    <div class="text-end mt-4">
      <button class="btn btn-primary" type="button" @click="openModal(true)">
        建立新的產品
      </button>
    </div>
    <table class="table align-middle mt-4">
      <thead>
        <tr>
          <th>圖片</th>
          <th>產品名稱</th>
          <th>原價</th>
          <th>售價</th>
          <th>是否啟用</th>
          <th>編輯</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in products" :key="index">
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
          <td>{{ item.title }}</td>
          <td>{{ $filters.currency(item.origin_price) }}</td>
          <td>{{ $filters.currency(item.price) }}</td>
          <td>
            <span v-if="item.is_enabled" class="text-success">啟用</span>
            <span v-else>未啟用</span>
          </td>
          <td>
            <div class="btn-group">
              <button
                class="btn btn-outline-primary btn-sm"
                type="button"
                @click="openModal(false, item)"
              >
                編輯
              </button>
              <button
                class="btn btn-outline-danger btn-sm"
                type="button"
                @click="openDelProductModal(item)"
              >
                刪除
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <Pagination :pages="pagination" @emit-pages="getProducts"></Pagination>
    <!-- ProductModal -->
    <ProductModal
      :product="tempProduct"
      @update-product="updateProduct"
      ref="productDetailModal"
    ></ProductModal>
    <!-- DelModal -->
    <DelModal
      :item="tempProduct"
      ref="delModal"
      @del-item="delProduct"
    ></DelModal>
  </div>
</template>
<script>
import ProductModal from '@/components/ProductModal.vue';
import DelModal from '@/components/DelModal.vue';
import Pagination from '@/components/Pagination.vue';
export default {
  data() {
    return {
      products: {},
      tempProduct: {},
      pagination: {},
      currentPages: 1,
      isLoading: false,
      isNew: false,
    };
  },
  components: {
    ProductModal,
    DelModal,
    Pagination,
  },
  methods: {
    getProducts(page = 1) {
      this.isLoading = true;
      this.currentPages = page;
      //   const api = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/products/all`;
      const api = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/products?page=${page}`;
      this.$http
        .get(api)
        .then((res) => {
          this.products = res.data.products;
          this.pagination = res.data.pagination;
          this.isLoading = false;
        })
        .catch((err) => {
          this.$httpMessageState(err.response, '產品列表錯誤訊息');
        });
    },
    openModal(isNew, item) {
      this.tempProduct = item;
      if (isNew) {
        this.tempProduct = {};
        this.isNew = true;
      } else {
        this.tempProduct = { ...item };
        this.isNew = false;
      }
      this.$refs.productDetailModal.openModal();
    },
    openDelProductModal(item) {
      this.tempProduct = { ...item };
      this.$refs.delModal.openModal();
    },
    updateProduct(temp) {
      this.isLoading = true;
      this.tempProduct = temp;
      let api = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/product/${this.tempProduct.id}`;
      let httpMethod = 'put';
      let status = '更新產品';
      if (this.isNew) {
        api = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/product`;
        httpMethod = 'post';
        status = '新增產品';
      }
      this.$http[httpMethod](api, { data: this.tempProduct })
        .then((res) => {
          this.$refs.productDetailModal.hideModal();
          this.getProducts(this.currentPages);
          this.$httpMessageState(res, status);
          this.isLoading = false;
        })
        .catch((err) => {
          this.$httpMessageState(err.response, status);
          this.isLoading = false;
        });
    },
    delProduct() {
      this.isLoading = true;
      let api = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/product/${this.tempProduct.id}`;
      this.$http
        .delete(api)
        .then((res) => {
          this.$httpMessageState(res, '刪除產品');
          this.$refs.delModal.hideModal();
          this.getProducts(this.currentPage);
          this.isLoading = false;
        })
        .catch((err) => {
          this.$httpMessageState(err.response, '刪除產品');
          this.isLoading = false;
        });
    },
  },
  mounted() {
    this.getProducts();
  },
};
</script>
