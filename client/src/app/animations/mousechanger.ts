import { dragicon, defaulticon } from './styleconstants';

export function changetodragicon() {
    document.documentElement.style.cursor = dragicon
}

export function resetmouse() {
    document.documentElement.style.cursor = defaulticon
}