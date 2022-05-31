uniform float time;
varying vec2 vUv;
varying vec3 vPosition;
uniform vec2 pixels;
varying vec3 vLayering0;
varying vec3 vLayering1;
varying vec3 vLayering2;
varying vec3 eyeVector;
varying vec3 vNormal;

mat2 rotate(float a){
  float s = sin(a);
  float c = cos(a);
  return mat2(c, -s, s, c);
}


float PI = 3.141592653589793238;
void main() {

  vNormal = normal; 

  vec4 worldPosition = modelViewMatrix * vec4(position, 1.0);
  eyeVector = normalize(worldPosition.xyz - cameraPosition); 

  float t = time * 0.002;
  mat2 rot = rotate(t);

  vec3 p0 = position;
  p0.yz = rot*p0.yz;
  vLayering0 = p0;

  mat2 rot1 = rotate(t + 10.);
  vec3 p1 = position;
  p1.xz = rot1*p1.xz;
  vLayering1 = p1;

  mat2 rot2 = rotate(t + 30.);
  vec3 p2 = position;
  p2.xy = rot2*p2.xy;
  vLayering2 = p2;

  vPosition = position;
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}