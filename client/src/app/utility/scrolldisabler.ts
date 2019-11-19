import { passiveeventargs } from './utilities';

const scrollname = 'scroll'

class _scrolldisabler {
    private scrollingallowed = true
    private intervalid = 0

    public togglescrolling(shouldscroll: boolean) {
        if(this.scrollingallowed === true && shouldscroll === false) {
            this.intervalid = window.requestAnimationFrame(this.everymillisecond)
            window.addEventListener(scrollname, this.onscrolling, passiveeventargs)
        }        
        this.scrollingallowed = shouldscroll

        if(shouldscroll === true) {
            window.removeEventListener(scrollname, this.onscrolling, passiveeventargs)
        }
    }

    private everymillisecond = () => {
        window.scrollTo(0, 0)
        console.log("scroll reset")

        if(this.scrollingallowed === false) {
            this.intervalid = window.requestAnimationFrame(this.everymillisecond)
        }

        else {
            window.cancelAnimationFrame(this.intervalid)
            return
        }        
    }

    private onscrolling = (scroll: Event) => {
        scroll.preventDefault()        
        scroll.stopImmediatePropagation()
        console.log('scrolling prevented')
    }
}

export const scrolldisabler = new _scrolldisabler()