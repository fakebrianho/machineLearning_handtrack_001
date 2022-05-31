const video = document.getElementById('myvideo')
// import './style.css'
const handimg = document.getElementById('handimage')
const canvas = document.getElementById('canvas')
const context = canvas.getContext('2d')
let trackButton = document.getElementById('trackbutton')
let nextImageButton = document.getElementById('nextimagebutton')
let updateNote = document.getElementById('updatenote')
let preloader = document.getElementById('preload')
let track = []
let isVideo = false
let model = null
let mappedVal
let mappedValY
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import vertex from './shaders/vertexShader.glsl'
import fragment from './shaders/fragmentShader.glsl'
const pointer = new THREE.Vector2()

const modelParams = {
	flipHorizontal: true, // flip e.g for video
	maxNumBoxes: 20, // maximum number of boxes to detect
	iouThreshold: 0.5, // ioU threshold for non-max suppression
	scoreThreshold: 0.6, // confidence threshold for predictions.
}

function startVideo() {
	handTrack.startVideo(video).then(function (status) {
		video.style.display = 'none'
		if (status) {
			isVideo = true
			runDetection()
		} else {
			// updateNote.innerText = 'Please enable video'
		}
	})
}

function toggleVideo() {
	gsap.to(preloader, { opacity: 0, delay: 0.5, duration: 1.5 })
	if (!isVideo) {
		startVideo()
	} else {
		handTrack.stopVideo(video)
		isVideo = false
	}
}

trackButton.addEventListener('click', function () {
	// console.log(video)
	toggleVideo()
})

function runDetection() {
	model.detect(video).then((predictions) => {
		// console.log('Predictions: ', predictions)
		track = predictions.slice(0)
		// model.renderPredictions(predictions, canvas, context, video)
		//code taken from the pong boilerplate in the handtrack.js demo, here I'm normalizing
		// console.log(predictions)
		predictions.forEach((prediction) => {
			if (prediction.label == 'face') {
				let midval = prediction.bbox[0] + prediction.bbox[2] / 2
				let midvalY = prediction.bbox[1] + prediction.bbox[2] / 2

				let midval2 = midval / video.width
				let midvalY2 = midvalY / video.height
				mappedVal = mapRange(midval2, 0, 1, -1, 1)
				mappedValY = mapRange(midvalY2, 0, 1, -1, 1)
			}
		})
		// if (predictions[0]) {
		// 	let midval = predictions[0].bbox[0] + predictions[0].bbox[2] / 2
		// 	let midvalY = predictions[0].bbox[1] + predictions[0].bbox[2] / 2
		// 	let midval2 = midval / video.width
		// 	let midvalY2 = midvalY / video.height
		// 	mappedVal = mapRange(midval2, 0, 1, -1, 1)
		// 	mappedValY = mapRange(midvalY2, 0, 1, -1, 1)
		// }
		model.renderPredictions(predictions, canvas, context, video)
		if (isVideo) {
			requestAnimationFrame(runDetection)
		}
	})
}

// Load the model.
handTrack.load(modelParams).then((lmodel) => {
	model = lmodel
	console.log(model)
	// updateNote.innerText = 'Loaded Model!'
	trackButton.disabled = false
})

/*------------------------------
Global Setup
------------------------------*/
const canvas3 = document.querySelector('.threeCanvas')
const scene = new THREE.Scene()
const renderer = new THREE.WebGLRenderer({
	canvas: canvas3,
})
let start = Date.now()

const loader = new THREE.TextureLoader()
// tLoader = new THREE.TextureLoader()
const doorColorTextures = loader.load('./explosion.png')

const light = new THREE.AmbientLight(0x404040) // soft white light
scene.add(light)
const geometry = new THREE.IcosahedronGeometry(20, 10)
// const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const material = new THREE.ShaderMaterial({
	uniforms: {
		tExplosion: {
			type: 't',
			value: doorColorTextures,
		},
		uTime: { value: 0 },
		uFreq: { value: 0 },
	},

	vertexShader: vertex,
	fragmentShader: fragment,
})

const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

/*------------------------------
Dimensions
------------------------------*/
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
}

const camera = new THREE.PerspectiveCamera(
	75,
	sizes.width / sizes.height,
	0.1,
	10000
)
camera.position.z = 100
scene.add(camera)

renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
const orbitControls = new OrbitControls(camera, renderer.domElement)

/*------------------------------
Environment Map
------------------------------*/
// const cLoader = new THREE.CubeTextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()

const environmentMap = cubeTextureLoader.load([
	'../px.jpg',
	'../nx.jpg',
	'../py.jpg',
	'../ny.jpg',
	'../pz.jpg',
	'../nz.jpg',
])

console.log(environmentMap)
scene.background = environmentMap
scene.environment = environmentMap
/*------------------------------
Resize
------------------------------*/
window.addEventListener('resize', () => {
	/*------------------------------
  Update Sizes
  ------------------------------*/
	sizes.width = window.innerWidth
	sizes.height = window.innerHeight
	// console.log(sizes.width)
	/*------------------------------
  Update Camera
  ------------------------------*/
	camera.aspect = sizes.width / sizes.height
	camera.updateProjectionMatrix()
	/*------------------------------
  Update Renderer
  ------------------------------*/
	renderer.setSize(sizes.width, sizes.height)
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/*------------------------------
Fullscreen Function
------------------------------*/
window.addEventListener('dblclick', () => {
	if (!document.fullscreenElement) {
		canvas.requestFullscreen()
	} else {
		document.exitFullscreen()
	}
})
/*------------------------------
mover
------------------------------*/

class Mover {
	constructor(x, y, z, m, radius, widthSeg, heightSeg, scene) {
		this.geometry = new THREE.SphereBufferGeometry(
			radius,
			widthSeg,
			heightSeg
		)
		this.testGeo = new THREE.BoxGeometry(5, 5, 5)
		this.material = new THREE.MeshBasicMaterial({ color: '#ff00ff' })
		this.position = new THREE.Vector3(x, y, z)
		this.vel = new THREE.Vector3(
			Math.random() * 1 - 0.5,
			Math.random() * 1 - 0.5,
			0
		)
		this.scene = scene
		this.acc = new THREE.Vector3(0, 0, 0)
		this.mass = m
		this.mesh = new THREE.Mesh(this.testGeo, this.material)
	}

	applyForce(force) {
		let f = force
		this.acc.add(f)
	}

	checkBoundaries() {
		let mp = this.mesh.position
		// // console.log(mp)
		if (mp.x > 150 || mp.x < -150) {
			this.vel.multiplyScalar(-1)
		}
		if (mp.y > 75 || mp.y < -75) {
			this.vel.multiplyScalar(-1)
		}
	}
	addToScene() {
		this.mesh.position.set(
			this.position.x,
			this.position.y,
			this.position.z
		)
		scene.add(this.mesh)
	}
	update() {
		this.vel.add(this.acc)
		this.vel.clampScalar(-0.35, 0.35) // clamp speed
		this.mesh.position.add(this.vel)
		this.acc.set(0, 0, 0)
	}
}
let movers = []
let moverCount = 10
for (let i = 0; i < moverCount; i++) {
	let m = new Mover(Math.random(), Math.random(), 0, 15, 32, 16, scene)
	m.addToScene()
	// m.mesh.position.set(Math.random(), Math.random(), 0)
	movers.push(m)
	// scene.add(m.mesh)
}
let test = new Mover(0, -0.5, 0, 15, 32, 16, scene)

// scene.add(test.mesh)
/*------------------------------
Attraction Function
------------------------------*/
const attract = (mover, attractor, amass, mmass) => {
	let a = new THREE.Vector3(attractor.position.x, attractor.position.y, 0.5)
	let b = new THREE.Vector3(mover.mesh.position.x, mover.mesh.position.y, 0.5)
	let force = a.sub(b)
	force.setLength(0.35)
	// console.log(force)
	let strength
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
	mover.applyForce(force)
	// .sub(attractor.pos, mover.pos)
}

window.addEventListener('pointermove', onPointerMove)
function mapRange(value, a, b, c, d) {
	// first map value from (a..b) to (0..1)
	value = (value - a) / (b - a)
	// then map it from (0..1) to (c..d) and return it
	return c + value * (d - c)
}
function onPointerMove(event) {
	// calculate pointer position in normalized device coordinates
	// (-1 to +1) for both components
	// pointer.x = (event.clientX / window.innerWidth) * 2 - 1
	// pointer.y = -(event.clientY / window.innerHeight) * 2 + 1
	// var vector = new THREE.Vector3(pointer.x, pointer.y, 0.5)
	// vector.unproject(camera)
	// var dir = vector.sub(camera.position).normalize()
	// var distance = -camera.position.z / dir.z
	// var pos = camera.position.clone().add(dir.multiplyScalar(distance))
	// mesh.position.copy(pos)
}

function jankyCheck() {
	let g = new THREE.BoxGeometry(270, 150, 1)
	let m = new THREE.MeshBasicMaterial({ color: '#FFFF00' })
	let jankyObject = new THREE.Mesh(g, m)
	scene.add(jankyObject)
}
// jankyCheck()
console.log(scene)
//Map function from p5

const clock = new THREE.Clock()
const animate = () => {
	/*------------------------------
  Smooth Animation
  ------------------------------*/
	const elapsedTime = clock.getElapsedTime()

	/*------------------------------
  Update Meshes
  ------------------------------*/

	track.forEach((tracked) => {
		if (tracked.label == 'closed') {
			attract(test, mesh, 1, 1)
			for (let i = 0; i < moverCount; i++) {
				attract(movers[i], mesh, 1, 1)
			}
		}
	})
	// console.log(mappedValY)
	if (mappedValY) {
		var vector = new THREE.Vector3(mappedVal, -mappedValY, 0.5)
		vector.unproject(camera)
		var dir = vector.sub(camera.position).normalize()
		var distance = -camera.position.z / dir.z
		var pos = camera.position.clone().add(dir.multiplyScalar(distance))
		// mesh.position.copy(pos)
		mesh.position.lerp(pos, 0.2)
	}
	for (let i = 0; i < moverCount; i++) {
		movers[i].update()
		movers[i].checkBoundaries()
	}
	test.update()
	test.checkBoundaries()
	// console.log(test)
	/*------------------------------
    Update Shader Uniforms
    ------------------------------*/
	// material.uniforms[ 'uTime' ].value = .00025 * ( Date.now() - start );
	// material.uniforms.uTime.value = clock.getElapsedTime()
	material.uniforms.uTime.value = 0.00025 * (Date.now() - start)

	/*------------------------------
	Camera
	------------------------------*/
	camera.rotation.y += 0.01
	/*------------------------------
  Render
  ------------------------------*/
	renderer.render(scene, camera)

	/*------------------------------
  Core
  ------------------------------*/
	// console.log(environmentMap)
	window.requestAnimationFrame(animate)
}

animate()
