export class AssetPool<T> {

    private pool:{[path:string]:T} = {};
    private loader:(path:string)=>T;

    constructor(loader:(path:string)=>T) {
        this.loader = loader;
    }

    public get(path:string):T {
        if (!this.pool[path])
        this.pool[path] = this.loader(path);
        
        return this.pool[path];
    }

}