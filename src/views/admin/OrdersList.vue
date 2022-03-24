<template>
  <div class="container">
    <Loading :active="isLoading" :z-index="1060"></Loading>
    <table class="table align-middle mt-4">
      <thead>
        <tr>
          <th>購買時間</th>
          <th>Email</th>
          <th>購買款項</th>
          <th>應付金額</th>
          <th>是否付款</th>
          <th>編輯</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="(item, index) in orders" :key="index">
          <tr v-if="orders.length" :class="{ 'text-secondary': !item.is_paid }">
            <td>{{ $filters.date(item.create_at) }}</td>
            <td><span v-text="item.user.email" v-if="item.user"></span></td>
            <td>
              <ul class="list-unstyled">
                <li v-for="(product, i) in item.products" :key="i">
                  {{ product.product.title }} 數量：{{ product.qty }}
                  {{ product.product.unit }}
                </li>
              </ul>
            </td>
            <td class="text-right">{{ item.total }}</td>
            <td>
              <div class="form-check form-switch">
                <input
                  class="form-check-input"
                  type="checkbox"
                  :id="`paidSwitch${item.id}`"
                  v-model="item.is_paid"
                  @change="updatePaid(item)"
                />
                <label class="form-check-label" :for="`paidSwitch${item.id}`">
                  <span v-if="item.is_paid">已付款</span>
                  <span v-else>未付款</span>
                </label>
              </div>
            </td>
            <td>
              <div class="btn-group">
                <button
                  class="btn btn-outline-primary btn-sm"
                  type="button"
                  @click="openModal(item)"
                >
                  檢視
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
        </template>
      </tbody>
    </table>
    <Pagination :pages="pagination" @emit-pages="getOrders"></Pagination>
    <!-- OrderModal -->
    <OrderModal
      :order="tempOrder"
      @update-paid="updatePaid"
      ref="orderModal"
    ></OrderModal>
    <!-- DelModal -->
    <DelModal :item="tempOrder" ref="delModal" @del-item="delOrder"></DelModal>
  </div>
</template>
<script>
import OrderModal from '@/components/OrderModal.vue';
import DelModal from '@/components/DelModal.vue';
import Pagination from '@/components/Pagination.vue';
export default {
  data() {
    return {
      orders: {},
      tempOrder: {},
      pagination: {},
      currentPages: 1,
      isLoading: false,
      isNew: false,
    };
  },
  components: { OrderModal, Pagination, DelModal },
  methods: {
    getOrders(page = 1) {
      this.isLoading = true;
      this.currentPages = page;
      const api = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/orders?page=${page}`;
      this.$http
        .get(api)
        .then((res) => {
          this.orders = res.data.orders;
          this.pagination = res.data.pagination;
          this.isLoading = false;
        })
        .catch((err) => {
          this.$httpMessageState(err.response, '錯誤訊息');
        });
    },
    openModal(item) {
      this.tempOrder = item;
      this.isNew = false;
      this.$refs.orderModal.openModal();
    },
    openDelProductModal(item) {
      this.tempOrder = { ...item };
      this.$refs.delModal.openModal();
    },
    delOrder() {
      this.isLoading = true;
      let api = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/order/${this.tempOrder.id}`;
      this.$http
        .delete(api)
        .then((res) => {
          this.$httpMessageState(res, '刪除訂單');
          this.$refs.delModal.hideModal();
          this.getOrders(this.currentPage);
          this.isLoading = false;
        })
        .catch((err) => {
          this.$httpMessageState(err, '刪除訂單');
          this.isLoading = false;
        });
    },
    updatePaid(item) {
      this.isLoading = true;
      const api = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/order/${item.id}`;
      const paid = {
        is_paid: item.is_paid,
      };
      this.$http
        .put(api, { data: paid })
        .then((response) => {
          this.isLoading = false;
          this.$refs.orderModal.hideModal();
          this.getOrders(this.currentPage);
          this.$httpMessageState(response, '更新付款狀態');
        })
        .catch((error) => {
          this.isLoading = false;
          this.$httpMessageState(error.response, '錯誤訊息');
        });
    },
  },
  mounted() {
    this.getOrders();
  },
};
</script>
