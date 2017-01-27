precision mediump float;

uniform float     time;
uniform vec2      resolution;
uniform sampler2D iChannel0;

void main( void ) {

    vec2 uv = gl_FragCoord.xy / resolution.xy;

    // Flip-a-roo.
    uv.y *= -1.0;
    uv.y -= 0.25;

    // Represents the v/y coord(0 to 1) that will not sway.
    float fixedBasePosY = 0.0;

    // Configs for you to get the sway just right.
    float speed = 1.0;
    float verticleDensity = 5.0;
    float swayIntensity = 0.005;

    // Putting it all together.
    float offsetX = sin(uv.y * verticleDensity + time * speed) * swayIntensity;

    // Offsettin the u/x coord.
    uv.x += -0.5 + offsetX * (uv.y - fixedBasePosY);

    gl_FragColor = texture2D(iChannel0, uv);

}