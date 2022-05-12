precision mediump float;

uniform vec3 uDepthColor; // Στελνω τα χρωματα στους shaders σαν THREE.Color() και τα παραλαμβανω σαν vec3
uniform vec3 uSurfaceColor;
uniform float uColorOffset;
uniform float uColorMultiplier;

varying float vElevation;

void main()
{
  // vec3 mixedColor = mix(uDepthColor, uSurfaceColor, (vElevation + 0.2) * 2.5);
  vec3 mixedColor = mix(uDepthColor, uSurfaceColor, (vElevation + uColorOffset) * uColorMultiplier);

  gl_FragColor = vec4(mixedColor, 1.0);
}
