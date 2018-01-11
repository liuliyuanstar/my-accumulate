import Vue from 'vue';
import Router from 'vue-router';
import imageList from '@/components/image-list';
import helloWorld from '@/components/HelloWorld';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/helloworld',
      name: 'helloWorld',
      component: helloWorld
    },
    {
      path: '/imagelist',
      name: 'imageList',
      component: imageList
    }
  ]
})
