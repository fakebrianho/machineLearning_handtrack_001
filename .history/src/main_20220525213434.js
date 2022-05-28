import p5 from 'p5'
import * as handTrack from 'handtrackjs'
// let sketch = function (p) {
// 	let x = 100
// 	let y = 100
let cam

function setup() {
	createCanvas(500, 500)
	cam = createCapture(VIDEO)
	cam.size(640, 480)
	cam.hide()
}

function draw() {
	background(255, 0, 0)
	image(cam, 0, 0)
}

window.setup = setup
window.draw = draw
const img = document.querySelector('video')
handTrack.load().then((model) => {
	model.detect(img).then((predictions) => {
		console.log('Predictions: ', predictions) // bbox predictions
	})
})
