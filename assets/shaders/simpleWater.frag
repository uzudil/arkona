precision mediump float;

uniform float     time;
uniform vec2      resolution;
uniform sampler2D iChannel0;

void main( void ) {

    vec2 uv = gl_FragCoord.xy / resolution.xy;

    // wave
    uv.y *= -1.0;
    float freq = 5.5;
    float amp = 0.01;
    uv.y += (sin((uv.x + (time * 1.5)) * freq) * amp);

    // flow
    uv.x += time * 0.1;
    uv.y += time * 0.1;

    vec4 texColor = texture2D(iChannel0, uv);
    gl_FragColor = texColor;

}
