import { dragicon, defaultstate } from './animation.data';

export function changetodragicon() {
    document.documentElement.style.cursor = dragicon
}

export function resetmouse() {
    document.documentElement.style.cursor = defaultstate
}