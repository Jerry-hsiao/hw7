<template>
  <div class="container">
    <Loading :active="isLoading" :z-index="1060"></Loading>
    <div class="text-end mt-4">
      <button class="btn btn-primary" type="button" @click="openModal(true)">
        建立新的優惠卷
      </button>
    </div>
    <table class="table align-middle mt-4">
      <thead>
        <tr>
          <th>名稱</th>
          <th>折扣百分比</th>
          <th>到期日</th>
          <th>是否啟用</th>
          <th>編輯</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in coupons" :key="index">
          <td>{{ item.title }}</td>
          <td>{{ item.percent }}%</td>
          <td>{{ $filters.date(item.due_date) }}</td>
          <td>
            <span v-if="item.is_enabled === 1" class="text-success">啟用</span>
            <span v-else class="text-muted">未啟用</span>
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
                @click="openDelCouponModal(item)"
              >
                刪除
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <Pagination :pages="pagination" @emit-pages="getCoupons"></Pagination>
    <!-- CouponModal -->
    <CouponModal
      :coupon="tempCoupon"
      :is-new="isNew"
      @update-coupon="updateCoupon"
      ref="couponModal"
    ></CouponModal>
    <!-- DelModal -->
    <DelModal
      :item="tempCoupon"
      ref="delModal"
      @del-item="delCoupon"
    ></DelModal>
  </div>
</template>
<script>
import CouponModal from '@/components/CouponModal.vue';
import DelModal from '@/components/DelModal.vue';
import Pagination from '@/components/Pagination.vue';
export default {
  data() {
    return {
      coupons: {},
      tempCoupon: {},
      orders: {},
      tempOrder: {},
      pagination: {},
      currentPages: 1,
      isLoading: false,
      isNew: false,
    };
  },
  components: { CouponModal, Pagination, DelModal },
  methods: {
    getCoupons(page = 1) {
      this.isLoading = true;
      this.currentPages = page;
      const api = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/coupons?page=${page}`;
      this.$http
        .get(api)
        .then((res) => {
          this.coupons = res.data.coupons;
          this.pagination = res.data.pagination;
          this.isLoading = false;
        })
        .catch((err) => {
          this.$httpMessageState(err.response, '優惠卷列表錯誤');
          this.isLoading = false;
        });
    },
    openModal(isNew, item) {
      this.isNew = isNew;
      if (isNew) {
        this.tempCoupon = { due_date: new Date().getTime() / 1000 };
      } else {
        this.tempCoupon = { ...item };
      }
      this.$refs.couponModal.openModal();
    },
    openDelCouponModal(item) {
      this.tempCoupon = { ...item };
      this.$refs.delModal.openModal();
    },
    delCoupon() {
      this.isLoading = true;
      let api = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/coupon/${this.tempCoupon.id}`;
      this.$http
        .delete(api)
        .then((res) => {
          this.$httpMessageState(res, '刪除優惠卷');
          this.$refs.delModal.hideModal();
          this.getCoupons(this.currentPages);
        })
        .catch((err) => {
          this.$httpMessageState(err, '刪除優惠卷');
          this.isLoading = false;
        });
    },
    updateCoupon(item) {
      this.isLoading = true;
      let url = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/coupon`;
      let httpMethod = 'post';
      let data = item;

      if (!this.isNew) {
        url = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/coupon/${item.id}`;
        httpMethod = 'put';
      }
      this.$http[httpMethod](url, { data })
        .then((response) => {
          this.$refs.couponModal.hideModal();
          this.getCoupons(this.currentPages);
          this.$httpMessageState(response, '新增優惠券');
        })
        .catch((error) => {
          this.isLoading = false;
          this.$httpMessageState(error.response, '錯誤訊息');
        });
    },
  },
  mounted() {
    this.getCoupons();
  },
};
</script>
