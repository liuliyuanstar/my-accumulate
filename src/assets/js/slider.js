export const slider = {
  load: function () {
    return {
      // 判断设备是否支持touch事件
      touch: 'ontouchstart' in window,
      slider: document.getElementsByClassName('image-preview')[0],
      index: 0, // 显示元素的索引
      startPos: 0,
      isScrolling: 0,
      endPos: 0,
      initDistance: 0,  // 两指间的初始距离
      initScale: 1, // 缩放倍数
      curScale: 1,  // 当前已有的缩放倍数
      initCenter: {x: 0, y: 0}, // 两指间的初始中点
      direction: -2,  // -2 无方向 -1 左，0 两指， 1 右， 2 纵向
      isLeftGoOn: 0,
      isRightGoOn: 0,
      // 滑动开始
      start: function (event) {
        if (event.targetTouches.length == 1) {
          var touch = event.targetTouches[0];     // touches数组对象获得屏幕上所有的touch，取第一个touch
          this.startPos = {x: touch.pageX, y: touch.pageY, time: +new Date()};    // 取第一个touch的坐标值
          this.isScrolling = 0;   // 这个参数判断是垂直滚动还是水平滚动
        } else if (event.targetTouches.length == 2) {
          this.direction = 0;
          this.initDistance = this.getDistance(event);
          this.curScale = this.initScale;
          this.initCenter = this.getCenter(event);
        }
        this.slider.addEventListener('touchmove', this, false);
      },
      // 移动
      move: function (event) {
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
          var distance = this.getDistance(event);
          this.initScale = distance / this.initDistance;
          var dataIndex = event.target.title;
          this.imageScale(this.initScale, dataIndex, this.initCenter);
        } else if (event.targetTouches.length == 1) {
          var touch = event.targetTouches[0];
          this.endPos = {x: touch.pageX - this.startPos.x, y: touch.pageY - this.startPos.y};
          this.isScrolling = Math.abs(this.endPos.x) < Math.abs(this.endPos.y) ? 1 : 0;    // isScrolling为1时，表示纵向滑动，0为横向滑动
          if (this.isScrolling === 0) {
            if (this.endPos.x > 0) {
              this.isRightGoOn = this.rightEffect(this.endPos.x);
              this.direction = 1;
              if (!this.isRightGoOn) {
                this.direction = -2;
              }
            } else if (this.endPos.x < 0) {
              this.isLeftGoOn = this.leftEffect(this.endPos.x);
              this.direction = -1;
              if (!this.isLeftGoOn) {
                this.direction = -2;
              }
            }
          } else {
            this.direction = 2;
            this.topEffect(this.endPos.y);
          }
        }
        this.slider.addEventListener('touchend', this, false);
      },
      // 滑动释放
      end: function () {
      //   var duration = +new Date() - this.startPos.time;    // 滑动的持续时间
        if ((this.direction == 1 || this.direction == -1) && this.isScrolling === 0) {    // 当为水平滚动时
          if (this.endPos.x > 0 && this.isRightGoOn > 5) {
            this.moveRight();
          } else if (this.endPos.x < 0 && this.isLeftGoOn > 5) {
            this.moveLeft();
          } else if (this.isRightGoOn > 0 || this.isLeftGoOn > 0) {
            this.cancelMove(this.direction);
          }
        } else {
          this.cancelMove(this.direction);
        }
        // 解绑事件
        this.slider.removeEventListener('touchmove', this, false);
        this.slider.removeEventListener('touchend', this, false);
      },
      // 获取两根手指的滑动距离
      getDistance: function (ev) {
        var x1 = ev.targetTouches[0].pageX;
        var y1 = ev.targetTouches[0].pageY;
        var x2 = ev.targetTouches[1].pageX;
        var y2 = ev.targetTouches[1].pageY;
        var a = x1 - x2;
        var b = y1 - y2;
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
      },
      moveLeft: function () {},
      moveRight: function () {},
      leftEffect: function (distance) {},
      rightEffect: function (distance) {},
      cancelMove: function (direction) {},
      topEffect: function (distance) {},
      // 缩放
      imageScale: function (scale, dataIndex, initCenter) {},
      handleEvent: function (event) {
        if (event.type === 'touchstart') {
          this.start(event);
        } else if (event.type === 'touchmove') {
          this.move(event);
        } else if (event.type === 'touchend') {
          this.end(event);
        }
      },
      // 初始化
      init: function () {
        var _this = this;
        if (_this.touch) {
          _this.slider.addEventListener('touchstart', _this.handleEvent, false);    // addEventListener第二个参数可以传一个对象，会调用该对象的handleEvent属性
        }
      }

    };
  }
};
