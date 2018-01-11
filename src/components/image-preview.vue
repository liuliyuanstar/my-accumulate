<template>
  <div class="image-preview"
       @touchstart="handleEvent($event)"
       @touchmove="handleEvent($event)"
       @touchend="handleEvent($event)"
  >
    <div class="items" v-bind:style="styleObject" v-bind:class="{animate:isAnimate}">
      <div v-for="(item, index) in imgsList" v-bind:class="{min:scaleList[index] < 1}">
        <img v-bind:class="{'image-item':true}"
             v-bind:title="index"
             v-bind:src="item"
             v-bind:style="{width:scaleList[index]*10 + 'rem','margin-top':marginTopList[index]+'rem'}"
        />
      </div>
    </div>
    <div class="icons">
      <div class="iconBox">
        <div v-for="(item, index) in imgsList" v-bind:class="{circle:true, current:curIndex==index}"></div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    template: '.image-preview',
    data: function () {
      return {
        styleObject: {
          marginLeft: '0rem'
        },
        curIndex: 0,
        isAnimate: true,
        tempLeft: 0,
        isStart: true,
        scaleList: [],
        marginTopList: [],
        basicScale: 1,
        tempTop: 0,
        phoneType: 0,
        phoneScale: 1,
        startPos: 0,
        isScrolling: 0,
        endPos: 0,
        initDistance: 0,  // 两指间的初始距离
        initCenter: {x: 0, y: 0}, // 两指间的初始中点
        direction: -2,  // -2 无方向 -1 左，0 两指， 1 右， 2 纵向
        isLeftGoOn: 0,
        isRightGoOn: 0
      };
    },
    props: {
      imgsList: Array,
      initIndex: {
        type: Number,
        default: 0
      }
    },
    watch: {
      imgsList: function () {
        for (let i = 0; i < this.imgsList.length; i++) {
          this.$set(this.scaleList, i, 1);
          this.$set(this.marginTopList, i, 0);
        }
      }
    },
    methods: {
      // 滑到下一张
      onSwipeLeft () {
        if (this.curIndex == this.imgsList.length - 1) {
          return;
        }
        this.isStart = true;
        this.isAnimate = true;
        this.curIndex = this.curIndex + 1;
        this.styleObject.marginLeft = this.totalLength(this.curIndex) + 'rem';
      },
      // 滑到上一张
      onSwipeRight () {
        if (this.curIndex == 0) {
          return;
        }
        this.isStart = true;
        this.isAnimate = true;
        this.curIndex = this.curIndex - 1;
        this.styleObject.marginLeft = this.totalLength(this.curIndex) + 'rem';
      },
      // 上下移动
      onMoveTop (distance) {
        this.isAnimate = false;
        if (this.isStart) {
          this.tempTop = this.marginTopList[this.curIndex];
          this.isStart = false;
        }
        let clientHeight = document.documentElement.clientHeight;
        let clientWidth = document.documentElement.clientWidth;
        let unit = clientWidth / 10;
        let bounding = document.getElementsByClassName('image-item')[this.curIndex].getBoundingClientRect();
        let height = bounding.height;
        let maxMargin = height - clientHeight;
        if (height > clientHeight) {
          let margin = this.tempTop + distance / unit;
          if (margin >= 0 && this.phoneType) {
            margin = 0;
          } else if (margin >= maxMargin / unit && !this.phoneType) {
            margin = maxMargin / unit;
          }
          if (margin < 0 - maxMargin / unit) {
            margin = 0 - maxMargin / unit;
          }
          this.$set(this.marginTopList, this.curIndex, margin);
        }
      },
      // 左移
      onMoveLeft (distance) {
        this.isAnimate = false;
        if (this.isStart) {
          this.tempLeft = parseFloat(this.styleObject.marginLeft);
          this.isStart = false;
        }
        let curLeft = parseFloat(this.styleObject.marginLeft);
        let max = this.totalLength(this.curIndex) - (this.scaleList[this.curIndex] - 1) * 10;
        let clientWidth = document.documentElement.clientWidth;
        if (curLeft > max) {
          let tempLenghth = (distance / clientWidth) * 10 + this.tempLeft;
          if (tempLenghth <= max) {
            this.styleObject.marginLeft = max + 'rem';
          } else {
            this.styleObject.marginLeft = tempLenghth + 'rem';
          }
          return 0;
        } else {
          if (this.curIndex == this.imgsList.length - 1) {
            return;
          }
          this.styleObject.marginLeft = (distance / clientWidth) * 10 + this.tempLeft + 'rem';
          return max - (distance / clientWidth) * 10 - this.tempLeft;
        }
      },
      // 右移
      onMoveRight (distance) {
        this.isAnimate = false;
        if (this.isStart) {
          this.tempLeft = parseFloat(this.styleObject.marginLeft);
          this.isStart = false;
        }
        let curLeft = parseFloat(this.styleObject.marginLeft);
        let min = this.totalLength(this.curIndex);
        let clientWidth = document.documentElement.clientWidth;
        if (curLeft < min) {
          let tempLenghth = (distance / clientWidth) * 10 + this.tempLeft;
          if (tempLenghth >= min) {
            this.styleObject.marginLeft = min + 'rem';
          } else {
            this.styleObject.marginLeft = tempLenghth + 'rem';
          }
          return 0;
        } else {
          if (this.curIndex == 0) {
            return;
          }
          this.styleObject.marginLeft = (distance / clientWidth) * 10 + this.tempLeft + 'rem';
          return (distance / clientWidth) * 10 + this.tempLeft - min;
        }
      },
      // 恢复到原状态
      cancelMove (direction) {
        this.isStart = true;
        if (direction == 1 || direction == -1) {
          this.isAnimate = true;
          if (direction == 1) {
            this.styleObject.marginLeft = this.totalLength(this.curIndex) + 'rem';
          } else if (direction == -1) {
            this.styleObject.marginLeft = this.totalLength(this.curIndex) - (this.scaleList[this.curIndex] - 1) * 10 + 'rem';
          }
        } else if (direction == 0) {
          let max = this.totalLength(this.curIndex) - (this.scaleList[this.curIndex] - 1) * 10;
          let min = this.totalLength(this.curIndex);
          let curLeft = parseFloat(this.styleObject.marginLeft);
          if (curLeft < max) {
            this.isAnimate = true;
            this.styleObject.marginLeft = max + 'rem';
          }
          if (curLeft > min) {
            this.styleObject.marginLeft = min + 'rem';
          }
          // 纵向
          let height = document.getElementsByClassName('image-item')[this.curIndex].height;
          let clientHeight = document.documentElement.clientHeight;
          let clientWidth = document.documentElement.clientWidth;
          let bounding = document.getElementsByClassName('image-item')[this.curIndex].getBoundingClientRect();
          let maxMargin = height - clientHeight;
          let unit = clientWidth / 10;
          this.isAnimate = true;
          if (height <= clientHeight) {
            this.$set(this.marginTopList, this.curIndex, 0);
          } else {
            if (bounding.top > 0) {
              this.$set(this.marginTopList, this.curIndex, 0);
            } else if (bounding.top < 0 - maxMargin) {
              this.$set(this.marginTopList, this.curIndex, 0 - maxMargin / unit);
            }
          }
        }
      },
      // 图片缩放
      imageScale (scale, dataIndex, initCenter) {
        dataIndex = parseInt(dataIndex);
        if (this.isStart) {
          if (this.scaleList[dataIndex]) {
            this.basicScale = this.scaleList[dataIndex];
          } else {
            this.basicScale = 1;
          }
          this.tempLeft = parseFloat(this.styleObject.marginLeft);
          this.tempTop = this.marginTopList[this.curIndex];
          this.isStart = false;
        }
        let fixScale = scale * this.basicScale;
        let naturalWidth = document.getElementsByClassName('image-item')[dataIndex].naturalWidth;
        let basicFont = document.getElementsByTagName('html')[0].style.fontSize;
        let maxScale = naturalWidth / (parseFloat(basicFont) * 10);
        if (maxScale < 1) {
          return;
        }
        if (fixScale < 1) {
          fixScale = 1;
        }
        if (fixScale > maxScale) {
          fixScale = maxScale;
        }
        let clientWidth = document.documentElement.clientWidth;
        this.isAnimate = false;
        this.styleObject.marginLeft = this.tempLeft - (fixScale / this.basicScale - 1) * (parseFloat(initCenter.x) / clientWidth) * 10 + 'rem';
        this.$set(this.scaleList, dataIndex, fixScale);
        // 竖直方向
        let clientHeight = document.documentElement.clientHeight;
        let bounding = document.getElementsByClassName('image-item')[dataIndex].getBoundingClientRect();
        if (bounding.top == 0 && bounding.height > clientHeight) {
          this.phoneType = 1;
          this.phoneScale = this.scaleList[dataIndex];
        }
//        if (bounding.top <= 0) {
//          let marginTop = this.tempTop - (fixScale / this.basicScale - 1) * (parseFloat(initCenter.y) / parseFloat(basicFont));
//          let phoneS = this.basicScale;
//          if (this.phoneScale > this.basicScale) {
//            phoneS = this.phoneScale;
//          }
//          let marginTop = this.tempTop - (fixScale / phoneS - 1) * clientHeight / 2 / parseFloat(basicFont);
//          console.log('marginTop:' + marginTop);
//          this.$set(this.marginTopList, dataIndex, marginTop);
//        }
      },
      // 获取图片框的总长度
      totalLength (curIndex) {
        let total = 0;
        for (let i = 0; i < curIndex; i++) {
          let scale = 1;
          if (this.scaleList[i]) {
            scale = this.scaleList[i];
          }
          total = total + 10 * scale + 0.2;
        }
        total = 0 - total;
        return total;
      },
      // 根据事件类型绑定事件
      handleEvent (event) {
        if (event.type === 'touchstart') {
          this.start(event);
        } else if (event.type === 'touchmove') {
          this.move(event);
        } else if (event.type === 'touchend') {
          this.end(event);
        }
      },
      // 滑动开始
      start (event) {
        if (event.targetTouches.length == 1) {
          let touch = event.targetTouches[0];     // touches数组对象获得屏幕上所有的touch，取第一个touch
          this.startPos = {x: touch.pageX, y: touch.pageY, time: +new Date()};    // 取第一个touch的坐标值
          this.isScrolling = 0;   // 这个参数判断是垂直滚动还是水平滚动
        } else if (event.targetTouches.length == 2) {
          this.direction = 0;
          this.initDistance = this.getDistance(event);
          this.initCenter = this.getCenter(event);
        }
      },
      // 移动
      move (event) {
        // 判断默认行为是否可以被禁用
        if (event.cancelable) {
          // 判断默认行为是否已经被禁用
          if (!event.defaultPrevented) {
            event.preventDefault();
          }
        }
        if (event.targetTouches.length > 2 && !event.target.className.contents('image-item')) {
          return;
        }
        if (event.targetTouches.length == 2) {
          let distance = this.getDistance(event);
          let scale = distance / this.initDistance;
          let dataIndex = event.target.title;
          this.imageScale(scale, dataIndex, this.initCenter);
        } else if (event.targetTouches.length == 1) {
          let touch = event.targetTouches[0];
          this.endPos = {x: touch.pageX - this.startPos.x, y: touch.pageY - this.startPos.y};
          this.isScrolling = Math.abs(this.endPos.x) < Math.abs(this.endPos.y) ? 1 : 0;    // isScrolling为1时，表示纵向滑动，0为横向滑动
          if (this.isScrolling === 0) {
            if (this.endPos.x > 0) {
              this.isRightGoOn = this.onMoveRight(this.endPos.x);
              this.direction = 1;
              if (!this.isRightGoOn) {
                this.direction = -2;
              }
            } else if (this.endPos.x < 0) {
              this.isLeftGoOn = this.onMoveLeft(this.endPos.x);
              this.direction = -1;
              if (!this.isLeftGoOn) {
                this.direction = -2;
              }
            }
          } else {
            this.direction = 2;
            this.onMoveTop(this.endPos.y);
          }
        }
      },
      // 滑动释放
      end () {
        //   let duration = +new Date() - this.startPos.time;    // 滑动的持续时间
        if ((this.direction == 1 || this.direction == -1) && this.isScrolling === 0) {    // 当为水平滚动时
          if (this.endPos.x > 0 && this.isRightGoOn > 5) {
            this.onSwipeRight();
          } else if (this.endPos.x < 0 && this.isLeftGoOn > 5) {
            this.onSwipeLeft();
          } else if (this.isRightGoOn > 0 || this.isLeftGoOn > 0) {
            this.cancelMove(this.direction);
          }
        } else {
          this.cancelMove(this.direction);
        }
      },
      // 获取两根手指的滑动距离
      getDistance (ev) {
        let x1 = ev.targetTouches[0].pageX;
        let y1 = ev.targetTouches[0].pageY;
        let x2 = ev.targetTouches[1].pageX;
        let y2 = ev.targetTouches[1].pageY;
        let a = x1 - x2;
        let b = y1 - y2;
        return Math.sqrt(a * a + b * b);  // 已知两个直角边开平方得出 斜角边
      },
      // 获取两根手指的中点坐标
      getCenter: function (ev) {
        var x1 = ev.targetTouches[0].pageX;
        var y1 = ev.targetTouches[0].pageY;
        var x2 = ev.targetTouches[1].pageX;
        var y2 = ev.targetTouches[1].pageY;
        var a = (x1 + x2) / 2;
        var b = (y1 + y2) / 2;
        return {x: a, y: b};
      }
    },
    mounted () {
    }
  };
</script>
<style lang="less">
  @import './../assets/less/image-preview.less';
</style>
