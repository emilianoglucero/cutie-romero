
varying vec2 vUV;
varying vec3 vNormal;
void main () {
  vec4 c = vec4(abs(vNormal) + vec3(vUV, 0.0), 0.12); // 设置透明度为0.1
  gl_FragColor = c;
}