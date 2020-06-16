#version 330 core
uniform sampler2D uTexture;
uniform vec4 uColor;
uniform vec2 uFrameSize;
uniform vec2 uFramePos;

in vec2 vTexCoord;

out vec4 FragColor;

void main()
{
    vec2 texCoord = uFramePos + vTexCoord * uFrameSize;
    vec4 color = texture(uTexture, texCoord) * uColor;

    // Discard transparent pixels
    if (color.a < 0.5) discard;
    color.a = 1;

    FragColor = color;
}   