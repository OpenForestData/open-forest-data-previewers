(function (module) {
  'use strict';

  var index = 0;

  function toggleIframeFullscreen(domId) {
    var iframe = document.getElementById(domId);
    var fullscreenMethod = iframe.requestFullscreen || iframe.webkitRequestFullScreen || iframe.mozRequestFullScreen;
    fullscreenMethod.call(iframe);
  }

  function embedDemo(demoUrl) {
    // DOM element ID
    var domId = 'embedded-demo-iframe-' + ++index;

    // Fullscreen link
    var aElem =
      '<a onclick="toggleIframeFullscreen(\'' +
      domId +
      '\')" class="embed-demo-fullscreen-link">[open in fullscreen]</a>';
    // Demo iframe
    var iframeElem =
      '<iframe id="' +
      domId +
      '" src="' +
      demoUrl +
      '" allowfullscreen class="embed-demo-iframe" onwheel="return false;"></iframe>';

    // Inline both fullscreen link & demo iframe at the current function call location
    document.querySelector('#root').appendChild(aElem);
    document.querySelector('#root').appendChild(iframeElem);
  }

  module.toggleIframeFullscreen = toggleIframeFullscreen;
  module.embedDemo = embedDemo;
})(this || window);
