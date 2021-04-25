<template>
  <div class="products-list">
    <a
      v-for="(product, index) in products"
      :key="index"
      :href="product.url"
      :title="product.url"
    >
      <img
        :src="product.image"
        :alt="product.title"
      >

      <span>
        {{ product.title }}
      </span>
    </a>
  </div>
</template>

<script>
export default {
  name: 'ProductsList',

  data () {
    return {
      products: [
        {
          image: '/images/products/rsyslog.png',
          title: 'Rsyslog',
          url: '/rsyslog/'
        },
        {
          image: '/images/products/sftp.png',
          title: 'SFTP',
          url: '/sftp/'
        },
        {
          image: '/images/products/vpn.png',
          title: 'VPN',
          url: '/vpn/'
        },
        {
          image: '/images/products/samba.png',
          title: 'Samba',
          url: '/samba/'
        }
      ]
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
