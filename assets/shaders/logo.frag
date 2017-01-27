// http://glslsandbox.com/e#38003.0
precision mediump float;

uniform float time;
uniform vec2 resolution;

float sinx(float x) {
	float v=sin(x);
	return sign(v)*pow(abs(v),0.6);
}

void main( void ) {
	vec2 position = (2.0 * gl_FragCoord.xy - resolution.xy) / min(resolution.x, resolution.y);

	vec3 origin = vec3(4.0 * sin(time / 3.0), 0.0, -time * 2.0);
	vec3 dir = normalize(vec3(position.x, -position.y, -1.0));
	dir.yz = vec2(dir.y - dir.z, dir.z + dir.y) / sqrt(2.0);

	vec3 allcol = vec3(0.0);
	for(int i = 1; i <= 3; i++) {
		float dist = (3.0 + float(2 * i)) / dir.y;
		if(dist > 0.0) {
			vec3 pos = dir * dist + origin;
			float c = pow(abs(sin(pos.x * 0.14 + float(i * i) + 0.6*sinx(pos.z / 3.0 * float(i + 3)))), 4.0) * 10.0 / dist / dist;
			vec3 col = vec3(0.4, 0.4, 0.3) * c;
			allcol += col;
		}
	}
	gl_FragColor = vec4(allcol,9.4);
}