#version 330 core
uniform mat4 uModelTransform;
uniform mat4 uViewTransform;
uniform mat4 uProjection;
uniform vec3 uWorldSize;

in vec3 aPos; 
in vec2 aTexCoord;

out vec2 vTexCoord;

void main()
{
    vec4 localSpace, viewSpace, clipSpace;

    localSpace = vec4(aPos, 1.0) * vec4(uWorldSize.xy, 0.0, 1.0);

    // Billboard
    mat4 modelViewMatrix = uViewTransform * uModelTransform;
    modelViewMatrix[0][0] = 1;
    modelViewMatrix[0][1] = 0;
    modelViewMatrix[0][2] = 0;
    modelViewMatrix[2][0] = 0;
    modelViewMatrix[2][1] = 0;
    modelViewMatrix[2][2] = 1;

    viewSpace = modelViewMatrix * localSpace;
    clipSpace = uProjection * viewSpace;
    gl_Position = clipSpace;

    vTexCoord = aTexCoord;
}