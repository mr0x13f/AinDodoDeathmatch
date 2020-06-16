export class Collection<Value> implements Iterable<Value> {

    private list:Value[] = [];
    private map:Record<number,Value> = {};

    get length(): number {
        return this.list.length;
    }

    public [Symbol.iterator]():Iterator<Value> {
        let index = 0;
        return { next: () => {
            if (index < this.list.length)
                return { done: false, value: this.list[index++] }
            else 
                return { done: true, value: null }
        } };
    }

    set(id:number, value:Value) {
        this.list.push(value);
        this.map[id] = value;
    }

    get(id:number) {
        return this.map[id];
    }

    clear() {
        this.list = [];
        this.map = [];
    }

}