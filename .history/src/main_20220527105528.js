const video = document.getElementById('myvideo')
const handimg = document.getElementById('handimage')
const canvas = document.getElementById('canvas')
const context = canvas.getContext('2d')
let trackButton = document.getElementById('trackbutton')
let nextImageButton = document.getElementById('nextimagebutton')
let updateNote = document.getElementById('updatenote')
let track = []
let isVideo = false
let model = null
let mappedVal
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
		// console.log('video started', status)
		if (status) {
			updateNote.innerText = 'Video started. Now tracking'
			isVideo = true
			runDetection()
		} else {
			updateNote.innerText = 'Please enable video'
		}
	})
}

function toggleVideo() {
	if (!isVideo) {
		updateNote.innerText = 'Starting video'
		startVideo()
	} else {
		updateNote.innerText = 'Stopping video'
		handTrack.stopVideo(video)
		isVideo = false
		updateNote.innerText = 'Video stopped'
	}
}

trackButton.addEventListener('click', function () {
	toggleVideo()
})

function runDetection() {
	model.detect(video).then((predictions) => {
		// console.log('Predictions: ', predictions)
		track = predictions.slice(0)
		// model.renderPredictions(predictions, canvas, context, video)
		//code taken from the pong boilerplate in the handtrack.js demo, here I'm normalizing
		if (predictions[0]) {
			let midval = predictions[0].bbox[0] + predictions[0].bbox[2] / 2
			let midval2 = midval / video.width
			mappedVal = mapRange(midval2, 0, 1, -1, 1)
			console.log(mappedVal)
		}
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
	updateNote.innerText = 'Loaded Model!'
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
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
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
	100
)
camera.position.z = 3
scene.add(camera)

renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
/*------------------------------
Resize
------------------------------*/
window.addEventListener('resize', () => {
	/*------------------------------
  Update Sizes
  ------------------------------*/
	sizes.width = window.innerWidth
	sizes.height = window.innerHeight
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
	constructor(x, y, z, m, radius, widthSeg, heightSeg) {
		this.geometry = new THREE.SphereBufferGeometry(
			radius,
			widthSeg,
			heightSeg
		)
		this.testGeo = new THREE.BoxGeometry(1, 1, 1)
		this.material = new THREE.MeshBasicMaterial({ color: '#ff00ff' })
		this.position = new THREE.Vector3(x, y, z)
		this.vel = new THREE.Vector3(
			Math.random(),
			Math.random(),
			Math.random()
		)
		this.vel.multiplyScalar(5)
		this.acc = new THREE.Vector3(0, 0, 0)
		this.mass = m
		this.mesh = new THREE.Mesh(this.testGeo, this.material)
		// this.mesh.position = this.position
		// this.r = sqrt(this.mass) * 2
	}

	applyForce(force) {
		// let f = p5.Vector.div(force, this.mass)
		let f = new THREE.Vector3()
		f = force.divideScalar(this.mass)
		// console.log(force)
		this.acc.add(f)
	}

	update() {
		// console.log(this.mesh.position)
		// this.mesh.position.add(new THREE.Vector3(0.001, 0, 0))
		// this.mesh.position.add(this.acc)
		// this.vel.add(this.acc)
		// this.position.add(this.vel)
		// this.acc.set(0, 0, 0)
	}

	// show() {
	// 	stroke(255)
	// 	strokeWeight(2)
	// 	fill(255, 100)
	// 	ellipse(this.pos.x, this.pos.y, this.r * 2)
	// }
}
let test = new Mover(0, -0.5, 0, 15, 32, 16)
scene.add(test.mesh)
/*------------------------------
Attraction Function
------------------------------*/
const attract = (mover, attractor, amass, mmass) => {
	let a = new THREE.Vector3(attractor.position.x, attractor.position.y, 0.5)
	let b = new THREE.Vector3(mover.mesh.position.x, mover.mesh.position.y, 0.5)
	let force = a.sub(b)
	let strength
	let distanceSquared =
		force.x * force.x + force.y * force.y + force.z * force.z
	let g = 1
	if (distanceSquared > 0) {
		strength = (amass * mmass) / distanceSquared
	} else {
		strength = 0
	}
	// force = force.normalize()
	// force = force.normalize().multiplyScalar(strength)
	// dir = dir.sub(mover.pos)
	// console.log(force)
	// console.log(distanceSquared)
	// console.log(strength)
	// mover.applyForce(force)
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

	pointer.x = (event.clientX / window.innerWidth) * 2 - 1
	pointer.y = -(event.clientY / window.innerHeight) * 2 + 1
	console.log(pointer.x)
	// var vector = new THREE.Vector3(pointer.x, pointer.y, 0.5)
	// vector.unproject(camera)
	// var dir = vector.sub(camera.position).normalize()
	// var distance = -camera.position.z / dir.z
	// var pos = camera.position.clone().add(dir.multiplyScalar(distance))
	// mesh.position.copy(pos)
}

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
			mesh.rotation.x = elapsedTime
			mesh.rotation.y = elapsedTime
		}
	})
	var vector = new THREE.Vector3(mappedVal, 0.1, 0.5)
	vector.unproject(camera)
	var dir = vector.sub(camera.position).normalize()
	var distance = -camera.position.z / dir.z
	var pos = camera.position.clone().add(dir.multiplyScalar(distance))
	mesh.position.copy(pos)
	// }
	// console.log(test.mesh)
	attract(test, mesh, 1, 1)
	test.update()
	// console.log(test)
	/*------------------------------
  Render
  ------------------------------*/
	renderer.render(scene, camera)

	/*------------------------------
  Core
  ------------------------------*/
	window.requestAnimationFrame(animate)
}

animate()
