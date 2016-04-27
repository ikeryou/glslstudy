(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Conf;

Conf = (function() {
  function Conf() {
    var key, ref, val;
    this.RELEASE = false;
    this.FLG = {
      LOG: true,
      PARAM: true,
      STATS: true
    };
    if (this.RELEASE) {
      ref = this.FLG;
      for (key in ref) {
        val = ref[key];
        this.FLG[key] = false;
      }
    }
  }

  return Conf;

})();

module.exports = Conf;


},{}],2:[function(require,module,exports){
var Contents,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Contents = (function() {
  function Contents() {
    this._r = bind(this._r, this);
    this._plane = bind(this._plane, this);
    this._getMaxTexSize = bind(this._getMaxTexSize, this);
    this._createFramebufferCubeMap = bind(this._createFramebufferCubeMap, this);
    this._createFramebuffer = bind(this._createFramebuffer, this);
    this._attachUniform = bind(this._attachUniform, this);
    this._createIBO = bind(this._createIBO, this);
    this._attachVBO = bind(this._attachVBO, this);
    this._createVBO = bind(this._createVBO, this);
    this._createProgram = bind(this._createProgram, this);
    this._createShader = bind(this._createShader, this);
    this._update = bind(this._update, this);
    this._resize = bind(this._resize, this);
    this.init = bind(this.init, this);
    this._c;
    this._gl;
    this._prg;
    this._mdl;
    this._startTime = new Date().getTime();
  }

  Contents.prototype.init = function() {
    this._c = document.getElementById("xCanvas");
    this._gl = this._c.getContext('webgl') || this._c.getContext('experimental-webgl');
    this._prg = this._createProgram(this._createShader("vs"), this._createShader("fs"));
    this._mdl = this._plane();
    this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, this._createIBO(this._mdl.i));
    this._attachVBO(this._prg, "position", 3, this._mdl.p);
    this._gl.clearColor(0.0, 0.0, 0.0, 1.0);
    MY.resize.add(this._resize, true);
    return MY.update.add(this._update);
  };

  Contents.prototype._resize = function(w, h) {
    var scale1, scale2;
    if ((window.devicePixelRatio != null) && window.devicePixelRatio >= 2) {
      scale1 = 2;
      scale2 = 1;
    } else {
      scale1 = 1;
      scale2 = 1;
    }
    this._c.width = w * scale1;
    this._c.height = h * scale1;
    $("#xCanvas").css({
      width: w * scale2,
      height: h * scale2
    });
    return this._gl.viewport(0, 0, this._c.width, this._c.height);
  };

  Contents.prototype._update = function() {
    var time;
    time = (new Date().getTime() - this._startTime) * 0.001;
    this._gl.clear(this._gl.COLOR_BUFFER_BIT);
    this._attachUniform(this._prg, "time", "float", time);
    this._attachUniform(this._prg, "mouse", "vec2", [MY.mouse.x / this._c.width, MY.mouse.y / this._c.height]);
    this._attachUniform(this._prg, "resolution", "vec2", [this._c.width, this._c.height]);
    this._gl.drawElements(this._gl.TRIANGLES, this._mdl.i.length, this._gl.UNSIGNED_SHORT, 0);
    return this._gl.flush();
  };

  Contents.prototype._createShader = function(id) {
    var scriptElement, shader;
    scriptElement = document.getElementById(id);
    shader = this._gl.createShader(scriptElement.type === "x-shader/x-vertex" ? this._gl.VERTEX_SHADER : this._gl.FRAGMENT_SHADER);
    this._gl.shaderSource(shader, scriptElement.text);
    this._gl.compileShader(shader);
    if (this._gl.getShaderParameter(shader, this._gl.COMPILE_STATUS)) {
      return shader;
    } else {
      console.log(this._gl.getShaderInfoLog(shader));
      return null;
    }
  };

  Contents.prototype._createProgram = function(vs, fs) {
    var program;
    program = this._gl.createProgram();
    this._gl.attachShader(program, vs);
    this._gl.attachShader(program, fs);
    this._gl.linkProgram(program);
    if (this._gl.getProgramParameter(program, this._gl.LINK_STATUS)) {
      this._gl.useProgram(program);
      return program;
    } else {
      console.log(this._gl.getProgramInfoLog(program));
      return null;
    }
  };

  Contents.prototype._createVBO = function(data) {
    var vbo;
    vbo = this._gl.createBuffer();
    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, vbo);
    this._gl.bufferData(this._gl.ARRAY_BUFFER, new Float32Array(data), this._gl.STATIC_DRAW);
    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, null);
    return vbo;
  };

  Contents.prototype._attachVBO = function(prg, name, attStride, data) {
    var attLocation, vbo;
    attLocation = this._gl.getAttribLocation(prg, name);
    vbo = this._createVBO(data);
    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, vbo);
    this._gl.enableVertexAttribArray(attLocation);
    this._gl.vertexAttribPointer(attLocation, attStride, this._gl.FLOAT, false, 0, 0);
    return this._gl.bindBuffer(this._gl.ARRAY_BUFFER, null);
  };

  Contents.prototype._createIBO = function(data) {
    var ibo;
    ibo = this._gl.createBuffer();
    this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, ibo);
    this._gl.bufferData(this._gl.ELEMENT_ARRAY_BUFFER, new Int16Array(data), this._gl.STATIC_DRAW);
    this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, null);
    return ibo;
  };

  Contents.prototype._attachUniform = function(prg, name, type, data) {
    var uniLocation;
    uniLocation = this._gl.getUniformLocation(prg, name);
    switch (type) {
      case "mat4":
        return this._gl.uniformMatrix4fv(uniLocation, false, data);
      case "vec2":
        return this._gl.uniform2fv(uniLocation, data);
      case "vec3":
        return this._gl.uniform3fv(uniLocation, data);
      case "vec4":
        return this._gl.uniform4fv(uniLocation, data);
      case "int":
        return this._gl.uniform1i(uniLocation, data);
      case "float":
        return this._gl.uniform1f(uniLocation, data);
    }
  };

  Contents.prototype._createFramebuffer = function(width, height) {
    var depthRenderBuffer, fTexture, frameBuffer;
    frameBuffer = this._gl.createFramebuffer();
    this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, frameBuffer);
    depthRenderBuffer = this._gl.createRenderbuffer();
    this._gl.bindRenderbuffer(this._gl.RENDERBUFFER, depthRenderBuffer);
    this._gl.renderbufferStorage(this._gl.RENDERBUFFER, this._gl.DEPTH_COMPONENT16, width, height);
    this._gl.framebufferRenderbuffer(this._gl.FRAMEBUFFER, this._gl.DEPTH_ATTACHMENT, this._gl.RENDERBUFFER, depthRenderBuffer);
    fTexture = this._gl.createTexture();
    this._gl.bindTexture(this._gl.TEXTURE_2D, fTexture);
    this._gl.texImage2D(this._gl.TEXTURE_2D, 0, this._gl.RGBA, width, height, 0, this._gl.RGBA, this._gl.UNSIGNED_BYTE, null);
    this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_MAG_FILTER, this._gl.LINEAR);
    this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_MIN_FILTER, this._gl.LINEAR);
    this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_WRAP_S, this._gl.CLAMP_TO_EDGE);
    this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_WRAP_T, this._gl.CLAMP_TO_EDGE);
    this._gl.framebufferTexture2D(this._gl.FRAMEBUFFER, this._gl.COLOR_ATTACHMENT0, this._gl.TEXTURE_2D, fTexture, 0);
    this._gl.bindTexture(this._gl.TEXTURE_2D, null);
    this._gl.bindRenderbuffer(this._gl.RENDERBUFFER, null);
    this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, null);
    return {
      f: frameBuffer,
      d: depthRenderBuffer,
      t: fTexture
    };
  };

  Contents.prototype._createFramebufferCubeMap = function(width, height, target) {
    var depthRenderBuffer, fTexture, frameBuffer, i;
    frameBuffer = this._gl.createFramebuffer();
    this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, frameBuffer);
    depthRenderBuffer = this._gl.createRenderbuffer();
    this._gl.bindRenderbuffer(this._gl.RENDERBUFFER, depthRenderBuffer);
    this._gl.renderbufferStorage(this._gl.RENDERBUFFER, this._gl.DEPTH_COMPONENT16, width, height);
    this._gl.framebufferRenderbuffer(this._gl.FRAMEBUFFER, this._gl.DEPTH_ATTACHMENT, this._gl.RENDERBUFFER, depthRenderBuffer);
    fTexture = this._gl.createTexture();
    this._gl.bindTexture(this._gl.TEXTURE_CUBE_MAP, fTexture);
    i = 0;
    while (i < target.length) {
      this._gl.texImage2D(target[i], 0, this._gl.RGBA, width, height, 0, this._gl.RGBA, this._gl.UNSIGNED_BYTE, null);
      i++;
    }
    this._gl.texParameteri(this._gl.TEXTURE_CUBE_MAP, this._gl.TEXTURE_MAG_FILTER, this._gl.LINEAR);
    this._gl.texParameteri(this._gl.TEXTURE_CUBE_MAP, this._gl.TEXTURE_MIN_FILTER, this._gl.LINEAR);
    this._gl.texParameteri(this._gl.TEXTURE_CUBE_MAP, this._gl.TEXTURE_WRAP_S, this._gl.CLAMP_TO_EDGE);
    this._gl.texParameteri(this._gl.TEXTURE_CUBE_MAP, this._gl.TEXTURE_WRAP_T, this._gl.CLAMP_TO_EDGE);
    this._gl.bindTexture(this._gl.TEXTURE_CUBE_MAP, null);
    this._gl.bindRenderbuffer(this._gl.RENDERBUFFER, null);
    this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, null);
    return {
      f: frameBuffer,
      d: depthRenderBuffer,
      t: fTexture
    };
  };

  Contents.prototype._getMaxTexSize = function(w, h) {
    var i, test;
    test = Math.max(w, h);
    i = 2;
    while (1) {
      if (i >= test) {
        return i;
      } else {
        i *= 2;
      }
    }
  };

  Contents.prototype._plane = function() {
    return {
      p: [-1.0, 1.0, 0.0, 1.0, 1.0, 0.0, -1.0, -1.0, 0.0, 1.0, -1.0, 0.0],
      c: [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0],
      i: [0, 2, 1, 1, 2, 3]
    };
  };

  Contents.prototype._r = function(degree) {
    return MY.u.radian(degree);
  };

  return Contents;

})();

module.exports = Contents;


},{}],3:[function(require,module,exports){
var Func,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  slice = [].slice;

Func = (function() {
  function Func() {
    this.log = bind(this.log, this);
  }

  Func.prototype.log = function() {
    var params;
    params = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    if (MY.conf.FLG.LOG) {
      if ((typeof console !== "undefined" && console !== null) && (console.log != null)) {
        return console.log.apply(console, params);
      }
    }
  };

  return Func;

})();

module.exports = Func;


},{}],4:[function(require,module,exports){
var Conf, Contents, DelayMgr, Func, Main, Mouse, Param, Profiler, ResizeMgr, UpdateMgr, Utils,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

UpdateMgr = require('./libs/mgr/UpdateMgr');

ResizeMgr = require('./libs/mgr/ResizeMgr');

DelayMgr = require('./libs/mgr/DelayMgr');

Utils = require('./libs/Utils');

Profiler = require('./Profiler');

Func = require('./Func');

Mouse = require('./Mouse');

Contents = require('./Contents');

Conf = require('./Conf');

Param = require('./Param');

Main = (function() {
  function Main() {
    this._update = bind(this._update, this);
    this.init = bind(this.init, this);
  }

  Main.prototype.init = function() {
    window.MY = {};
    MY.conf = new Conf();
    MY.u = new Utils();
    MY.update = new UpdateMgr();
    MY.update.add(this._update);
    MY.resize = new ResizeMgr();
    MY.delay = new DelayMgr();
    MY.mouse = new Mouse();
    MY.f = new Func();
    MY.profiler = new Profiler();
    MY.param = new Param();
    MY.c = new Contents();
    return MY.c.init();
  };

  Main.prototype._update = function() {
    return window.MY.delay.update();
  };

  return Main;

})();

$(window).ready((function(_this) {
  return function() {
    var app;
    app = new Main();
    app.init();
    return window.MY.main = app;
  };
})(this));


},{"./Conf":1,"./Contents":2,"./Func":3,"./Mouse":5,"./Param":6,"./Profiler":7,"./libs/Utils":8,"./libs/mgr/DelayMgr":10,"./libs/mgr/ResizeMgr":11,"./libs/mgr/UpdateMgr":12}],5:[function(require,module,exports){
var Mouse,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Mouse = (function() {
  function Mouse() {
    this.dist = bind(this.dist, this);
    this._eMouseMove = bind(this._eMouseMove, this);
    this._init = bind(this._init, this);
    this.x = MY.resize.sw() * 0.5;
    this.y = MY.resize.sh() * 0.5;
    this.oldX = 0;
    this.oldY = 0;
    this._init();
  }

  Mouse.prototype._init = function() {
    if (MY.u.isSmt()) {
      $(window).on("touchstart", this._eMouseMove);
      return $(window).on("touchmove", this._eMouseMove);
    } else {
      return $(window).on("mousemove", this._eMouseMove);
    }
  };

  Mouse.prototype._eMouseMove = function(e) {
    var touches;
    if (MY.u.isSmt()) {
      touches = event.touches;
      event.preventDefault();
      if ((touches != null) && touches.length > 0) {
        this.oldX = this.x;
        this.oldY = this.y;
        this.x = touches[0].pageX;
        return this.y = touches[0].pageY;
      }
    } else {
      this.oldX = this.x;
      this.oldY = this.y;
      this.x = e.clientX;
      return this.y = e.clientY;
    }
  };

  Mouse.prototype.dist = function(tx, ty) {
    var dx, dy;
    dx = tx - this.x;
    dy = ty - this.y;
    return Math.sqrt(dx * dx + dy * dy);
  };

  return Mouse;

})();

module.exports = Mouse;


},{}],6:[function(require,module,exports){
var Param,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Param = (function() {
  function Param() {
    this.addCallBack = bind(this.addCallBack, this);
    this._callBack = bind(this._callBack, this);
    this._setGuiBool = bind(this._setGuiBool, this);
    this._setGuiNum = bind(this._setGuiNum, this);
    this._init = bind(this._init, this);
    this._gui;
    this.line = 10;
    this.lineScale = MY.u.isSmt() ? 50 : 100;
    this.callBack = {};
    this._init();
  }

  Param.prototype._init = function() {
    if (MY.conf.FLG.PARAM) {
      this._gui = new dat.GUI();
      this._setGuiNum("line", 0, 20, 0.1);
      return this._setGuiNum("lineScale", 0, 400, 1);
    }
  };

  Param.prototype._setGuiNum = function(name, min, max, step) {
    return this._gui.add(this, name, min, max).step(step).onFinishChange((function(_this) {
      return function(e) {
        _this[name] = e;
        return _this._callBack(name);
      };
    })(this));
  };

  Param.prototype._setGuiBool = function(name) {
    return this._gui.add(this, name).onFinishChange((function(_this) {
      return function(e) {
        _this[name] = e;
        return _this._callBack(name);
      };
    })(this));
  };

  Param.prototype._callBack = function(name) {
    var i, j, len, ref, results, val;
    if (this.callBack[name] != null) {
      ref = this.callBack[name];
      results = [];
      for (i = j = 0, len = ref.length; j < len; i = ++j) {
        val = ref[i];
        if (val != null) {
          results.push(val());
        } else {
          results.push(void 0);
        }
      }
      return results;
    }
  };

  Param.prototype.addCallBack = function(name, func) {
    if (this.callBack[name] == null) {
      this.callBack[name] = [];
    }
    return this.callBack[name].push(func);
  };

  return Param;

})();

module.exports = Param;


},{}],7:[function(require,module,exports){
var Profiler,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Profiler = (function() {
  function Profiler() {
    this._update = bind(this._update, this);
    this._init = bind(this._init, this);
    this._stats;
    this._init();
  }

  Profiler.prototype._init = function() {
    if (MY.conf.FLG.STATS) {
      this._stats = new Stats();
      this._stats.domElement.style.position = "fixed";
      this._stats.domElement.style.left = "0px";
      this._stats.domElement.style.bottom = "0px";
      document.body.appendChild(this._stats.domElement);
      return MY.update.add(this._update);
    }
  };

  Profiler.prototype._update = function() {
    if (this._stats != null) {
      return this._stats.update();
    }
  };

  return Profiler;

})();

module.exports = Profiler;


},{}],8:[function(require,module,exports){
var Utils,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Utils = (function() {
  function Utils() {
    this.price = bind(this.price, this);
    this.getHexColor = bind(this.getHexColor, this);
    this.scrollTop = bind(this.scrollTop, this);
    this.windowHeight = bind(this.windowHeight, this);
    this.numStr = bind(this.numStr, this);
    this._A = Math.PI / 180;
  }

  Utils.prototype.random2 = function() {
    return this.random(0, 100) * 0.01;
  };

  Utils.prototype.random = function(min, max) {
    if (min < 0) {
      min--;
    }
    return ~~(Math.random() * ((max + 1) - min) + min);
  };

  Utils.prototype.hit = function(range) {
    return this.random(0, range - 1) === 0;
  };

  Utils.prototype.range = function(val) {
    return this.random(-val, val);
  };

  Utils.prototype.arrRand = function(arr) {
    return arr[this.random(0, arr.length - 1)];
  };

  Utils.prototype.map = function(num, resMin, resMax, baseMin, baseMax) {
    var p;
    if (num < baseMin) {
      return resMin;
    }
    if (num > baseMax) {
      return resMax;
    }
    p = (resMax - resMin) / (baseMax - baseMin);
    return ((num - baseMin) * p) + resMin;
  };

  Utils.prototype.radian = function(degree) {
    return degree * this._A;
  };

  Utils.prototype.degree = function(radian) {
    return radian / this._A;
  };

  Utils.prototype.decimal = function(num, n) {
    var i, pos;
    num = String(num);
    pos = num.indexOf(".");
    if (n === 0) {
      return num.split(".")[0];
    }
    if (pos === -1) {
      num += ".";
      i = 0;
      while (i < n) {
        num += "0";
        i++;
      }
      return num;
    }
    num = num.substr(0, pos) + num.substr(pos, n + 1);
    return num;
  };

  Utils.prototype.floor = function(num, min, max) {
    return Math.min(max, Math.max(num, min));
  };

  Utils.prototype.strReverse = function(str) {
    var i, len, res;
    res = "";
    len = str.length;
    i = 1;
    while (i <= len) {
      res += str.substr(-i, 1);
      i++;
    }
    return res;
  };

  Utils.prototype.shuffle = function(arr) {
    var i, j, k, results;
    i = arr.length;
    results = [];
    while (--i) {
      j = Math.floor(Math.random() * (i + 1));
      if (i === j) {
        continue;
      }
      k = arr[i];
      arr[i] = arr[j];
      results.push(arr[j] = k);
    }
    return results;
  };

  Utils.prototype.sliceNull = function(arr) {
    var i, l, len1, newArr, val;
    newArr = [];
    for (i = l = 0, len1 = arr.length; l < len1; i = ++l) {
      val = arr[i];
      if (val !== null) {
        newArr.push(val);
      }
    }
    return newArr;
  };

  Utils.prototype.replaceAll = function(val, org, dest) {
    return val.split(org).join(dest);
  };

  Utils.prototype.sort = function(arr, para, desc) {
    if (desc === void 0) {
      desc = false;
    }
    if (desc) {
      return arr.sort(function(a, b) {
        return b[para] - a[para];
      });
    } else {
      return arr.sort(function(a, b) {
        return a[para] - b[para];
      });
    }
  };

  Utils.prototype.unique = function() {
    return new Date().getTime();
  };

  Utils.prototype.numStr = function(num, keta) {
    var i, len, str;
    str = String(num);
    if (str.length >= keta) {
      return str;
    }
    len = keta - str.length;
    i = 0;
    while (i < len) {
      str = "0" + str;
      i++;
    }
    return str;
  };

  Utils.prototype.buttonMode = function(flg) {
    if (flg) {
      return $("body").css("cursor", "pointer");
    } else {
      return $("body").css("cursor", "default");
    }
  };

  Utils.prototype.getQuery = function(key) {
    var qs, regex;
    key = key.replace(/[€[]/, "€€€[").replace(/[€]]/, "€€€]");
    regex = new RegExp("[€€?&]" + key + "=([^&#]*)");
    qs = regex.exec(window.location.href);
    if (qs === null) {
      return "";
    } else {
      return qs[1];
    }
  };

  Utils.prototype.hash = function() {
    return location.hash.replace("#", "");
  };

  Utils.prototype.isSmt = function() {
    return navigator.userAgent.indexOf('iPad') > 0 || navigator.userAgent.indexOf('iPhone') > 0 || navigator.userAgent.indexOf('iPod') > 0 || navigator.userAgent.indexOf('Android') > 0;
  };

  Utils.prototype.isAndroid = function() {
    var u;
    u = navigator.userAgent;
    return u.indexOf('BlackBerry') > 0 || u.indexOf('Android') > 0 || u.indexOf('Windows Phone') > 0;
  };

  Utils.prototype.isIos = function() {
    return navigator.userAgent.indexOf('iPad') > 0 || navigator.userAgent.indexOf('iPhone') > 0 || navigator.userAgent.indexOf('iPod') > 0;
  };

  Utils.prototype.isPs3 = function() {
    var u;
    u = navigator.userAgent;
    return u.indexOf('PLAYSTATION 3') > 0;
  };

  Utils.prototype.isVita = function() {
    var u;
    u = navigator.userAgent;
    return u.indexOf('PlayStation Vita') > 0;
  };

  Utils.prototype.isIe8Under = function() {
    var msie;
    msie = navigator.appVersion.toLowerCase();
    msie = msie.indexOf('msie') > -1 ? parseInt(msie.replace(/.*msie[ ]/, '').match(/^[0-9]+/)) : 0;
    return msie <= 8 && msie !== 0;
  };

  Utils.prototype.isIe9Under = function() {
    var msie;
    msie = navigator.appVersion.toLowerCase();
    msie = msie.indexOf('msie') > -1 ? parseInt(msie.replace(/.*msie[ ]/, '').match(/^[0-9]+/)) : 0;
    return msie <= 9 && msie !== 0;
  };

  Utils.prototype.isIe = function() {
    var ua;
    ua = window.navigator.userAgent.toLowerCase();
    return ua.indexOf('msie') !== -1 || ua.indexOf('trident/7') !== -1;
  };

  Utils.prototype.isIpad = function() {
    return navigator.userAgent.indexOf('iPad') > 0;
  };

  Utils.prototype.isTablet = function() {
    return this.isIpad() || (this.isAndroid() && navigator.userAgent.indexOf('Mobile') === -1);
  };

  Utils.prototype.isWin = function() {
    return navigator.platform.indexOf("Win") !== -1;
  };

  Utils.prototype.isChrome = function() {
    return navigator.userAgent.indexOf('Chrome') > 0;
  };

  Utils.prototype.isFF = function() {
    return window.navigator.userAgent.toLowerCase().indexOf('firefox') !== -1;
  };

  Utils.prototype.isIOSUiView = function() {
    var a;
    a = window.navigator.userAgent.toLowerCase();
    return (this.isIos() && a.indexOf('safari') === -1) || (this.isIos() && a.indexOf('crios') > 0) || (this.isIos() && a.indexOf('gsa') > 0);
  };

  Utils.prototype.getCookie = function(key) {
    var a, arr, i, l, len1, val;
    if (document.cookie === void 0 || document.cookie === null) {
      return null;
    }
    arr = document.cookie.split("; ");
    for (i = l = 0, len1 = arr.length; l < len1; i = ++l) {
      val = arr[i];
      a = val.split("=");
      if (a[0] === key) {
        return a[1];
      }
    }
    return null;
  };

  Utils.prototype.setCookie = function(key, val) {
    return document.cookie = key + "=" + val;
  };

  Utils.prototype.windowHeight = function() {
    return $(document).height();
  };

  Utils.prototype.scrollTop = function() {
    return Math.max($(window).scrollTop(), $(document).scrollTop());
  };

  Utils.prototype.getHexColor = function(r, g, b) {
    var str;
    str = (r << 16 | g << 8 | b).toString(16);
    return "#" + new Array(7 - str.length).join("0") + str;
  };

  Utils.prototype.price = function(num) {
    return String(num).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
  };

  return Utils;

})();

module.exports = Utils;


},{}],9:[function(require,module,exports){
var BaseMgr, Utils,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Utils = require('../Utils');

BaseMgr = (function() {
  function BaseMgr() {
    this._init = bind(this._init, this);
    this._u = new Utils();
  }

  BaseMgr.prototype._init = function() {};

  return BaseMgr;

})();

module.exports = BaseMgr;


},{"../Utils":8}],10:[function(require,module,exports){
var BaseMgr, DelayMgr,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

BaseMgr = require('./BaseMgr');

DelayMgr = (function(superClass) {
  extend(DelayMgr, superClass);

  function DelayMgr() {
    this.update = bind(this.update, this);
    this._init = bind(this._init, this);
    DelayMgr.__super__.constructor.call(this);
    this._registFunc = [];
    this._init();
  }

  DelayMgr.prototype._init = function() {
    return DelayMgr.__super__._init.call(this);
  };

  DelayMgr.prototype.add = function(func, delay) {
    this._registFunc = this._sliceNull(this._registFunc);
    return this._registFunc.push({
      f: func,
      d: delay
    });
  };

  DelayMgr.prototype.remove = function(func) {
    var arr, i, j, len, ref, val;
    arr = [];
    ref = this._registFunc;
    for (i = j = 0, len = ref.length; j < len; i = ++j) {
      val = ref[i];
      if (val.f !== func) {
        arr.push(val);
      }
    }
    return this._registFunc = arr;
  };

  DelayMgr.prototype.update = function() {
    var i, j, len, ref, results, val;
    ref = this._registFunc;
    results = [];
    for (i = j = 0, len = ref.length; j < len; i = ++j) {
      val = ref[i];
      if ((val != null) && --val.d <= 0) {
        val.f();
        results.push(this._registFunc[i] = null);
      } else {
        results.push(void 0);
      }
    }
    return results;
  };

  DelayMgr.prototype._sliceNull = function(arr) {
    var i, j, len, newArr, val;
    newArr = [];
    for (i = j = 0, len = arr.length; j < len; i = ++j) {
      val = arr[i];
      if (val !== null) {
        newArr.push(val);
      }
    }
    return newArr;
  };

  return DelayMgr;

})(BaseMgr);

module.exports = DelayMgr;


},{"./BaseMgr":9}],11:[function(require,module,exports){
var BaseMgr, ResizeMgr,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

BaseMgr = require('./BaseMgr');

ResizeMgr = (function(superClass) {
  extend(ResizeMgr, superClass);

  function ResizeMgr() {
    this.sh = bind(this.sh, this);
    this.sw = bind(this.sw, this);
    this._setStageSize = bind(this._setStageSize, this);
    this._call = bind(this._call, this);
    this._eResize = bind(this._eResize, this);
    this.refresh = bind(this.refresh, this);
    this._init = bind(this._init, this);
    ResizeMgr.__super__.constructor.call(this);
    this._resizeList = [];
    this.ws = {
      w: 0,
      h: 0,
      oldW: -1,
      oldH: -1
    };
    this._t;
    this._init();
  }

  ResizeMgr.prototype._init = function() {
    ResizeMgr.__super__._init.call(this);
    $(window).bind("resize", this._eResize);
    return this._setStageSize();
  };

  ResizeMgr.prototype.add = function(func, isCall) {
    this._resizeList.push(func);
    if ((isCall != null) && isCall) {
      return func(this.ws.w, this.ws.h);
    }
  };

  ResizeMgr.prototype.remove = function(func) {
    var arr, i, j, len, ref, val;
    arr = [];
    ref = this._resizeList;
    for (i = j = 0, len = ref.length; j < len; i = ++j) {
      val = ref[i];
      if (val !== func) {
        arr.push(val);
      }
    }
    return this._resizeList = arr;
  };

  ResizeMgr.prototype.refresh = function() {
    return this._eResize();
  };

  ResizeMgr.prototype._eResize = function(e) {
    var i, j, len, ref, val;
    this._setStageSize();
    if (this._t != null) {
      ref = this._t;
      for (i = j = 0, len = ref.length; j < len; i = ++j) {
        val = ref[i];
        clearInterval(val);
      }
      this._t = null;
    }
    this._t = [];
    return this._t[0] = setTimeout(this._call, 200);
  };

  ResizeMgr.prototype._call = function() {
    var i, j, len, ref, results, val;
    ref = this._resizeList;
    results = [];
    for (i = j = 0, len = ref.length; j < len; i = ++j) {
      val = ref[i];
      results.push(val(this.ws.w, this.ws.h));
    }
    return results;
  };

  ResizeMgr.prototype._setStageSize = function() {
    var h, w;
    if (this._u.isSmt()) {
      w = window.innerWidth;
      h = window.innerHeight;
    } else {
      if (this._u.isIe8Under()) {
        w = $(window).width();
        h = $(window).height();
      } else {
        w = window.innerWidth;
        h = window.innerHeight;
      }
    }
    this.ws.oldW = this.ws.w;
    this.ws.oldH = this.ws.h;
    this.ws.w = w;
    return this.ws.h = h;
  };

  ResizeMgr.prototype.sw = function() {
    return this.ws.w;
  };

  ResizeMgr.prototype.sh = function() {
    return this.ws.h;
  };

  return ResizeMgr;

})(BaseMgr);

module.exports = ResizeMgr;


},{"./BaseMgr":9}],12:[function(require,module,exports){
var BaseMgr, UpdateMgr,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

BaseMgr = require('./BaseMgr');

UpdateMgr = (function(superClass) {
  extend(UpdateMgr, superClass);

  function UpdateMgr(isRAF) {
    this._update = bind(this._update, this);
    this._init = bind(this._init, this);
    UpdateMgr.__super__.constructor.call(this);
    this.cnt = 0;
    this._isRAF = isRAF || true;
    this._updateList = [];
    this._init();
  }

  UpdateMgr.prototype._init = function() {
    var requestAnimationFrame;
    UpdateMgr.__super__._init.call(this);
    requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    window.requestAnimationFrame = requestAnimationFrame;
    if (this._isRAF && (window.requestAnimationFrame != null)) {
      return window.requestAnimationFrame(this._update);
    } else {
      return setInterval(this._update, 1000 / 60);
    }
  };

  UpdateMgr.prototype.add = function(func) {
    return this._updateList.push(func);
  };

  UpdateMgr.prototype.remove = function(func) {
    var arr, i, j, len, ref, val;
    arr = [];
    ref = this._updateList;
    for (i = j = 0, len = ref.length; j < len; i = ++j) {
      val = ref[i];
      if (val !== func) {
        arr.push(val);
      }
    }
    return this._updateList = arr;
  };

  UpdateMgr.prototype._update = function() {
    var i, j, len, ref, t, val;
    this.cnt++;
    ref = this._updateList;
    for (i = j = 0, len = ref.length; j < len; i = ++j) {
      val = ref[i];
      if (val != null) {
        val();
      }
    }
    if (this._isRAF && (window.requestAnimationFrame != null)) {
      return t = window.requestAnimationFrame(this._update);
    }
  };

  return UpdateMgr;

})(BaseMgr);

module.exports = UpdateMgr;


},{"./BaseMgr":9}]},{},[4]);
