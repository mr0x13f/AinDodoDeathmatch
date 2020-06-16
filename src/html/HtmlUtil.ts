export module HtmlUtil {

    export function showElement(id:string) {
        let el = document.getElementById(id);
        if (el)
            el.style.display = "block";
    }

    export function hideElement(id:string) {
        let el = document.getElementById(id);
        if (el)
            el.style.display = "none";
    }

    export function clearChildren(parent:HTMLElement) {
        parent.childNodes.forEach((listItem) => {
            parent.removeChild(listItem);
        }); 
    }

}