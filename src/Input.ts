// User input

import { Renderer } from "./graphics/Renderer";

export module Input {
    
    let keyPressMap: {[key:string]:boolean} = {};
    let keyDownMap: {[key:string]:boolean} = {};
    let _canvas:HTMLCanvasElement;
    export const mousePosition = {x:0, y:0};

    export function init() {
        window.onkeydown = onKeyDown;
        window.onkeyup = onKeyUp;
    }

    export function setCanvas(canvas:HTMLCanvasElement) {
        if (_canvas)
            _canvas.removeEventListener("mousemove", onMouseMove)
        
        _canvas = canvas;
        _canvas.addEventListener("mousemove", onMouseMove);
    }

    export function clear() {
        keyPressMap = {};
    }

    export function keyDown(key:string): boolean {
        return keyDownMap[key];
    }

    export function keyPress(key:string): boolean {
        return keyPressMap[key];
    }

    function onKeyDown(e:KeyboardEvent) {
        if (!keyDown(e.key)) {
            keyPressMap[e.key] = true
        }
        keyDownMap[e.key] = true;
    }

    function onKeyUp(e:KeyboardEvent) {
        keyDownMap[e.key] = false;
    }

    function onMouseMove(event:MouseEvent) {
        let rect = _canvas.getBoundingClientRect();
        mousePosition.x = event.clientX - rect.left,
        mousePosition.y = event.clientY - rect.top
    }

}