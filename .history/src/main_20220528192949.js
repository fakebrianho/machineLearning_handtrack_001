const video = document.getElementById('myvideo')
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
			// updateNote.innerText = 'Video started. Now tracking'
			isVideo = true
			runDetection()
		} else {
			// updateNote.innerText = 'Please enable video'
		}
	})
}

function toggleVideo() {
	gsap.to(preloader, { opacity: 0, delay: 0.5, duration: 1.5 })
	// preloader.style.opacity = 0
	if (!isVideo) {
		// updateNote.innerText = 'Starting video'
		startVideo()
	} else {
		// updateNote.innerText = 'Stopping video'
		handTrack.stopVideo(video)
		isVideo = false
		// updateNote.innerText = 'Video stopped'
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
	1000
)
camera.position.z = 30
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
			Math.random() * 0.11,
			Math.random() * 0.11,
			0
		)
		this.acc = new THREE.Vector3(0, 0, 0)
		this.mass = m
		this.mesh = new THREE.Mesh(this.testGeo, this.material)
	}

	applyForce(force) {
		// let f = p5.Vector.div(force, this.mass)
		// let f = new THREE.Vector3()
		// let dampening = 0.05
		// f = force.divideScalar(this.mass)
		// f = f.multiplyScalar(dampening)
		// cube.acc.subVectors(attractor, pos)
		// f = this.acc.add(f)

		/*------------------------------
Block
------------------------------*/
		// cube.acc.subVectors(attractor, cube.position);
		let f = force
		this.acc.add(f)
		// let dampening = 0.95
		// f = f.multiplyScalar(dampening)
		// set magnitude of acceleration
		// f.setLength(0.17) // equiv to PVector.mult();

		/*------------------------------
    Block
    ------------------------------*/
		// console.log(this.acc)
		// let vel = new THREE.Vector3()
		// let pos = new THREE.Vector3()
		// pos = this.mesh.position
		// vel = this.vel
		// this.vel.add(force)
		// vel.clampScalar(-0.2, 0.2)
		// pos.add(vel)
	}

	update() {
		this.vel.add(this.acc)
		this.vel.clampScalar(-0.09, 0.09) // clamp speed
		console.log(this.vel)
		this.mesh.position.add(this.vel)
		this.acc.set(0, 0, 0)
	}
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
	force.setLength(0.17)
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
			attract(test, mesh, 1, 1)
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
		console.log(pos)
	}
	test.update()
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
