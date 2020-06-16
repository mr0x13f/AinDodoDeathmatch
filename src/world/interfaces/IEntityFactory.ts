import { Entity } from "../Entity";

export interface IEntityFactory {

    readonly TYPE_NAME:string;

    build:()=>Entity;

}