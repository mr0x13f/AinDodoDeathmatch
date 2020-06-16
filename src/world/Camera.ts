import { IBoundingBox } from "./interfaces/IBoundingBox";
import { World } from "./World";
import { Collision } from "./Collision";
import { Renderer } from "../graphics/Renderer";
import { BrushShader } from "../graphics/shaders/BrushShader";
import { SpriteShader } from "../graphics/shaders/SpriteShader";

export class Camera implements IBoundingBox {

    public x:number = 0;
    public y:number = 0;
    public w:number = Renderer.SCREEN_WIDTH;
    public h:number = Renderer.SCREEN_HEIGHT;

    public draw() {

        Renderer.clear();

        BrushShader.use();
        BrushShader.setCamera(this);

        for (let brush of World.brushes)
            if (Collision.aabb(brush, this))
                BrushShader.drawBrush(brush);
        
        // SpriteShader.use();
        // SpriteShader.setCamera(this);

        // for (let entity of World.entities)
        //     entity.doDraw();

    }

    public shake(amount:number, duration:number) {
        // TODO
    }

}