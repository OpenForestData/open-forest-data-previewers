/*
 Web Build: http://mootools.net/more/builder/28d40e444bec8b00f153c3cdb314d764
*/
var $jscomp = $jscomp || {};
$jscomp.scope = {};
$jscomp.ASSUME_ES5 = !1;
$jscomp.ASSUME_NO_NATIVE_MAP = !1;
$jscomp.ASSUME_NO_NATIVE_SET = !1;
$jscomp.defineProperty =
  $jscomp.ASSUME_ES5 || 'function' == typeof Object.defineProperties
    ? Object.defineProperty
    : function (a, b, c) {
        a != Array.prototype && a != Object.prototype && (a[b] = c.value);
      };
$jscomp.getGlobal = function (a) {
  return 'undefined' != typeof window && window === a ? a : 'undefined' != typeof global && null != global ? global : a;
};
$jscomp.global = $jscomp.getGlobal(this);
$jscomp.polyfill = function (a, b, c, d) {
  if (b) {
    c = $jscomp.global;
    a = a.split('.');
    for (d = 0; d < a.length - 1; d++) {
      var e = a[d];
      e in c || (c[e] = {});
      c = c[e];
    }
    a = a[a.length - 1];
    d = c[a];
    b = b(d);
    b != d && null != b && $jscomp.defineProperty(c, a, { configurable: !0, writable: !0, value: b });
  }
};
$jscomp.polyfill(
  'Array.prototype.fill',
  function (a) {
    return a
      ? a
      : function (a, c, d) {
          var b = this.length || 0;
          0 > c && (c = Math.max(0, b + c));
          if (null == d || d > b) d = b;
          d = Number(d);
          0 > d && (d = Math.max(0, b + d));
          for (c = Number(c || 0); c < d; c++) this[c] = a;
          return this;
        };
  },
  'es6',
  'es3'
);
MooTools.More = { version: '1.6.0', build: '45b71db70f879781a7e0b0d3fb3bb1307c2521eb' };
Class.refactor = function (a, b) {
  Object.each(b, function (b, d) {
    var c = a.prototype[d];
    c = (c && c.$origin) || c || function () {};
    a.implement(
      d,
      'function' == typeof b
        ? function () {
            var a = this.previous;
            this.previous = c;
            var d = b.apply(this, arguments);
            this.previous = a;
            return d;
          }
        : b
    );
  });
  return a;
};
(function () {
  Events.Pseudos = function (a, b, e) {
    var c = function (a) {
        return {
          store: a.store
            ? function (b, c) {
                a.store('_monitorEvents:' + b, c);
              }
            : function (b, c) {
                (a._monitorEvents || (a._monitorEvents = {}))[b] = c;
              },
          retrieve: a.retrieve
            ? function (b, c) {
                return a.retrieve('_monitorEvents:' + b, c);
              }
            : function (b, c) {
                return a._monitorEvents ? a._monitorEvents[b] || c : c;
              },
        };
      },
      d = function (b) {
        if (-1 == b.indexOf(':') || !a) return null;
        for (var c = Slick.parse(b).expressions[0][0], d = c.pseudos, e = d.length, f = []; e--; ) {
          var k = d[e].key,
            h = a[k];
          null != h && f.push({ event: c.tag, value: d[e].value, pseudo: k, original: b, listener: h });
        }
        return f.length ? f : null;
      };
    return {
      addEvent: function (a, e, f) {
        var k = d(a);
        if (!k) return b.call(this, a, e, f);
        var h = c(this),
          g = h.retrieve(a, []),
          l = k[0].event,
          r = Array.slice(arguments, 2),
          q = e,
          u = this;
        k.each(function (a) {
          var b = a.listener,
            c = q;
          0 == b
            ? (l += ':' + a.pseudo + '(' + a.value + ')')
            : (q = function () {
                b.call(u, a, c, arguments, q);
              });
        });
        g.include({ type: l, event: e, monitor: q });
        h.store(a, g);
        a != l && b.apply(this, [a, e].concat(r));
        return b.apply(this, [l, q].concat(r));
      },
      removeEvent: function (a, b) {
        if (!d(a)) return e.call(this, a, b);
        var f = c(this),
          k = f.retrieve(a);
        if (!k) return this;
        var h = Array.slice(arguments, 2);
        e.apply(this, [a, b].concat(h));
        k.each(function (a, c) {
          (b && a.event != b) || e.apply(this, [a.type, a.monitor].concat(h));
          delete k[c];
        }, this);
        f.store(a, k);
        return this;
      },
    };
  };
  var a = {
    once: function (a, b, e, f) {
      b.apply(this, e);
      this.removeEvent(a.event, f).removeEvent(a.original, b);
    },
    throttle: function (a, b, e) {
      b._throttled ||
        (b.apply(this, e),
        (b._throttled = setTimeout(function () {
          b._throttled = !1;
        }, a.value || 250)));
    },
    pause: function (a, b, e) {
      clearTimeout(b._pause);
      b._pause = b.delay(a.value || 250, this, e);
    },
  };
  Events.definePseudo = function (b, d) {
    a[b] = d;
    return this;
  };
  Events.lookupPseudo = function (b) {
    return a[b];
  };
  var b = Events.prototype;
  Events.implement(Events.Pseudos(a, b.addEvent, b.removeEvent));
  ['Request', 'Fx'].each(function (a) {
    this[a] && this[a].implement(Events.prototype);
  });
})();
(function () {
  var a = (this.Drag = new Class({
    Implements: [Events, Options],
    options: {
      snap: 6,
      unit: 'px',
      grid: !1,
      style: !0,
      limit: !1,
      handle: !1,
      invert: !1,
      unDraggableTags: 'button input a textarea select option'.split(' '),
      preventDefault: !1,
      stopPropagation: !1,
      compensateScroll: !1,
      modifiers: { x: 'left', y: 'top' },
    },
    initialize: function () {
      var b = Array.link(arguments, {
        options: Type.isObject,
        element: function (a) {
          return null != a;
        },
      });
      this.element = document.id(b.element);
      this.document = this.element.getDocument();
      this.setOptions(b.options || {});
      b = typeOf(this.options.handle);
      this.handles =
        ('array' == b || 'collection' == b ? $$(this.options.handle) : document.id(this.options.handle)) ||
        this.element;
      this.mouse = { now: {}, pos: {} };
      this.value = { start: {}, now: {} };
      this.offsetParent = (function (a) {
        a = a.getOffsetParent();
        return !a || /^(?:body|html)$/i.test(a.tagName) ? window : document.id(a);
      })(this.element);
      this.selection = 'selectstart' in document ? 'selectstart' : 'mousedown';
      this.compensateScroll = { start: {}, diff: {}, last: {} };
      !('ondragstart' in document) ||
        'FileReader' in window ||
        a.ondragstartFixed ||
        ((document.ondragstart = Function.convert(!1)), (a.ondragstartFixed = !0));
      this.bound = {
        start: this.start.bind(this),
        check: this.check.bind(this),
        drag: this.drag.bind(this),
        stop: this.stop.bind(this),
        cancel: this.cancel.bind(this),
        eventStop: Function.convert(!1),
        scrollListener: this.scrollListener.bind(this),
      };
      this.attach();
    },
    attach: function () {
      this.handles.addEvent('mousedown', this.bound.start);
      this.handles.addEvent('touchstart', this.bound.start);
      this.options.compensateScroll && this.offsetParent.addEvent('scroll', this.bound.scrollListener);
      return this;
    },
    detach: function () {
      this.handles.removeEvent('mousedown', this.bound.start);
      this.handles.removeEvent('touchstart', this.bound.start);
      this.options.compensateScroll && this.offsetParent.removeEvent('scroll', this.bound.scrollListener);
      return this;
    },
    scrollListener: function () {
      if (this.mouse.start) {
        var a = this.offsetParent.getScroll();
        if ('absolute' == this.element.getStyle('position')) {
          var c = this.sumValues(a, this.compensateScroll.last, -1);
          this.mouse.now = this.sumValues(this.mouse.now, c, 1);
        } else this.compensateScroll.diff = this.sumValues(a, this.compensateScroll.start, -1);
        this.offsetParent != window &&
          (this.compensateScroll.diff = this.sumValues(this.compensateScroll.start, a, -1));
        this.compensateScroll.last = a;
        this.render(this.options);
      }
    },
    sumValues: function (a, c, d) {
      var b = {},
        f = this.options,
        k;
      for (k in f.modifiers) f.modifiers[k] && (b[k] = a[k] + c[k] * d);
      return b;
    },
    start: function (a) {
      if (!this.options.unDraggableTags.contains(a.target.get('tag'))) {
        var b = this.options;
        if (!a.rightClick) {
          b.preventDefault && a.preventDefault();
          b.stopPropagation && a.stopPropagation();
          this.compensateScroll.start = this.compensateScroll.last = this.offsetParent.getScroll();
          this.compensateScroll.diff = { x: 0, y: 0 };
          this.mouse.start = a.page;
          this.fireEvent('beforeStart', this.element);
          var d = b.limit;
          this.limit = { x: [], y: [] };
          var e,
            f,
            k = this.offsetParent == window ? null : this.offsetParent;
          for (e in b.modifiers)
            if (b.modifiers[e]) {
              var h = this.element.getStyle(b.modifiers[e]);
              h && !h.match(/px$/) && (f || (f = this.element.getCoordinates(k)), (h = f[b.modifiers[e]]));
              this.value.now[e] = b.style ? (h || 0).toInt() : this.element[b.modifiers[e]];
              b.invert && (this.value.now[e] *= -1);
              this.mouse.pos[e] = a.page[e] - this.value.now[e];
              if (d && d[e])
                for (h = 2; h--; ) {
                  var g = d[e][h];
                  if (g || 0 === g) this.limit[e][h] = 'function' == typeof g ? g() : g;
                }
            }
          'number' == typeOf(this.options.grid) && (this.options.grid = { x: this.options.grid, y: this.options.grid });
          a = {
            mousemove: this.bound.check,
            mouseup: this.bound.cancel,
            touchmove: this.bound.check,
            touchend: this.bound.cancel,
          };
          a[this.selection] = this.bound.eventStop;
          this.document.addEvents(a);
        }
      }
    },
    check: function (a) {
      this.options.preventDefault && a.preventDefault();
      Math.round(Math.sqrt(Math.pow(a.page.x - this.mouse.start.x, 2) + Math.pow(a.page.y - this.mouse.start.y, 2))) >
        this.options.snap &&
        (this.cancel(),
        this.document.addEvents({
          mousemove: this.bound.drag,
          mouseup: this.bound.stop,
          touchmove: this.bound.drag,
          touchend: this.bound.stop,
        }),
        this.fireEvent('start', [this.element, a]).fireEvent('snap', this.element));
    },
    drag: function (a) {
      var b = this.options;
      b.preventDefault && a.preventDefault();
      this.mouse.now = this.sumValues(a.page, this.compensateScroll.diff, -1);
      this.render(b);
      this.fireEvent('drag', [this.element, a]);
    },
    render: function (a) {
      for (var b in a.modifiers)
        a.modifiers[b] &&
          ((this.value.now[b] = this.mouse.now[b] - this.mouse.pos[b]),
          a.invert && (this.value.now[b] *= -1),
          a.limit &&
            this.limit[b] &&
            ((this.limit[b][1] || 0 === this.limit[b][1]) && this.value.now[b] > this.limit[b][1]
              ? (this.value.now[b] = this.limit[b][1])
              : (this.limit[b][0] || 0 === this.limit[b][0]) &&
                this.value.now[b] < this.limit[b][0] &&
                (this.value.now[b] = this.limit[b][0])),
          a.grid[b] && (this.value.now[b] -= (this.value.now[b] - (this.limit[b][0] || 0)) % a.grid[b]),
          a.style
            ? this.element.setStyle(a.modifiers[b], this.value.now[b] + a.unit)
            : (this.element[a.modifiers[b]] = this.value.now[b]));
    },
    cancel: function (a) {
      this.document.removeEvents({
        mousemove: this.bound.check,
        mouseup: this.bound.cancel,
        touchmove: this.bound.check,
        touchend: this.bound.cancel,
      });
      a && (this.document.removeEvent(this.selection, this.bound.eventStop), this.fireEvent('cancel', this.element));
    },
    stop: function (a) {
      var b = {
        mousemove: this.bound.drag,
        mouseup: this.bound.stop,
        touchmove: this.bound.drag,
        touchend: this.bound.stop,
      };
      b[this.selection] = this.bound.eventStop;
      this.document.removeEvents(b);
      this.mouse.start = null;
      a && this.fireEvent('complete', [this.element, a]);
    },
  }));
})();
Element.implement({
  makeResizable: function (a) {
    var b = new Drag(this, Object.merge({ modifiers: { x: 'width', y: 'height' } }, a));
    this.store('resizer', b);
    return b.addEvent(
      'drag',
      function () {
        this.fireEvent('resize', b);
      }.bind(this)
    );
  },
});
Drag.Move = new Class({
  Extends: Drag,
  options: { droppables: [], container: !1, precalculate: !1, includeMargins: !0, checkDroppables: !0 },
  initialize: function (a, b) {
    this.parent(a, b);
    a = this.element;
    this.droppables = $$(this.options.droppables);
    this.setContainer(this.options.container);
    if (this.options.style) {
      if ('left' == this.options.modifiers.x && 'top' == this.options.modifiers.y) {
        b = a.getOffsetParent();
        var c = a.getStyles('left', 'top');
        !b || ('auto' != c.left && 'auto' != c.top) || a.setPosition(a.getPosition(b));
      }
      'static' == a.getStyle('position') && a.setStyle('position', 'absolute');
    }
    this.addEvent('start', this.checkDroppables, !0);
    this.overed = null;
  },
  setContainer: function (a) {
    (this.container = document.id(a)) &&
      'element' != typeOf(this.container) &&
      (this.container = document.id(this.container.getDocument().body));
  },
  start: function (a) {
    this.container && (this.options.limit = this.calculateLimit());
    this.options.precalculate &&
      (this.positions = this.droppables.map(function (a) {
        return a.getCoordinates();
      }));
    this.parent(a);
  },
  calculateLimit: function () {
    var a = this.element,
      b = this.container,
      c = document.id(a.getOffsetParent()) || document.body,
      d = b.getCoordinates(c),
      e = {},
      f = {},
      k = {},
      h = {},
      g = c.getScroll();
    ['top', 'right', 'bottom', 'left'].each(function (d) {
      e[d] = a.getStyle('margin-' + d).toInt();
      a.getStyle('border-' + d).toInt();
      f[d] = b.getStyle('margin-' + d).toInt();
      k[d] = b.getStyle('border-' + d).toInt();
      h[d] = c.getStyle('padding-' + d).toInt();
    }, this);
    var l = 0 + g.x,
      m = 0 + g.y,
      n = d.right - k.right - (a.offsetWidth + e.left + e.right) + g.x;
    g = d.bottom - k.bottom - (a.offsetHeight + e.top + e.bottom) + g.y;
    this.options.includeMargins ? ((l += e.left), (m += e.top)) : ((n += e.right), (g += e.bottom));
    'relative' == a.getStyle('position')
      ? ((d = a.getCoordinates(c)),
        (d.left -= a.getStyle('left').toInt()),
        (d.top -= a.getStyle('top').toInt()),
        (l -= d.left),
        (m -= d.top),
        'relative' != b.getStyle('position') && ((l += k.left), (m += k.top)),
        (n += e.left - d.left),
        (g += e.top - d.top),
        b != c &&
          ((l += f.left + h.left),
          !h.left && 0 > l && (l = 0),
          (m += c == document.body ? 0 : f.top + h.top),
          !h.top && 0 > m && (m = 0)))
      : ((l -= e.left), (m -= e.top), b != c && ((l += d.left + k.left), (m += d.top + k.top)));
    return { x: [l, n], y: [m, g] };
  },
  getDroppableCoordinates: function (a) {
    var b = a.getCoordinates();
    'fixed' == a.getStyle('position') &&
      ((a = window.getScroll()), (b.left += a.x), (b.right += a.x), (b.top += a.y), (b.bottom += a.y));
    return b;
  },
  checkDroppables: function () {
    var a = this.droppables
      .filter(function (a, c) {
        a = this.positions ? this.positions[c] : this.getDroppableCoordinates(a);
        c = this.mouse.now;
        return c.x > a.left && c.x < a.right && c.y < a.bottom && c.y > a.top;
      }, this)
      .getLast();
    this.overed != a &&
      (this.overed && this.fireEvent('leave', [this.element, this.overed]),
      a && this.fireEvent('enter', [this.element, a]),
      (this.overed = a));
  },
  drag: function (a) {
    this.parent(a);
    this.options.checkDroppables && this.droppables.length && this.checkDroppables();
  },
  stop: function (a) {
    this.checkDroppables();
    this.fireEvent('drop', [this.element, this.overed, a]);
    this.overed = null;
    return this.parent(a);
  },
});
Element.implement({
  makeDraggable: function (a) {
    a = new Drag.Move(this, a);
    this.store('dragger', a);
    return a;
  },
});
Class.Mutators.Binds = function (a) {
  this.prototype.initialize || this.implement('initialize', function () {});
  return Array.convert(a).concat(this.prototype.Binds || []);
};
Class.Mutators.initialize = function (a) {
  return function () {
    Array.convert(this.Binds).each(function (a) {
      var b = this[a];
      b && (this[a] = b.bind(this));
    }, this);
    return a.apply(this, arguments);
  };
};
(function () {
  var a = function (a, b) {
      var c = [];
      Object.each(b, function (b) {
        Object.each(b, function (b) {
          a.each(function (a) {
            c.push(a + '-' + b + ('border' == a ? '-width' : ''));
          });
        });
      });
      return c;
    },
    b = function (a, b) {
      var c = 0;
      Object.each(b, function (b, d) {
        d.test(a) && (c += b.toInt());
      });
      return c;
    };
  Element.implement({
    measure: function (a) {
      if (!this || this.offsetHeight || this.offsetWidth) return a.call(this);
      for (var b = this.getParent(), c = []; b && !b.offsetHeight && !b.offsetWidth && b != document.body; )
        c.push(b.expose()), (b = b.getParent());
      b = this.expose();
      a = a.call(this);
      b();
      c.each(function (a) {
        a();
      });
      return a;
    },
    expose: function () {
      if ('none' != this.getStyle('display')) return function () {};
      var a = this.style.cssText;
      this.setStyles({ display: 'block', position: 'absolute', visibility: 'hidden' });
      return function () {
        this.style.cssText = a;
      }.bind(this);
    },
    getDimensions: function (a) {
      a = Object.merge({ computeSize: !1 }, a);
      var b = { x: 0, y: 0 },
        c = this.getParent('body');
      if (c && 'none' == this.getStyle('display'))
        b = this.measure(function () {
          return a.computeSize ? this.getComputedSize(a) : this.getSize();
        });
      else if (c)
        try {
          b = a.computeSize ? this.getComputedSize(a) : this.getSize();
        } catch (f) {}
      return Object.append(b, b.x || 0 === b.x ? { width: b.x, height: b.y } : { x: b.width, y: b.height });
    },
    getComputedSize: function (c) {
      c = Object.merge(
        {
          styles: ['padding', 'border'],
          planes: { height: ['top', 'bottom'], width: ['left', 'right'] },
          mode: 'both',
        },
        c
      );
      var d = {},
        e = { width: 0, height: 0 },
        f;
      'vertical' == c.mode
        ? (delete e.width, delete c.planes.width)
        : 'horizontal' == c.mode && (delete e.height, delete c.planes.height);
      a(c.styles, c.planes).each(function (a) {
        d[a] = this.getStyle(a).toInt();
      }, this);
      Object.each(
        c.planes,
        function (a, c) {
          var k = c.capitalize(),
            h = this.getStyle(c);
          'auto' != h || f || (f = this.getDimensions());
          h = d[c] = 'auto' == h ? f[c] : h.toInt();
          e['total' + k] = h;
          a.each(function (a) {
            var c = b(a, d);
            e['computed' + a.capitalize()] = c;
            e['total' + k] += c;
          });
        },
        this
      );
      return Object.append(e, d);
    },
  });
})();
(function () {
  this.Slider = new Class({
    Implements: [Events, Options],
    Binds: ['clickedElement', 'draggedKnob', 'scrolledElement'],
    options: {
      onTick: function (a) {
        this.setKnobPosition(a);
      },
      initialStep: 0,
      snap: !1,
      offset: 0,
      range: !1,
      wheel: !1,
      steps: 100,
      mode: 'horizontal',
    },
    initialize: function (a, b, c) {
      this.setOptions(c);
      c = this.options;
      this.element = document.id(a);
      b = this.knob = document.id(b);
      this.previousChange = this.previousEnd = this.step = c.initialStep ? c.initialStep : c.range ? c.range[0] : 0;
      a = {};
      var d = { x: !1, y: !1 };
      switch (c.mode) {
        case 'vertical':
          this.axis = 'y';
          this.property = 'top';
          this.offset = 'offsetHeight';
          break;
        case 'horizontal':
          (this.axis = 'x'), (this.property = 'left'), (this.offset = 'offsetWidth');
      }
      this.setSliderDimensions();
      this.setRange(c.range, null, !0);
      'static' == b.getStyle('position') && b.setStyle('position', 'relative');
      b.setStyle(this.property, -c.offset);
      d[this.axis] = this.property;
      a[this.axis] = [-c.offset, this.full - c.offset];
      a = {
        snap: 0,
        limit: a,
        modifiers: d,
        onDrag: this.draggedKnob,
        onStart: this.draggedKnob,
        onBeforeStart: function () {
          this.isDragging = !0;
        }.bind(this),
        onCancel: function () {
          this.isDragging = !1;
        }.bind(this),
        onComplete: function () {
          this.isDragging = !1;
          this.draggedKnob();
          this.end();
        }.bind(this),
      };
      c.snap && this.setSnap(a);
      this.drag = new Drag(b, a);
      null != c.initialStep && this.set(c.initialStep, !0);
      this.attach();
    },
    attach: function () {
      this.element.addEvent('mousedown', this.clickedElement);
      this.options.wheel && this.element.addEvent('mousewheel', this.scrolledElement);
      this.drag.attach();
      return this;
    },
    detach: function () {
      this.element.removeEvent('mousedown', this.clickedElement).removeEvent('mousewheel', this.scrolledElement);
      this.drag.detach();
      return this;
    },
    autosize: function () {
      this.setSliderDimensions().setKnobPosition(this.toPosition(this.step));
      this.drag.options.limit[this.axis] = [-this.options.offset, this.full - this.options.offset];
      this.options.snap && this.setSnap();
      return this;
    },
    setSnap: function (a) {
      a || (a = this.drag.options);
      a.grid = Math.ceil(this.stepWidth);
      a.limit[this.axis][1] = this.element[this.offset];
      return this;
    },
    setKnobPosition: function (a) {
      this.options.snap && (a = this.toPosition(this.step));
      this.knob.setStyle(this.property, a);
      return this;
    },
    setSliderDimensions: function () {
      this.full = this.element.measure(
        function () {
          this.half = this.knob[this.offset] / 2;
          return this.element[this.offset] - this.knob[this.offset] + 2 * this.options.offset;
        }.bind(this)
      );
      return this;
    },
    set: function (a, b) {
      (0 < this.range) ^ (a < this.min) || (a = this.min);
      (0 < this.range) ^ (a > this.max) || (a = this.max);
      this.step = a.round(this.modulus.decimalLength);
      b
        ? this.checkStep().setKnobPosition(this.toPosition(this.step))
        : this.checkStep().fireEvent('tick', this.toPosition(this.step)).fireEvent('move').end();
      return this;
    },
    setRange: function (a, b, c) {
      this.min = Array.pick([a[0], 0]);
      this.max = Array.pick([a[1], this.options.steps]);
      this.range = this.max - this.min;
      this.steps = this.options.steps || this.full;
      this.stepSize = Math.abs(this.range) / this.steps;
      this.stepWidth = (this.stepSize * this.full) / Math.abs(this.range);
      this.setModulus();
      a && this.set(Array.pick([b, this.step]).limit(this.min, this.max), c);
      return this;
    },
    setModulus: function () {
      for (var a = ((this.stepSize + '').split('.')[1] || []).length, b = '1'; a--; ) b += '0';
      this.modulus = { multiplier: b.toInt(10), decimalLength: b.length - 1 };
    },
    clickedElement: function (a) {
      if (!this.isDragging && a.target != this.knob) {
        var b = 0 > this.range ? -1 : 1;
        a = a.page[this.axis] - this.element.getPosition()[this.axis] - this.half;
        a = a.limit(-this.options.offset, this.full - this.options.offset);
        this.step = (this.min + b * this.toStep(a)).round(this.modulus.decimalLength);
        this.checkStep().fireEvent('tick', a).fireEvent('move').end();
      }
    },
    scrolledElement: function (a) {
      this.set(this.step + (('horizontal' == this.options.mode ? 0 > a.wheel : 0 < a.wheel) ? -1 : 1) * this.stepSize);
      a.stop();
    },
    draggedKnob: function () {
      var a = 0 > this.range ? -1 : 1,
        b = this.drag.value.now[this.axis];
      b = b.limit(-this.options.offset, this.full - this.options.offset);
      this.step = (this.min + a * this.toStep(b)).round(this.modulus.decimalLength);
      this.checkStep();
      this.fireEvent('move');
    },
    checkStep: function () {
      var a = this.step;
      this.previousChange != a && ((this.previousChange = a), this.fireEvent('change', a));
      return this;
    },
    end: function () {
      var a = this.step;
      this.previousEnd !== a && ((this.previousEnd = a), this.fireEvent('complete', a + ''));
      return this;
    },
    toStep: function (a) {
      a = (((a + this.options.offset) * this.stepSize) / this.full) * this.steps;
      return this.options.steps
        ? (
            a -
            ((a * this.modulus.multiplier) % (this.stepSize * this.modulus.multiplier)) / this.modulus.multiplier
          ).round(this.modulus.decimalLength)
        : a;
    },
    toPosition: function (a) {
      return (this.full * Math.abs(this.min - a)) / (this.steps * this.stepSize) - this.options.offset || 0;
    },
  });
})();
(function () {
  for (var a = { relay: !1 }, b = ['once', 'throttle', 'pause'], c = b.length; c--; )
    a[b[c]] = Events.lookupPseudo(b[c]);
  DOMEvent.definePseudo = function (b, c) {
    a[b] = c;
    return this;
  };
  b = Element.prototype;
  [Element, Window, Document].invoke('implement', Events.Pseudos(a, b.addEvent, b.removeEvent));
})();
Element.implement({
  isDisplayed: function () {
    return 'none' != this.getStyle('display');
  },
  isVisible: function () {
    var a = this.offsetWidth,
      b = this.offsetHeight;
    return 0 == a && 0 == b ? !1 : 0 < a && 0 < b ? !0 : 'none' != this.style.display;
  },
  toggle: function () {
    return this[this.isDisplayed() ? 'hide' : 'show']();
  },
  hide: function () {
    try {
      var a = this.getStyle('display');
    } catch (b) {}
    return 'none' == a ? this : this.store('element:_originalDisplay', a || '').setStyle('display', 'none');
  },
  show: function (a) {
    if (!a && this.isDisplayed()) return this;
    a = a || this.retrieve('element:_originalDisplay') || 'block';
    return this.setStyle('display', 'none' == a ? 'block' : a);
  },
  swapClass: function (a, b) {
    return this.removeClass(a).addClass(b);
  },
});
Document.implement({
  clearSelection: function () {
    if (window.getSelection) {
      var a = window.getSelection();
      a && a.removeAllRanges && a.removeAllRanges();
    } else if (document.selection && document.selection.empty)
      try {
        document.selection.empty();
      } catch (b) {}
  },
});
(function () {
  var a = function (a) {
    var b = a.options.hideInputs;
    if (window.OverText) {
      var d = [null];
      OverText.each(function (a) {
        d.include('.' + a.options.labelClass);
      });
      d && (b += d.join(', '));
    }
    return b ? a.element.getElements(b) : null;
  };
  Fx.Reveal = new Class({
    Extends: Fx.Morph,
    options: {
      link: 'cancel',
      styles: ['padding', 'border', 'margin'],
      transitionOpacity: 'opacity' in document.documentElement,
      mode: 'vertical',
      display: function () {
        return 'tr' != this.element.get('tag') ? 'block' : 'table-row';
      },
      opacity: 1,
      hideInputs: 'opacity' in document.documentElement ? null : 'select, input, textarea, object, embed',
    },
    dissolve: function () {
      if (this.hiding || this.showing)
        'chain' == this.options.link
          ? this.chain(this.dissolve.bind(this))
          : 'cancel' != this.options.link || this.hiding || (this.cancel(), this.dissolve());
      else if ('none' != this.element.getStyle('display')) {
        this.hiding = !0;
        this.showing = !1;
        this.hidden = !0;
        this.cssText = this.element.style.cssText;
        var b = this.element.getComputedSize({ styles: this.options.styles, mode: this.options.mode });
        this.options.transitionOpacity && (b.opacity = this.options.opacity);
        var c = {};
        Object.each(b, function (a, b) {
          c[b] = [a, 0];
        });
        this.element.setStyles({ display: Function.convert(this.options.display).call(this), overflow: 'hidden' });
        var d = a(this);
        d && d.setStyle('visibility', 'hidden');
        this.$chain.unshift(
          function () {
            this.hidden &&
              ((this.hiding = !1),
              (this.element.style.cssText = this.cssText),
              this.element.setStyle('display', 'none'),
              d && d.setStyle('visibility', 'visible'));
            this.fireEvent('hide', this.element);
            this.callChain();
          }.bind(this)
        );
        this.start(c);
      } else
        this.callChain.delay(10, this), this.fireEvent('complete', this.element), this.fireEvent('hide', this.element);
      return this;
    },
    reveal: function () {
      if (this.showing || this.hiding)
        'chain' == this.options.link
          ? this.chain(this.reveal.bind(this))
          : 'cancel' != this.options.link || this.showing || (this.cancel(), this.reveal());
      else if ('none' == this.element.getStyle('display')) {
        this.hiding = !1;
        this.showing = !0;
        this.hidden = !1;
        this.cssText = this.element.style.cssText;
        var b;
        this.element.measure(
          function () {
            b = this.element.getComputedSize({ styles: this.options.styles, mode: this.options.mode });
          }.bind(this)
        );
        null != this.options.heightOverride && (b.height = this.options.heightOverride.toInt());
        null != this.options.widthOverride && (b.width = this.options.widthOverride.toInt());
        this.options.transitionOpacity && (this.element.setStyle('opacity', 0), (b.opacity = this.options.opacity));
        var c = { height: 0, display: Function.convert(this.options.display).call(this) };
        Object.each(b, function (a, b) {
          c[b] = 0;
        });
        c.overflow = 'hidden';
        this.element.setStyles(c);
        var d = a(this);
        d && d.setStyle('visibility', 'hidden');
        this.$chain.unshift(
          function () {
            this.element.style.cssText = this.cssText;
            this.element.setStyle('display', Function.convert(this.options.display).call(this));
            this.hidden || (this.showing = !1);
            d && d.setStyle('visibility', 'visible');
            this.callChain();
            this.fireEvent('show', this.element);
          }.bind(this)
        );
        this.start(b);
      } else this.callChain(), this.fireEvent('complete', this.element), this.fireEvent('show', this.element);
      return this;
    },
    toggle: function () {
      'none' == this.element.getStyle('display') ? this.reveal() : this.dissolve();
      return this;
    },
    cancel: function () {
      this.parent.apply(this, arguments);
      null != this.cssText && (this.element.style.cssText = this.cssText);
      this.showing = this.hiding = !1;
      return this;
    },
  });
  Element.Properties.reveal = {
    set: function (a) {
      this.get('reveal').cancel().setOptions(a);
      return this;
    },
    get: function () {
      var a = this.retrieve('reveal');
      a || ((a = new Fx.Reveal(this)), this.store('reveal', a));
      return a;
    },
  };
  Element.Properties.dissolve = Element.Properties.reveal;
  Element.implement({
    reveal: function (a) {
      this.get('reveal').setOptions(a).reveal();
      return this;
    },
    dissolve: function (a) {
      this.get('reveal').setOptions(a).dissolve();
      return this;
    },
    nix: function (a) {
      var b = Array.link(arguments, { destroy: Type.isBoolean, options: Type.isObject });
      this.get('reveal')
        .setOptions(a)
        .dissolve()
        .chain(
          function () {
            this[b.destroy ? 'destroy' : 'dispose']();
          }.bind(this)
        );
      return this;
    },
    wink: function () {
      var a = Array.link(arguments, { duration: Type.isNumber, options: Type.isObject }),
        c = this.get('reveal').setOptions(a.options);
      c.reveal().chain(function () {
        (function () {
          c.dissolve();
        }.delay(a.duration || 2e3));
      });
    },
  });
})();
Fx.Elements = new Class({
  Extends: Fx.CSS,
  initialize: function (a, b) {
    this.elements = this.subject = $$(a);
    this.parent(b);
  },
  compute: function (a, b, c) {
    var d = {},
      e;
    for (e in a) {
      var f = a[e],
        k = b[e],
        h = (d[e] = {}),
        g;
      for (g in f) h[g] = this.parent(f[g], k[g], c);
    }
    return d;
  },
  set: function (a) {
    for (var b in a)
      if (this.elements[b]) {
        var c = a[b],
          d;
        for (d in c) this.render(this.elements[b], d, c[d], this.options.unit);
      }
    return this;
  },
  start: function (a) {
    if (!this.check(a)) return this;
    var b = {},
      c = {},
      d;
    for (d in a)
      if (this.elements[d]) {
        var e = a[d],
          f = (b[d] = {}),
          k = (c[d] = {}),
          h;
        for (h in e) {
          var g = this.prepare(this.elements[d], h, e[h]);
          f[h] = g.from;
          k[h] = g.to;
        }
      }
    return this.parent(b, c);
  },
});
Fx.Slide = new Class({
  Extends: Fx,
  options: { mode: 'vertical', wrapper: !1, hideOverflow: !0, resetHeight: !1 },
  initialize: function (a, b) {
    a = this.element = this.subject = document.id(a);
    this.parent(b);
    b = this.options;
    var c = a.retrieve('wrapper'),
      d = a.getStyles('margin', 'position', 'overflow');
    b.hideOverflow && (d = Object.append(d, { overflow: 'hidden' }));
    b.wrapper && (c = document.id(b.wrapper).setStyles(d));
    c || (c = new Element('div', { styles: d }).wraps(a));
    a.store('wrapper', c).setStyle('margin', 0);
    'visible' == a.getStyle('overflow') && a.setStyle('overflow', 'hidden');
    this.now = [];
    this.open = !0;
    this.wrapper = c;
    this.addEvent(
      'complete',
      function () {
        (this.open = 0 != c['offset' + this.layout.capitalize()]) &&
          this.options.resetHeight &&
          c.setStyle('height', '');
      },
      !0
    );
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
  set: function (a) {
    this.element.setStyle(this.margin, a[0]);
    this.wrapper.setStyle(this.layout, a[1]);
    return this;
  },
  compute: function (a, b, c) {
    return [0, 1].map(function (d) {
      return Fx.compute(a[d], b[d], c);
    });
  },
  start: function (a, b) {
    if (!this.check(a, b)) return this;
    this[b || this.options.mode]();
    var c = this.element.getStyle(this.margin).toInt();
    b = this.wrapper.getStyle(this.layout).toInt();
    var d = [
      [c, b],
      [0, this.offset],
    ];
    c = [
      [c, b],
      [-this.offset, 0],
    ];
    switch (a) {
      case 'in':
        var e = d;
        break;
      case 'out':
        e = c;
        break;
      case 'toggle':
        e = 0 == b ? d : c;
    }
    return this.parent(e[0], e[1]);
  },
  slideIn: function (a) {
    return this.start('in', a);
  },
  slideOut: function (a) {
    return this.start('out', a);
  },
  hide: function (a) {
    this[a || this.options.mode]();
    this.open = !1;
    return this.set([-this.offset, 0]);
  },
  show: function (a) {
    this[a || this.options.mode]();
    this.open = !0;
    return this.set([0, this.offset]);
  },
  toggle: function (a) {
    return this.start('toggle', a);
  },
});
Element.Properties.slide = {
  set: function (a) {
    this.get('slide').cancel().setOptions(a);
    return this;
  },
  get: function () {
    var a = this.retrieve('slide');
    a || ((a = new Fx.Slide(this, { link: 'cancel' })), this.store('slide', a));
    return a;
  },
};
Element.implement({
  slide: function (a, b) {
    a = a || 'toggle';
    var c = this.get('slide');
    switch (a) {
      case 'hide':
        c.hide(b);
        break;
      case 'show':
        c.show(b);
        break;
      case 'toggle':
        a = this.retrieve('slide:flag', c.open);
        c[a ? 'slideOut' : 'slideIn'](b);
        this.store('slide:flag', !a);
        var d = !0;
        break;
      default:
        c.start(a, b);
    }
    d || this.eliminate('slide:flag');
    return this;
  },
});
(function () {
  var a = function (a, c) {
    return a ? ('function' == typeOf(a) ? a(c) : c.get(a)) : '';
  };
  this.Tips = new Class({
    Implements: [Events, Options],
    options: {
      onShow: function () {
        this.tip.setStyle('display', 'block');
      },
      onHide: function () {
        this.tip.setStyle('display', 'none');
      },
      title: 'title',
      text: function (a) {
        return a.get('rel') || a.get('href');
      },
      showDelay: 100,
      hideDelay: 100,
      className: 'tip-wrap',
      offset: { x: 16, y: 16 },
      windowPadding: { x: 0, y: 0 },
      fixed: !1,
      waiAria: !0,
      hideEmpty: !1,
    },
    initialize: function () {
      var a = Array.link(arguments, {
        options: Type.isObject,
        elements: function (a) {
          return null != a;
        },
      });
      this.setOptions(a.options);
      a.elements && this.attach(a.elements);
      this.container = new Element('div', { class: 'tip' });
      this.options.id && (this.container.set('id', this.options.id), this.options.waiAria && this.attachWaiAria());
    },
    toElement: function () {
      return this.tip
        ? this.tip
        : (this.tip = new Element('div', {
            class: this.options.className,
            styles: { position: 'absolute', top: 0, left: 0, display: 'none' },
          }).adopt(
            new Element('div', { class: 'tip-top' }),
            this.container,
            new Element('div', { class: 'tip-bottom' })
          ));
    },
    attachWaiAria: function () {
      var a = this.options.id;
      this.container.set('role', 'tooltip');
      this.waiAria ||
        (this.waiAria = {
          show: function (b) {
            a && b.set('aria-describedby', a);
            this.container.set('aria-hidden', 'false');
          },
          hide: function (b) {
            a && b.erase('aria-describedby');
            this.container.set('aria-hidden', 'true');
          },
        });
      this.addEvents(this.waiAria);
    },
    detachWaiAria: function () {
      this.waiAria &&
        (this.container.erase('role'), this.container.erase('aria-hidden'), this.removeEvents(this.waiAria));
    },
    attach: function (b) {
      $$(b).each(function (b) {
        var c = a(this.options.title, b),
          e = a(this.options.text, b);
        b.set('title', '').store('tip:native', c).retrieve('tip:title', c);
        b.retrieve('tip:text', e);
        this.fireEvent('attach', [b]);
        c = ['enter', 'leave'];
        this.options.fixed || c.push('move');
        c.each(function (a) {
          var c = b.retrieve('tip:' + a);
          c ||
            (c = function (c) {
              this['element' + a.capitalize()].apply(this, [c, b]);
            }.bind(this));
          b.store('tip:' + a, c).addEvent('mouse' + a, c);
        }, this);
      }, this);
      return this;
    },
    detach: function (a) {
      $$(a).each(function (a) {
        ['enter', 'leave', 'move'].each(function (b) {
          a.removeEvent('mouse' + b, a.retrieve('tip:' + b)).eliminate('tip:' + b);
        });
        this.fireEvent('detach', [a]);
        if ('title' == this.options.title) {
          var b = a.retrieve('tip:native');
          b && a.set('title', b);
        }
      }, this);
      return this;
    },
    elementEnter: function (a, c) {
      clearTimeout(this.timer);
      this.timer = function () {
        this.container.empty();
        var b = !this.options.hideEmpty;
        ['title', 'text'].each(function (a) {
          var d = c.retrieve('tip:' + a);
          a = this['_' + a + 'Element'] = new Element('div', { class: 'tip-' + a }).inject(this.container);
          d && (this.fill(a, d), (b = !0));
        }, this);
        b ? this.show(c) : this.hide(c);
        this.position(this.options.fixed ? { page: c.getPosition() } : a);
      }.delay(this.options.showDelay, this);
    },
    elementLeave: function (a, c) {
      clearTimeout(this.timer);
      this.timer = this.hide.delay(this.options.hideDelay, this, c);
      this.fireForParent(a, c);
    },
    setTitle: function (a) {
      this._titleElement && (this._titleElement.empty(), this.fill(this._titleElement, a));
      return this;
    },
    setText: function (a) {
      this._textElement && (this._textElement.empty(), this.fill(this._textElement, a));
      return this;
    },
    fireForParent: function (a, c) {
      (c = c.getParent()) &&
        c != document.body &&
        (c.retrieve('tip:enter') ? c.fireEvent('mouseenter', a) : this.fireForParent(a, c));
    },
    elementMove: function (a, c) {
      this.position(a);
    },
    position: function (a) {
      this.tip || document.id(this);
      var b = window.getSize(),
        d = window.getScroll(),
        e = { x: this.tip.offsetWidth, y: this.tip.offsetHeight },
        f = { x: 'left', y: 'top' },
        k = { y: !1, x2: !1, y2: !1, x: !1 },
        h = {},
        g;
      for (g in f)
        (h[f[g]] = a.page[g] + this.options.offset[g]),
          0 > h[f[g]] && (k[g] = !0),
          h[f[g]] + e[g] - d[g] > b[g] - this.options.windowPadding[g] &&
            ((h[f[g]] = a.page[g] - this.options.offset[g] - e[g]), (k[g + '2'] = !0));
      this.fireEvent('bound', k);
      this.tip.setStyles(h);
    },
    fill: function (a, c) {
      'string' == typeof c ? a.set('html', c) : a.adopt(c);
    },
    show: function (a) {
      this.tip || document.id(this);
      this.tip.getParent() || this.tip.inject(document.body);
      this.fireEvent('show', [this.tip, a]);
    },
    hide: function (a) {
      this.tip || document.id(this);
      this.fireEvent('hide', [this.tip, a]);
    },
  });
})();
var IIPMooViewer = new Class({
  Extends: Events,
  version: '2.0',
  initialize: function (a, b) {
    this.source = a || alert('No element ID given to IIPMooViewer constructor');
    this.server = b.server || '/fcgi-bin/iipsrv.fcgi';
    this.render = b.render || 'spiral';
    this.viewport = null;
    b.viewport
      ? (this.viewport = {
          resolution: 'resolution' in b.viewport ? parseInt(b.viewport.resolution) : null,
          rotation: 'rotation' in b.viewport ? parseInt(b.viewport.rotation) : null,
          contrast: 'contrast' in b.viewport ? parseFloat(b.viewport.contrast) : null,
          x: 'x' in b.viewport ? parseFloat(b.viewport.x) : null,
          y: 'y' in b.viewport ? parseFloat(b.viewport.y) : null,
        })
      : 0 < window.location.hash.length &&
        1 != b.disableHash &&
        ((a = window.location.hash.split('#')[1].split(',')),
        3 == a.length && (this.viewport = { x: parseFloat(a[0]), y: parseFloat(a[1]), resolution: parseInt(a[2]) }));
    this.images = Array(b.image.length);
    b.image || alert('Image location not set in class constructor options');
    if ('array' == typeOf(b.image))
      for (i = 0; i < b.image.length; i++)
        this.images[i] = {
          src: b.image[i],
          sds: '0,90',
          cnt: this.viewport && null != this.viewport.contrast ? this.viewport.contrast : null,
          opacity: 0 == i ? 1 : 0,
        };
    else
      this.images = [
        {
          src: b.image,
          sds: '0,90',
          cnt: this.viewport && null != this.viewport.contrast ? this.viewport.contrast : null,
          shade: null,
        },
      ];
    this.loadoptions = b.load || null;
    this.credit = b.credit || null;
    this.scale = 'function' === typeof Scale && b.scale ? new Scale(b.scale, b.units) : null;
    this.enableFullscreen = 'native';
    'undefined' != typeof b.enableFullcreen &&
      (0 == b.enableFullcreen && (this.enableFullscreen = !1),
      'page' == b.enableFullscreen && (this.enableFullscreen = 'page'));
    this.fullscreen = null;
    0 != this.enableFullscreen &&
      (this.fullscreen = { isFullscreen: !1, targetsize: {}, eventChangeName: null, enter: null, exit: null });
    this.disableContextMenu = !0;
    this.prefix = b.prefix || 'images/';
    this.navigation = null;
    this.navOptions = b.navigation || null;
    'function' === typeof Navigation &&
      (this.navigation = new Navigation({
        showNavWindow: b.showNavWindow,
        showNavButtons: b.showNavButtons,
        navWinSize: b.navWinSize,
        showCoords: b.showCoords,
        prefix: this.prefix,
        navigation: b.navigation,
      }));
    this.winResize = 'undefined' != typeof b.winResize && 0 == b.winResize ? !1 : !0;
    switch (b.protocol) {
      case 'zoomify':
        this.protocol = new Protocols.Zoomify();
        break;
      case 'deepzoom':
        this.protocol = new Protocols.DeepZoom();
        break;
      case 'djatoka':
        this.protocol = new Protocols.Djatoka();
        break;
      case 'IIIF':
        this.protocol = new Protocols.IIIF();
        break;
      default:
        this.protocol = new Protocols.IIP();
    }
    this.preload = 1 == b.preload ? !0 : !1;
    this.effects = !1;
    this.annotations = 'function' == typeof this.initAnnotationTips && b.annotations ? b.annotations : null;
    this.click = b.click || null;
    this.max_size = {};
    this.hei = this.wid = 0;
    this.resolutions = [];
    this.num_resolutions = 0;
    this.view = { x: 0, y: 0, w: this.wid, h: this.hei, res: 0, rotation: 0 };
    this.tileSize = {};
    this.tiles = [];
    this.nTilesToLoad = this.nTilesLoaded = 0;
    this.CSSprefix = '';
    'firefox' == Browser.name
      ? (this.CSSprefix = '-moz-')
      : 'chrome' == Browser.name || 'safari' == Browser.name || 'ios' == Browser.platform
      ? (this.CSSprefix = '-webkit-')
      : 'opera' == Browser.name
      ? (this.CSSprefix = '-o-')
      : 'ie' == Browser.name && (this.CSSprefix = 'ms-');
    var c = this;
    Tips = new Class({
      Extends: Tips,
      show: function (a) {
        this.tip || document.id(this);
        this.tip.getParent() || this.tip.inject(document.id(c.source));
        this.fireEvent('show', [this.tip, a]);
      },
    });
    window.addEvent('domready', this.load.bind(this));
  },
  requestImages: function () {
    this.canvas.setStyle('cursor', 'wait');
    Browser.buggy ||
      (this.getView(),
      this.canvas.setStyle(
        this.CSSprefix + 'transform-origin',
        (this.wid > this.view.w ? Math.round(this.view.x + this.view.w / 2) : Math.round(this.wid / 2)) +
          'px ' +
          ((this.hei > this.view.h ? Math.round(this.view.y + this.view.h / 2) : Math.round(this.hei / 2)) + 'px')
      ));
    this.loadGrid();
    this.annotations &&
      (this.drawAnnotations(),
      this.annotationTip && this.annotationTip.attach(this.canvas.getChildren('div.annotation')));
  },
  loadGrid: function () {
    var a = this.preload ? 1 : 0,
      b = this.getView(),
      c = Math.floor(b.x / this.tileSize.w) - a,
      d = Math.floor(b.y / this.tileSize.h) - a;
    0 > c && (c = 0);
    0 > d && (d = 0);
    var e = Math.min(this.wid, b.w),
      f = Math.ceil((e + b.x) / this.tileSize.w - 1) + a;
    e = Math.min(this.hei, b.h);
    var k = Math.ceil((e + b.y) / this.tileSize.h - 1) + a;
    a = Math.ceil(this.wid / this.tileSize.w);
    b = Math.ceil(this.hei / this.tileSize.h);
    f = Math.min(f, a - 1);
    k = Math.min(k, b - 1);
    var h;
    var g = (b = 0);
    g = c + Math.round((f - c) / 2);
    var l = d + Math.round((k - d) / 2);
    e = Array((f - c) * (f - c));
    var m = Array((f - c) * (f - c));
    m.empty();
    var n = 0;
    for (h = d; h <= k; h++)
      for (d = c; d <= f; d++)
        (e[n] = {}),
          (e[n].n =
            'spiral' == this.render
              ? Math.abs(l - h) * Math.abs(l - h) + Math.abs(g - d) * Math.abs(g - d)
              : Math.random()),
          (e[n].x = d),
          (e[n].y = h),
          n++,
          (b = d + h * a),
          m.push(b);
    this.nTilesLoaded = 0;
    this.nTilesToLoad = n * this.images.length;
    this.canvas.get('morph').cancel();
    var t = this;
    this.canvas.getChildren('img').each(function (a) {
      var b = parseInt(a.retrieve('tile'));
      m.contains(b) || (a.destroy(), t.tiles.erase(b));
    });
    e.sort(function (a, b) {
      return a.n - b.n;
    });
    for (f = 0; f < n; f++)
      if (((d = e[f].x), (h = e[f].y), (b = d + h * a), this.tiles.contains(b)))
        (this.nTilesLoaded += this.images.length),
          this.navigation && this.navigation.refreshLoadBar(this.nTilesLoaded, this.nTilesToLoad),
          this.nTilesLoaded >= this.nTilesToLoad && this.canvas.setStyle('cursor', null);
      else
        for (g = 0; g < this.images.length; g++)
          (c = new Element('img', {
            class: 'layer' + g + ' hidden',
            styles: { left: d * this.tileSize.w, top: h * this.tileSize.h },
          })),
            this.effects && c.setStyle('opacity', 0.1),
            c.inject(this.canvas),
            (k = this.protocol.getTileURL({
              server: this.server,
              image: this.images[g].src,
              resolution: this.view.res,
              sds: this.images[g].sds || '0,90',
              contrast: this.images[g].cnt || null,
              gamma: this.images[g].gam || null,
              shade: this.images[g].shade || null,
              tileindex: b,
              x: d,
              y: h,
            })),
            c.addEvents({
              load: function (a, b) {
                this.effects && a.setStyle('opacity', 1);
                a.removeClass('hidden');
                a.width && a.height
                  ? (this.nTilesLoaded++,
                    this.navigation && this.navigation.refreshLoadBar(this.nTilesLoaded, this.nTilesToLoad),
                    this.nTilesLoaded >= this.nTilesToLoad && this.canvas.setStyle('cursor', null),
                    this.tiles.push(b))
                  : a.fireEvent('error');
              }.bind(this, c, b),
              error: function () {
                this.removeEvents('error');
                this.set('src', this.src + '?' + Date.now());
              },
            }),
            c.set('src', k),
            c.store('tile', b),
            1 !== this.images[g].opacity &&
              this.canvas.getChildren('img.layer' + g).setStyle('opacity', this.images[g].opacity);
  },
  getRegionURL: function () {
    var a = this.resolutions[this.view.res].w,
      b = this.resolutions[this.view.res].h;
    return this.protocol.getRegionURL(
      this.server,
      this.images[0].src,
      { x: this.view.x / a, y: this.view.y / b, w: this.view.w / a, h: this.view.h / b },
      a,
      b
    );
  },
  key: function (a) {
    var b = new DOMEvent(a),
      c = Math.round(this.view.w / 4);
    switch (a.code) {
      case 37:
        this.nudge(-c, 0);
        IIPMooViewer.sync && IIPMooViewer.windows(this).invoke('nudge', -c, 0);
        b.preventDefault();
        break;
      case 38:
        this.nudge(0, -c);
        IIPMooViewer.sync && IIPMooViewer.windows(this).invoke('nudge', 0, -c);
        b.preventDefault();
        break;
      case 39:
        this.nudge(c, 0);
        IIPMooViewer.sync && IIPMooViewer.windows(this).invoke('nudge', c, 0);
        b.preventDefault();
        break;
      case 40:
        this.nudge(0, c);
        IIPMooViewer.sync && IIPMooViewer.windows(this).invoke('nudge', 0, c);
        b.preventDefault();
        break;
      case 107:
        a.control ||
          (this.zoomIn(), IIPMooViewer.sync && IIPMooViewer.windows(this).invoke('zoomIn'), b.preventDefault());
        break;
      case 109:
      case 189:
        a.control ||
          (this.zoomOut(), IIPMooViewer.sync && IIPMooViewer.windows(this).invoke('zoomOut'), b.preventDefault());
        break;
      case 72:
        if (this.navOptions && this.navOptions.id) break;
        b.preventDefault();
        this.navigation && this.navigation.toggleWindow();
        this.credit && this.container.getElement('div.credit').get('reveal').toggle();
        'undefined' != this.blend_list && this.container.getElement('div.multiblend').get('reveal').toggle();
        break;
      case 82:
        if (
          this.navOptions &&
          this.navOptions.buttons &&
          !this.navOptions.buttons.contains('rotateLeft') &&
          !this.navOptions.buttons.contains('rotateRight')
        )
          break;
        b.preventDefault();
        a.control ||
          ((b = this.view.rotation),
          (b = a.shift ? b - 90 : b + 90),
          this.rotate(b),
          IIPMooViewer.sync && IIPMooViewer.windows(this).invoke('rotate', b));
        break;
      case 65:
        this.annotations && this.toggleAnnotations();
        b.preventDefault();
        break;
      case 27:
        this.fullscreen && this.fullscreen.isFullscreen && (IIPMooViewer.sync || this.toggleFullScreen());
        this.container.getElement('div.info').fade('out');
        break;
      case 70:
        IIPMooViewer.sync || this.toggleFullScreen();
        b.preventDefault();
        break;
      case 67:
        a.control &&
          prompt(
            'URL of current view:',
            window.location.href.split('#')[0] +
              '#' +
              this.view.res +
              ':' +
              (this.view.x + this.view.w / 2) / this.wid +
              ',' +
              (this.view.y + this.view.h / 2) / this.hei
          );
    }
  },
  rotate: function (a) {
    Browser.buggy ||
      ((this.view.rotation = a),
      this.canvas.setStyle(this.CSSprefix + 'transform', 'rotate(' + a + 'deg)'),
      this.constrain(),
      this.requestImages(),
      this.updateNavigation());
  },
  toggleFullScreen: function () {
    if (0 != this.enableFullscreen) {
      if (this.fullscreen.isFullscreen) {
        var a = this.fullscreen.targetsize.pos.x;
        var b = this.fullscreen.targetsize.pos.y;
        var c = this.fullscreen.targetsize.size.x;
        var d = this.fullscreen.targetsize.size.y;
        p = this.fullscreen.targetsize.position;
        this.fullscreen.exit && this.fullscreen.exit.call(document);
      } else
        (this.fullscreen.targetsize = {
          pos: { x: this.container.style.left, y: this.container.style.top },
          size: { x: this.container.style.width, y: this.container.style.height },
          position: this.container.style.position,
        }),
          (b = a = 0),
          (d = c = '100%'),
          (p = 'absolute'),
          this.fullscreen.enter && this.fullscreen.enter.call(this.container);
      this.fullscreen.enter ||
        (this.container.setStyles({ left: a, top: b, width: c, height: d, position: p }),
        (this.fullscreen.isFullscreen = !this.fullscreen.isFullscreen),
        this.fullscreen.isFullscreen
          ? this.showPopUp(IIPMooViewer.lang.exitFullscreen)
          : this.container.getElements('div.message').destroy(),
        this.reload());
    }
  },
  showPopUp: function (a) {
    var b = new Element('div', { class: 'message', html: a }).inject(this.container);
    (Browser.buggy
      ? function () {
          b.destroy();
        }
      : function () {
          b.fade('out')
            .get('tween')
            .chain(function () {
              b.destroy();
            });
        }
    ).delay(3e3);
  },
  scrollNavigation: function (a) {
    this.canvas.get('morph').cancel();
    var b = Math.round(a.x * this.wid);
    a = Math.round(a.y * this.hei);
    var c =
      Math.abs(b - this.view.x) < this.view.w / 2 &&
      Math.abs(a - this.view.y) < this.view.h / 2 &&
      0 == this.view.rotation;
    this.view.x = b;
    this.view.y = a;
    c
      ? this.canvas.morph({
          left: this.wid > this.view.w ? -b : Math.round((this.view.w - this.wid) / 2),
          top: this.hei > this.view.h ? -a : Math.round((this.view.h - this.hei) / 2),
        })
      : (this.positionCanvas(), this.requestImages());
    IIPMooViewer.sync &&
      ((b = (b + this.view.w / 2) / this.wid),
      (a = (a + this.view.h / 2) / this.hei),
      IIPMooViewer.windows(this).invoke('centerTo', b, a));
  },
  scroll: function (a) {
    var b = this.canvas.getStyle('left').toInt();
    var c = this.canvas.getStyle('top').toInt();
    var d = -b;
    a = -c;
    var e = this.view.rotation % 360;
    0 > e && (e += 360);
    90 == e
      ? ((d = this.view.x - (this.view.y + c)), (a = this.view.y + (this.view.x + b)))
      : 180 == e
      ? ((d = this.view.x + (this.view.x + b)), (a = this.view.y + (this.view.y + c)))
      : 270 == e && ((d = this.view.x + (this.view.y + c)), (a = this.view.y - (this.view.x + b)));
    this.moveTo(d, a);
    IIPMooViewer.sync &&
      ((b = (d + this.view.w / 2) / this.wid),
      (a = (a + this.view.h / 2) / this.hei),
      IIPMooViewer.windows(this).invoke('centerTo', b, a));
  },
  getView: function () {
    var a = this.view.x,
      b = this.view.y,
      c = this.view.w,
      d = this.view.h;
    90 == Math.abs(this.view.rotation % 180) &&
      ((a = Math.round(this.view.x + this.view.w / 2 - this.view.h / 2)),
      (b = Math.round(this.view.y + this.view.h / 2 - this.view.w / 2)),
      0 > a && (a = 0),
      0 > b && (b = 0),
      (c = this.view.h),
      (d = this.view.w));
    return { x: a, y: b, w: c, h: d };
  },
  checkBounds: function (a, b) {
    a > this.wid - this.view.w && (a = this.wid - this.view.w);
    b > this.hei - this.view.h && (b = this.hei - this.view.h);
    if (0 > a || this.wid < this.view.w) a = 0;
    if (0 > b || this.hei < this.view.h) b = 0;
    this.view.x = a;
    this.view.y = b;
  },
  moveTo: function (a, b) {
    if (a != this.view.x || b != this.view.y)
      this.checkBounds(a, b), this.positionCanvas(), this.requestImages(), this.updateNavigation();
  },
  centerTo: function (a, b) {
    this.moveTo(Math.round(a * this.wid - this.view.w / 2), Math.round(b * this.hei - this.view.h / 2));
  },
  nudge: function (a, b) {
    var c = a,
      d = b,
      e = this.view.rotation % 360;
    0 > e && (e += 360);
    90 == e ? ((d = -a), (c = b)) : 180 == e ? ((c = -a), (d = -b)) : 270 == e && ((c = -b), (d = a));
    0 == e
      ? (this.checkBounds(this.view.x + c, this.view.y + d),
        this.canvas.morph({
          left: this.wid > this.view.w ? -this.view.x : Math.round((this.view.w - this.wid) / 2),
          top: this.hei > this.view.h ? -this.view.y : Math.round((this.view.h - this.hei) / 2),
        }))
      : this.moveTo(this.view.x + c, this.view.y + d);
    this.updateNavigation();
  },
  zoom: function (a) {
    a = new DOMEvent(a);
    a.stop();
    var b = 1;
    b = a.wheel && 0 > a.wheel ? -1 : a.shift ? -1 : 1;
    if (!((1 == b && this.view.res >= this.num_resolutions - 1) || (-1 == b && 0 >= this.view.res))) {
      if (a.target) {
        var c = a.target.get('class');
        if (('zone' != c) & ('navimage' != c))
          (c = this.containerPosition),
            (c = { x: this.canvas.style.left.toInt() + c.x, y: this.canvas.style.top.toInt() + c.y }),
            (this.view.x = a.page.x - c.x - Math.floor(this.view.w / 2)),
            (this.view.y = a.page.y - c.y - Math.floor(this.view.h / 2));
        else {
          c = this.navigation.zone.getParent().getPosition();
          var d = this.navigation.zone.getParent().getSize(),
            e = this.navigation.zone.getSize();
          this.view.x = Math.round(((a.page.x - c.x - e.x / 2) * this.wid) / d.x);
          this.view.y = Math.round(((a.page.y - c.y - e.y / 2) * this.hei) / d.y);
        }
        if (IIPMooViewer.sync) {
          var f = (this.view.x + this.view.w / 2) / this.wid,
            k = (this.view.y + this.view.h / 2) / this.hei;
          IIPMooViewer.windows(this).each(function (a) {
            a.view.x = Math.round(f * a.wid - a.view.w / 2);
            a.view.y = Math.round(k * a.hei - a.view.h / 2);
          });
        }
      }
      -1 == b ? this.zoomOut() : this.zoomIn();
      IIPMooViewer.sync &&
        (-1 == b ? IIPMooViewer.windows(this).invoke('zoomOut') : IIPMooViewer.windows(this).invoke('zoomIn'));
    }
  },
  zoomIn: function () {
    this.view.res < this.num_resolutions - 1 && this.zoomTo(this.view.res + 1);
  },
  zoomOut: function () {
    0 < this.view.res && this.zoomTo(this.view.res - 1);
  },
  zoomTo: function (a) {
    if (a != this.view.res && a <= this.num_resolutions - 1 && 0 <= a) {
      var b = Math.pow(2, a - this.view.res);
      if (a > this.view.res) {
        var c =
          this.resolutions[this.view.res].w > this.view.w
            ? (this.view.w * (b - 1)) / 2
            : this.resolutions[a].w / 2 - this.view.w / 2;
        var d =
          this.resolutions[this.view.res].h > this.view.h
            ? (this.view.h * (b - 1)) / 2
            : this.resolutions[a].h / 2 - this.view.h / 2;
      } else (c = (-this.view.w * (1 - b)) / 2), (d = (-this.view.h * (1 - b)) / 2);
      this.view.x = Math.round(b * this.view.x + c);
      this.view.y = Math.round(b * this.view.y + d);
      this.view.res = a;
      this._zoom();
    }
  },
  _zoom: function () {
    this.wid = this.resolutions[this.view.res].w;
    this.hei = this.resolutions[this.view.res].h;
    this.view.x + this.view.w > this.wid && (this.view.x = this.wid - this.view.w);
    0 > this.view.x && (this.view.x = 0);
    this.view.y + this.view.h > this.hei && (this.view.y = this.hei - this.view.h);
    0 > this.view.y && (this.view.y = 0);
    this.positionCanvas();
    this.canvas.setStyles({ width: this.wid, height: this.hei });
    this.constrain();
    this.canvas.getChildren('img').destroy();
    this.tiles.empty();
    this.requestImages();
    this.updateNavigation();
    this.navigation && this.navigation.setCoords('');
    this.scale && this.scale.update(this.wid / this.max_size.w, this.view.w);
  },
  calculateNavSize: function () {
    var a = Math.round(this.view.w * this.navigation.options.navWinSize);
    this.max_size.w > 3 * this.max_size.h && (a = Math.round(this.view.w / 3));
    (this.max_size.h / this.max_size.w) * a > 0.4 * this.view.h &&
      (a = Math.round((0.4 * this.view.h * this.max_size.w) / this.max_size.h));
    this.navigation.size.x = a;
    this.navigation.size.y = Math.round((this.max_size.h / this.max_size.w) * a);
    if (this.navOptions && this.navOptions.id && document.id(this.navOptions.id)) {
      a = document.id(this.navOptions.id).getSize();
      if (30 > a.x) throw 'Error: Navigation container is too small!';
      this.navigation.size.x = a.x;
      this.navigation.size.y = Math.round((this.max_size.h / this.max_size.w) * a.x);
    }
  },
  updateContainerSize: function () {
    this.containerPosition = this.container.getPosition();
    var a = this.container.getSize();
    this.view.w = a.x;
    this.view.h = a.y;
  },
  calculateSizes: function () {
    this.updateContainerSize();
    this.navigation && this.calculateNavSize();
    this.view.res = this.num_resolutions;
    var a = this.max_size.w,
      b = this.max_size.h;
    if ('undefined' == typeof this.resolutions) {
      this.resolutions = Array(this.num_resolutions);
      this.resolutions.push({ w: a, h: b });
      for (var c = 1; c < this.num_resolutions; c++)
        (a = Math.floor(a / 2)), (b = Math.floor(b / 2)), this.resolutions.push({ w: a, h: b });
      this.resolutions.reverse();
    }
    this.view.res = 0;
    for (c = this.num_resolutions - 1; 0 < c; c--)
      if (((a = this.resolutions[c].w), (b = this.resolutions[c].h), a < this.view.w && b < this.view.h)) {
        this.view.res = c;
        break;
      }
    0 > this.view.res && (this.view.res = 0);
    this.view.res >= this.num_resolutions && (this.view.res = this.num_resolutions - 1);
    this.wid = this.resolutions[this.view.res].w;
    this.hei = this.resolutions[this.view.res].h;
    this.scale && this.scale.calculateDefault(this.max_size.w);
  },
  setCredit: function (a) {
    this.container.getElement('div.credit').set('html', a);
  },
  createWindows: function () {
    this.container = document.id(this.source);
    this.container.addClass('iipmooviewer');
    var a = this;
    'native' == this.enableFullscreen &&
      (document.documentElement.requestFullscreen
        ? ((this.fullscreen.eventChangeName = 'fullscreenchange'),
          (this.fullscreen.enter = this.container.requestFullscreen),
          (this.fullscreen.exit = document.cancelFullScreen))
        : document.mozCancelFullScreen
        ? ((this.fullscreen.eventChangeName = 'mozfullscreenchange'),
          (this.fullscreen.enter = this.container.mozRequestFullScreen),
          (this.fullscreen.exit = document.mozCancelFullScreen))
        : document.webkitCancelFullScreen &&
          ((this.fullscreen.eventChangeName = 'webkitfullscreenchange'),
          (this.fullscreen.enter = this.container.webkitRequestFullScreen),
          (this.fullscreen.exit = document.webkitCancelFullScreen)),
      this.fullscreen.enter
        ? document.addEventListener(this.fullscreen.eventChangeName, function () {
            a.fullscreen.isFullscreen = !a.fullscreen.isFullscreen;
          })
        : '100%' == this.container.getStyle('width') &&
          '100%' == this.container.getStyle('height') &&
          (this.enableFullscreen = !1));
    new Element('div', {
      class: 'info',
      styles: { opacity: 0 },
      events: {
        click: function () {
          this.fade('out');
        },
      },
      html:
        '<div><div><h2><a href="http://iipimage.sourceforge.net"><img src="' +
        this.prefix +
        'iip.32x32.png"/></a>IIPMooViewer</h2>IIPImage HTML5 High Resolution Image Viewer - Version ' +
        this.version +
        '<br/><ul><li>' +
        IIPMooViewer.lang.navigate +
        '</li><li>' +
        IIPMooViewer.lang.zoomIn +
        '</li><li>' +
        IIPMooViewer.lang.zoomOut +
        '</li><li>' +
        IIPMooViewer.lang.rotate +
        '</li><li>' +
        IIPMooViewer.lang.fullscreen +
        '<li>' +
        IIPMooViewer.lang.annotations +
        '</li><li>' +
        IIPMooViewer.lang.navigation +
        '</li></ul><br/>' +
        IIPMooViewer.lang.more +
        ' <a href="http://iipimage.sourceforge.net">http://iipimage.sourceforge.net</a></div></div>',
    }).inject(this.container);
    this.canvas = new Element('div', {
      class: 'canvas',
      morph: {
        transition: Fx.Transitions.Quad.easeInOut,
        onComplete: function () {
          a.requestImages();
        },
      },
    });
    ('ontouchstart' in window || navigator.msMaxTouchPoints) && this.addTouchEvents();
    var b = this.updateCoords.bind(this);
    this.touch = new Drag(this.canvas, {
      onStart: function () {
        a.canvas.addClass('drag');
        a.canvas.removeEvent('mousemove:throttle(75)', b);
      },
      onComplete: function () {
        a.scroll();
        a.canvas.removeClass('drag');
        a.canvas.addEvent('mousemove:throttle(75)', b);
      },
    });
    this.canvas.inject(this.container);
    this.canvas.addEvents({
      'mousewheel:throttle(75)': this.zoom.bind(this),
      dblclick: this.zoom.bind(this),
      mousedown: function (a) {
        new DOMEvent(a).stop();
      },
      'mousemove:throttle(75)': b,
      mouseenter: function () {
        a.navigation && a.navigation.coords && a.navigation.coords.fade(0.65);
      },
      mouseleave: function () {
        a.navigation && a.navigation.coords && a.navigation.coords.fade('out');
      },
    });
    this.annotations && this.initAnnotationTips();
    this.disableContextMenu &&
      this.container.addEvent('contextmenu', function (b) {
        new DOMEvent(b).stop();
        a.container.getElement('div.info').fade(0.95);
        return !1;
      });
    if (this.click) {
      var c = this.click.bind(this);
      this.canvas.addEvent('mouseup', c);
      this.touch &&
        this.touch.addEvents({
          start: function (b) {
            a.canvas.removeEvents('mouseup');
          },
          complete: function (b) {
            a.canvas.addEvent('mouseup', c);
          },
        });
    }
    var d = this.key.bind(this);
    this.container.addEvents({
      mouseenter: function () {
        document.addEvent('keydown', d);
      },
      mouseleave: function () {
        document.removeEvent('keydown', d);
      },
      mousewheel: function (a) {
        a.preventDefault();
      },
    });
    new Element('img', {
      src: this.prefix + 'iip.32x32.png',
      class: 'logo',
      title: IIPMooViewer.lang.tooltips.help,
      events: {
        click: function () {
          a.container.getElement('div.info').fade(0.95);
        },
        mousedown: function (a) {
          new DOMEvent(a).stop();
        },
      },
    }).inject(this.container);
    'ios' == Browser.platform && window.navigator.standalone && this.container.addClass('standalone');
    this.credit && new Element('div', { class: 'credit', html: this.credit }).inject(this.container);
    this.scale && this.scale.create(this.container);
    this.calculateSizes();
    this.navigation &&
      (this.navOptions && this.navOptions.id && document.id(this.navOptions.id)
        ? this.navigation.create(document.id(this.navOptions.id))
        : this.navigation.create(this.container),
      this.navigation.setImage(this.protocol.getThumbnailURL(this.server, this.images[0].src, this.navigation.size.x)),
      this.navigation.addEvents({
        rotate: function (b) {
          b = a.view.rotation + b;
          a.rotate(b);
          IIPMooViewer.sync && IIPMooViewer.windows(a).invoke('rotate', b);
        },
        zoomIn: function () {
          a.zoomIn();
          IIPMooViewer.sync && IIPMooViewer.windows(a).invoke('zoomIn');
        },
        zoomOut: function () {
          a.zoomOut();
          IIPMooViewer.sync && IIPMooViewer.windows(a).invoke('zoomOut');
        },
        reload: function () {
          a.reload();
          IIPMooViewer.sync && IIPMooViewer.windows(a).invoke('reload');
        },
        scroll: this.scrollNavigation.bind(this),
        zoom: this.zoom.bind(this),
        print: this.print.bind(this),
      }));
    if ('ios' != Browser.platform && 'android' != Browser.platform) {
      var e = 'img.logo, div.toolbar, div.scale';
      'ie' != Browser.name || (8 != Browser.version && 7 != Browser.version) || (e = 'img.logo, div.toolbar');
      new Tips(e, {
        className: 'tip',
        onShow: function (a, b) {
          a.setStyles({ opacity: 0, display: 'block' }).fade(0.9);
        },
        onHide: function (a, b) {
          a.fade('out')
            .get('tween')
            .chain(function () {
              a.setStyle('display', 'none');
            });
        },
      });
    }
    this.viewport &&
      'resolution' in this.viewport &&
      'undefined' == typeof this.resolutions[this.viewport.resolution] &&
      (this.viewport.resolution = null);
    this.viewport &&
      null != this.viewport.resolution &&
      ((this.view.res = this.viewport.resolution),
      (this.wid = this.resolutions[this.view.res].w),
      (this.hei = this.resolutions[this.view.res].h),
      this.touch && (this.touch.options.limit = { x: [this.view.w - this.wid, 0], y: [this.view.h - this.hei, 0] }));
    this.viewport && null != this.viewport.x && null != this.viewport.y
      ? this.centerTo(this.viewport.x, this.viewport.y)
      : this.recenter();
    this.canvas.setStyles({ width: this.wid, height: this.hei });
    this.requestImages();
    this.updateNavigation();
    this.scale && this.scale.update(this.wid / this.max_size.w, this.view.w);
    this.viewport && null != this.viewport.rotation && this.rotate(this.viewport.rotation);
    'onhashchange' in window &&
      window.addEvent('hashchange', function () {
        var b = window.location.hash.split('#')[1].split(':');
        a.zoomTo(parseInt(b[0]));
        b = b.split(',');
        a.centerTo(parseFloat(b[0]), parseFloat(b[1]));
      });
    this.winResize && window.addEvent('resize', this.reflow.bind(this));
    this.fireEvent('load');
  },
  updateCoords: function (a) {
    this.navigation &&
      this.navigation.coords &&
      ((a = this.transformCoords(
        (a.page.x -
          this.containerPosition.x +
          this.view.x -
          (this.wid < this.view.w ? Math.round((this.view.w - this.wid) / 2) : 0)) /
          this.wid,
        (a.page.y -
          this.containerPosition.y +
          this.view.y -
          (this.hei < this.view.h ? Math.round((this.view.h - this.hei) / 2) : 0)) /
          this.hei
      )),
      this.navigation.setCoords(a));
  },
  transformCoords: function (a, b) {
    return this.scale
      ? Math.round((a * this.max_size.w) / this.scale.pixelscale) +
          this.scale.units.dims[this.scale.defaultUnit] +
          ', ' +
          Math.round((b * this.max_size.h) / this.scale.pixelscale) +
          this.scale.units.dims[this.scale.defaultUnit]
      : Math.round(a * this.wid) + 'px, ' + Math.round(b * this.hei) + 'px';
  },
  changeImage: function (a) {
    this.images = [
      { src: a, sds: '0,90', cnt: this.viewport && null != this.viewport.contrast ? this.viewport.contrast : null },
    ];
    new Request({
      method: 'get',
      url: this.protocol.getMetaDataURL(this.server, this.images[0].src),
      onComplete: function (b) {
        b = b || alert('Error: No response from server ' + this.server);
        b = this.protocol.parseMetaData(b);
        this.max_size = b.max_size;
        this.tileSize = b.tileSize;
        this.num_resolutions = b.num_resolutions;
        'undefined' != typeof this.resolutions && (this.resolutions = b.resolutions);
        this.reload();
        this.navigation &&
          this.navigation.setImage(this.protocol.getThumbnailURL(this.server, a, this.navigation.size.x));
        this.fireEvent('imageChanged');
      }.bind(this),
      onFailure: function () {
        alert('Error: Unable to get image metadata from server!');
      },
    }).send();
  },
  load: function () {
    this.loadoptions
      ? ((this.max_size = this.loadoptions.size),
        (this.tileSize = this.loadoptions.tiles),
        (this.num_resolutions = this.loadoptions.resolutions),
        this.createWindows())
      : new Request({
          method: 'get',
          url: this.protocol.getMetaDataURL(this.server, this.images[0].src),
          onComplete: function (a) {
            a = a || alert('Error: No response from server ' + this.server);
            a = this.protocol.parseMetaData(a) || alert('Error: Unexpected response from server ' + this.server);
            this.max_size = a.max_size;
            this.tileSize = a.tileSize;
            this.num_resolutions = a.num_resolutions;
            'undefined' != typeof this.resolutions && (this.resolutions = a.resolutions);
            this.createWindows();
          }.bind(this),
          onFailure: function () {
            alert('Error: Unable to get image metadata from server!');
          },
        }).send();
  },
  reflow: function () {
    this.updateContainerSize();
    this.positionCanvas();
    this.navigation && (this.calculateNavSize(), this.navigation.reflow(this.container));
    this.scale && (this.scale.update(this.wid / this.max_size.w, this.view.w), this.scale.reflow(this.container));
    this.requestImages();
    this.updateNavigation();
    this.constrain();
  },
  reload: function () {
    this.canvas.get('morph').cancel();
    this.canvas.getChildren('img').destroy();
    this.tiles.empty();
    this.calculateSizes();
    this.viewport &&
      null != this.viewport.resolution &&
      ((this.view.res = this.viewport.resolution),
      (this.wid = this.resolutions[this.view.res].w),
      (this.hei = this.resolutions[this.view.res].h),
      this.touch && (this.touch.options.limit = { x: [this.view.w - this.wid, 0], y: [this.view.h - this.hei, 0] }));
    this.viewport && null != this.viewport.x && null != this.viewport.y
      ? this.centerTo(this.viewport.x, this.viewport.y)
      : this.recenter();
    'function' === typeof Scale &&
      this.viewport &&
      null != this.viewport.scale &&
      !this.scale &&
      (this.scale = new Scale(this.viewport.scale));
    this.canvas.setStyles({ width: this.wid, height: this.hei });
    this.reflow();
    this.viewport && null != this.viewport.rotation ? this.rotate(this.viewport.rotation) : this.rotate(0);
  },
  recenter: function () {
    var a = Math.round((this.wid - this.view.w) / 2);
    this.view.x = 0 > a ? 0 : a;
    a = Math.round((this.hei - this.view.h) / 2);
    this.view.y = 0 > a ? 0 : a;
    this.positionCanvas();
    this.constrain();
  },
  constrain: function () {
    var a =
        this.wid < this.view.w
          ? [Math.round((this.view.w - this.wid) / 2), Math.round((this.view.w - this.wid) / 2)]
          : [this.view.w - this.wid, 0],
      b =
        this.hei < this.view.h
          ? [Math.round((this.view.h - this.hei) / 2), Math.round((this.view.h - this.hei) / 2)]
          : [this.view.h - this.hei, 0];
    this.touch && (this.touch.options.limit = { x: a, y: b });
  },
  positionCanvas: function () {
    this.canvas.setStyles({
      left: this.wid > this.view.w ? -this.view.x : Math.round((this.view.w - this.wid) / 2),
      top: this.hei > this.view.h ? -this.view.y : Math.round((this.view.h - this.hei) / 2),
    });
  },
  updateNavigation: function () {
    if (this.navigation) {
      var a = this.getView();
      this.navigation.update(a.x / this.wid, a.y / this.hei, a.w / this.wid, a.h / this.hei);
    }
  },
  toggleNavigationWindow: function () {
    this.navigation && this.navigation.toggleWindow();
  },
  print: function () {
    var a = this.resolutions[this.view.res].w,
      b = this.resolutions[this.view.res].h;
    a = this.protocol.getRegionURL(
      this.server,
      this.images[0].src,
      { x: this.view.x / a, y: this.view.y / b, w: this.view.w / a, h: this.view.h / b },
      1280,
      1754
    );
    window.open(a, '_blank').addEventListener('load', function () {
      this.focus();
      this.print();
      this.close();
    });
  },
});
IIPMooViewer.synchronize = function (a) {
  this.sync = a;
};
IIPMooViewer.windows = function (a) {
  return this.sync && this.sync.contains(a)
    ? this.sync.filter(function (b) {
        return b != a;
      })
    : [];
};
Browser.buggy = 'ie' == Browser.name && (!Browser.version || 9 > Browser.version);
Element.NativeEvents.hashchange = 1;
if ('undefined' === typeof Protocols) var Protocols = {};
var Navigation = new Class({
  Extends: Events,
  options: {},
  position: { x: 0, y: 0 },
  size: { x: 0, y: 0 },
  initialize: function (a) {
    this.options.showNavWindow = 0 == a.showNavWindow ? !1 : !0;
    this.options.showNavButtons = 0 == a.showNavButtons ? !1 : !0;
    this.options.navWinSize = a.navWinSize || 0.2;
    this.options.showCoords = 1 == a.showCoords ? !0 : !1;
    this.prefix = a.prefix;
    this.standalone = a.navigation && a.navigation.id && document.id(a.navigation.id) ? !0 : !1;
    this.options.navButtons = (a.navigation && a.navigation.buttons) || ['reset', 'zoomIn', 'zoomOut'];
  },
  create: function (a) {
    if (this.options.showNavWindow || this.options.showNavButtons) {
      this.navcontainer = new Element('div', {
        class: 'navcontainer',
        styles: { width: this.size.x, position: this.standalone ? 'static' : 'absolute' },
      });
      if (!this.standalone) {
        var b = new Element('div', {
          class: 'toolbar',
          events: {
            dblclick: function (a) {
              a.getElement('div.navbuttons').get('slide').toggle();
            }.pass(a),
          },
        });
        b.store('tip:text', IIPMooViewer.lang.drag);
        b.inject(this.navcontainer);
      }
      if (this.options.showNavWindow) {
        var c = new Element('div', { class: 'navwin', styles: { height: this.size.y } });
        c.inject(this.navcontainer);
        new Element('img', {
          class: 'navimage',
          events: {
            click: this.scroll.bind(this),
            'mousewheel:throttle(75)': function (a) {
              f.fireEvent('zoom', a);
            },
            mousedown: function (a) {
              new DOMEvent(a).stop();
            },
          },
        }).inject(c);
        this.zone = new Element('div', {
          class: 'zone',
          morph: { duration: 500, transition: Fx.Transitions.Quad.easeInOut },
          events: {
            'mousewheel:throttle(75)': function (a) {
              f.fireEvent('zoom', a);
            },
            dblclick: function (a) {
              f.fireEvent('zoom', a);
            },
          },
          styles: { width: 0, height: 0 },
        });
        this.zone.inject(c);
        this.options.showCoords &&
          ((this.coords = new Element('div', {
            class: 'coords',
            html: '<div></div>',
            styles: { top: this.size.y - 6, opacity: 0.8 },
            tween: { duration: 1e3, transition: Fx.Transitions.Sine.easeOut, link: 'cancel' },
          })),
          this.coords.inject(this.navcontainer));
      }
      if (this.options.showNavButtons) {
        var d = new Element('div', { class: 'navbuttons' }),
          e = this.prefix;
        this.options.navButtons.each(function (a) {
          new Element('img', {
            src: e + a + (Browser.buggy ? '.png' : '.svg'),
            class: a,
            title: IIPMooViewer.lang.tooltips[a],
            events: {
              error: function () {
                this.removeEvents('error');
                this.src = this.src.replace('.svg', '.png');
              },
            },
          }).inject(d);
        });
        d.inject(this.navcontainer);
        d.set('slide', { duration: 300, transition: Fx.Transitions.Quad.easeInOut, mode: 'vertical' });
        var f = this;
        this.options.navButtons.contains('reset') &&
          d.getElement('img.reset').addEvent('click', function () {
            f.fireEvent('reload');
          });
        this.options.navButtons.contains('zoomIn') &&
          d.getElement('img.zoomIn').addEvent('click', function () {
            f.fireEvent('zoomIn');
          });
        this.options.navButtons.contains('zoomOut') &&
          d.getElement('img.zoomOut').addEvent('click', function () {
            f.fireEvent('zoomOut');
          });
        this.options.navButtons.contains('rotateLeft') &&
          d.getElement('img.rotateLeft').addEvent('click', function () {
            f.fireEvent('rotate', -90);
          });
        this.options.navButtons.contains('rotateRight') &&
          d.getElement('img.rotateRight').addEvent('click', function () {
            f.fireEvent('rotate', 90);
          });
        this.options.navButtons.contains('print') &&
          d.getElement('img.print').addEvent('click', function () {
            f.fireEvent('print');
          });
      }
      this.options.showNavWindow &&
        new Element('div', {
          class: 'loadBarContainer',
          html: '<div class="loadBar"></div>',
          styles: { width: this.size.x - 2 },
          tween: { duration: 1e3, transition: Fx.Transitions.Sine.easeOut, link: 'cancel' },
        }).inject(this.navcontainer);
      this.navcontainer.inject(a);
      this.options.showNavWindow &&
        this.zone.makeDraggable({
          container: this.navcontainer.getElement('div.navwin'),
          onStart: function () {
            var a = f.zone.getPosition();
            f.position = { x: a.x, y: a.y - 10 };
            f.zone.get('morph').cancel();
          },
          onComplete: this.scroll.bind(this),
        });
      this.standalone || this.navcontainer.makeDraggable({ container: a, handle: b });
    }
  },
  toggleWindow: function () {
    this.navcontainer && this.navcontainer.get('reveal').toggle();
  },
  refreshLoadBar: function (a, b) {
    if (this.options.showNavWindow) {
      var c = (a / b) * this.size.x,
        d = this.navcontainer.getElement('div.loadBarContainer'),
        e = d.getElement('div.loadBar');
      e.setStyle('width', c);
      e.set('html', IIPMooViewer.lang.loading + '&nbsp;:&nbsp;' + Math.round((a / b) * 100) + '%');
      '0.85' != d.style.opacity && d.setStyles({ visibility: 'visible', opacity: 0.85 });
      a >= b && d.fade('out');
    }
  },
  reflow: function (a) {
    a.getElements('div.navcontainer, div.navcontainer div.loadBarContainer').setStyle('width', this.size.x);
    this.options.showNavWindow &&
      (this.navcontainer && this.navcontainer.setStyle('left', a.getPosition(a).x + a.getSize().x - this.size.x - 10),
      this.zone && this.zone.getParent().setStyle('height', this.size.y),
      this.options.showCoords && this.coords.setStyle('top', this.size.y - 6));
  },
  setImage: function (a) {
    this.navcontainer &&
      this.navcontainer.getElement('img.navimage') &&
      (this.navcontainer.getElement('img.navimage').src = a);
  },
  setCoords: function (a) {
    this.coords && this.coords.getElement('div').set('html', a);
  },
  scroll: function (a) {
    this.zone.get('morph').cancel();
    var b = this.zone.getSize();
    var c = b.x,
      d = b.y;
    if (a.event) {
      a.stop();
      var e = this.zone.getParent().getPosition();
      b = a.page.x - e.x - Math.floor(c / 2);
      e = a.page.y - e.y - Math.floor(d / 2);
    } else if (
      ((b = a.offsetLeft),
      (e = a.offsetTop - 10),
      3 > Math.abs(b - this.position.x) && 3 > Math.abs(e - this.position.y))
    )
      return;
    b > this.size.x - c && (b = this.size.x - c);
    e > this.size.y - d && (e = this.size.y - d);
    0 > b && (b = 0);
    0 > e && (e = 0);
    b /= this.size.x;
    e /= this.size.y;
    this.fireEvent('scroll', { x: b, y: e });
    a.event && this.update(b, e, c / this.size.x, d / this.size.y);
  },
  update: function (a, b, c, d) {
    if (this.options.showNavWindow) {
      a *= this.size.x;
      a > this.size.x && (a = this.size.x);
      0 > a && (a = 0);
      b *= this.size.y;
      b > this.size.y && (b = this.size.y);
      0 > b && (b = 0);
      c *= this.size.x;
      a + c > this.size.x && (c = this.size.x - a);
      d *= this.size.y;
      d + b > this.size.y && (d = this.size.y - b);
      var e = this.zone.offsetHeight - this.zone.clientHeight;
      this.zone.morph({
        fps: 30,
        left: a,
        top: this.standalone ? b : b + 8,
        width: 0 < c - e ? c - e : 1,
        height: 0 < d - e ? d - e : 1,
      });
    }
  },
});
var Scale = new Class({
  initialize: function (a, b) {
    this.pixelscale = a;
    this.units = {
      dims: 'pm nm &#181;m mm cm m km'.split(' '),
      orders: [1e-12, 1e-9, 1e-6, 0.001, 0.01, 1, 1e3],
      mults: [1, 2, 5, 10, 50, 100],
      factor: 1e3,
    };
    b &&
      (0 == instanceOf(b, String)
        ? (this.units = b)
        : 'degrees' == b &&
          (this.units = {
            dims: ["''", "'", '&deg'],
            orders: [1 / 3600, 1 / 60, 1],
            mults: [1, 10, 15, 30],
            factor: 3600,
          }));
  },
  create: function (a) {
    this.scale = new Element('div', {
      class: 'scale',
      title: IIPMooViewer.lang.scale,
      html: '<div class="ruler"></div><div class="label"></div>',
    }).inject(a);
    this.scale.makeDraggable({ container: a });
    this.scale.getElement('div.ruler').set('tween', { transition: Fx.Transitions.Quad.easeInOut });
  },
  update: function (a, b) {
    a *= this.units.factor * this.pixelscale;
    var c;
    var d = 0;
    a: for (; d < this.units.orders.length; d++)
      for (c = 0; c < this.units.mults.length; c++)
        if (this.units.orders[d] * this.units.mults[c] * a > b / 20) break a;
    d >= this.units.orders.length && (d = this.units.orders.length - 1);
    c >= this.units.mults.length && (c = this.units.mults.length - 1);
    b = this.units.mults[c] + this.units.dims[d];
    a = a * this.units.orders[d] * this.units.mults[c] - 4;
    this.scale.getElement('div.ruler').tween('width', a);
    this.scale.getElement('div.label').set('html', b);
  },
  calculateDefault: function (a) {
    for (
      var b = 0;
      b < this.units.orders.length && !(1e3 > a / (this.units.orders[b] * this.units.factor * this.pixelscale));
      b++
    );
    this.defaultUnit = b;
  },
  reflow: function (a) {
    a = a.getSize().y - a.getElement('div.scale').getSize().y - 10;
    this.scale.setStyles({ left: 10, top: a });
  },
});
IIPMooViewer.implement({
  addTouchEvents: function () {
    if ('ontouchstart' in window || navigator.msMaxTouchPoints) {
      var a = this;
      this.container.addEvent('touchmove', function (a) {
        a.preventDefault();
      });
      document.body.addEvents({
        touchmove: function (a) {
          a.preventDefault();
        },
        orientationchange: function () {
          a.container.setStyles({ width: '100%', height: '100%' });
          this.reflow.delay(500, this);
        }.bind(this),
      });
      this.canvas.addEvents({
        touchstart: function (b) {
          a.touch.detach();
          b.preventDefault();
          a.touchend = null;
          if (1 == b.touches.length) {
            var c = a.canvas.retrieve('taptime') || 0,
              d = Date.now();
            a.canvas.store('taptime', d);
            a.canvas.store('tapstart', 1);
            250 > d - c
              ? (a.canvas.eliminate('taptime'),
                a.zoomIn(),
                IIPMooViewer.sync && IIPMooViewer.windows(a).invoke('zoomIn'))
              : ((a.touchstart = { x: b.touches[0].pageX, y: b.touches[0].pageY }), a.canvas.addClass('drag'));
          } else
            2 == b.touches.length &&
              (a.canvas.store('gesturestart', 1),
              (a.touchstart = [
                { x: b.touches[0].pageX, y: b.touches[0].pageY },
                { x: b.touches[1].pageX, y: b.touches[1].pageY },
              ]),
              a.canvas.setStyle(a.CSSprefix + 'transform', 'translateZ(0,0,0)'));
        },
        touchmove: function (b) {
          if (1 == b.touches.length) {
            a.touchend = { x: b.touches[0].pageX, y: b.touches[0].pageY };
            var c = a.touchend.x - a.touchstart.x,
              d = a.touchend.y - a.touchstart.y;
            c = a.view.x - c;
            d = a.view.y - d;
            c > a.wid - a.view.w && (a.touchend.x = a.touchstart.x - a.wid + a.view.w + a.view.x);
            d > a.hei - a.view.h && (a.touchend.y = a.touchstart.y - a.hei + a.view.h + a.view.y);
            0 > c && (a.touchend.x = a.touchstart.x + a.view.x);
            0 > d && (a.touchend.y = a.touchstart.y + a.view.y);
            c = a.wid > a.view.w ? a.touchend.x - a.touchstart.x : 0;
            d = a.hei > a.view.h ? a.touchend.y - a.touchstart.y : 0;
            a.canvas.setStyle(a.CSSprefix + 'transform', 'translate3d(' + c + 'px,' + d + 'px, 0 )');
          }
          2 == b.touches.length &&
            ((a.touchend = [
              { x: b.touches[0].pageX, y: b.touches[0].pageY },
              { x: b.touches[1].pageX, y: b.touches[1].pageY },
            ]),
            a.canvas.setStyle(
              this.CSSprefix + 'transform-origin',
              Math.round((b.touches[0].pageX + b.touches[1].pageX) / 2) +
                a.view.x +
                'px,' +
                (Math.round((b.touches[0].pageY + b.touches[1].pageY) / 2) + a.view.y) +
                'px'
            ));
        },
        touchend: function (b) {
          a.touch.attach();
          if (1 == a.canvas.retrieve('gesturestart')) {
            a.canvas.removeClass('drag');
            a.canvas.eliminate('tapstart');
            a.canvas.eliminate('gesturestart');
            b =
              (a.touchend[1].x - a.touchend[0].x) * (a.touchend[1].x - a.touchend[0].x) +
              (a.touchend[1].y - a.touchend[0].y) * (a.touchend[1].y - a.touchend[0].y) -
              ((a.touchstart[1].x - a.touchstart[0].x) * (a.touchstart[1].x - a.touchstart[0].x) +
                (a.touchstart[1].y - a.touchstart[0].y) * (a.touchstart[1].y - a.touchstart[0].y));
            if (2e4 < Math.abs(b))
              0 < b
                ? (a.zoomIn(), IIPMooViewer.sync && IIPMooViewer.windows(a).invoke('zoomIn'))
                : 0 > b && (a.zoomOut(), IIPMooViewer.sync && IIPMooViewer.windows(a).invoke('zoomOut'));
            else if (
              ((b =
                (180 * Math.atan2(a.touchend[1].y - a.touchend[0].y, a.touchend[1].x - a.touchend[0].x)) / Math.PI -
                (180 * Math.atan2(a.touchstart[1].y - a.touchstart[0].y, a.touchstart[1].x - a.touchstart[0].x)) /
                  Math.PI),
              25 < Math.abs(b))
            ) {
              var c = a.view.rotation;
              c = 0 < b ? c + 90 : c - 90;
              a.rotate(c);
              IIPMooViewer.sync && IIPMooViewer.windows(a).invoke('rotate', c);
            }
            a.touchend = null;
          } else
            1 == a.canvas.retrieve('tapstart') &&
              a.touchend &&
              (a.canvas.eliminate('tapstart'),
              (a.view.x -= a.touchend.x - a.touchstart.x),
              (a.view.y -= a.touchend.y - a.touchstart.y),
              (a.touchend = null),
              a.view.x > a.wid - a.view.w && (a.view.x = a.wid - a.view.w),
              a.view.y > a.hei - a.view.h && (a.view.y = a.hei - a.view.h),
              0 > a.view.x && (a.view.x = 0),
              0 > a.view.y && (a.view.y = 0),
              a.canvas.setStyle(a.CSSprefix + 'transform', 'none'),
              a.canvas.setStyles({
                left: a.wid > a.view.w ? -a.view.x : Math.round((a.view.w - a.wid) / 2),
                top: a.hei > a.view.h ? -a.view.y : Math.round((a.view.h - a.hei) / 2),
              }),
              a.requestImages(),
              a.navigation &&
                a.navigation.update(a.view.x / a.wid, a.view.y / a.hei, a.view.w / a.wid, a.view.h / a.hei),
              IIPMooViewer.sync && IIPMooViewer.windows(a).invoke('moveTo', a.view.x, a.view.y),
              a.canvas.setStyle(a.CSSprefix + 'transform', 'translateZ(0)'),
              a.canvas.removeClass('drag'));
        },
      });
    }
  },
});
Protocols.IIP = new Class({
  getMetaDataURL: function (a, b) {
    a = a + '?FIF=' + b + '&obj=IIP,1.0&obj=Max-size&obj=Tile-size&obj=Resolution-number';
    this.ask_resolutions && (a += '&obj=Resolutions');
    return a;
  },
  getTileURL: function (a) {
    var b = Array('?FIF=' + a.image);
    a.contrast && b.push('CNT=' + a.contrast);
    a.sds && b.push('SDS=' + a.sds);
    a.rotation && b.push('ROT=' + a.rotation);
    a.gamma && b.push('GAM=' + a.gamma);
    a.shade && b.push('SHD=' + a.shade + ',30');
    b.push('JTL=' + a.resolution + ',' + a.tileindex);
    return a.server + b.join('&');
  },
  parseMetaData: function (a) {
    var b = a.split('Max-size');
    if (!b[1]) return null;
    var c = b[1].split(' '),
      d = { w: parseInt(c[0].substring(1, c[0].length)), h: parseInt(c[1]) };
    b = a.split('Tile-size');
    if (!b[1]) return null;
    c = b[1].split(' ');
    var e = { w: parseInt(c[0].substring(1, c[0].length)), h: parseInt(c[1]) };
    b = a.split('Resolution-number');
    c = parseInt(b[1].substring(1, b[1].length));
    d = { max_size: d, tileSize: e, num_resolutions: c };
    if (this.ask_resolutions) {
      b = a.split('Resolutions');
      b = b[1].substring(1, b[1].length);
      a = b.split(',');
      b = [];
      for (e = 0; e < a.length; e++) {
        var f = a[e].split(' ');
        b.push({ w: parseInt(f[0]), h: parseInt(f[1]) });
      }
      b.length == c && (d.resolutions = b);
    }
    return d;
  },
  getRegionURL: function (a, b, c, d, e) {
    c = c.x + ',' + c.y + ',' + c.w + ',' + c.h;
    var f = '';
    d && (f += '&WID=' + d);
    e && (f += '&HEI=' + e);
    return a + '?FIF=' + b + f + '&RGN=' + c + '&CVT=jpeg';
  },
  getThumbnailURL: function (a, b, c) {
    return a + '?FIF=' + b + '&WID=' + c + '&QLT=98&CVT=jpeg';
  },
});
IIPMooViewer.implement({
  initAnnotationTips: function () {
    this.annotationTip = null;
    this.annotationsVisible = !0;
    this.createAnnotationsArray();
    var a = this;
    this.canvas.addEvent('mouseenter', function () {
      a.annotationsVisible && a.canvas.getElements('div.annotation').removeClass('hidden');
    });
    this.canvas.addEvent('mouseleave', function () {
      a.annotationsVisible && a.canvas.getElements('div.annotation').addClass('hidden');
    });
  },
  createAnnotationsArray: function () {
    var a = [];
    Object.each(this.annotations, function (b, c) {
      b.id = c;
      a.push(b);
    });
    a.sort(function (a, c) {
      return c.w * c.h - a.w * a.h;
    });
    this.annotation_array = a;
  },
  drawAnnotations: function () {
    if (this.annotations) {
      for (var a, b = 0, c = this.annotation_array.length; b < c; b++) {
        a = this.annotation_array[b];
        var d = {
            left: Math.round(this.wid * a.x),
            top: Math.round(this.hei * a.y),
            width: Math.round(this.wid * a.w),
            height: Math.round(this.hei * a.h),
          },
          e = $('annotation-' + a.id);
        e ? e.setStyles(d) : this.initAnnotation(a, d);
      }
      this.annotationTip || (this.annotationTip = this.createAnnotationsTips());
    }
  },
  initAnnotation: function (a, b) {
    var c = 'annotation';
    a.category && (c += ' ' + a.category);
    b = new Element('div', { id: 'annotation-' + a.id, class: c, styles: b }).inject(this.canvas);
    this.annotationsVisible || b.addClass('hidden');
    if ('function' == typeof this.editAnnotation) {
      var d = this;
      b.addEvent('dblclick', function (a) {
        new DOMEvent(a).stop();
        d.editAnnotation(this);
      });
    }
    c = a.text;
    a.title && (c = '<h1>' + a.title + '</h1>' + c);
    b.store('tip:text', c);
  },
  createAnnotationsTips: function () {
    return new Tips('div.annotation', {
      className: 'tip',
      fixed: !0,
      offset: { x: 30, y: 30 },
      hideDelay: 300,
      link: 'chain',
      onShow: function (a, b) {
        a.setStyles({ opacity: a.getStyle('opacity'), display: 'block' }).fade(0.9);
        a.addEvents({
          mouseleave: function () {
            this.active = !1;
            this.fade('out')
              .get('tween')
              .chain(function () {
                this.element.setStyle('display', 'none');
              });
          },
          mouseenter: function () {
            this.active = !0;
          },
        });
      },
      onHide: function (a, b) {
        a.active ||
          (a
            .fade('out')
            .get('tween')
            .chain(function () {
              this.element.setStyle('display', 'none');
            }),
          a.removeEvents(['mouseenter', 'mouseleave']));
      },
    });
  },
  toggleAnnotations: function () {
    var a = this.canvas.getElements('div.annotation');
    a &&
      (this.annotationsVisible
        ? (a.addClass('hidden'), (this.annotationsVisible = !1), this.showPopUp(IIPMooViewer.lang.annotationsDisabled))
        : (a.removeClass('hidden'), (this.annotationsVisible = !0)));
  },
  destroyAnnotations: function () {
    this.annotationTip && this.annotationTip.detach(this.canvas.getChildren('div.annotation'));
    this.canvas.getChildren('div.annotation').each(function (a) {
      a.eliminate('tip:text');
      a.destroy();
    });
  },
});
IIPMooViewer.implement({
  blend: function (a) {
    this.addEvent('load', function () {
      this.images[1] = { src: a[0][0], sds: '0,90', opacity: 0 };
      this.createBlendingInterface();
      a.each(function (a) {
        new Element('option', { value: a[0], html: a[1] })
          .inject(document.id('baselayer'))
          .clone()
          .inject(document.id('overlay'));
      });
    });
  },
  createBlendingInterface: function () {
    var a = this;
    new Element('div', {
      class: 'blending',
      html:
        '<h2 title="<h2>Image Comparison</h2>Select the pair of images you wish<br/>to compare from the menus below.<br/>Use the slider to blend smoothly<br/>between them">Image Comparison</h2><span>Image 1</span><select id="baselayer"></select><br/><br/><span>Move slider to blend between images:</span><br/><div id="area"><div id="knob"></div></div><br/><span>Image 2</span><select id="overlay"></select><br/>',
    }).inject(this.navigation.navcontainer);
    new Tips('div.blending h2', {
      className: 'tip',
      onShow: function (a) {
        a.setStyle('opacity', 0);
        a.fade(0.7);
      },
      onHide: function (a) {
        a.fade(0);
      },
    });
    var b = new Slider(document.id('area'), document.id('knob'), {
      range: [0, 100],
      onChange: function (b) {
        a.images[1] &&
          ((a.images[1].opacity = b / 100),
          a.canvas.getChildren('img.layer1').setStyle('opacity', a.images[1].opacity));
      },
    });
    window.addEvent('resize', function () {
      b.autosize();
    });
    document.id('baselayer').addEvent('change', function () {
      a.images[0].src = document.id('baselayer').value;
      a.canvas.getChildren('img.layer0').destroy();
      a.tiles.empty();
      a.requestImages();
    });
    document.id('overlay').addEvent('change', function () {
      var b = 0;
      a.images[1] && (b = a.images[1].opacity);
      a.images[1] = { src: document.id('overlay').value, opacity: b };
      a.canvas.getChildren('img.layer1').destroy();
      a.tiles.empty();
      a.requestImages();
    });
  },
  multiblend: function (a) {
    this.blend_list = a;
    this.blend_index = 0;
    this.images[1] = { src: a[1][0], sds: '0,90', opacity: 0 };
    this.addEvent('load', function () {
      this.createMultiBlendInterface();
    });
  },
  createMultiBlendInterface: function () {
    var a = this,
      b = new Element('div', {
        class: 'blending multiblend',
        html:
          '<h2 title="<h2>Image Comparison</h2>Move the slider to blend through<br/>the different images">Image Comparison</h2><div id="area"><div id="knob"></div></div><div class="caption"></div>',
      }).inject(this.container);
    new Tips('div.blending h2', {
      className: 'tip',
      onShow: function (a) {
        a.setStyle('opacity', 0);
        a.fade(0.7);
      },
      onHide: function (a) {
        a.fade(0);
      },
    });
    var c = new Slider(document.id('area'), document.id('knob'), {
      range: [0, 99],
      mode: 'horizontal',
      wheel: !0,
      onChange: function (b) {
        if (a.images[1]) {
          var c = 100 / (a.blend_list.length - 1),
            d = Math.floor(((a.blend_list.length - 1) * b) / 100);
          0 > d && (d = 0);
          var e = d + 1;
          e >= a.blend_list.length && (e = a.blend_list.length - 1);
          a.images[1].opacity = (b % c) / c;
          d == e && alert('layers are equal');
          if (d != a.blend_index) {
            a.images[0].src = a.blend_list[d][0];
            a.images[1].src = a.blend_list[e][0];
            b = a.canvas.getChildren('img.layer0');
            c = a.canvas.getChildren('img.layer1');
            var g = a.blend_index + 1;
            g > a.blend_list.length - 1 && (g = a.blend_list.length - 1);
            d == a.blend_index + 1
              ? ((a.nTilesLoaded -= b.length),
                b.each(function (b) {
                  var c = new RegExp(a.blend_list[a.blend_index][0]);
                  c = b.get('src').replace(c, a.images[1].src);
                  b.set('src', c);
                }),
                b.addClass('layer1').removeClass('layer0'),
                c.addClass('layer0').removeClass('layer1').setStyle('opacity', null))
              : d == this.blend_index - 1
              ? ((a.nTilesLoaded -= c.length),
                c.each(function (b) {
                  var c = new RegExp(a.blend_list[g][0]);
                  c = b.get('src').replace(c, a.images[0].src);
                  b.set('src', c);
                }),
                c.addClass('layer0').setStyle('opacity', null).removeClass('layer1'),
                b.addClass('layer1').removeClass('layer0'))
              : ((a.nTilesLoaded = 0),
                b.each(function (b) {
                  var c = new RegExp(a.blend_list[a.blend_index][0]);
                  c = b.get('src').replace(c, a.images[0].src);
                  b.set('src', c);
                }),
                c.each(function (b) {
                  var c = new RegExp(a.blend_list[g][0]);
                  c = b.get('src').replace(c, a.images[1].src);
                  b.set('src', c);
                }),
                b.setStyle('opacity', null));
            a.blend_index = d;
          }
          a.canvas.getChildren('img.layer1').setStyle('opacity', a.images[1].opacity);
        }
      },
    });
    b = b.getElement('div.caption');
    for (var d = 0; d < this.blend_list.length; d++)
      new Element('span', {
        html: this.blend_list[d][1],
        styles: { left: (90 * d) / (this.blend_list.length - 1) + '%' },
      }).inject(b);
    window.addEvent('resize', function () {
      c.autosize();
    });
  },
});
IIPMooViewer.lang = {
  scale: 'draggable scale',
  navigate:
    'To navigate within image: drag image within main window or drag zone within the navigation window or click an area within navigation window',
  zoomIn: 'To zoom in: double click or use the mouse scroll wheel or simply press the "+" key',
  zoomOut: 'To zoom out: shift double click or use the mouse wheel or press the "-" key',
  rotate: 'To rotate image clockwise: press the "r" key, anti-clockwise: press shift and "r"',
  fullscreen: 'For fullscreen: press the "f" key',
  annotations: 'To toggle any annotations: press the "a" key',
  navigation: 'To show/hide navigation window: press "h" key',
  more: 'For more information visit',
  exitFullscreen: 'Press "Esc" to exit fullscreen mode',
  loading: 'loading',
  drag: '* Drag to move<br/>* Double Click to show/hide buttons<br/>* Press h to hide',
  annotationsDisabled: 'Annotations disabled<br/>Press "a" to re-enable',
  tooltips: {
    help: 'click for help',
    reset: 'Reset View',
    zoomIn: 'Zoom In',
    zoomOut: 'Zoom Out',
    rotateLeft: 'Rotate left',
    rotateRight: 'Rotate right',
    print: 'Print View',
  },
};
