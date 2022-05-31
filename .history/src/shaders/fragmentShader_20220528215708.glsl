uniform float uTime;
varying vec3 newPos;
varying vec2 vUv;
varying float noise;
uniform sampler2D tExplosion;

float random( vec3 scale, float seed ){
  return fract( sin( dot( gl_FragCoord.xyz + seed, scale ) ) * 43758.5453 + seed ) ;
}

void main() {

  // get a random offset
  float r = .01 * random( vec3( 12.9898, 78.233, 151.7182 ), 0.0 );
  // lookup vertically in the texture, using noise and offset
  // to get the right RGB colour
  vec2 tPos = vec2( 0, 1.3 * noise + r );
  vec4 color = texture2D( tExplosion, tPos );
//   color = vec4(0.949, 0.0, 0.0, 0.0);

  gl_FragColor = vec4( color.rgb, 1.0 );

}