import { IBoundingBox } from "./interfaces/IBoundingBox";
import { Collision } from "./Collision";

export abstract class Entity implements IBoundingBox {

    public type:string = "Entity";
    public id:number = -1;

    public x:number = 0;
    public y:number = 0;
    public w:number = 0;
    public h:number = 0;

    public vx:number = 0;
    public vy:number = 0;

    protected draw() { }
    protected update() { }
    protected spawn() { }
    
    public doUpdate() {
        this.update();
        Collision.moveEntity(this);
    }

    public doDraw() {
        this.draw();
    }

    public doSpawn() {
        this.spawn();
    }

    ///////////////////////////////////////////////////////////
    // Parsing
    ///////////////////////////////////////////////////////////

    public allowMapCreate = false;
    
    public parseMapData(data:any):void {
        this.x = data.x;
        this.y = data.y;
    };

    public allowNetCreate = false;

    public parseNetCreateData(data:any):void {
        this.id = data.id;
        this.x = data.x;
        this.y = data.y;
        this.vx = data.vx;
        this.vy = data.vy;
    };

    public getNetCreateData():any {
        return {
            id: this.id,
            x: this.x,
            y: this.y,
            vx: this.vx,
            vy: this.vy,
        };
    };

    public allowNetUpdate = false;

    public parseNetUpdateData(data:any):void {
        this.x = data.x;
        this.y = data.y;
        this.vx = data.vx;
        this.vy = data.vy;
    };

    public getNetUpdateData():any {
        return {
            x: this.x,
            y: this.y,
            vx: this.vx,
            vy: this.vy,
        };
    };


}