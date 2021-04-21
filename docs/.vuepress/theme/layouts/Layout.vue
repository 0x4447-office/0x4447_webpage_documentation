<template>
  <ParentLayout>
    <template #page-bottom>
      <div class="layout-footer">
        Est.2016, Copr.0x4447™ LLC.
      </div>
    </template>
  </ParentLayout>
</template>

<script>
import ParentLayout from '@parent-theme/layouts/Layout.vue'

export default {
  name: 'Layout',

  components: {
    ParentLayout
  }
}
</script>
