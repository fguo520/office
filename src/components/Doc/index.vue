<template>
  <div @click="click">
    <svg-icon icon-class="doc" />
  </div>
</template>

<script>
export default {
  name: 'Doc',
  methods: {
    click() {
      // window.open('http://www.jd.com', '_blank')
    }
  }
}
</script>
