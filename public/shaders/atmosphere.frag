uniform vec3 glowColor;
uniform float intensity;
uniform float power;

varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  vec3 viewDirection = normalize(-vPosition);
  float fresnel = pow(1.0 - abs(dot(viewDirection, vNormal)), power);
  vec3 glow = glowColor * fresnel * intensity;
  gl_FragColor = vec4(glow, fresnel);
}
