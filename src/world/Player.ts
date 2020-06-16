import { IControllable } from "./interfaces/IControllable";
import { RemoteClient } from "../network/RemoteClient";

export class Player {

    public id:number = -1;
    public name:string = "Player";
    public local:boolean = false;
    public entity:IControllable|null = null;
    public client:RemoteClient|null = null;

    public getNetCreateData():any {
        return {
            id: this.id,
            name: this.name,
            local: false,
        }
    }

    public parseNetCreateData(data:any) {
        this.id = data.id;
        this.name = data.name;
        this.local = data.local;
    }

}