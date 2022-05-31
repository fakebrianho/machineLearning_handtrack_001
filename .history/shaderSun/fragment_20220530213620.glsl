uniform float time;
uniform float progress;
uniform sampler2D texture1;
uniform vec4 resolution;
uniform samplerCube uPerlin;
varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;
varying vec3 vLayering0;
varying vec3 vLayering1;
varying vec3 vLayering2;
varying vec3 eyeVector;

float PI = 3.141592653589793238;

//LITERaLLY WITCHCRAFT WTF ? 
vec3 brightnessToColor(float b){
	b *= 0.25;
	return (vec3(b, b*b, b*b*b*b) / 0.25) * 0.8;
}

float supersun(){
	float sum = 0.;
	sum += textureCube(uPerlin, vLayering0).r;
	sum += textureCube(uPerlin, vLayering1).r;
	sum += textureCube(uPerlin, vLayering2).r;
	sum *= 0.33;
	return sum;
}
float Fresnel(vec3 eyeVector, vec3 worldNormal) {
	return pow(1.0 + dot(eyeVector, worldNormal), 3.0);
}
void main()	{

	
	float brightness = supersun();
	float fres = Fresnel(eyeVector, vNormal); 
	brightness = brightness * 4. + 1.;
	brightness += pow(fres, 0.8);
	vec3 color = brightnessToColor(brightness);
	gl_FragColor = vec4(color, 1.0); 
	// gl_FragColor = vec4(fres);
	// gl_FragColor = vec4(vLayering2, 1.0);
	// gl_FragColor = vec4(1.0, 0.0, 0.,0.);
}