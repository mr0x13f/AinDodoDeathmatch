import { IBoundingBox } from "./interfaces/IBoundingBox";
import { Entity } from "./Entity";

export module Collision {

    export const EPSILON = 0.1;

    export function aabb(a:IBoundingBox, b:IBoundingBox): boolean {
        return a.x + a.w > b.x
            && a.x < b.x + b.w
            && a.y + a.h > b.y
            && a.y < b.y + b.h;
    }

    export function moveEntity(entity:Entity) {

        if (Math.abs(entity.vx) < EPSILON)
            entity.vx = 0;
        if (Math.abs(entity.vy) < EPSILON)
            entity.vy = 0;

        if (entity.vx == 0 && entity.vy == 0)
            return;

        entity.x += entity.vx;
        entity.y += entity.vy;

    }

}