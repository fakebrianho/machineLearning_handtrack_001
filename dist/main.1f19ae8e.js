// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"main.js":[function(require,module,exports) {
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var video = document.getElementById('myvideo');
var handimg = document.getElementById('handimage');
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
var trackButton = document.getElementById('trackbutton');
var nextImageButton = document.getElementById('nextimagebutton');
var updateNote = document.getElementById('updatenote');
var preloader = document.getElementById('preload');
var track = [];
var isVideo = false;
var model = null;
var mappedVal;
var mappedValY;
var pointer = new THREE.Vector2();
var modelParams = {
  flipHorizontal: true,
  // flip e.g for video
  maxNumBoxes: 20,
  // maximum number of boxes to detect
  iouThreshold: 0.5,
  // ioU threshold for non-max suppression
  scoreThreshold: 0.6 // confidence threshold for predictions.

};

function startVideo() {
  handTrack.startVideo(video).then(function (status) {
    video.style.display = 'none'; // console.log('video started', status)

    if (status) {
      // updateNote.innerText = 'Video started. Now tracking'
      isVideo = true;
      runDetection();
    } else {// updateNote.innerText = 'Please enable video'
    }
  });
}

function toggleVideo() {
  gsap.to(preloader, {
    opacity: 0,
    delay: 0.5,
    duration: 1.5
  }); // preloader.style.opacity = 0

  if (!isVideo) {
    // updateNote.innerText = 'Starting video'
    startVideo();
  } else {
    // updateNote.innerText = 'Stopping video'
    handTrack.stopVideo(video);
    isVideo = false; // updateNote.innerText = 'Video stopped'
  }
}

trackButton.addEventListener('click', function () {
  toggleVideo();
});

function runDetection() {
  model.detect(video).then(function (predictions) {
    // console.log('Predictions: ', predictions)
    track = predictions.slice(0); // model.renderPredictions(predictions, canvas, context, video)
    //code taken from the pong boilerplate in the handtrack.js demo, here I'm normalizing
    // console.log(predictions)

    predictions.forEach(function (prediction) {
      if (prediction.label == 'face') {
        var midval = prediction.bbox[0] + prediction.bbox[2] / 2;
        var midvalY = prediction.bbox[1] + prediction.bbox[2] / 2;
        var midval2 = midval / video.width;
        var midvalY2 = midvalY / video.height;
        mappedVal = mapRange(midval2, 0, 1, -1, 1);
        mappedValY = mapRange(midvalY2, 0, 1, -1, 1);
      }
    }); // if (predictions[0]) {
    // 	let midval = predictions[0].bbox[0] + predictions[0].bbox[2] / 2
    // 	let midvalY = predictions[0].bbox[1] + predictions[0].bbox[2] / 2
    // 	let midval2 = midval / video.width
    // 	let midvalY2 = midvalY / video.height
    // 	mappedVal = mapRange(midval2, 0, 1, -1, 1)
    // 	mappedValY = mapRange(midvalY2, 0, 1, -1, 1)
    // }

    model.renderPredictions(predictions, canvas, context, video);

    if (isVideo) {
      requestAnimationFrame(runDetection);
    }
  });
} // Load the model.


handTrack.load(modelParams).then(function (lmodel) {
  model = lmodel;
  console.log(model); // updateNote.innerText = 'Loaded Model!'

  trackButton.disabled = false;
});
/*------------------------------
Global Setup
------------------------------*/

var canvas3 = document.querySelector('.threeCanvas');
var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer({
  canvas: canvas3
});
var geometry = new THREE.BoxGeometry(1, 1, 1);
var material = new THREE.MeshBasicMaterial({
  color: 0xff0000
});
var mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);
/*------------------------------
Dimensions
------------------------------*/

var sizes = {
  width: window.innerWidth,
  height: window.innerHeight
};
var camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000);
camera.position.z = 30;
scene.add(camera);
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
/*------------------------------
Resize
------------------------------*/

window.addEventListener('resize', function () {
  /*------------------------------
   Update Sizes
   ------------------------------*/
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  /*------------------------------
   Update Camera
   ------------------------------*/

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  /*------------------------------
   Update Renderer
   ------------------------------*/

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
/*------------------------------
Fullscreen Function
------------------------------*/

window.addEventListener('dblclick', function () {
  if (!document.fullscreenElement) {
    canvas.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
});
/*------------------------------
mover
------------------------------*/

var Mover = /*#__PURE__*/function () {
  function Mover(x, y, z, m, radius, widthSeg, heightSeg) {
    _classCallCheck(this, Mover);

    this.geometry = new THREE.SphereBufferGeometry(radius, widthSeg, heightSeg);
    this.testGeo = new THREE.BoxGeometry(1, 1, 1);
    this.material = new THREE.MeshBasicMaterial({
      color: '#ff00ff'
    });
    this.position = new THREE.Vector3(x, y, z);
    this.vel = new THREE.Vector3(Math.random() * 0.11, Math.random() * 0.11, 0);
    this.acc = new THREE.Vector3(0, 0, 0);
    this.mass = m;
    this.mesh = new THREE.Mesh(this.testGeo, this.material);
  }

  _createClass(Mover, [{
    key: "applyForce",
    value: function applyForce(force) {
      var f = force;
      this.acc.add(f);
    }
  }, {
    key: "update",
    value: function update() {
      this.vel.add(this.acc);
      this.vel.clampScalar(-0.09, 0.09); // clamp speed

      console.log(this.vel);
      this.mesh.position.add(this.vel);
      this.acc.set(0, 0, 0);
    }
  }]);

  return Mover;
}();

var test = new Mover(0, -0.5, 0, 15, 32, 16);
scene.add(test.mesh);
/*------------------------------
Attraction Function
------------------------------*/

var attract = function attract(mover, attractor, amass, mmass) {
  var a = new THREE.Vector3(attractor.position.x, attractor.position.y, 0.5);
  var b = new THREE.Vector3(mover.mesh.position.x, mover.mesh.position.y, 0.5);
  var force = a.sub(b);
  force.setLength(0.17); // console.log(force)

  var strength;
  /*------------------------------
     Block
     ------------------------------*/
  // console.log(a)
  // let distanceSquared =
  // 	force.x * force.x + force.y * force.y + force.z * force.z
  // let g = 1
  // if (distanceSquared > 0) {
  // 	strength = (amass * mmass) / distanceSquared
  // } else {
  // 	strength = 0
  // }

  /*------------------------------
     Block
     ------------------------------*/
  // force = force.normalize()
  // force = force.normalize().multiplyScalar(strength)
  // dir = dir.sub(mover.pos)
  // console.log(force)
  // console.log(distanceSquared)
  // console.log(strength)

  mover.applyForce(force); // .sub(attractor.pos, mover.pos)
};

window.addEventListener('pointermove', onPointerMove);

function mapRange(value, a, b, c, d) {
  // first map value from (a..b) to (0..1)
  value = (value - a) / (b - a); // then map it from (0..1) to (c..d) and return it

  return c + value * (d - c);
}

function onPointerMove(event) {// calculate pointer position in normalized device coordinates
  // (-1 to +1) for both components
  // pointer.x = (event.clientX / window.innerWidth) * 2 - 1
  // pointer.y = -(event.clientY / window.innerHeight) * 2 + 1
  // var vector = new THREE.Vector3(pointer.x, pointer.y, 0.5)
  // vector.unproject(camera)
  // var dir = vector.sub(camera.position).normalize()
  // var distance = -camera.position.z / dir.z
  // var pos = camera.position.clone().add(dir.multiplyScalar(distance))
  // mesh.position.copy(pos)
} //Map function from p5


var clock = new THREE.Clock();

var animate = function animate() {
  /*------------------------------
   Smooth Animation
   ------------------------------*/
  var elapsedTime = clock.getElapsedTime();
  /*------------------------------
   Update Meshes
   ------------------------------*/

  track.forEach(function (tracked) {
    if (tracked.label == 'closed') {
      mesh.rotation.x = elapsedTime;
      mesh.rotation.y = elapsedTime;
      attract(test, mesh, 1, 1);
    }
  }); // console.log(mappedValY)

  if (mappedValY) {
    var vector = new THREE.Vector3(mappedVal, -mappedValY, 0.5);
    vector.unproject(camera);
    var dir = vector.sub(camera.position).normalize();
    var distance = -camera.position.z / dir.z;
    var pos = camera.position.clone().add(dir.multiplyScalar(distance)); // mesh.position.copy(pos)

    mesh.position.lerp(pos, 0.2);
    console.log(pos);
  }

  test.update();
  /*------------------------------
   Render
   ------------------------------*/

  renderer.render(scene, camera);
  /*------------------------------
   Core
   ------------------------------*/

  window.requestAnimationFrame(animate);
};

animate();
},{}],"../../../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "58083" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","main.js"], null)
//# sourceMappingURL=/main.1f19ae8e.js.map