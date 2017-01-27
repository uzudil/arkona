precision mediump float;

uniform float     time;
uniform vec2      resolution;
uniform sampler2D iChannel0;

void main( void ) {

    vec2 uv = gl_FragCoord.xy / resolution.xy;

    // wave
    uv.y *= -1.0;
    uv.y += (sin((uv.x + (time * 0.5)) * 10.0) * 0.01) + (sin((uv.x + (time * 0.2)) * 32.0) * 0.01);

    // flow
    uv.x += time * 0.05;
    uv.y += time * 0.05;

    vec4 texColor = texture2D(iChannel0, uv);
    gl_FragColor = texColor;

}