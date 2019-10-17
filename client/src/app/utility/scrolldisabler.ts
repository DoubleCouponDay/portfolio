import { passiveeventargs } from './utilities';

const scrollname = 'scroll'

class _scrolldisabler {

    public togglescrolling(shouldscroll: boolean) {
        switch(shouldscroll) {
            case false:
                window.addEventListener(scrollname, this.onscrolling, passiveeventargs)
                break

            case true:
                window.removeEventListener(scrollname, this.onscrolling)
                break
        }
    }

    private onscrolling = (scroll: Event) => {
        window.scrollTo(0, 100)
        scroll.preventDefault()
        scroll.stopImmediatePropagation()
    }
}

export const scrolldisabler = new _scrolldisabler()