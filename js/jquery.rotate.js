(function($) {
  
var div = document.createElement('div'),
  divStyle = div.style,
  support = $.support;

support.transform = 
  divStyle.MozTransform === ''? 'MozTransform' :
  (divStyle.MsTransform === ''? 'MsTransform' :
  (divStyle.WebkitTransform === ''? 'WebkitTransform' : 
  (divStyle.OTransform === ''? 'OTransform' :
  false)));
support.matrixFilter = !support.transform && divStyle.filter === '';
div = null;

$.cssNumber.rotate = true;
$.cssHooks.rotate = {
  set: function( elem, value ) {
    var _support = support,
      supportTransform = _support.transform,
      cos, sin,
      centerOrigin;
    
    if (typeof value === 'string') {
      value = toRadian(value);
    }
    
    $.data( elem, 'transform', {
      rotate: value
    });
    
    if (supportTransform) {
      elem.style[supportTransform] = 'rotate('+ value +'rad)';
      
    } else if (_support.matrixFilter) {
      cos = Math.cos(value);
      sin = Math.sin(value);
      elem.style.filter = [
        "progid:DXImageTransform.Microsoft.Matrix(",
          "M11="+cos+",",
          "M12="+(-sin)+",",
          "M21="+sin+",",
          "M22="+cos+",",
          "SizingMethod='auto expand'",
        ")"
      ].join('');
      
      // From pbakaus's Transformie http://github.com/pbakaus/transformie
      if(centerOrigin = $.rotate.centerOrigin) {
        elem.style[centerOrigin == 'margin' ? 'marginLeft' : 'left'] = -(elem.offsetWidth/2) + (elem.clientWidth/2) + "px";
        elem.style[centerOrigin == 'margin' ? 'marginTop' : 'top'] = -(elem.offsetHeight/2) + (elem.clientHeight/2) + "px";
      }
    }
  },
  get: function( elem, computed ) {
    var transform = $.data( elem, 'transform' );
    return transform && transform.rotate? transform.rotate : 0;
  }
};
$.fx.step.rotate = function( fx ) {
  $.cssHooks.rotate.set( fx.elem, fx.now+fx.unit );
};

function radToDeg( rad ) {
  return rad * 180 / Math.PI;
}
function toRadian(value) {
  if(value.indexOf("deg") != -1) {
    return parseInt(value,10) * (Math.PI * 2 / 360);
  } else if (value.indexOf("grad") != -1) {
    return parseInt(value,10) * (Math.PI/200);
  }
  return parseFloat(value);
}

$.rotate = {
  centerOrigin: 'margin',
  radToDeg: radToDeg
};
  
})(jQuery);