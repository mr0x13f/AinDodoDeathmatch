export class Race {

    private finish:number;
    private progress:number;
    private onFinish:()=>void;

    constructor(finish:number, onFinish:()=>void) {
        this.finish = finish;
        this.progress = 0;
        this.onFinish = onFinish;
    }

    public increment() {
        this.progress++;
        if (this.isFinished())
            this.onFinish();
    }

    public isFinished():boolean {
        return this.progress == this.finish;
    }

}