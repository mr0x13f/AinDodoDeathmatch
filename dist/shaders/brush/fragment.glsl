precision mediump float;

struct Brush {
    vec2 pos;
    vec2 size;
    float z;
    float shadow;
    sampler2D texture;
    vec2 texOffset;
    vec2 texScale;
};

uniform Brush uBrush;

varying vec2 vTexCoord;

void main() {

    vec4 texColor = texture2D(uBrush.texture, vTexCoord);
    vec4 color = texColor * vec4(vec3(uBrush.shadow), 1.0);

    // Discard transparent pixels
    if (color.a < 0.5) discard;
    color.a = 1.0;

    gl_FragColor = color;
    
}   