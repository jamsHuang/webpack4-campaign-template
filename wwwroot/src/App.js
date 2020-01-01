import * as $ from 'jquery';
import {TweenMax, Power3} from "gsap";
import Bar from "./components/foo/Bar";

$(function () {
    document.body.appendChild(component());
    TweenMax.fromTo($('.sharing'), 2,
        {
            y: 100
        }, {
            y: 0,
            ease: Power3.easeInOut,
            repeat: -1,
            yoyo: true
        });

});

function component() {
    const bar = new Bar();
    const element = document.createElement('h2');
    element.innerHTML = bar.greeting();
    return element;
}