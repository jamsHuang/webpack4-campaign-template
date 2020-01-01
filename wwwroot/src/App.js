import Bar from "./foo/Bar";

window.addEventListener('load', () => {
    document.body.appendChild(component());
});

function component() {
    const bar = new Bar();
    const element = document.createElement('h2');
    element.innerHTML = bar.greeting();
    return element;
}