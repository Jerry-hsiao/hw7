<template>
  <div class="container">
    <Loading :active="isLoading" :z-index="1060"></Loading>
    <div class="text-end mt-4">
      <button class="btn btn-primary" type="button" @click="openModal(true)">
        建立新的頁面
      </button>
    </div>
    <table class="table align-middle mt-4">
      <thead>
        <tr>
          <th style="width: 200px">標題</th>
          <th style="width: 200px">作者</th>
          <th>描述</th>
          <th style="width: 130px">建立時間</th>
          <th style="width: 130px">是否公開</th>
          <th style="width: 150px">編輯</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(article, index) in articles" :key="index">
          <td>{{ article.title }}</td>
          <td>{{ article.author }}</td>
          <td>{{ article.description }}</td>
          <td>{{ $filters.date(article.create_at) }}</td>
          <td>
            <span v-if="article.isPublic"> 已上架</span>
            <span v-else>未上架</span>
          </td>
          <td>
            <div class="btn-group">
              <button
                class="btn btn-outline-primary btn-sm"
                type="button"
                @click="getArticle(article.id)"
              >
                編輯
              </button>
              <button
                class="btn btn-outline-danger btn-sm"
                type="button"
                @click="openDelModal(article)"
              >
                刪除
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <Pagination :pages="pagination" @emit-pages="getArticles"></Pagination>

  <!-- ArticleModal -->
  <ArticleModal
    :article="tempArticle"
    :isNew="isNew"
    @update-article="updateArticle"
    ref="articleModal"
  ></ArticleModal>
  <!-- DelModal -->
  <DelModal
    :item="tempArticle"
    @del-item="delArticle"
    ref="delModal"
  ></DelModal>
</template>
<script>
import Pagination from '@/components/Pagination.vue';
import ArticleModal from '@/components/ArticleModal.vue';
import DelModal from '@/components/DelModal.vue';

export default {
  data() {
    return {
      isLoading: false,
      articles: {},
      tempArticle: {},
      pagination: {},
      isNew: false,
      currentPages: 1,
    };
  },
  components: { ArticleModal, DelModal, Pagination },
  methods: {
    getArticles(page = 1) {
      this.isLoading = true;
      this.currentPages = page;
      const api = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/articles?page=${page}`;
      this.$http
        .get(api)
        .then((res) => {
          this.articles = res.data.articles;
          this.pagination = res.data.pagination;
          this.isLoading = false;
        })
        .catch((err) => {
          this.$httpMessageState(err.response, '貼文讀取');
          this.isLoading = false;
        });
    },
    getArticle(id) {
      this.isLoading = true;
      const api = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/article/${id}`;
      this.$http
        .get(api)
        .then((res) => {
          if (res.data.success) {
            this.openModal(false, res.data.article);
          }
          this.isLoading = false;
        })
        .catch((err) => {
          this.$httpMessageState(err.response, '連線錯誤');
          this.isLoading = false;
        });
    },
    openModal(isNew, item) {
      this.isNew = isNew;
      if (isNew) {
        this.tempArticle = {
          create_at: new Date().getTime() / 1000,
        };
        this.$refs.articleModal.openModal();
      } else {
        this.tempArticle = { ...item };
      }
      this.$refs.articleModal.openModal();
    },
    openDelModal(item) {
      this.tempArticle = item;
      this.$refs.delModal.openModal();
    },
    delArticle() {
      this.isLoading = true;
      const url = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/article/${this.tempArticle.id}`;
      this.$http
        .delete(url)
        .then((res) => {
          this.$httpMessageState(res, '刪除貼文');
          this.$refs.delModal.hideModal();
          this.getArticles(this.currentPages);
        })
        .catch((err) => {
          this.$httpMessageState(err.response, '系統錯誤');
          this.isLoading = false;
        });
    },
    updateArticle(item) {
      this.isLoading = true;
      let url = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/article`;
      let httpMethod = 'post';
      let status = '新增貼文';
      let data = item;
      if (!this.isNew) {
        url = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/article/${item.id}`;
        httpMethod = 'put';
        status = '更新貼文';
      }
      this.$http[httpMethod](url, { data })
        .then((res) => {
          this.$refs.articleModal.hideModal();
          this.getArticles(this.currentPages);
          this.$httpMessageState(res, status);
        })
        .catch((err) => {
          this.$httpMessageState(err.response, status);
          this.isLoading = false;
        });
    },
  },
  mounted() {
    this.getArticles();
  },
};
</script>
