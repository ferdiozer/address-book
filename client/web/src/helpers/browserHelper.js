export const getBrowser = () => {
  // Opera 8.0+
  if ((!!window.opr && !!['opr'].addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0) {
    return 'opera';
  }

  // Firefox 1.0+
  if (typeof window.InstallTrigger !== 'undefined') {
    return 'firefox';
  }

  // Safari 3.0+ "[object HTMLElementConstructor]"
  if (/constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === '[object SafariRemoteNotification]'; }(!window.safari || (typeof window.safari !== 'undefined' && window.safari.pushNotification)))) {
    return 'safari';
  }

  // Internet Explorer 6-11
  if (/* @cc_on!@ */false || !!document.documentMode) {
    return 'ie';
  }

  // Edge 20+
  if (!(/* @cc_on!@ */false || !!document.documentMode) && !!window.StyleMedia) {
    return 'edge';
  }

  // Chrome 1+
  if (window.chrome) {
    return 'chrome';
  }

  // Blink engine detection
  if (((!!window.chrome) || ((!!window.opr && !!['opr'].addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0)) && !!window.CSS) {
    return 'blink';
  }

  return 'Browser';
};
