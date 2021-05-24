<template>
  <div class="products-list">
    <a
      v-for="(product, index) in products"
      :key="index"
      :href="product.link"
      :title="product.link"
    >
      <img
        :src="product.image"
        :alt="product.text"
      >

      <span>
        {{ product.text }}
      </span>
    </a>
  </div>
</template>

<script>
export default {
  name: 'ProductsList',

  computed: {
    products () {
      return this.$root.$themeConfig.nav.
        filter((navItem) => navItem.items?.length > 0).
        map((navItem) => {
          return {
            image: navItem.image,
            text: navItem.text,
            link: navItem.items[0].link
          }
        })
    }
  }
}
</script>

<style>
.products-list {
  margin-bottom: 36px;
  display: flex;
}

.products-list a {
  width: 100%;
  display: flex;
  flex-flow: column;
  align-items: center;
  font-size: 20px;
}

@media (max-width: 768px) {
  .products-list {
    flex-flow: row wrap;
  }

  .products-list a {
    width: 50%;
    font-size: 18px;
  }
}
</style>
