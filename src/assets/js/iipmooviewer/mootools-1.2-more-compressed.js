//MooTools More, <http://mootools.net/more>. Copyright (c) 2006-2008 Valerio Proietti, <http://mad4milk.net>, MIT Style License.

Fx.Slide = new Class({
  Extends: Fx,
  options: { mode: 'vertical' },
  initialize: function (B, A) {
    this.addEvent(
      'complete',
      function () {
        this.open = this.wrapper['offset' + this.layout.capitalize()] != 0;
        if (this.open && Browser.Engine.webkit419) {
          this.element.dispose().inject(this.wrapper);
        }
      },
      true
    );
    this.element = this.subject = $(B);
    this.parent(A);
    var C = this.element.retrieve('wrapper');
    this.wrapper =
      C ||
      new Element('div', {
        styles: $extend(this.element.getStyles('margin', 'position'), { overflow: 'hidden' }),
      }).wraps(this.element);
    this.element.store('wrapper', this.wrapper).setStyle('margin', 0);
    this.now = [];
    this.open = true;
  },
  vertical: function () {
    this.margin = 'margin-top';
    this.layout = 'height';
    this.offset = this.element.offsetHeight;
  },
  horizontal: function () {
    this.margin = 'margin-left';
    this.layout = 'width';
    this.offset = this.element.offsetWidth;
  },
  set: function (A) {
    this.element.setStyle(this.margin, A[0]);
    this.wrapper.setStyle(this.layout, A[1]);
    return this;
  },
  compute: function (E, D, C) {
    var B = [];
    var A = 2;
    A.times(function (F) {
      B[F] = Fx.compute(E[F], D[F], C);
    });
    return B;
  },
  start: function (B, E) {
    if (!this.check(arguments.callee, B, E)) {
      return this;
    }
    this[E || this.options.mode]();
    var D = this.element.getStyle(this.margin).toInt();
    var C = this.wrapper.getStyle(this.layout).toInt();
    var A = [
      [D, C],
      [0, this.offset],
    ];
    var G = [
      [D, C],
      [-this.offset, 0],
    ];
    var F;
    switch (B) {
      case 'in':
        F = A;
        break;
      case 'out':
        F = G;
        break;
      case 'toggle':
        F = this.wrapper['offset' + this.layout.capitalize()] == 0 ? A : G;
    }
    return this.parent(F[0], F[1]);
  },
  slideIn: function (A) {
    return this.start('in', A);
  },
  slideOut: function (A) {
    return this.start('out', A);
  },
  hide: function (A) {
    this[A || this.options.mode]();
    this.open = false;
    return this.set([-this.offset, 0]);
  },
  show: function (A) {
    this[A || this.options.mode]();
    this.open = true;
    return this.set([0, this.offset]);
  },
  toggle: function (A) {
    return this.start('toggle', A);
  },
});
Element.Properties.slide = {
  set: function (B) {
    var A = this.retrieve('slide');
    if (A) {
      A.cancel();
    }
    return this.eliminate('slide').store('slide:options', $extend({ link: 'cancel' }, B));
  },
  get: function (A) {
    if (A || !this.retrieve('slide')) {
      if (A || !this.retrieve('slide:options')) {
        this.set('slide', A);
      }
      this.store('slide', new Fx.Slide(this, this.retrieve('slide:options')));
    }
    return this.retrieve('slide');
  },
};
Element.implement({
  slide: function (D, E) {
    D = D || 'toggle';
    var B = this.get('slide'),
      A;
    switch (D) {
      case 'hide':
        B.hide(E);
        break;
      case 'show':
        B.show(E);
        break;
      case 'toggle':
        var C = this.retrieve('slide:flag', B.open);
        B[C ? 'slideOut' : 'slideIn'](E);
        this.store('slide:flag', !C);
        A = true;
        break;
      default:
        B.start(D, E);
    }
    if (!A) {
      this.eliminate('slide:flag');
    }
    return this;
  },
});
Fx.Elements = new Class({
  Extends: Fx.CSS,
  initialize: function (B, A) {
    this.elements = this.subject = $$(B);
    this.parent(A);
  },
  compute: function (G, H, I) {
    var C = {};
    for (var D in G) {
      var A = G[D],
        E = H[D],
        F = (C[D] = {});
      for (var B in A) {
        F[B] = this.parent(A[B], E[B], I);
      }
    }
    return C;
  },
  set: function (B) {
    for (var C in B) {
      var A = B[C];
      for (var D in A) {
        this.render(this.elements[C], D, A[D], this.options.unit);
      }
    }
    return this;
  },
  start: function (C) {
    if (!this.check(arguments.callee, C)) {
      return this;
    }
    var H = {},
      I = {};
    for (var D in C) {
      var F = C[D],
        A = (H[D] = {}),
        G = (I[D] = {});
      for (var B in F) {
        var E = this.prepare(this.elements[D], B, F[B]);
        A[B] = E.from;
        G[B] = E.to;
      }
    }
    return this.parent(H, I);
  },
});
var Drag = new Class({
  Implements: [Events, Options],
  options: {
    snap: 6,
    unit: 'px',
    grid: false,
    style: true,
    limit: false,
    handle: false,
    invert: false,
    preventDefault: false,
    modifiers: { x: 'left', y: 'top' },
  },
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
  },
  attach: function () {
    this.handles.addEvent('mousedown', this.bound.start);
    return this;
  },
  detach: function () {
    this.handles.removeEvent('mousedown', this.bound.start);
    return this;
  },
  start: function (C) {
    if (this.options.preventDefault) {
      C.preventDefault();
    }
    this.fireEvent('beforeStart', this.element);
    this.mouse.start = C.page;
    var A = this.options.limit;
    this.limit = { x: [], y: [] };
    for (var D in this.options.modifiers) {
      if (!this.options.modifiers[D]) {
        continue;
      }
      if (this.options.style) {
        this.value.now[D] = this.element.getStyle(this.options.modifiers[D]).toInt();
      } else {
        this.value.now[D] = this.element[this.options.modifiers[D]];
      }
      if (this.options.invert) {
        this.value.now[D] *= -1;
      }
      this.mouse.pos[D] = C.page[D] - this.value.now[D];
      if (A && A[D]) {
        for (var B = 2; B--; B) {
          if ($chk(A[D][B])) {
            this.limit[D][B] = $lambda(A[D][B])();
          }
        }
      }
    }
    if ($type(this.options.grid) == 'number') {
      this.options.grid = { x: this.options.grid, y: this.options.grid };
    }
    this.document.addEvents({ mousemove: this.bound.check, mouseup: this.bound.cancel });
    this.document.addEvent(this.selection, this.bound.eventStop);
  },
  check: function (A) {
    if (this.options.preventDefault) {
      A.preventDefault();
    }
    var B = Math.round(
      Math.sqrt(Math.pow(A.page.x - this.mouse.start.x, 2) + Math.pow(A.page.y - this.mouse.start.y, 2))
    );
    if (B > this.options.snap) {
      this.cancel();
      this.document.addEvents({ mousemove: this.bound.drag, mouseup: this.bound.stop });
      this.fireEvent('start', this.element).fireEvent('snap', this.element);
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
      if (this.options.invert) {
        this.value.now[B] *= -1;
      }
      if (this.options.limit && this.limit[B]) {
        if ($chk(this.limit[B][1]) && this.value.now[B] > this.limit[B][1]) {
          this.value.now[B] = this.limit[B][1];
        } else {
          if ($chk(this.limit[B][0]) && this.value.now[B] < this.limit[B][0]) {
            this.value.now[B] = this.limit[B][0];
          }
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
  cancel: function (A) {
    this.document.removeEvent('mousemove', this.bound.check);
    this.document.removeEvent('mouseup', this.bound.cancel);
    if (A) {
      this.document.removeEvent(this.selection, this.bound.eventStop);
      this.fireEvent('cancel', this.element);
    }
  },
  stop: function (A) {
    this.document.removeEvent(this.selection, this.bound.eventStop);
    this.document.removeEvent('mousemove', this.bound.drag);
    this.document.removeEvent('mouseup', this.bound.stop);
    if (A) {
      this.fireEvent('complete', this.element);
    }
  },
});
Element.implement({
  makeResizable: function (A) {
    return new Drag(this, $merge({ modifiers: { x: 'width', y: 'height' } }, A));
  },
});
Drag.Move = new Class({
  Extends: Drag,
  options: { droppables: [], container: false },
  initialize: function (C, B) {
    this.parent(C, B);
    this.droppables = $$(this.options.droppables);
    this.container = $(this.options.container);
    if (this.container && $type(this.container) != 'element') {
      this.container = $(this.container.getDocument().body);
    }
    C = this.element;
    var D = C.getStyle('position');
    var A = D != 'static' ? D : 'absolute';
    if (C.getStyle('left') == 'auto' || C.getStyle('top') == 'auto') {
      C.position(C.getPosition(C.offsetParent));
    }
    C.setStyle('position', A);
    this.addEvent(
      'start',
      function () {
        this.checkDroppables();
      },
      true
    );
  },
  start: function (B) {
    if (this.container) {
      var D = this.element,
        J = this.container,
        E = J.getCoordinates(D.offsetParent),
        F = {},
        A = {};
      ['top', 'right', 'bottom', 'left'].each(function (K) {
        F[K] = J.getStyle('padding-' + K).toInt();
        A[K] = D.getStyle('margin-' + K).toInt();
      }, this);
      var C = D.offsetWidth + A.left + A.right,
        I = D.offsetHeight + A.top + A.bottom;
      var H = [E.left + F.left, E.right - F.right - C];
      var G = [E.top + F.top, E.bottom - F.bottom - I];
      this.options.limit = { x: H, y: G };
    }
    this.parent(B);
  },
  checkAgainst: function (B) {
    B = B.getCoordinates();
    var A = this.mouse.now;
    return A.x > B.left && A.x < B.right && A.y < B.bottom && A.y > B.top;
  },
  checkDroppables: function () {
    var A = this.droppables.filter(this.checkAgainst, this).getLast();
    if (this.overed != A) {
      if (this.overed) {
        this.fireEvent('leave', [this.element, this.overed]);
      }
      if (A) {
        this.overed = A;
        this.fireEvent('enter', [this.element, A]);
      } else {
        this.overed = null;
      }
    }
  },
  drag: function (A) {
    this.parent(A);
    if (this.droppables.length) {
      this.checkDroppables();
    }
  },
  stop: function (A) {
    this.checkDroppables();
    this.fireEvent('drop', [this.element, this.overed]);
    this.overed = null;
    return this.parent(A);
  },
});
Element.implement({
  makeDraggable: function (A) {
    return new Drag.Move(this, A);
  },
});
var Tips = new Class({
  Implements: [Events, Options],
  options: {
    onShow: function (A) {
      A.setStyle('visibility', 'visible');
    },
    onHide: function (A) {
      A.setStyle('visibility', 'hidden');
    },
    showDelay: 100,
    hideDelay: 100,
    className: null,
    offsets: { x: 16, y: 16 },
    fixed: false,
  },
  initialize: function () {
    var C = Array.link(arguments, { options: Object.type, elements: $defined });
    this.setOptions(C.options || null);
    this.tip = new Element('div').inject(document.body);
    if (this.options.className) {
      this.tip.addClass(this.options.className);
    }
    var B = new Element('div', { class: 'tip-top' }).inject(this.tip);
    this.container = new Element('div', { class: 'tip' }).inject(this.tip);
    var A = new Element('div', { class: 'tip-bottom' }).inject(this.tip);
    this.tip.setStyles({ position: 'absolute', top: 0, left: 0, visibility: 'hidden' });
    if (C.elements) {
      this.attach(C.elements);
    }
  },
  attach: function (A) {
    $$(A).each(function (D) {
      var G = D.retrieve('tip:title', D.get('title'));
      var F = D.retrieve('tip:text', D.get('rel') || D.get('href'));
      var E = D.retrieve('tip:enter', this.elementEnter.bindWithEvent(this, D));
      var C = D.retrieve('tip:leave', this.elementLeave.bindWithEvent(this, D));
      D.addEvents({ mouseenter: E, mouseleave: C });
      if (!this.options.fixed) {
        var B = D.retrieve('tip:move', this.elementMove.bindWithEvent(this, D));
        D.addEvent('mousemove', B);
      }
      D.store('tip:native', D.get('title'));
      D.erase('title');
    }, this);
    return this;
  },
  detach: function (A) {
    $$(A).each(function (C) {
      C.removeEvent('mouseenter', C.retrieve('tip:enter') || $empty);
      C.removeEvent('mouseleave', C.retrieve('tip:leave') || $empty);
      C.removeEvent('mousemove', C.retrieve('tip:move') || $empty);
      C.eliminate('tip:enter').eliminate('tip:leave').eliminate('tip:move');
      var B = C.retrieve('tip:native');
      if (B) {
        C.set('title', B);
      }
    });
    return this;
  },
  elementEnter: function (B, A) {
    $A(this.container.childNodes).each(Element.dispose);
    var D = A.retrieve('tip:title');
    if (D) {
      this.titleElement = new Element('div', { class: 'tip-title' }).inject(this.container);
      this.fill(this.titleElement, D);
    }
    var C = A.retrieve('tip:text');
    if (C) {
      this.textElement = new Element('div', { class: 'tip-text' }).inject(this.container);
      this.fill(this.textElement, C);
    }
    this.timer = $clear(this.timer);
    this.timer = this.show.delay(this.options.showDelay, this);
    this.position(!this.options.fixed ? B : { page: A.getPosition() });
  },
  elementLeave: function (A) {
    $clear(this.timer);
    this.timer = this.hide.delay(this.options.hideDelay, this);
  },
  elementMove: function (A) {
    this.position(A);
  },
  position: function (D) {
    var B = window.getSize(),
      A = window.getScroll();
    var E = { x: this.tip.offsetWidth, y: this.tip.offsetHeight };
    var C = { x: 'left', y: 'top' };
    for (var F in C) {
      var G = D.page[F] + this.options.offsets[F];
      if (G + E[F] - A[F] > B[F]) {
        G = D.page[F] - this.options.offsets[F] - E[F];
      }
      this.tip.setStyle(C[F], G);
    }
  },
  fill: function (A, B) {
    typeof B == 'string' ? A.set('html', B) : A.adopt(B);
  },
  show: function () {
    this.fireEvent('show', this.tip);
  },
  hide: function () {
    this.fireEvent('hide', this.tip);
  },
});
var Slider = new Class({
  Implements: [Events, Options],
  options: {
    onTick: function (A) {
      if (this.options.snap) {
        A = this.toPosition(this.step);
      }
      this.knob.setStyle(this.property, A);
    },
    snap: false,
    offset: 0,
    range: false,
    wheel: false,
    steps: 100,
    mode: 'horizontal',
  },
  initialize: function (E, A, D) {
    this.setOptions(D);
    this.element = $(E);
    this.knob = $(A);
    this.previousChange = this.previousEnd = this.step = -1;
    this.element.addEvent('mousedown', this.clickedElement.bind(this));
    if (this.options.wheel) {
      this.element.addEvent('mousewheel', this.scrolledElement.bindWithEvent(this));
    }
    var F,
      B = {},
      C = { x: false, y: false };
    switch (this.options.mode) {
      case 'vertical':
        this.axis = 'y';
        this.property = 'top';
        F = 'offsetHeight';
        break;
      case 'horizontal':
        this.axis = 'x';
        this.property = 'left';
        F = 'offsetWidth';
    }
    this.half = this.knob[F] / 2;
    this.full = this.element[F] - this.knob[F] + this.options.offset * 2;
    this.min = $chk(this.options.range[0]) ? this.options.range[0] : 0;
    this.max = $chk(this.options.range[1]) ? this.options.range[1] : this.options.steps;
    this.range = this.max - this.min;
    this.steps = this.options.steps || this.full;
    this.stepSize = Math.abs(this.range) / this.steps;
    this.stepWidth = (this.stepSize * this.full) / Math.abs(this.range);
    this.knob.setStyle('position', 'relative').setStyle(this.property, -this.options.offset);
    C[this.axis] = this.property;
    B[this.axis] = [-this.options.offset, this.full - this.options.offset];
    this.drag = new Drag(this.knob, {
      snap: 0,
      limit: B,
      modifiers: C,
      onDrag: this.draggedKnob.bind(this),
      onStart: this.draggedKnob.bind(this),
      onComplete: function () {
        this.draggedKnob();
        this.end();
      }.bind(this),
    });
    if (this.options.snap) {
      this.drag.options.grid = Math.ceil(this.stepWidth);
      this.drag.options.limit[this.axis][1] = this.full;
    }
  },
  set: function (A) {
    if (!((this.range > 0) ^ (A < this.min))) {
      A = this.min;
    }
    if (!((this.range > 0) ^ (A > this.max))) {
      A = this.max;
    }
    this.step = Math.round(A);
    this.checkStep();
    this.end();
    this.fireEvent('tick', this.toPosition(this.step));
    return this;
  },
  clickedElement: function (C) {
    var B = this.range < 0 ? -1 : 1;
    var A = C.page[this.axis] - this.element.getPosition()[this.axis] - this.half;
    A = A.limit(-this.options.offset, this.full - this.options.offset);
    this.step = Math.round(this.min + B * this.toStep(A));
    this.checkStep();
    this.end();
    this.fireEvent('tick', A);
  },
  scrolledElement: function (A) {
    var B = this.options.mode == 'horizontal' ? A.wheel < 0 : A.wheel > 0;
    this.set(B ? this.step - this.stepSize : this.step + this.stepSize);
    A.stop();
  },
  draggedKnob: function () {
    var B = this.range < 0 ? -1 : 1;
    var A = this.drag.value.now[this.axis];
    A = A.limit(-this.options.offset, this.full - this.options.offset);
    this.step = Math.round(this.min + B * this.toStep(A));
    this.checkStep();
  },
  checkStep: function () {
    if (this.previousChange != this.step) {
      this.previousChange = this.step;
      this.fireEvent('change', this.step);
    }
  },
  end: function () {
    if (this.previousEnd !== this.step) {
      this.previousEnd = this.step;
      this.fireEvent('complete', this.step + '');
    }
  },
  toStep: function (A) {
    var B = (((A + this.options.offset) * this.stepSize) / this.full) * this.steps;
    return this.options.steps ? Math.round((B -= B % this.stepSize)) : B;
  },
  toPosition: function (A) {
    return (this.full * Math.abs(this.min - A)) / (this.steps * this.stepSize) - this.options.offset;
  },
});
