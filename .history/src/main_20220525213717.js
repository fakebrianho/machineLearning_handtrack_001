import p5 from 'p5'
import * as handTrack from 'handtrackjs'
// let sketch = function (p) {
// 	let x = 100
// 	let y = 100
let cam
const defaultParams = {
	flipHorizontal: false,
	outputStride: 16,
	imageScaleFactor: 1,
	maxNumBoxes: 20,
	iouThreshold: 0.2,
	scoreThreshold: 0.6,
	modelType: 'ssd320fpnlite',
	modelSize: 'large',
	bboxLineWidth: '2',
	fontSize: 17,
}
const video = document.getElementById('videoid')

handTrack.startVideo(video)
/* start camera input stream on the provided video tag. returns a promise with message format
{ status: false, msg: 'please provide a valid video element' } 
*/
const model = await handTrack.load(defaultParams)
// function setup() {
// 	createCanvas(500, 500)
// 	cam = createCapture(VIDEO)
// 	cam.size(640, 480)
// 	cam.hide()
// }

// function draw() {
// 	background(255, 0, 0)
// 	image(cam, 0, 0)
// }
// const model =  await handTrack.load();
// const predictions = await model.detect(img);
// window.setup = setup
// window.draw = draw
// const img = document.querySelector('video')
// handTrack.load().then((model) => {
// 	model.detect(img).then((predictions) => {
// 		console.log('Predictions: ', predictions) // bbox predictions
// 	})
// })
