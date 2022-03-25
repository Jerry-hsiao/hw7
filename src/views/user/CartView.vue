<template>
  <div>
    <Loading :active="isLoading" :z-index="1060"></Loading>
    <div>
      <!-- 購物車 -->
      <div class="text-end">
        <button
          class="btn btn-outline-danger"
          type="button"
          @click="removeCartAll"
          :disabled="!cartData.carts || cartData.carts.length === 0"
        >
          <i class="bi bi-x-circle"></i>
          清空購物車
        </button>
      </div>
      <table class="table align-middle">
        <thead>
          <tr>
            <th></th>
            <th>品名</th>
            <th style="width: 150px">數量/單位</th>
            <th>單價</th>
            <th>單筆總價</th>
          </tr>
        </thead>
        <tbody>
          <template v-if="cartData.carts">
            <tr v-for="item in cartData.carts" :key="item.id">
              <td>
                <button
                  type="button"
                  class="btn btn-outline-danger btn-sm"
                  @click="removeCart(item.id)"
                  :disabled="loadingStatus.loadingItem === item.id"
                >
                  <i class="fas fa-spinner fa-pulse"></i>
                  x
                </button>
              </td>
              <td>
                {{ item.product.title }}
                <div class="text-success" v-if="item.coupon">已套用優惠券</div>
              </td>
              <td>
                <div class="input-group input-group-sm">
                  <div class="input-group mb-3">
                    <!-- <input
                    min="1"
                    type="number"
                    class="form-control"
                    v-model.number="item.qty"
                  /> -->
                    <select
                      class="form-select"
                      v-model="item.qty"
                      @change="updateCart(item)"
                      :disabled="loadingStatus.loadingItem === item.id"
                    >
                      <option
                        :value="num"
                        v-for="num in 50"
                        :key="num + 'item.id'"
                      >
                        {{ num }}
                      </option>
                    </select>
                    <span class="input-group-text" id="basic-addon2">{{
                      item.product.unit
                    }}</span>
                  </div>
                </div>
              </td>
              <td class="text-end">
                {{ item.product.price }}
              </td>
              <td class="text-end">
                <small
                  v-if="cartData.final_total !== cartData.total"
                  class="text-success"
                  >折扣價：</small
                >
                {{ $filters.currency(item.final_total) }}
              </td>
            </tr>
          </template>
        </tbody>
        <tfoot>
          <tr>
            <td colspan="4" class="text-end">總計</td>
            <td class="text-end">{{ cartData.final_total }}</td>
          </tr>
          <tr v-if="cartData.final_total !== cartData.total">
            <td colspan="4" class="text-end text-success">折扣價</td>
            <td class="text-end text-success">
              {{ $filters.currency(cartData.final_total) }}
            </td>
          </tr>
        </tfoot>
      </table>
      <div class="input-group mb-3 input-group-sm">
        <input
          type="text"
          class="form-control"
          v-model="coupon_code"
          placeholder="請輸入優惠碼"
        />
        <div class="input-group-append">
          <button
            class="btn btn-outline-secondary"
            type="button"
            @click="addCouponCode"
          >
            套用優惠碼
          </button>
        </div>
      </div>

      <div class="my-5 row justify-content-center">
        <Form
          ref="form"
          class="col-md-6"
          v-slot="{ errors }"
          @submit="createOrder"
        >
          <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <Field
              id="email"
              name="email"
              type="email"
              class="form-control"
              data-vv-delay="1000"
              :class="{
                'is-valid': !errors['email'] && form.user.email,
                'is-invalid': errors['email'],
              }"
              placeholder="請輸入 Email"
              rules="email|required"
              v-model="form.user.email"
            ></Field>
            <ErrorMessage name="email" class="invalid-feedback"></ErrorMessage>
          </div>

          <div class="mb-3">
            <label for="name" class="form-label">收件人姓名</label>
            <Field
              id="name"
              name="姓名"
              type="text"
              class="form-control"
              :class="{
                'is-valid': !errors['姓名'] && form.user.name,
                'is-invalid': errors['姓名'],
              }"
              placeholder="請輸入姓名"
              :rules="{ required: true, max: 6 }"
              v-model="form.user.name"
            ></Field>
            <ErrorMessage name="姓名" class="invalid-feedback"></ErrorMessage>
          </div>

          <div class="mb-3">
            <label for="tel" class="form-label">收件人電話</label>
            <Field
              id="tel"
              name="電話"
              type="text"
              class="form-control"
              :class="{
                'is-valid': !errors['電話'] && form.user.tel,
                'is-invalid': errors['電話'],
              }"
              placeholder="請輸入電話"
              :rules="isPhone"
              v-model="form.user.tel"
            ></Field>
            <ErrorMessage name="電話" class="invalid-feedback"></ErrorMessage>
          </div>

          <div class="mb-3">
            <label for="address" class="form-label">收件人地址</label>
            <Field
              id="address"
              name="地址"
              type="text"
              class="form-control"
              :class="{
                'is-valid': !errors['地址'] && form.user.address,
                'is-invalid': errors['地址'],
              }"
              placeholder="請輸入地址"
              rules="required"
              v-model="form.user.address"
            ></Field>
            <ErrorMessage name="地址" class="invalid-feedback"></ErrorMessage>
          </div>

          <div class="mb-3">
            <label for="message" class="form-label">留言</label>
            <Field
              name="留言"
              id="message"
              class="form-control"
              cols="30"
              rows="10"
              v-model="form.message"
            ></Field>
          </div>
          <div class="text-end">
            <button
              type="submit"
              class="btn btn-danger"
              :disabled="
                !cartData.carts ||
                cartData.carts.length === 0 ||
                errors['email'] ||
                errors['電話'] ||
                errors['姓名'] ||
                errors['地址']
              "
            >
              送出訂單
            </button>
          </div>
        </Form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cartData: {
        carts: [],
      },
      form: {
        user: {
          name: '',
          email: '',
          tel: '',
          address: '',
        },
        message: '',
      },
      loadingStatus: {
        loadingItem: '',
      },
      isLoading: false,
      coupon_code: '',
    };
  },
  methods: {
    getCarts() {
      this.isLoading = true;
      this.$http
        .get(`${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/cart`)
        .then((res) => {
          this.cartData = res.data.data;
          this.isLoading = false;
        })
        .catch((err) => {
          this.isLoading = false;
          this.$httpMessageState(err.response, '購物車列表');
        });
    },
    removeCart(id) {
      this.isLoading = true;
      this.loadingStatus.loadingItem = id;
      this.$http
        .delete(
          `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/cart/${id}`
        )
        .then((res) => {
          this.$httpMessageState(res, '刪除');
          this.getCarts();
          this.isLoading = false;
          this.loadingStatus.loadingItem = '';
        })
        .catch((err) => {
          this.isLoading = false;
          this.loadingStatus.loadingItem = '';
          this.$httpMessageState(err.response, '刪除');
        });
    },
    removeCartAll() {
      this.isLoading = true;
      this.$http
        .delete(
          `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/carts`
        )
        .then((res) => {
          this.$httpMessageState(res, '刪除');
          this.getCarts();
          this.isLoading = false;
        })
        .catch((err) => {
          this.isLoading = false;
          this.$httpMessageState(err.response, '刪除');
        });
    },
    updateCart(item) {
      this.isLoading = true;
      this.loadingStatus.loadingItem = item.id;
      const url = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/cart/${item.id}`;
      const cart = {
        product_id: item.product_id,
        qty: item.qty,
      };
      this.$http
        .put(url, { data: cart })
        .then((res) => {
          this.$httpMessageState(res, '更新數量');
          this.getCarts();
          this.loadingStatus.loadingItem = '';
          this.isLoading = false;
        })
        .catch((err) => {
          this.isLoading = false;
          this.$httpMessageState(err.response, '更新數量');
        });
    },
    createOrder() {
      this.isLoading = true;
      const url = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/order`;
      const order = this.form;
      this.$http
        .post(url, { data: order })
        .then((res) => {
          this.$httpMessageState(res, '新增訂單');
          this.$refs.form.resetForm();
          this.emptyForm();
          this.$router.push(`/user/checkout/${res.data.orderId}`);
          this.isLoading = false;
        })
        .catch((err) => {
          this.isLoading = false;
          this.$httpMessageState(err, '新增訂單');
        });
    },
    addCouponCode() {
      const url = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/coupon`;
      const coupon = {
        code: this.coupon_code,
      };
      this.isLoading = true;
      this.$http
        .post(url, { data: coupon })
        .then((response) => {
          this.$httpMessageState(response, '加入優惠券');
          this.getCarts();
          this.isLoading = false;
        })
        .catch((error) => {
          this.isLoading = false;
          this.$httpMessageState(error.response, '加入優惠券');
        });
    },
    isPhone(value) {
      const phoneNumber = /^(09)[0-9]{8}$/;
      return phoneNumber.test(value) ? true : '需要正確的電話號碼';
    },
    emptyForm() {
      this.form.user.name = '';
      this.form.user.address = '';
      this.form.user.email = '';
      this.form.user.tel = '';
      this.form.message = '';
    },
  },
  mounted() {
    this.getCarts();
  },
};
</script>
