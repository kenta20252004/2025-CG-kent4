/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/app.ts":
/*!********************!*\
  !*** ./src/app.ts ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");
/* harmony import */ var three_examples_jsm_controls_OrbitControls__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three/examples/jsm/controls/OrbitControls */ "./node_modules/three/examples/jsm/controls/OrbitControls.js");
/* harmony import */ var cannon_es__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! cannon-es */ "./node_modules/cannon-es/dist/cannon-es.js");
//23FI032 川島健太郎



class ThreeJSContainer {
    scene;
    light;
    constructor() { }
    createRendererDOM = (width, height, cameraPos) => {
        const renderer = new three__WEBPACK_IMPORTED_MODULE_1__.WebGLRenderer();
        renderer.setSize(width, height);
        renderer.setClearColor(new three__WEBPACK_IMPORTED_MODULE_1__.Color(0x000000));
        renderer.shadowMap.enabled = true;
        const camera = new three__WEBPACK_IMPORTED_MODULE_1__.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.set(0, 25, 0);
        //camera.position.copy(cameraPos);
        camera.lookAt(new three__WEBPACK_IMPORTED_MODULE_1__.Vector3(0, 4, 0));
        const orbitControls = new three_examples_jsm_controls_OrbitControls__WEBPACK_IMPORTED_MODULE_0__.OrbitControls(camera, renderer.domElement);
        this.createScene();
        const render = (time) => {
            orbitControls.update();
            renderer.render(this.scene, camera);
            requestAnimationFrame(render);
        };
        requestAnimationFrame(render);
        renderer.domElement.style.cssFloat = "left";
        renderer.domElement.style.margin = "10px";
        return renderer.domElement;
    };
    createScene = () => {
        this.scene = new three__WEBPACK_IMPORTED_MODULE_1__.Scene();
        const cubeMeshes = [];
        const cubeBodies = [];
        const num1 = 25;
        const num2 = 15;
        const space = 0.6; //ドミノの間隔調整
        const cubeShape = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Box(new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Vec3(0.25, 0.5, 0.1));
        const world = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.World({ gravity: new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Vec3(0, -9.82, 0) });
        world.defaultContactMaterial.friction = 0.01; //摩擦係数
        world.defaultContactMaterial.restitution = 0.9; //反発係数
        const geometry = new three__WEBPACK_IMPORTED_MODULE_1__.BoxGeometry(0.5, 1, 0.2); //geometry
        let material; //material
        for (let i = 0; i < num1; i++) {
            for (let j = 0; j < num2; j++) {
                const x = (i - num1 / 2) * space; //x座標
                const z = (j - num2 / 2) * space; //z座標
                if ((i >= 1 && i <= 6 && j == 3) || (i >= 3 && i <= 4 && j >= 3 && j <= 10)
                    || (i == 9 && j >= 3 && j <= 10) || (i >= 10 && i <= 12 && (j == 3 || j == 10)) || (i == 13 && (j == 4 || j == 9)) || (i == 14 && j >= 5 && j <= 8)
                    || (i == 17 && j >= 3 && j <= 9) || (j == 10 && i >= 18 && i <= 21) || (i == 22 && j >= 3 && j <= 9)) {
                    //↑の条件を満たしたドミノが青になる👇
                    material = new three__WEBPACK_IMPORTED_MODULE_1__.MeshLambertMaterial({ color: 0x0000ff });
                }
                else {
                    //それ以外は白
                    material = new three__WEBPACK_IMPORTED_MODULE_1__.MeshLambertMaterial({ color: 0xffff00 });
                }
                const mesh = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(geometry, material);
                mesh.position.set(x, 0.5, z);
                if (j === 0)
                    mesh.rotateX(0.5); //1列目のドミノを傾ける
                this.scene.add(mesh);
                cubeMeshes.push(mesh);
                const body = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Body({ mass: 2 }); //2kg
                body.addShape(cubeShape);
                body.position.set(mesh.position.x, mesh.position.y, mesh.position.z); //positionの初期化
                body.quaternion.set(mesh.quaternion.x, mesh.quaternion.y, mesh.quaternion.z, mesh.quaternion.w); //quaternionの初期化
                cubeBodies.push(body);
                world.addBody(body);
            }
        }
        //地面
        const phongMaterial = new three__WEBPACK_IMPORTED_MODULE_1__.MeshPhongMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0,
            side: three__WEBPACK_IMPORTED_MODULE_1__.DoubleSide //両面表示
        });
        const planeGeometry = new three__WEBPACK_IMPORTED_MODULE_1__.PlaneGeometry(25, 25);
        const planeMesh = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(planeGeometry, phongMaterial);
        planeMesh.rotateX(-Math.PI / 2);
        this.scene.add(planeMesh); //シーンの追加
        const planeShape = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Plane();
        const planeBody = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Body({ mass: 0 }); //0kg
        planeBody.addShape(planeShape);
        planeBody.position.set(planeMesh.position.x, planeMesh.position.y, planeMesh.position.z); //positionの初期化
        planeBody.quaternion.set(planeMesh.quaternion.x, planeMesh.quaternion.y, planeMesh.quaternion.z, planeMesh.quaternion.w); //quaternionの初期化
        world.addBody(planeBody);
        //ライト
        this.light = new three__WEBPACK_IMPORTED_MODULE_1__.DirectionalLight(0xffffff);
        const lvec = new three__WEBPACK_IMPORTED_MODULE_1__.Vector3(1, 1, 1).clone().normalize();
        this.light.position.set(lvec.x, lvec.y, lvec.z);
        this.scene.add(this.light);
        //花火(パーティクルの生成)
        const particleCount = 500;
        const particlesGeometry = new three__WEBPACK_IMPORTED_MODULE_1__.BufferGeometry();
        const radius = 6;
        const positions = new Float32Array(particleCount * 3); //500*3の配列を用意
        const velocities = new Float32Array(particleCount * 3); //花火で使う
        for (let i = 0; i < particleCount; i++) {
            const theta = (i / particleCount) * Math.PI * 2;
            positions[i * 3 + 0] = Math.cos(theta) * radius; //xは円を描くイメージ
            positions[i * 3 + 1] = 2; //y=2
            positions[i * 3 + 2] = Math.sin(theta) * radius; //zは円を描くイメージ
            //最初は動かない
            velocities[i * 3 + 0] = 0;
            velocities[i * 3 + 1] = 0;
            velocities[i * 3 + 2] = 0;
        }
        const colors = new Float32Array(particleCount * 3); //色の配列を用意
        for (let i = 0; i < particleCount; i++) {
            let color;
            const r = Math.random();
            //色のランダム生成
            if (r < 0.125) {
                color = new three__WEBPACK_IMPORTED_MODULE_1__.Color(0xff0000); //赤
            }
            else if (r >= 0.125 && r < 0.250) {
                color = new three__WEBPACK_IMPORTED_MODULE_1__.Color(0xffff00); //黄色
            }
            else if (r >= 0.25 && r < 0.375) {
                color = new three__WEBPACK_IMPORTED_MODULE_1__.Color(0xff00ff); //マゼンタ
            }
            else if (r >= 0.375 && r < 0.50) {
                color = new three__WEBPACK_IMPORTED_MODULE_1__.Color(0x00ff00); //緑
            }
            else if (r >= 0.50 && r < 0.625) {
                color = new three__WEBPACK_IMPORTED_MODULE_1__.Color(0x00ffff); //シアン
            }
            else if (r >= 0.625 && r < 0.75) {
                color = new three__WEBPACK_IMPORTED_MODULE_1__.Color(0x0000ff); //青
            }
            else if (r >= 0.75 && r < 0.875) {
                color = new three__WEBPACK_IMPORTED_MODULE_1__.Color(0x000000); //黒
            }
            else if (r >= 0.875) {
                color = new three__WEBPACK_IMPORTED_MODULE_1__.Color(0xffffff); //白
            }
            //配列に格納
            colors[i * 3 + 0] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;
        }
        //オブジェクトを作成
        particlesGeometry.setAttribute("color", new three__WEBPACK_IMPORTED_MODULE_1__.BufferAttribute(colors, 3));
        particlesGeometry.setAttribute("position", new three__WEBPACK_IMPORTED_MODULE_1__.BufferAttribute(positions, 3));
        particlesGeometry.setAttribute("velocity", new three__WEBPACK_IMPORTED_MODULE_1__.BufferAttribute(velocities, 3));
        const particlesMaterial = new three__WEBPACK_IMPORTED_MODULE_1__.PointsMaterial({
            size: 0.15,
            transparent: true,
            opacity: 0.9,
            vertexColors: true //カラフルにするために追加
        });
        const particles = new three__WEBPACK_IMPORTED_MODULE_1__.Points(particlesGeometry, particlesMaterial); //meshの作成
        particles.visible = false; //最初は非表示
        this.scene.add(particles);
        let startTime = performance.now();
        let hasLaunched = false; //花火の打ち上げ
        let hasExploded = false; //爆発
        let sCount = 0; //爆発の回数
        const launchHeight = 8; //ここまでいったら爆発
        const update = () => {
            requestAnimationFrame(update);
            world.fixedStep();
            for (let i = 0; i < cubeMeshes.length; i++) {
                cubeMeshes[i].position.set(cubeBodies[i].position.x, cubeBodies[i].position.y, cubeBodies[i].position.z);
                cubeMeshes[i].quaternion.set(cubeBodies[i].quaternion.x, cubeBodies[i].quaternion.y, cubeBodies[i].quaternion.z, cubeBodies[i].quaternion.w);
            }
            //属性に関して
            const posAttr = particlesGeometry.getAttribute("position");
            const velAttr = particlesGeometry.getAttribute("velocity");
            const elapsed = (performance.now() - startTime) / 1000; //時間経過
            const waitTime = sCount === 0 ? 6 : 1;
            if (!hasLaunched && elapsed >= waitTime) {
                hasLaunched = true;
                particles.visible = true;
                sCount++;
            }
            //パーティクルの情報更新
            for (let i = 0; i < particleCount; i++) {
                let x = posAttr.getX(i);
                let y = posAttr.getY(i);
                let z = posAttr.getZ(i);
                //アニメーションが開始して6秒たっていたら
                if (!hasLaunched && elapsed >= 6) {
                    hasLaunched = true; //開始
                    particles.visible = true; //パーティクルが見える
                }
                //開始かつまだ爆発していない
                if (hasLaunched && !hasExploded) {
                    y += 0.1; //パーティクルが上昇
                    if (y >= launchHeight) { //高さが8以上
                        hasExploded = true; //爆発
                        //ランダムな速度ベクトルを付与
                        for (let j = 0; j < particleCount; j++) {
                            const theta = (j / particleCount) * Math.PI * 2;
                            const radius = 0.2 + Math.random() * 0.1;
                            const vx = Math.cos(theta) * radius;
                            const vy = 0.3 + Math.random() * 0.1;
                            const vz = Math.sin(theta) * radius;
                            velAttr.setXYZ(j, vx, vy, vz);
                        }
                        //更新
                        velAttr.needsUpdate = true;
                    }
                    posAttr.setY(i, y);
                }
                //爆発したら
                if (hasExploded) {
                    //位置情報を取得
                    const vx = velAttr.getX(i); //xの速度ベクトル
                    const vy = velAttr.getY(i); //yの速度ベクトル
                    const vz = velAttr.getZ(i); //zの速度ベクトル
                    posAttr.setXYZ(i, x + vx, y + vy, z + vz); //position更新
                    velAttr.setXYZ(i, vx * 0.98, vy * 0.98 - 0.01, vz * 0.98); //物理演算
                }
            }
            posAttr.needsUpdate = true;
            //爆発したら
            if (hasExploded) {
                let allBelow = true;
                for (let i = 0; i < particleCount; i++) { //パーティクルがy<0になると
                    if (posAttr.getY(i) > 0) {
                        allBelow = false;
                        break;
                    }
                }
                if (allBelow) {
                    for (let i = 0; i < particleCount; i++) {
                        //リセット
                        posAttr.setXYZ(i, 0, 0, 0);
                        velAttr.setXYZ(i, 0, 0, 0);
                    }
                    //更新
                    posAttr.needsUpdate = true;
                    velAttr.needsUpdate = true;
                    //時間のリセット
                    startTime = performance.now();
                    //フラグとパーティクルのリセット
                    hasLaunched = false;
                    hasExploded = false;
                    particles.visible = false;
                    //新しい速度ベクトルの作成
                    for (let i = 0; i < particleCount; i++) {
                        const angle = (i / particleCount) * Math.PI * 2;
                        const radius = 0.2 + Math.random() * 0.1;
                        const vx = Math.cos(angle) * radius;
                        const vy = 0.3 + Math.random() * 0.1;
                        const vz = Math.sin(angle) * radius;
                        velAttr.setXYZ(i, vx, vy, vz);
                    }
                    velAttr.needsUpdate = true;
                }
            }
            posAttr.needsUpdate = true;
        };
        requestAnimationFrame(update);
    };
}
window.addEventListener("DOMContentLoaded", init);
function init() {
    const container = new ThreeJSContainer();
    const viewport = container.createRendererDOM(640, 480, new three__WEBPACK_IMPORTED_MODULE_1__.Vector3(5, 5, 5));
    document.body.appendChild(viewport);
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"main": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkcgprendering"] = self["webpackChunkcgprendering"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["vendors-node_modules_cannon-es_dist_cannon-es_js-node_modules_three_examples_jsm_controls_Orb-e58bd2"], () => (__webpack_require__("./src/app.ts")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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VTtRQUV2QixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQzNCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQzNCLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBSztnQkFDdEMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFLO2dCQUV0QyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7dUJBQ3BFLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO3VCQUNoSixDQUFDLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxF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QUNBO1dBQ0EsS0FBSztXQUNMO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7Ozs7V0MzQkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7O1dDTkE7O1dBRUE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOztXQUVBOztXQUVBOztXQUVBOztXQUVBOztXQUVBOztXQUVBOztXQUVBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLE1BQU0scUJBQXFCO1dBQzNCO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7O1dBRUE7V0FDQTtXQUNBOzs7OztVRWhEQTtVQUNBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nLy4vc3JjL2FwcC50cyIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svcnVudGltZS9jaHVuayBsb2FkZWQiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9ydW50aW1lL2pzb25wIGNodW5rIGxvYWRpbmciLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbIi8vMjNGSTAzMiDlt53ls7blgaXlpKrpg45cbmltcG9ydCAqIGFzIFRIUkVFIGZyb20gXCJ0aHJlZVwiO1xuaW1wb3J0IHsgT3JiaXRDb250cm9scyB9IGZyb20gXCJ0aHJlZS9leGFtcGxlcy9qc20vY29udHJvbHMvT3JiaXRDb250cm9sc1wiO1xuaW1wb3J0ICogYXMgQ0FOTk9OIGZyb20gXCJjYW5ub24tZXNcIjtcblxuY2xhc3MgVGhyZWVKU0NvbnRhaW5lciB7XG4gICAgcHJpdmF0ZSBzY2VuZTogVEhSRUUuU2NlbmU7XG4gICAgcHJpdmF0ZSBsaWdodDogVEhSRUUuTGlnaHQ7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHsgfVxuXG4gICAgcHVibGljIGNyZWF0ZVJlbmRlcmVyRE9NID0gKHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyLCBjYW1lcmFQb3M6IFRIUkVFLlZlY3RvcjMpID0+IHtcbiAgICAgICAgY29uc3QgcmVuZGVyZXIgPSBuZXcgVEhSRUUuV2ViR0xSZW5kZXJlcigpO1xuICAgICAgICByZW5kZXJlci5zZXRTaXplKHdpZHRoLCBoZWlnaHQpO1xuICAgICAgICByZW5kZXJlci5zZXRDbGVhckNvbG9yKG5ldyBUSFJFRS5Db2xvcigweDAwMDAwMCkpO1xuICAgICAgICByZW5kZXJlci5zaGFkb3dNYXAuZW5hYmxlZCA9IHRydWU7XG5cbiAgICAgICAgY29uc3QgY2FtZXJhID0gbmV3IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhKDc1LCB3aWR0aCAvIGhlaWdodCwgMC4xLCAxMDAwKTtcbiAgICAgICAgY2FtZXJhLnBvc2l0aW9uLnNldCgwLDI1LDApO1xuICAgICAgICAvL2NhbWVyYS5wb3NpdGlvbi5jb3B5KGNhbWVyYVBvcyk7XG4gICAgICAgIGNhbWVyYS5sb29rQXQobmV3IFRIUkVFLlZlY3RvcjMoMCw0LDApKTtcblxuICAgICAgICBjb25zdCBvcmJpdENvbnRyb2xzID0gbmV3IE9yYml0Q29udHJvbHMoY2FtZXJhLCByZW5kZXJlci5kb21FbGVtZW50KTtcblxuICAgICAgICB0aGlzLmNyZWF0ZVNjZW5lKCk7XG5cbiAgICAgICAgY29uc3QgcmVuZGVyOiBGcmFtZVJlcXVlc3RDYWxsYmFjayA9ICh0aW1lKSA9PiB7XG4gICAgICAgICAgICBvcmJpdENvbnRyb2xzLnVwZGF0ZSgpO1xuICAgICAgICAgICAgcmVuZGVyZXIucmVuZGVyKHRoaXMuc2NlbmUsIGNhbWVyYSk7XG4gICAgICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUocmVuZGVyKTtcbiAgICAgICAgfTtcbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHJlbmRlcik7XG5cbiAgICAgICAgcmVuZGVyZXIuZG9tRWxlbWVudC5zdHlsZS5jc3NGbG9hdCA9IFwibGVmdFwiO1xuICAgICAgICByZW5kZXJlci5kb21FbGVtZW50LnN0eWxlLm1hcmdpbiA9IFwiMTBweFwiO1xuICAgICAgICByZXR1cm4gcmVuZGVyZXIuZG9tRWxlbWVudDtcbiAgICB9O1xuXG4gICAgcHJpdmF0ZSBjcmVhdGVTY2VuZSA9ICgpID0+IHtcbiAgICAgICAgdGhpcy5zY2VuZSA9IG5ldyBUSFJFRS5TY2VuZSgpO1xuXG4gICAgICAgIGNvbnN0IGN1YmVNZXNoZXM6IFRIUkVFLk1lc2hbXSA9IFtdO1xuICAgICAgICBjb25zdCBjdWJlQm9kaWVzOiBDQU5OT04uQm9keVtdID0gW107XG5cbiAgICAgICAgY29uc3QgbnVtMSA9IDI1O1xuICAgICAgICBjb25zdCBudW0yID0gMTU7XG4gICAgICAgIGNvbnN0IHNwYWNlID0gMC42Oy8v44OJ44Of44OO44Gu6ZaT6ZqU6Kq/5pW0XG5cbiAgICAgICAgY29uc3QgY3ViZVNoYXBlID0gbmV3IENBTk5PTi5Cb3gobmV3IENBTk5PTi5WZWMzKDAuMjUsIDAuNSwgMC4xKSk7XG5cbiAgICAgICAgY29uc3Qgd29ybGQgPSBuZXcgQ0FOTk9OLldvcmxkKHsgZ3Jhdml0eTogbmV3IENBTk5PTi5WZWMzKDAsIC05LjgyLCAwKSB9KTtcbiAgICAgICAgd29ybGQuZGVmYXVsdENvbnRhY3RNYXRlcmlhbC5mcmljdGlvbiA9IDAuMDE7Ly/mkanmk6bkv4LmlbBcbiAgICAgICAgd29ybGQuZGVmYXVsdENvbnRhY3RNYXRlcmlhbC5yZXN0aXR1dGlvbiA9IDAuOTsvL+WPjeeZuuS/guaVsFxuXG4gICAgICAgIGNvbnN0IGdlb21ldHJ5ID0gbmV3IFRIUkVFLkJveEdlb21ldHJ5KDAuNSwgMSwgMC4yKTsvL2dlb21ldHJ5XG4gICAgICAgIGxldCBtYXRlcmlhbDsvL21hdGVyaWFsXG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW0xOyBpKyspIHtcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgbnVtMjsgaisrKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgeCA9IChpIC0gbnVtMSAvIDIpICogc3BhY2U7Ly945bqn5qiZXG4gICAgICAgICAgICAgICAgY29uc3QgeiA9IChqIC0gbnVtMiAvIDIpICogc3BhY2U7Ly965bqn5qiZXG5cbiAgICAgICAgICAgICAgICBpZiAoKGkgPj0gMSAmJiBpIDw9IDYgJiYgaiA9PSAzKSB8fCAoaSA+PSAzICYmIGkgPD0gNCAmJiBqID49IDMgJiYgaiA8PSAxMClcbiAgICAgICAgICAgICAgICAgICAgfHwgKGkgPT0gOSAmJiBqID49IDMgJiYgaiA8PSAxMCkgfHwgKGkgPj0gMTAgJiYgaSA8PSAxMiAmJiAoaiA9PSAzIHx8IGogPT0gMTApKSB8fCAoaSA9PSAxMyAmJiAoaiA9PSA0IHx8IGogPT0gOSkpIHx8IChpID09IDE0ICYmIGogPj0gNSAmJiBqIDw9IDgpXG4gICAgICAgICAgICAgICAgICAgIHx8IChpID09IDE3ICYmIGogPj0gMyAmJiBqIDw9IDkpIHx8IChqID09IDEwICYmIGkgPj0gMTggJiYgaSA8PSAyMSkgfHwgKGkgPT0gMjIgJiYgaiA+PSAzICYmIGogPD0gOSkpIHtcbiAgICAgICAgICAgICAgICAgICAgLy/ihpHjga7mnaHku7bjgpLmuoDjgZ/jgZfjgZ/jg4njg5/jg47jgYzpnZLjgavjgarjgovwn5GHXG4gICAgICAgICAgICAgICAgICAgIG1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hMYW1iZXJ0TWF0ZXJpYWwoeyBjb2xvcjogMHgwMDAwZmYgfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy/jgZ3jgozku6XlpJbjga/nmb1cbiAgICAgICAgICAgICAgICAgICAgbWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaExhbWJlcnRNYXRlcmlhbCh7IGNvbG9yOiAweGZmZmYwMCB9KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjb25zdCBtZXNoID0gbmV3IFRIUkVFLk1lc2goZ2VvbWV0cnksIG1hdGVyaWFsKTtcbiAgICAgICAgICAgICAgICBtZXNoLnBvc2l0aW9uLnNldCh4LCAwLjUsIHopO1xuICAgICAgICAgICAgICAgIGlmIChqID09PSAwKSBtZXNoLnJvdGF0ZVgoMC41KTsvLzHliJfnm67jga7jg4njg5/jg47jgpLlgr7jgZHjgotcblxuICAgICAgICAgICAgICAgIHRoaXMuc2NlbmUuYWRkKG1lc2gpO1xuICAgICAgICAgICAgICAgIGN1YmVNZXNoZXMucHVzaChtZXNoKTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IGJvZHkgPSBuZXcgQ0FOTk9OLkJvZHkoeyBtYXNzOiAyIH0pOy8vMmtnXG4gICAgICAgICAgICAgICAgYm9keS5hZGRTaGFwZShjdWJlU2hhcGUpO1xuICAgICAgICAgICAgICAgIGJvZHkucG9zaXRpb24uc2V0KG1lc2gucG9zaXRpb24ueCwgbWVzaC5wb3NpdGlvbi55LCBtZXNoLnBvc2l0aW9uLnopOy8vcG9zaXRpb27jga7liJ3mnJ/ljJZcbiAgICAgICAgICAgICAgICBib2R5LnF1YXRlcm5pb24uc2V0KG1lc2gucXVhdGVybmlvbi54LCBtZXNoLnF1YXRlcm5pb24ueSwgbWVzaC5xdWF0ZXJuaW9uLnosIG1lc2gucXVhdGVybmlvbi53KTsvL3F1YXRlcm5pb27jga7liJ3mnJ/ljJZcbiAgICAgICAgICAgICAgICBjdWJlQm9kaWVzLnB1c2goYm9keSk7XG4gICAgICAgICAgICAgICAgd29ybGQuYWRkQm9keShib2R5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8v5Zyw6Z2iXG4gICAgICAgIGNvbnN0IHBob25nTWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaFBob25nTWF0ZXJpYWwoe1xuICAgICAgICAgICAgY29sb3I6IDB4ZmZmZmZmLFxuICAgICAgICAgICAgdHJhbnNwYXJlbnQ6IHRydWUsXG4gICAgICAgICAgICBvcGFjaXR5OiAwLC8v6YCP5piOXG4gICAgICAgICAgICBzaWRlOiBUSFJFRS5Eb3VibGVTaWRlLy/kuKHpnaLooajnpLpcbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnN0IHBsYW5lR2VvbWV0cnkgPSBuZXcgVEhSRUUuUGxhbmVHZW9tZXRyeSgyNSwgMjUpO1xuICAgICAgICBjb25zdCBwbGFuZU1lc2ggPSBuZXcgVEhSRUUuTWVzaChwbGFuZUdlb21ldHJ5LCBwaG9uZ01hdGVyaWFsKTtcbiAgICAgICAgcGxhbmVNZXNoLnJvdGF0ZVgoLU1hdGguUEkgLyAyKTtcbiAgICAgICAgdGhpcy5zY2VuZS5hZGQocGxhbmVNZXNoKTsvL+OCt+ODvOODs+OBrui/veWKoFxuXG4gICAgICAgIGNvbnN0IHBsYW5lU2hhcGUgPSBuZXcgQ0FOTk9OLlBsYW5lKCk7XG4gICAgICAgIGNvbnN0IHBsYW5lQm9keSA9IG5ldyBDQU5OT04uQm9keSh7IG1hc3M6IDAgfSk7Ly8wa2dcbiAgICAgICAgcGxhbmVCb2R5LmFkZFNoYXBlKHBsYW5lU2hhcGUpO1xuICAgICAgICBwbGFuZUJvZHkucG9zaXRpb24uc2V0KHBsYW5lTWVzaC5wb3NpdGlvbi54LCBwbGFuZU1lc2gucG9zaXRpb24ueSwgcGxhbmVNZXNoLnBvc2l0aW9uLnopOy8vcG9zaXRpb27jga7liJ3mnJ/ljJZcbiAgICAgICAgcGxhbmVCb2R5LnF1YXRlcm5pb24uc2V0KHBsYW5lTWVzaC5xdWF0ZXJuaW9uLngsIHBsYW5lTWVzaC5xdWF0ZXJuaW9uLnksIHBsYW5lTWVzaC5xdWF0ZXJuaW9uLnosIHBsYW5lTWVzaC5xdWF0ZXJuaW9uLncpOy8vcXVhdGVybmlvbuOBruWIneacn+WMllxuICAgICAgICB3b3JsZC5hZGRCb2R5KHBsYW5lQm9keSk7XG5cbiAgICAgICAgLy/jg6njgqTjg4hcbiAgICAgICAgdGhpcy5saWdodCA9IG5ldyBUSFJFRS5EaXJlY3Rpb25hbExpZ2h0KDB4ZmZmZmZmKTtcbiAgICAgICAgY29uc3QgbHZlYyA9IG5ldyBUSFJFRS5WZWN0b3IzKDEsIDEsIDEpLm5vcm1hbGl6ZSgpO1xuICAgICAgICB0aGlzLmxpZ2h0LnBvc2l0aW9uLnNldChsdmVjLngsIGx2ZWMueSwgbHZlYy56KTtcbiAgICAgICAgdGhpcy5zY2VuZS5hZGQodGhpcy5saWdodCk7XG5cbiAgICAgICAgLy/oirHngaso44OR44O844OG44Kj44Kv44Or44Gu55Sf5oiQKVxuICAgICAgICBjb25zdCBwYXJ0aWNsZUNvdW50ID0gNTAwO1xuICAgICAgICBjb25zdCBwYXJ0aWNsZXNHZW9tZXRyeSA9IG5ldyBUSFJFRS5CdWZmZXJHZW9tZXRyeSgpO1xuICAgICAgICBjb25zdCByYWRpdXMgPSA2O1xuICAgICAgICBjb25zdCBwb3NpdGlvbnMgPSBuZXcgRmxvYXQzMkFycmF5KHBhcnRpY2xlQ291bnQgKiAzKTsvLzUwMCoz44Gu6YWN5YiX44KS55So5oSPXG4gICAgICAgIGNvbnN0IHZlbG9jaXRpZXMgPSBuZXcgRmxvYXQzMkFycmF5KHBhcnRpY2xlQ291bnQgKiAzKTsvL+iKseeBq+OBp+S9v+OBhlxuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcGFydGljbGVDb3VudDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCB0aGV0YSA9IChpIC8gcGFydGljbGVDb3VudCkgKiBNYXRoLlBJICogMjtcbiAgICAgICAgICAgIHBvc2l0aW9uc1tpICogMyArIDBdID0gTWF0aC5jb3ModGhldGEpICogcmFkaXVzOy8veOOBr+WGhuOCkuaPj+OBj+OCpOODoeODvOOCuFxuICAgICAgICAgICAgcG9zaXRpb25zW2kgKiAzICsgMV0gPSAyOy8veT0yXG4gICAgICAgICAgICBwb3NpdGlvbnNbaSAqIDMgKyAyXSA9IE1hdGguc2luKHRoZXRhKSAqIHJhZGl1czsvL3rjga/lhobjgpLmj4/jgY/jgqTjg6Hjg7zjgrhcblxuICAgICAgICAgICAgLy/mnIDliJ3jga/li5XjgYvjgarjgYRcbiAgICAgICAgICAgIHZlbG9jaXRpZXNbaSAqIDMgKyAwXSA9IDA7XG4gICAgICAgICAgICB2ZWxvY2l0aWVzW2kgKiAzICsgMV0gPSAwO1xuICAgICAgICAgICAgdmVsb2NpdGllc1tpICogMyArIDJdID0gMDtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGNvbG9ycyA9IG5ldyBGbG9hdDMyQXJyYXkocGFydGljbGVDb3VudCAqIDMpOy8v6Imy44Gu6YWN5YiX44KS55So5oSPXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcGFydGljbGVDb3VudDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgY29sb3I6IFRIUkVFLkNvbG9yO1xuICAgICAgICAgICAgY29uc3QgciA9IE1hdGgucmFuZG9tKCk7XG5cbiAgICAgICAgICAgIC8v6Imy44Gu44Op44Oz44OA44Og55Sf5oiQXG4gICAgICAgICAgICBpZiAociA8IDAuMTI1KSB7XG4gICAgICAgICAgICAgICAgY29sb3IgPSBuZXcgVEhSRUUuQ29sb3IoMHhmZjAwMDApOy8v6LWkXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHIgPj0gMC4xMjUgJiYgciA8IDAuMjUwKSB7XG4gICAgICAgICAgICAgICAgY29sb3IgPSBuZXcgVEhSRUUuQ29sb3IoMHhmZmZmMDApOy8v6buE6ImyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHIgPj0gMC4yNSAmJiByIDwgMC4zNzUpIHtcbiAgICAgICAgICAgICAgICBjb2xvciA9IG5ldyBUSFJFRS5Db2xvcigweGZmMDBmZik7Ly/jg57jgrzjg7Pjgr9cbiAgICAgICAgICAgIH0gZWxzZSBpZiAociA+PSAwLjM3NSAmJiByIDwgMC41MCkge1xuICAgICAgICAgICAgICAgIGNvbG9yID0gbmV3IFRIUkVFLkNvbG9yKDB4MDBmZjAwKTsvL+e3kVxuICAgICAgICAgICAgfSBlbHNlIGlmIChyID49IDAuNTAgJiYgciA8IDAuNjI1KSB7XG4gICAgICAgICAgICAgICAgY29sb3IgPSBuZXcgVEhSRUUuQ29sb3IoMHgwMGZmZmYpOy8v44K344Ki44OzXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHIgPj0gMC42MjUgJiYgciA8IDAuNzUpIHtcbiAgICAgICAgICAgICAgICBjb2xvciA9IG5ldyBUSFJFRS5Db2xvcigweDAwMDBmZik7Ly/pnZJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAociA+PSAwLjc1ICYmIHIgPCAwLjg3NSkge1xuICAgICAgICAgICAgICAgIGNvbG9yID0gbmV3IFRIUkVFLkNvbG9yKDB4MDAwMDAwKTsvL+m7klxuICAgICAgICAgICAgfSBlbHNlIGlmIChyID49IDAuODc1KSB7XG4gICAgICAgICAgICAgICAgY29sb3IgPSBuZXcgVEhSRUUuQ29sb3IoMHhmZmZmZmYpOy8v55m9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8v6YWN5YiX44Gr5qC857SNXG4gICAgICAgICAgICBjb2xvcnNbaSAqIDMgKyAwXSA9IGNvbG9yLnI7XG4gICAgICAgICAgICBjb2xvcnNbaSAqIDMgKyAxXSA9IGNvbG9yLmc7XG4gICAgICAgICAgICBjb2xvcnNbaSAqIDMgKyAyXSA9IGNvbG9yLmI7XG4gICAgICAgIH1cblxuICAgICAgICAvL+OCquODluOCuOOCp+OCr+ODiOOCkuS9nOaIkFxuICAgICAgICBwYXJ0aWNsZXNHZW9tZXRyeS5zZXRBdHRyaWJ1dGUoXCJjb2xvclwiLCBuZXcgVEhSRUUuQnVmZmVyQXR0cmlidXRlKGNvbG9ycywgMykpO1xuICAgICAgICBwYXJ0aWNsZXNHZW9tZXRyeS5zZXRBdHRyaWJ1dGUoXCJwb3NpdGlvblwiLCBuZXcgVEhSRUUuQnVmZmVyQXR0cmlidXRlKHBvc2l0aW9ucywgMykpO1xuICAgICAgICBwYXJ0aWNsZXNHZW9tZXRyeS5zZXRBdHRyaWJ1dGUoXCJ2ZWxvY2l0eVwiLCBuZXcgVEhSRUUuQnVmZmVyQXR0cmlidXRlKHZlbG9jaXRpZXMsIDMpKTtcblxuICAgICAgICBjb25zdCBwYXJ0aWNsZXNNYXRlcmlhbCA9IG5ldyBUSFJFRS5Qb2ludHNNYXRlcmlhbCh7XG4gICAgICAgICAgICBzaXplOiAwLjE1LFxuICAgICAgICAgICAgdHJhbnNwYXJlbnQ6IHRydWUsXG4gICAgICAgICAgICBvcGFjaXR5OiAwLjksXG4gICAgICAgICAgICB2ZXJ0ZXhDb2xvcnM6IHRydWUvL+OCq+ODqeODleODq+OBq+OBmeOCi+OBn+OCgeOBq+i/veWKoFxuICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCBwYXJ0aWNsZXMgPSBuZXcgVEhSRUUuUG9pbnRzKHBhcnRpY2xlc0dlb21ldHJ5LCBwYXJ0aWNsZXNNYXRlcmlhbCk7Ly9tZXNo44Gu5L2c5oiQXG4gICAgICAgIHBhcnRpY2xlcy52aXNpYmxlID0gZmFsc2U7Ly/mnIDliJ3jga/pnZ7ooajnpLpcbiAgICAgICAgdGhpcy5zY2VuZS5hZGQocGFydGljbGVzKTtcblxuICAgICAgICBsZXQgc3RhcnRUaW1lID0gcGVyZm9ybWFuY2Uubm93KCk7XG4gICAgICAgIGxldCBoYXNMYXVuY2hlZCA9IGZhbHNlOy8v6Iqx54Gr44Gu5omT44Gh5LiK44GSXG4gICAgICAgIGxldCBoYXNFeHBsb2RlZCA9IGZhbHNlOy8v54iG55m6XG4gICAgICAgIGxldCBzQ291bnQgPSAwOy8v54iG55m644Gu5Zue5pWwXG4gICAgICAgIGNvbnN0IGxhdW5jaEhlaWdodCA9IDg7Ly/jgZPjgZPjgb7jgafjgYTjgaPjgZ/jgonniIbnmbpcblxuICAgICAgICBjb25zdCB1cGRhdGU6IEZyYW1lUmVxdWVzdENhbGxiYWNrID0gKCkgPT4ge1xuICAgICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHVwZGF0ZSk7XG5cbiAgICAgICAgICAgIHdvcmxkLmZpeGVkU3RlcCgpO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjdWJlTWVzaGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgY3ViZU1lc2hlc1tpXS5wb3NpdGlvbi5zZXQoY3ViZUJvZGllc1tpXS5wb3NpdGlvbi54LCBjdWJlQm9kaWVzW2ldLnBvc2l0aW9uLnksIGN1YmVCb2RpZXNbaV0ucG9zaXRpb24ueik7XG4gICAgICAgICAgICAgICAgY3ViZU1lc2hlc1tpXS5xdWF0ZXJuaW9uLnNldChjdWJlQm9kaWVzW2ldLnF1YXRlcm5pb24ueCwgY3ViZUJvZGllc1tpXS5xdWF0ZXJuaW9uLnksIGN1YmVCb2RpZXNbaV0ucXVhdGVybmlvbi56LCBjdWJlQm9kaWVzW2ldLnF1YXRlcm5pb24udyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8v5bGe5oCn44Gr6Zai44GX44GmXG4gICAgICAgICAgICBjb25zdCBwb3NBdHRyID0gcGFydGljbGVzR2VvbWV0cnkuZ2V0QXR0cmlidXRlKFwicG9zaXRpb25cIikgYXMgVEhSRUUuQnVmZmVyQXR0cmlidXRlO1xuICAgICAgICAgICAgY29uc3QgdmVsQXR0ciA9IHBhcnRpY2xlc0dlb21ldHJ5LmdldEF0dHJpYnV0ZShcInZlbG9jaXR5XCIpIGFzIFRIUkVFLkJ1ZmZlckF0dHJpYnV0ZTtcblxuXG4gICAgICAgICAgICBjb25zdCBlbGFwc2VkID0gKHBlcmZvcm1hbmNlLm5vdygpIC0gc3RhcnRUaW1lKSAvIDEwMDA7Ly/mmYLplpPntYzpgY5cbiAgICAgICAgICAgIGNvbnN0IHdhaXRUaW1lID0gc0NvdW50ID09PSAwID8gNiA6IDE7XG5cblxuICAgICAgICAgICAgaWYgKCFoYXNMYXVuY2hlZCAmJiBlbGFwc2VkID49IHdhaXRUaW1lKSB7XG4gICAgICAgICAgICAgICAgaGFzTGF1bmNoZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHBhcnRpY2xlcy52aXNpYmxlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBzQ291bnQrKztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgXG4gICAgICAgICAgICAvL+ODkeODvOODhuOCo+OCr+ODq+OBruaDheWgseabtOaWsFxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwYXJ0aWNsZUNvdW50OyBpKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgeCA9IHBvc0F0dHIuZ2V0WChpKTtcbiAgICAgICAgICAgICAgICBsZXQgeSA9IHBvc0F0dHIuZ2V0WShpKTtcbiAgICAgICAgICAgICAgICBsZXQgeiA9IHBvc0F0dHIuZ2V0WihpKTtcblxuICAgICAgICAgICAgICAgIC8v44Ki44OL44Oh44O844K344On44Oz44GM6ZaL5aeL44GX44GmNuenkuOBn+OBo+OBpuOBhOOBn+OCiVxuICAgICAgICAgICAgICAgIGlmICghaGFzTGF1bmNoZWQgJiYgZWxhcHNlZCA+PSA2KSB7XG4gICAgICAgICAgICAgICAgICAgIGhhc0xhdW5jaGVkID0gdHJ1ZTsvL+mWi+Wni1xuICAgICAgICAgICAgICAgICAgICBwYXJ0aWNsZXMudmlzaWJsZSA9IHRydWU7Ly/jg5Hjg7zjg4bjgqPjgq/jg6vjgYzopovjgYjjgotcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvL+mWi+Wni+OBi+OBpOOBvuOBoOeIhueZuuOBl+OBpuOBhOOBquOBhFxuICAgICAgICAgICAgICAgIGlmIChoYXNMYXVuY2hlZCAmJiAhaGFzRXhwbG9kZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgeSArPSAwLjE7Ly/jg5Hjg7zjg4bjgqPjgq/jg6vjgYzkuIrmmIdcbiAgICAgICAgICAgICAgICAgICAgaWYgKHkgPj0gbGF1bmNoSGVpZ2h0KSB7Ly/pq5jjgZXjgYw45Lul5LiKXG4gICAgICAgICAgICAgICAgICAgICAgICBoYXNFeHBsb2RlZCA9IHRydWU7Ly/niIbnmbpcbiAgICAgICAgICAgICAgICAgICAgICAgIC8v44Op44Oz44OA44Og44Gq6YCf5bqm44OZ44Kv44OI44Or44KS5LuY5LiOXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHBhcnRpY2xlQ291bnQ7IGorKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHRoZXRhID0gKGogLyBwYXJ0aWNsZUNvdW50KSAqIE1hdGguUEkgKiAyO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHJhZGl1cyA9IDAuMiArIE1hdGgucmFuZG9tKCkgKiAwLjE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdnggPSBNYXRoLmNvcyh0aGV0YSkgKiByYWRpdXM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdnkgPSAwLjMgKyBNYXRoLnJhbmRvbSgpICogMC4xO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHZ6ID0gTWF0aC5zaW4odGhldGEpICogcmFkaXVzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZlbEF0dHIuc2V0WFlaKGosIHZ4LCB2eSwgdnopO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgLy/mm7TmlrBcbiAgICAgICAgICAgICAgICAgICAgICAgIHZlbEF0dHIubmVlZHNVcGRhdGUgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHBvc0F0dHIuc2V0WShpLCB5KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvL+eIhueZuuOBl+OBn+OCiVxuICAgICAgICAgICAgICAgIGlmIChoYXNFeHBsb2RlZCkge1xuICAgICAgICAgICAgICAgICAgICAvL+S9jee9ruaDheWgseOCkuWPluW+l1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB2eCA9IHZlbEF0dHIuZ2V0WChpKTsvL3jjga7pgJ/luqbjg5njgq/jg4jjg6tcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdnkgPSB2ZWxBdHRyLmdldFkoaSk7Ly9544Gu6YCf5bqm44OZ44Kv44OI44OrXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHZ6ID0gdmVsQXR0ci5nZXRaKGkpOy8veuOBrumAn+W6puODmeOCr+ODiOODq1xuXG4gICAgICAgICAgICAgICAgICAgIHBvc0F0dHIuc2V0WFlaKGksIHggKyB2eCwgeSArIHZ5LCB6ICsgdnopOy8vcG9zaXRpb27mm7TmlrBcbiAgICAgICAgICAgICAgICAgICAgdmVsQXR0ci5zZXRYWVooaSwgdnggKiAwLjk4LCB2eSAqIDAuOTggLSAwLjAxLCB2eiAqIDAuOTgpOy8v54mp55CG5ryU566XXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBwb3NBdHRyLm5lZWRzVXBkYXRlID0gdHJ1ZTtcblxuICAgICAgICAgICAgLy/niIbnmbrjgZfjgZ/jgolcbiAgICAgICAgICAgIGlmIChoYXNFeHBsb2RlZCkge1xuICAgICAgICAgICAgICAgIGxldCBhbGxCZWxvdyA9IHRydWU7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwYXJ0aWNsZUNvdW50OyBpKyspIHsvL+ODkeODvOODhuOCo+OCr+ODq+OBjHk8MOOBq+OBquOCi+OBqFxuICAgICAgICAgICAgICAgICAgICBpZiAocG9zQXR0ci5nZXRZKGkpID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYWxsQmVsb3cgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKGFsbEJlbG93KSB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcGFydGljbGVDb3VudDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL+ODquOCu+ODg+ODiFxuICAgICAgICAgICAgICAgICAgICAgICAgcG9zQXR0ci5zZXRYWVooaSwgMCwgMCwgMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB2ZWxBdHRyLnNldFhZWihpLCAwLCAwLCAwKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8v5pu05pawXG4gICAgICAgICAgICAgICAgICAgIHBvc0F0dHIubmVlZHNVcGRhdGUgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB2ZWxBdHRyLm5lZWRzVXBkYXRlID0gdHJ1ZTtcblxuICAgICAgICAgICAgICAgICAgICAvL+aZgumWk+OBruODquOCu+ODg+ODiFxuICAgICAgICAgICAgICAgICAgICBzdGFydFRpbWUgPSBwZXJmb3JtYW5jZS5ub3coKTtcblxuICAgICAgICAgICAgICAgICAgICAvL+ODleODqeOCsOOBqOODkeODvOODhuOCo+OCr+ODq+OBruODquOCu+ODg+ODiFxuICAgICAgICAgICAgICAgICAgICBoYXNMYXVuY2hlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBoYXNFeHBsb2RlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBwYXJ0aWNsZXMudmlzaWJsZSA9IGZhbHNlO1xuXG4gICAgICAgICAgICAgICAgICAgIC8v5paw44GX44GE6YCf5bqm44OZ44Kv44OI44Or44Gu5L2c5oiQXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcGFydGljbGVDb3VudDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBhbmdsZSA9IChpIC8gcGFydGljbGVDb3VudCkgKiBNYXRoLlBJICogMjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHJhZGl1cyA9IDAuMiArIE1hdGgucmFuZG9tKCkgKiAwLjE7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB2eCA9IE1hdGguY29zKGFuZ2xlKSAqIHJhZGl1cztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHZ5ID0gMC4zICsgTWF0aC5yYW5kb20oKSAqIDAuMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHZ6ID0gTWF0aC5zaW4oYW5nbGUpICogcmFkaXVzO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmVsQXR0ci5zZXRYWVooaSwgdngsIHZ5LCB2eik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdmVsQXR0ci5uZWVkc1VwZGF0ZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcG9zQXR0ci5uZWVkc1VwZGF0ZSA9IHRydWU7XG5cbiAgICAgICAgfTtcblxuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodXBkYXRlKTtcblxuICAgIH1cbn1cblxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsIGluaXQpO1xuXG5mdW5jdGlvbiBpbml0KCkge1xuICAgIGNvbnN0IGNvbnRhaW5lciA9IG5ldyBUaHJlZUpTQ29udGFpbmVyKCk7XG4gICAgY29uc3Qgdmlld3BvcnQgPSBjb250YWluZXIuY3JlYXRlUmVuZGVyZXJET00oNjQwLCA0ODAsIG5ldyBUSFJFRS5WZWN0b3IzKDUsIDUsIDUpKTtcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHZpZXdwb3J0KTtcbn1cbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4vLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuX193ZWJwYWNrX3JlcXVpcmVfXy5tID0gX193ZWJwYWNrX21vZHVsZXNfXztcblxuIiwidmFyIGRlZmVycmVkID0gW107XG5fX3dlYnBhY2tfcmVxdWlyZV9fLk8gPSAocmVzdWx0LCBjaHVua0lkcywgZm4sIHByaW9yaXR5KSA9PiB7XG5cdGlmKGNodW5rSWRzKSB7XG5cdFx0cHJpb3JpdHkgPSBwcmlvcml0eSB8fCAwO1xuXHRcdGZvcih2YXIgaSA9IGRlZmVycmVkLmxlbmd0aDsgaSA+IDAgJiYgZGVmZXJyZWRbaSAtIDFdWzJdID4gcHJpb3JpdHk7IGktLSkgZGVmZXJyZWRbaV0gPSBkZWZlcnJlZFtpIC0gMV07XG5cdFx0ZGVmZXJyZWRbaV0gPSBbY2h1bmtJZHMsIGZuLCBwcmlvcml0eV07XG5cdFx0cmV0dXJuO1xuXHR9XG5cdHZhciBub3RGdWxmaWxsZWQgPSBJbmZpbml0eTtcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBkZWZlcnJlZC5sZW5ndGg7IGkrKykge1xuXHRcdHZhciBbY2h1bmtJZHMsIGZuLCBwcmlvcml0eV0gPSBkZWZlcnJlZFtpXTtcblx0XHR2YXIgZnVsZmlsbGVkID0gdHJ1ZTtcblx0XHRmb3IgKHZhciBqID0gMDsgaiA8IGNodW5rSWRzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRpZiAoKHByaW9yaXR5ICYgMSA9PT0gMCB8fCBub3RGdWxmaWxsZWQgPj0gcHJpb3JpdHkpICYmIE9iamVjdC5rZXlzKF9fd2VicGFja19yZXF1aXJlX18uTykuZXZlcnkoKGtleSkgPT4gKF9fd2VicGFja19yZXF1aXJlX18uT1trZXldKGNodW5rSWRzW2pdKSkpKSB7XG5cdFx0XHRcdGNodW5rSWRzLnNwbGljZShqLS0sIDEpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZnVsZmlsbGVkID0gZmFsc2U7XG5cdFx0XHRcdGlmKHByaW9yaXR5IDwgbm90RnVsZmlsbGVkKSBub3RGdWxmaWxsZWQgPSBwcmlvcml0eTtcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYoZnVsZmlsbGVkKSB7XG5cdFx0XHRkZWZlcnJlZC5zcGxpY2UoaS0tLCAxKVxuXHRcdFx0dmFyIHIgPSBmbigpO1xuXHRcdFx0aWYgKHIgIT09IHVuZGVmaW5lZCkgcmVzdWx0ID0gcjtcblx0XHR9XG5cdH1cblx0cmV0dXJuIHJlc3VsdDtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIi8vIG5vIGJhc2VVUklcblxuLy8gb2JqZWN0IHRvIHN0b3JlIGxvYWRlZCBhbmQgbG9hZGluZyBjaHVua3Ncbi8vIHVuZGVmaW5lZCA9IGNodW5rIG5vdCBsb2FkZWQsIG51bGwgPSBjaHVuayBwcmVsb2FkZWQvcHJlZmV0Y2hlZFxuLy8gW3Jlc29sdmUsIHJlamVjdCwgUHJvbWlzZV0gPSBjaHVuayBsb2FkaW5nLCAwID0gY2h1bmsgbG9hZGVkXG52YXIgaW5zdGFsbGVkQ2h1bmtzID0ge1xuXHRcIm1haW5cIjogMFxufTtcblxuLy8gbm8gY2h1bmsgb24gZGVtYW5kIGxvYWRpbmdcblxuLy8gbm8gcHJlZmV0Y2hpbmdcblxuLy8gbm8gcHJlbG9hZGVkXG5cbi8vIG5vIEhNUlxuXG4vLyBubyBITVIgbWFuaWZlc3RcblxuX193ZWJwYWNrX3JlcXVpcmVfXy5PLmogPSAoY2h1bmtJZCkgPT4gKGluc3RhbGxlZENodW5rc1tjaHVua0lkXSA9PT0gMCk7XG5cbi8vIGluc3RhbGwgYSBKU09OUCBjYWxsYmFjayBmb3IgY2h1bmsgbG9hZGluZ1xudmFyIHdlYnBhY2tKc29ucENhbGxiYWNrID0gKHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uLCBkYXRhKSA9PiB7XG5cdHZhciBbY2h1bmtJZHMsIG1vcmVNb2R1bGVzLCBydW50aW1lXSA9IGRhdGE7XG5cdC8vIGFkZCBcIm1vcmVNb2R1bGVzXCIgdG8gdGhlIG1vZHVsZXMgb2JqZWN0LFxuXHQvLyB0aGVuIGZsYWcgYWxsIFwiY2h1bmtJZHNcIiBhcyBsb2FkZWQgYW5kIGZpcmUgY2FsbGJhY2tcblx0dmFyIG1vZHVsZUlkLCBjaHVua0lkLCBpID0gMDtcblx0aWYoY2h1bmtJZHMuc29tZSgoaWQpID0+IChpbnN0YWxsZWRDaHVua3NbaWRdICE9PSAwKSkpIHtcblx0XHRmb3IobW9kdWxlSWQgaW4gbW9yZU1vZHVsZXMpIHtcblx0XHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhtb3JlTW9kdWxlcywgbW9kdWxlSWQpKSB7XG5cdFx0XHRcdF9fd2VicGFja19yZXF1aXJlX18ubVttb2R1bGVJZF0gPSBtb3JlTW9kdWxlc1ttb2R1bGVJZF07XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmKHJ1bnRpbWUpIHZhciByZXN1bHQgPSBydW50aW1lKF9fd2VicGFja19yZXF1aXJlX18pO1xuXHR9XG5cdGlmKHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uKSBwYXJlbnRDaHVua0xvYWRpbmdGdW5jdGlvbihkYXRhKTtcblx0Zm9yKDtpIDwgY2h1bmtJZHMubGVuZ3RoOyBpKyspIHtcblx0XHRjaHVua0lkID0gY2h1bmtJZHNbaV07XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGluc3RhbGxlZENodW5rcywgY2h1bmtJZCkgJiYgaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdKSB7XG5cdFx0XHRpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF1bMF0oKTtcblx0XHR9XG5cdFx0aW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdID0gMDtcblx0fVxuXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXy5PKHJlc3VsdCk7XG59XG5cbnZhciBjaHVua0xvYWRpbmdHbG9iYWwgPSBzZWxmW1wid2VicGFja0NodW5rY2dwcmVuZGVyaW5nXCJdID0gc2VsZltcIndlYnBhY2tDaHVua2NncHJlbmRlcmluZ1wiXSB8fCBbXTtcbmNodW5rTG9hZGluZ0dsb2JhbC5mb3JFYWNoKHdlYnBhY2tKc29ucENhbGxiYWNrLmJpbmQobnVsbCwgMCkpO1xuY2h1bmtMb2FkaW5nR2xvYmFsLnB1c2ggPSB3ZWJwYWNrSnNvbnBDYWxsYmFjay5iaW5kKG51bGwsIGNodW5rTG9hZGluZ0dsb2JhbC5wdXNoLmJpbmQoY2h1bmtMb2FkaW5nR2xvYmFsKSk7IiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBkZXBlbmRzIG9uIG90aGVyIGxvYWRlZCBjaHVua3MgYW5kIGV4ZWN1dGlvbiBuZWVkIHRvIGJlIGRlbGF5ZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXy5PKHVuZGVmaW5lZCwgW1widmVuZG9ycy1ub2RlX21vZHVsZXNfY2Fubm9uLWVzX2Rpc3RfY2Fubm9uLWVzX2pzLW5vZGVfbW9kdWxlc190aHJlZV9leGFtcGxlc19qc21fY29udHJvbHNfT3JiLWU1OGJkMlwiXSwgKCkgPT4gKF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9hcHAudHNcIikpKVxuX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18uTyhfX3dlYnBhY2tfZXhwb3J0c19fKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==