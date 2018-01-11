<template>
  <div class="image-list">
    <imagePreview
      v-bind:imgsList="imageList"
      ref="imagePre"
    ></imagePreview>
  </div>
</template>
<script>
  import imagePreview from './image-preview.vue'
  export default {
    template: '.image-list',
    data: function () {
      return {
        imageList: []
      }
    },
    components: {
      'imagePreview': imagePreview
    },
    methods: {
      getImgList () {
        this.$http.get('http://localhost:3000/imglist', {t: Math.random()}).then(function (data) {
          data = data.body;
          if (data.imgList) {
            this.imageList = data.imgList;
            this.$refs['imagePre'].isImageShow = true;
          }
        });
      }
    },
    mounted () {
      this.getImgList();
      console.log('Hello,world!');
    }
  }
</script>
<style lang="less">
 @import './../assets/less/image-list.less';
</style>
