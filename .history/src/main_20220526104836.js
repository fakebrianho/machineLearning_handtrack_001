// import * as THREE from 'three'
// import 'regenerator-runtime/runtime'

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
		console.log('Predictions: ', predictions)
		Array1 = Array2.slice(0)
		// model.renderPredictions(predictions, canvas, context, video)
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

console.log('ash')
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
const clock = new THREE.Clock()
const animate = () => {
	/*------------------------------
  Smooth Animation
  ------------------------------*/
	const elapsedTime = clock.getElapsedTime()

	/*------------------------------
  Update Meshes
  ------------------------------*/
	if (predictions.length >= 2) {
		mesh.rotation.x = elapsedTime
		mesh.rotation.y = elapsedTime
	}

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
