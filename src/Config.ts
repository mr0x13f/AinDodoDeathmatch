export module Config {

    let storage: Storage;

    export function init() {
        storage = window.localStorage;
    }

    export function getData(key:string): any|null {
        let value = storage.getItem(key);
        if (value)
            return JSON.parse(value);
    }
    
    export function setData(key:string, data:any) {
        storage.setItem(key, JSON.stringify(data));
    }

    export function getString(key:string): string|null {
        return storage.getItem(key);
    }
    
    export function setString(key:string, data:string) {
        storage.setItem(key,data);
    }

}