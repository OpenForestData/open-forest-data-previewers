var iip;
var TargetDrag = new Class({
  Extends: Drag,
  initialize: function () {
    var B = Array.link(arguments, { options: Object.type, element: $defined });
    this.element = $(B.element);
    this.document = this.element.getDocument();
    this.setOptions(B.options || {});
    var A = $type(this.options.handle);
    this.handles = A == 'array' || A == 'collection' ? $$(this.options.handle) : $(this.options.handle) || this.element;
    this.mouse = { now: {}, pos: {} };
    this.value = { start: {}, now: {} };
    this.selection = Browser.Engine.trident ? 'selectstart' : 'mousedown';
    this.bound = {
      start: this.start.bind(this),
      check: this.check.bind(this),
      drag: this.drag.bind(this),
      stop: this.stop.bind(this),
      cancel: this.cancel.bind(this),
      eventStop: $lambda(false),
    };
    this.attach();
    if (Browser.Engine.trident) {
      this.handles.ondragstart = function () {
        return false;
      };
    }
  },
  drag: function (A) {
    if (this.options.preventDefault) {
      A.preventDefault();
    }
    this.mouse.now = A.page;
    for (var B in this.options.modifiers) {
      if (!this.options.modifiers[B]) {
        continue;
      }
      this.value.now[B] = this.mouse.now[B] - this.mouse.pos[B];
      if (B == 'x') {
        if (iip.rgn_x - this.value.now[B] < 0) {
          this.value.now[B] = iip.rgn_x;
          this.out = true;
        }
        if (iip.wid > iip.rgn_w) {
          if (iip.rgn_x - this.value.now[B] > iip.wid - iip.rgn_w) {
            this.value.now[B] = -(iip.wid - iip.rgn_w - iip.rgn_x);
            this.out = true;
          }
        } else {
          this.value.now[B] = 0;
          this.out = true;
        }
      }
      if (B == 'y') {
        if (iip.rgn_y - this.value.now[B] < 0) {
          this.value.now[B] = iip.rgn_y;
          this.out = true;
        }
        if (iip.hei > iip.rgn_h) {
          if (iip.rgn_y - this.value.now[B] > iip.hei - iip.rgn_h) {
            this.value.now[B] = -(iip.hei - iip.rgn_h - iip.rgn_y);
            this.out = true;
          }
        } else {
          this.value.now[B] = 0;
          this.out = true;
        }
      }
      if (this.options.grid[B]) {
        this.value.now[B] -= this.value.now[B] % this.options.grid[B];
      }
      if (this.options.style) {
        this.element.setStyle(this.options.modifiers[B], this.value.now[B] + this.options.unit);
      } else {
        this.element[this.options.modifiers[B]] = this.value.now[B];
      }
    }
    this.fireEvent('drag', this.element);
  },
});
var IIP = new Class({
  initialize: function (A, B) {
    this.source = A || alert('No element ID given to IIP constructor');
    this.server = B.server || '/fcgi-bin/iipsrv.fcgi';
    this.render = B.render || 'random';
    this.images = new Array(B.image.length);
    B.image || alert('Image location not set in IIP constructor options');
    if ($type(B.image) == 'array') {
      for (i = 0; i < B.image.length; i++) {
        this.images[i] = { src: B.image[i], sds: '0,90' };
      }
    } else {
      this.images = [{ src: B.image, sds: '0,90' }];
    }
    this.credit = B.credit || null;
    this.scale = B.scale || null;
    if (B.zoom == 0) {
      this.initialZoom = 0;
    } else {
      this.initialZoom = B.zoom || 1;
    }
    this.showNavButtons = true;
    if (B.showNavButtons == false) {
      this.showNavButtons = false;
    }
    this.targetclick = B.targetclick || null;
    this.max_width = 0;
    this.max_height = 0;
    this.min_x = 0;
    this.min_y = 0;
    this.sds = '0,90';
    this.contrast = 1;
    this.opacity = 0;
    this.wid = 0;
    this.hei = 0;
    this.rgn_x = 0;
    this.rgn_y = 0;
    this.rgn_w = this.wid;
    this.rgn_h = this.wid;
    this.xfit = 0;
    this.yfit = 0;
    this.navpos = [0, 0];
    this.tileSize = [0, 0];
    this.num_resolutions = 0;
    this.res;
    this.refresher = null;
    this.nTilesLoaded = 0;
    this.nTilesToLoad = 0;
    window.addEvent(
      'domready',
      function () {
        this.load();
      }.bind(this)
    );
  },
  requestImages: function () {
    if (this.refresher) {
      $clear(this.refresher);
      this.refresher = null;
    }
    $('target').setStyle('cursor', 'wait');
    this.loadGrid();
    this.refresher = this.refresh.periodical(500, this);
  },
  loadGrid: function () {
    var D = $(this.source).getPosition();
    $('target')
      .getChildren()
      .each(function (Z) {
        Z.destroy();
      });
    $('target').setStyles({ left: 0, top: 0 });
    var B = Math.floor(this.rgn_x / this.tileSize[0]);
    var A = Math.floor(this.rgn_y / this.tileSize[1]);
    var W = this.rgn_w;
    if (this.wid < this.rgn_w) {
      W = this.wid;
    }
    var H = Math.floor((W + this.rgn_x) / this.tileSize[0]);
    W = this.rgn_h;
    if (this.hei < this.rgn_h) {
      W = this.hei;
    }
    var F = Math.floor((W + this.rgn_y) / this.tileSize[1]);
    var M = Math.ceil(this.wid / this.tileSize[0]);
    var V = Math.ceil(this.hei / this.tileSize[1]);
    var J = Math.floor(this.rgn_x % this.tileSize[0]);
    if (this.wid < this.rgn_w) {
      J -= (this.rgn_w - this.wid) / 2;
    }
    var I = Math.floor(this.rgn_y % this.tileSize[1]);
    if (this.hei < this.rgn_h) {
      I -= (this.rgn_h - this.hei) / 2;
    }
    var Y;
    var U, T, R, N;
    var C, L;
    R = 0;
    N = 0;
    var Q = B + Math.round((H - B) / 2);
    var P = A + Math.round((F - A) / 2);
    var X = new Array((H - B) * (H - B));
    var G = 0;
    for (T = A; T <= F; T++) {
      for (U = B; U <= H; U++) {
        X[G] = {};
        if (this.render == 'spiral') {
          X[G].n = Math.abs(P - T) * Math.abs(P - T) + Math.abs(Q - U) * Math.abs(Q - U);
        } else {
          X[G].n = Math.random();
        }
        X[G].x = U;
        X[G].y = T;
        G++;
      }
    }
    this.nTilesLoaded = 0;
    this.nTilesToLoad = G * this.images.length;
    X.sort(function K(c, Z) {
      return c.n - Z.n;
    });
    for (var O = 0; O < G; O++) {
      var U = X[O].x;
      var T = X[O].y;
      R = U + T * M;
      var N;
      for (N = 0; N < this.images.length; N++) {
        Y = new Element('img', {
          class: 'layer' + N,
          styles: { left: (U - B) * this.tileSize[0] - J, top: (T - A) * this.tileSize[1] - I },
          events: {
            load: function () {
              this.nTilesLoaded++;
              this.refreshLoadBar();
            }.bind(this),
            error: function () {
              this.src = this.src;
            },
          },
        });
        var E =
          this.server +
          '?FIF=' +
          this.images[N].src +
          '&cnt=' +
          this.contrast +
          '&sds=' +
          this.images[N].sds +
          '&jtl=' +
          this.res +
          ',' +
          R;
        Y.set('src', E);
        Y.injectInside('target');
      }
    }
    if (this.images.length > 1) {
      var S = 'img.layer' + (N - 1);
      $$(S).set('opacity', this.opacity);
    }
  },
  refresh: function () {
    var A = 0;
    $('target')
      .getChildren()
      .each(function (B) {
        if (B.width == 0 || B.height == 0) {
          B.src = B.src;
          A = 1;
        }
      });
    if (A == 0) {
      $clear(this.refresher);
      this.refresher = null;
    }
  },
  key: function (A) {
    var B = 100;
    switch (A.code) {
      case 37:
        this.scrollTo(-B, 0);
        break;
      case 38:
        this.scrollTo(0, -B);
        break;
      case 39:
        this.scrollTo(B, 0);
        break;
      case 40:
        this.scrollTo(0, B);
        break;
      case 107:
        if (!A.control) {
          this.zoomIn();
        }
        break;
      case 109:
        if (!A.control) {
          this.zoomOut();
        }
        break;
    }
  },
  scrollNavigation: function (F) {
    var D = 0;
    var B = 0;
    var A = $('zone').getSize();
    var C = A.x;
    var E = A.y;
    if (F.event) {
      var G = $('navwin').getPosition();
      D = F.event.clientX - G.x - C / 2;
      B = F.event.clientY - G.y - E / 2;
    } else {
      D = F.offsetLeft;
      B = F.offsetTop - 10;
      if (Math.abs(D - this.navpos[0]) < 3 && Math.abs(B - this.navpos[1]) < 3) {
        return;
      }
    }
    if (D > this.min_x - C) {
      D = this.min_x - C;
    }
    if (B > this.min_y - E) {
      B = this.min_y - E;
    }
    if (D < 0) {
      D = 0;
    }
    if (B < 0) {
      B = 0;
    }
    this.rgn_x = Math.round((D * this.wid) / this.min_x);
    this.rgn_y = Math.round((B * this.hei) / this.min_y);
    this.requestImages();
    if (F.event) {
      this.positionZone();
    }
  },
  scroll: function () {
    var B = -$('target').offsetLeft;
    var A = -$('target').offsetTop;
    this.scrollTo(B, A);
  },
  checkBounds: function (C, B) {
    var A = this.rgn_x + C;
    var D = this.rgn_y + B;
    if (A > this.wid - this.rgn_w) {
      A = this.wid - this.rgn_w;
    }
    if (D > this.hei - this.rgn_h) {
      D = this.hei - this.rgn_h;
    }
    if (A < 0) {
      A = 0;
    }
    if (D < 0) {
      D = 0;
    }
    this.rgn_x = A;
    this.rgn_y = D;
  },
  scrollTo: function (B, A) {
    if (B || A) {
      if (Math.abs(B) < 3 && Math.abs(A) < 3) {
        return;
      }
      this.checkBounds(B, A);
      this.requestImages();
      this.positionZone();
    }
  },
  zoom: function (B) {
    var A = new Event(B);
    if (A.wheel) {
      if (A.wheel > 0) {
        this.zoomIn();
      } else {
        if (A.wheel < 0) {
          this.zoomOut();
        }
      }
    } else {
      if (A.shift) {
        this.zoomOut();
      } else {
        this.zoomIn();
      }
    }
  },
  zoomIn: function () {
    if (this.wid <= this.max_width / 2 && this.hei <= this.max_height / 2) {
      this.res++;
      this.wid = this.max_width;
      this.hei = this.max_height;
      for (var A = this.res; A < this.num_resolutions - 1; A++) {
        this.wid = Math.floor(this.wid / 2);
        this.hei = Math.floor(this.hei / 2);
      }
      if (this.xfit == 1) {
        this.rgn_x = this.wid / 2 - this.rgn_w / 2;
      } else {
        if (this.wid > this.rgn_w) {
          this.rgn_x = 2 * this.rgn_x + this.rgn_w / 2;
        }
      }
      if (this.rgn_x > this.wid) {
        this.rgn_x = this.wid - this.rgn_w;
      }
      if (this.rgn_x < 0) {
        this.rgn_x = 0;
      }
      if (this.yfit == 1) {
        this.rgn_y = this.hei / 2 - this.rgn_h / 2;
      } else {
        if (this.hei > this.rgn_h) {
          this.rgn_y = this.rgn_y * 2 + this.rgn_h / 2;
        }
      }
      if (this.rgn_y > this.hei) {
        this.rgn_y = this.hei - this.rgn_h;
      }
      if (this.rgn_y < 0) {
        this.rgn_y = 0;
      }
      this.requestImages();
      this.positionZone();
      if (this.scale) {
        this.setScale();
      }
    }
  },
  zoomOut: function () {
    if (this.wid > this.rgn_w || this.hei > this.rgn_h) {
      this.res--;
      this.wid = this.max_width;
      this.hei = this.max_height;
      for (var A = this.res; A < this.num_resolutions - 1; A++) {
        this.wid = Math.floor(this.wid / 2);
        this.hei = Math.floor(this.hei / 2);
      }
      this.rgn_x = this.rgn_x / 2 - this.rgn_w / 4;
      if (this.rgn_x + this.rgn_w > this.wid) {
        this.rgn_x = this.wid - this.rgn_w;
      }
      if (this.rgn_x < 0) {
        this.xfit = 1;
        this.rgn_x = 0;
      } else {
        this.xfit = 0;
      }
      this.rgn_y = this.rgn_y / 2 - this.rgn_h / 4;
      if (this.rgn_y + this.rgn_h > this.hei) {
        this.rgn_y = this.hei - this.rgn_h;
      }
      if (this.rgn_y < 0) {
        this.yfit = 1;
        this.rgn_y = 0;
      } else {
        this.yfit = 0;
      }
      this.requestImages();
      this.positionZone();
      if (this.scale) {
        this.setScale();
      }
    }
  },
  calculateMinSizes: function () {
    var D = this.max_width;
    var A = this.max_height;
    var E = 100;
    var G = $(this.source).getSize();
    var C = G.x;
    var B = G.y;
    if (C > B) {
      if (D > 2 * A) {
        E = C / 2;
      } else {
        E = C / 4;
      }
    } else {
      E = B / 4;
    }
    var F = this.res;
    while (D > E) {
      D = parseInt(D / 2);
      A = parseInt(A / 2);
      if (--F == 1) {
        break;
      }
    }
    this.min_x = D;
    this.min_y = A;
    D = this.max_width;
    A = this.max_height;
    while (D > C && A > B) {
      D = parseInt(D / 2);
      A = parseInt(A / 2);
      this.res--;
    }
    this.wid = D;
    this.hei = A;
    this.res--;
  },
  createWindows: function () {
    var E = $(this.source).getSize();
    var B = E.x;
    var A = E.y;
    this.calculateMinSizes();
    this.createNavigationWindow();
    var D = new Element('div', {
      id: 'target',
      morph: { transition: Fx.Transitions.Quad.easeInOut, onComplete: this.requestImages.bind(this) },
    });
    new TargetDrag(D, { onComplete: this.scroll.bind(this) });
    D.injectInside(this.source);
    D.addEvent('mousewheel', this.zoom.bind(this));
    D.addEvent('dblclick', this.zoom.bind(this));
    if (this.targetclick) {
      D.addEvent('click', this.targetclick.bindWithEvent(this));
    }
    this.rgn_w = B;
    this.rgn_h = A;
    this.reCenter();
    window.addEvent('resize', function () {
      window.location = window.location;
    });
    document.addEvent('keydown', this.key.bindWithEvent(this));
    new Element('a', { href: 'http://iipimage.sourceforge.net', id: 'logo' }).injectInside(this.source);
    new Element('img', { src: 'images/iip.32x32.png', id: 'info', styles: { opacity: 0.8 } }).injectInside('logo');
    if (Browser.Engine.trident5) {
      $('info').setStyle(
        'filter',
        'progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled=true,src="images/iip.32x32.png",sizingMethod=scale)'
      );
    }
    new Tips('#info, #toolbar', {
      className: 'tip',
      onShow: function (F) {
        F.setStyle('opacity', 0);
        F.fade(0.7);
      },
      onHide: function (F) {
        F.fade(0);
      },
    });
    $('info').store(
      'tip:text',
      '<h2><img src="images/iip.32x32.png"/>IIPMooViewer</h2>IIPImage High Resolution Ajax Image Viewer<ul><li>To navigate within image:<ul><li>drag image within main window or</li><li>drag zone within the navigation window</li><li>click an area within navigation window</li></ul><li>To zoom in:<ul><li>double click with the mouse or</li><li>use the mouse scroll wheel or</li><li>or simply press the "+" key</li></ul><li>To zoom out:<ul><li>shift double click with the mouse or</li><li>use the mouse wheel or</li><li>press the "-" key</li></ul></li><li>To move the navigation window:<ul><li>drag navigation window toolbar</li></ul><li>To show / hide navigation buttons:</li><ul><li>double click navigation window toolbar</li></ul></ul>Written by Ruven Pillay<br/>For more information visit http://iipimage.sf.net'
    );
    if (this.credit) {
      new Element('div', { id: 'credit', html: this.credit }).injectInside(this.source);
    }
    if (this.scale) {
      new Element('div', { id: 'scale' }).injectInside(this.source);
    }
    for (var C = 0; C < this.initialZoom; C++) {
      this.zoomIn();
    }
    this.zoomOut();
    this.requestImages();
    this.positionZone();
  },
  createNavigationWindow: function () {
    var C = new Element('div', { id: 'navcontainer', styles: { width: this.min_x, height: 10 } });
    var D = new Element('div', {
      id: 'toolbar',
      styles: { width: this.min_x },
      events: {
        dblclick: function () {
          $('navbuttons').slide('toggle');
        },
      },
    });
    D.store('tip:text', '* Drag to move<br/>* Double Click to show/hide navigation buttons');
    D.injectInside(C);
    var F = new Element('div', { id: 'navwin', styles: { width: this.min_x, height: this.min_y } });
    F.injectInside(C);
    var B = new Element('img', {
      id: 'navigation',
      src:
        this.server +
        '?FIF=' +
        this.images[0].src +
        '&SDS=' +
        this.images[0].sds +
        '&CNT=1.0&WID=' +
        this.min_x +
        '&QLT=99&CVT=jpeg',
    });
    B.injectInside(F);
    var A = new Element('div', {
      id: 'zone',
      styles: { width: this.min_x / 2, height: this.min_y / 2, opacity: 0.4 },
      morph: { duration: 500, transition: Fx.Transitions.Quad.easeInOut },
    });
    A.injectInside(F);
    var G = new Element('div', {
      id: 'loadBarContainer',
      html: '<div id="loadBar"></div>',
      styles: { width: this.min_x - 2 },
      tween: { duration: 1000, transition: Fx.Transitions.Sine.easeOut, link: 'cancel' },
    });
    var E = new Element('div', {
      id: 'navbuttons',
      html:
        '<img id="shiftLeft" src="images/left.png"/><img id="shiftUp" src="images/up.png"/><img id="shiftRight" src="images/right.png"/><br/><img id="shiftDown" src="images/down.png"/><br/><img id="zoomIn" src="images/zoomIn.png"/><img id="zoomOut" src="images/zoomOut.png"/><img id="reset" src="images/reset.png"/>',
    });
    E.injectInside(C);
    E.set('slide', { duration: 300, transition: Fx.Transitions.Quad.easeInOut, mode: 'vertical' });
    G.injectInside(C);
    C.injectInside(this.source);
    if (this.showNavButtons == false) {
      E.slide('out');
    }
    if (Browser.Engine.trident) {
      $$('div#navbuttons, div#navbuttons img').setStyle('opacity', 0.75);
    }
    C.makeDraggable({ container: this.source, handle: D });
    $('zoomIn').addEvent('click', this.zoomIn.bindWithEvent(this));
    $('zoomOut').addEvent('click', this.zoomOut.bindWithEvent(this));
    $('reset').addEvent('click', function () {
      window.location = window.location;
    });
    $('shiftLeft').addEvent(
      'click',
      function () {
        this.scrollTo(-this.rgn_w / 3, 0);
      }.bind(this)
    );
    $('shiftUp').addEvent(
      'click',
      function () {
        this.scrollTo(0, -this.rgn_h / 3);
      }.bind(this)
    );
    $('shiftDown').addEvent(
      'click',
      function () {
        this.scrollTo(0, this.rgn_h / 3);
      }.bind(this)
    );
    $('shiftRight').addEvent(
      'click',
      function () {
        this.scrollTo(this.rgn_w / 3, 0);
      }.bind(this)
    );
    $('zone').makeDraggable({
      container: 'navwin',
      onStart: function () {
        this.navpos = [$('zone').offsetLeft, $('zone').offsetTop - 10];
      }.bind(this),
      onComplete: this.scrollNavigation.bindWithEvent(this),
    });
    $('navigation').addEvent('click', this.scrollNavigation.bindWithEvent(this));
    $('navigation').addEvent('mousewheel', this.zoom.bindWithEvent(this));
    $('zone').addEvent('mousewheel', this.zoom.bindWithEvent(this));
    $('zone').addEvent('dblclick', this.zoom.bindWithEvent(this));
  },
  refreshLoadBar: function () {
    var A = (this.nTilesLoaded / this.nTilesToLoad) * this.min_x;
    $('loadBar').setStyle('width', A);
    $('loadBar').set('html', 'loading&nbsp;:&nbsp;' + Math.round((this.nTilesLoaded / this.nTilesToLoad) * 100) + '%');
    if ($('loadBarContainer').style.opacity != 0.85) {
      $('loadBarContainer').setStyle('opacity', 0.85);
    }
    if (this.nTilesLoaded == this.nTilesToLoad) {
      $('target').setStyle('cursor', 'move');
      $('loadBarContainer').fade('out');
    }
  },
  setScale: function () {
    var B = (1000 * this.scale * this.wid) / this.max_width;
    var A = '1m';
    if (B > 1000) {
      B = B / 100;
      A = '1cm';
    } else {
      if (B > 100) {
        B = B / 10;
        A = '10cm';
      }
    }
    $('scale').set({ styles: { width: B }, html: A });
  },
  load: function () {
    new Request({
      method: 'get',
      url: this.server,
      onComplete: function (D) {
        var A = D || alert('No response from server ' + this.server);
        var C = A.split('Max-size');
        if (!C[1]) {
          alert('Unexpected response from server ' + this.server);
        }
        var B = C[1].split(' ');
        this.max_width = parseInt(B[0].substring(1, B[0].length));
        this.max_height = parseInt(B[1]);
        C = A.split('Tile-size');
        B = C[1].split(' ');
        this.tileSize[0] = parseInt(B[0].substring(1, B[0].length));
        this.tileSize[1] = parseInt(B[1]);
        C = A.split('Resolution-number');
        this.num_resolutions = parseInt(C[1].substring(1, C[1].length));
        this.res = this.num_resolutions;
        this.createWindows();
      }.bind(this),
      onFailure: function () {
        alert('Unable to get image and tile sizes from server!');
      },
    }).send('FIF=' + this.images[0].src + '&obj=IIP,1.0&obj=Max-size&obj=Tile-size&obj=Resolution-number');
  },
  reCenter: function () {
    this.rgn_x = (this.wid - this.rgn_w) / 2;
    this.rgn_y = (this.hei - this.rgn_h) / 2;
  },
  positionZone: function () {
    var E = (this.rgn_x / this.wid) * this.min_x;
    if (E > this.min_x) {
      E = this.min_x;
    }
    if (E < 0) {
      E = 0;
    }
    var B = (this.rgn_y / this.hei) * this.min_y;
    if (B > this.min_y) {
      B = this.min_y;
    }
    if (B < 0) {
      B = 0;
    }
    var D = (this.rgn_w / this.wid) * this.min_x;
    if (E + D > this.min_x) {
      D = this.min_x - E;
    }
    var A = (this.rgn_h / this.hei) * this.min_y;
    if (A + B > this.min_y) {
      A = this.min_y - B;
    }
    if (D < this.min_x) {
      this.xfit = 0;
    } else {
      this.xfit = 1;
    }
    if (A < this.min_y) {
      this.yfit = 0;
    } else {
      this.yfit = 1;
    }
    var C = $('zone').offsetHeight - $('zone').clientHeight;
    $('zone').morph({ left: E, top: B + 10, width: D - C / 2, height: A - C / 2 });
  },
});
