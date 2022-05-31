uniform float uTime;
varying vec3 newPos;
varying vec2 vUv;
varying float noise;
uniform sampler2D tExplosion;

float random( vec3 scale, float seed ){
  return fract( sin( dot( gl_FragCoord.xyz + seed, scale ) ) * 43758.5453 + seed ) ;
}

void main() {

  float r = .001 * random( vec3( 12.9898, 78.233, 151.7182 ), 0.0 );
  vec2 tPos = vec2( 0, 2.3 * noise + r );
  vec4 color = texture2D( tExplosion, tPos );
  vec4 color2 = mix(vec4(0.64, 0.4, 0.3, 1.0), color, 0.5);
  gl_FragColor = vec4( color2.rgb, 1.0 );
    // gl_FragColor = vec4( vec3( vUv, 0. ), 1. );
  //   vec3 color = vec3( vUv * ( 1. - 2. * noise ), 0.0 );
  // gl_FragColor = vec4( color.rgb, 1.0 );


}