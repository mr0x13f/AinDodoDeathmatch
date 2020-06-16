export module Util {

    export function httpGetMainThread(url:string): string {
        var request = new XMLHttpRequest();
        request.open("GET", url, false);
        request.send();
        return request.responseText;
    }; 

    export function httpGet(url:string, then:(data:string)=>void=()=>{}, error:(code:number)=>void=()=>{}) {
        let request = new XMLHttpRequest();
        request.onreadystatechange = () => {
            if (request.readyState == 4 && request.status == 200)
                then( request.responseText );
            else
                error( request.status );
        };
        request.open("GET", url, true);
        request.send();
    }; 

    export function vec4FromHex(hex:string, alpha?:number): number[] {

        let result = <RegExpExecArray> /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.toLowerCase());

        return [
            parseInt(result[1], 16) / 255,
            parseInt(result[2], 16) / 255,
            parseInt(result[3], 16) / 255,
            alpha || 1
        ];
    }

    export function mat4FromProjection(w:number, h:number): number[] {
        return [

        ];
    }

    export function mat4FromViewTransform(x:number, y:number): number[] {
        return [
            
        ];
    }

    export function mat4FromTransform(x:number, y:number, w:number, h:number, z:number=0): number[] {
        return [
            
        ];
    }


}