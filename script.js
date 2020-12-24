(function ($) {
  var windowWidth = 0;
  var windowHeight = 0;
  var maxWidth = 0;
  var minWidth = 0;
  var maxHeight = 0;
  var textShadowSupport = true;
  var xv = 0;
  var snowflakes = ["\u2744", "\u2745", "\u2746"];
  var prevTime;
  var absMax = 200;
  var flakeCount = 0;
  var maxFlakes = 150;

  $(init);

  function init() {
    var detectSize = function () {
      windowWidth = $(window).width();
      windowHeight = $(window).height();

      maxWidth = windowWidth + 300;
      minWidth = -300;
      maxHeight = windowHeight + 300;
    };

    detectSize();

    $(window).resize(detectSize);

    if (!$("body").css("textShadow")) {
      textShadowSupport = false;
    }

    var iterations = maxFlakes;
    while (iterations--) {
      addFlake(true);
    }

    prevTime = new Date().getTime();
    setInterval(move, 50);
  }

  function addFlake(initial) {
    flakeCount++;

    var sizes = [
      {
        r: 1.0,
        css: {
          fontSize: 15 + Math.floor(Math.random() * 20) + "px",
          textShadow: "9999px 0 0 rgba(238, 238, 238, 0.5)"
        },
        v: 2
      },
      {
        r: 0.6,
        css: {
          fontSize: 50 + Math.floor(Math.random() * 20) + "px",
          textShadow: "9999px 0 2px #eee"
        },
        v: 6
      },
      {
        r: 0.2,
        css: {
          fontSize: 90 + Math.floor(Math.random() * 30) + "px",
          textShadow: "9999px 0 6px #eee"
        },
        v: 12
      },
      {
        r: 0.1,
        css: {
          fontSize: 150 + Math.floor(Math.random() * 50) + "px",
          textShadow: "9999px 0 24px #eee"
        },
        v: 20
      }
    ];

    var $nowflake = $(
      '<span class="winternetz">' +
        snowflakes[Math.floor(Math.random() * snowflakes.length)] +
        "</span>"
    ).css({
      color: "#eee",
      display: "block",
      position: "fixed",
      background: "transparent",
      width: "auto",
      height: "auto",
      margin: "0",
      padding: "0",
      textAlign: "left",
      zIndex: 9999
    });

    if (textShadowSupport) {
      $nowflake.css("textIndent", "-9999px");
    }

    var r = Math.random();

    var i = sizes.length;

    var v = 0;

    while (i--) {
      if (r < sizes[i].r) {
        v = sizes[i].v;
        $nowflake.css(sizes[i].css);
        break;
      }
    }

    var x = -300 + Math.floor(Math.random() * (windowWidth + 300));

    var y = 0;
    if (typeof initial == "undefined" || !initial) {
      y = -300;
    } else {
      y = -300 + Math.floor(Math.random() * (windowHeight + 300));
    }

    $nowflake.css({
      left: x + "px",
      top: y + "px"
    });

    $nowflake.data("x", x);
    $nowflake.data("y", y);
    $nowflake.data("v", v);
    $nowflake.data("half_v", Math.round(v * 0.5));

    $("body").append($nowflake);
  }

  function move() {
    if (Math.random() > 0.8) {
      xv += -1 + Math.random() * 2;

      if (Math.abs(xv) > 3) {
        xv = 3 * (xv / Math.abs(xv));
      }
    }

    // Throttle code
    var newTime = new Date().getTime();
    var diffTime = newTime - prevTime;
    prevTime = newTime;

    if (diffTime < 55 && flakeCount < absMax) {
      addFlake();
    } else if (diffTime > 150) {
      $("span.winternetz:first").remove();
      flakeCount--;
    }

    $("span.winternetz").each(function () {
      var x = $(this).data("x");
      var y = $(this).data("y");
      var v = $(this).data("v");
      var half_v = $(this).data("half_v");

      y += v;

      x += Math.round(xv * v);
      x += -half_v + Math.round(Math.random() * v);

      // because flakes are rotating, the origin could be +/- the size of the flake offset
      if (x > maxWidth) {
        x = -300;
      } else if (x < minWidth) {
        x = windowWidth;
      }

      if (y > maxHeight) {
        $(this).remove();
        flakeCount--;

        addFlake();
      } else {
        $(this).data("x", x);
        $(this).data("y", y);

        $(this).css({
          left: x + "px",
          top: y + "px"
        });

        // only spin biggest three flake sizes
        if (v >= 6) {
          $(this).animate({ rotate: "+=" + half_v + "deg" }, 0);
        }
      }
    });
  }
})(jQuery);

var thetamin = 0,
  thetamax = 6 * Math.PI,
  period = 5,
  linespacing = 1 / 30,
  linelength = linespacing / 2,
  yscreenoffset = 300,
  xscreenoffset = 260,
  xscreenscale = 360,
  yscreenscale = 360,
  ycamera = 2,
  zcamera = -3,

  rate = 1 / (2 * Math.PI), // every rotation y gets one bigger
  factor = rate / 3;

function run() {
  var ctx = document.getElementById('scene').getContext('2d'),
      spirals = [
        new Spiral({
          foreground: "#220000", // Second shadow for red spiral
          angleoffset: Math.PI * 0.92,
          factor: 0.90 * factor
        }),
        new Spiral({
          foreground: "#002211", // Second shadow for cyan spiral
          angleoffset: -Math.PI * 0.08,
          factor: 0.90 * factor
        }),
        new Spiral({
          foreground: "#660000", // red spiral shadow
          angleoffset: Math.PI * 0.95,
          factor: 0.93 * factor
        }),
        new Spiral({
          foreground: "#003322", // cyan spiral shadow
          angleoffset: -Math.PI * 0.05,
          factor: 0.93 * factor
        }),
        new Spiral({
          foreground: "#ff0000", // red Spiral
          angleoffset: Math.PI,
          factor: factor
        }),
        new Spiral({
          foreground: "#00ffcc", // cyan spiral
          angleoffset: 0,
          factor: factor
        })];

  renderFrame(); // animation loop starts here

  function renderFrame() {
    requestAnimationFrame(renderFrame);

    ctx.clearRect(0, 0, 500, 500);
    ctx.beginPath();
    spirals.forEach(renderSpiral);
  }

  function renderSpiral(spiral) {
    spiral.render(ctx);
  }

  function Spiral(config) {
    var offset = 0;
    var lineSegments = computeLineSegments();

    this.render = function(ctx) {
      offset -= 1;
      if (offset <= -period) {
        offset += period;
      }

      lineSegments[offset].forEach(drawLineSegment);
    };

    function drawLineSegment(segment) {
      stroke(config.foreground, segment.start.alpha);
      ctx.moveTo(segment.start.x, segment.start.y);
      ctx.lineTo(segment.end.x, segment.end.y);
    }

    function computeLineSegments() {
      var lineSegments = {};
      var factor = config.factor;
      var thetanew, thetaold;
      for (var offset = 0; offset > -period; offset--) {
        lineSegments[offset] = lines = [];
        for (var theta = thetamin + getdtheta(thetamin, offset * linespacing / period, rate, factor); theta < thetamax; theta += getdtheta(theta, linespacing, rate, factor)) {
          thetaold = (theta >= thetamin) ? theta : thetamin;
          thetanew = theta + getdtheta(theta, linelength, rate, factor);

          if (thetanew <= thetamin) {
            continue;
          }

          lines.push({
            start: getPointByAngle(thetaold, factor, config.angleoffset, rate),
            end: getPointByAngle(thetanew, factor, config.angleoffset, rate)
          });
        }
      }

      return lineSegments;
    }
  }

  function stroke(color, alpha) {
    ctx.closePath();
    ctx.stroke();
    ctx.strokeStyle = color;
    ctx.globalAlpha = alpha;
    ctx.beginPath();
  }

  function getPointByAngle(theta, factor, angleoffset, rate) {
    var x = theta * factor *  Math.cos(theta + angleoffset);
    var z = - theta * factor * Math.sin(theta + angleoffset);
    var y = rate * theta;
    // now that we have 3d coorinates, project them into 2d space:
    var point = projectTo2d(x, y, z);
    // calculate point's color alpha level:
    point.alpha = Math.atan((y * factor / rate * 0.1 + 0.02 - z) * 40) * 0.35 + 0.65;

    return point;
  }

  function getdtheta(theta, lineLength, rate, factor) {
    return lineLength / Math.sqrt(rate * rate + factor * factor * theta * theta);
  }

  function projectTo2d(x, y, z) {
    return {
      x: xscreenoffset + xscreenscale * (x / (z - zcamera)),
      y: yscreenoffset + yscreenscale * ((y - ycamera) / (z - zcamera))
    };
  }

  // I actually want it to be slower then 60fps
  function requestAnimationFrame(callback) {
    window.setTimeout(callback, 1000 / 24);
  }
}

function getParameterByName(name, url = window.location.href) {
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

document.getElementsByClassName('customise')[0].innerHTML=getParameterByName('custom');