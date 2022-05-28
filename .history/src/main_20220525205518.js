import p5 from 'p5'
import * as handTrack from 'handtrackjs'

let sketch = function (p) {
	let x = 100
	let y = 100
	let cam
	p.setup = function () {
		p.createCanvas(700, 410)
		cam = createCapture(VIDEO)
		cam.size(640, 480)
		cam.hide()
	}
	p.draw = function () {
		p.background(0)
		p.fill(255)
		p.rect(x, y, 50, 50)
	}
}
let myp5 = new p5(sketch)

// const img = document.getElementById('img')
// const model = await handTrack.load()
// const predictions = await model.detect(img)
const img = document.getElementById('img')
handTrack.load().then((model) => {
	model.detect(img).then((predictions) => {
		console.log('Predictions: ', predictions) // bbox predictions
	})
})
