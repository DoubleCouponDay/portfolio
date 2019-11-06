import { volumestate, millisecondspoint } from '../pages/scrollview/scrollview.data';
import { isnullorundefined } from '../utility/utilities';
import { maxvolume, volumedecrement, volumeincrement } from './audio.data';
import { nooccurrence } from '../global.data';

export class generatedraggableaudio {

    private timeoutIDs = new Array<number>()

    private volumescurrentmode = volumestate.stable

    private scrollaudio: HTMLAudioElement

    private throttleinput = false

    constructor(private pathtoaudio: string) {
        this.scrollaudio = new Audio(pathtoaudio)         
    }

    playaudio() {   
        if(this.throttleinput === true) {
            this.scrollaudio.volume = 1
            this.resetaudio()
            return            
        }  
        this.scrollaudio.currentTime = 0
        this.throttleinput = true
        let playstate = this.scrollaudio.play()

        this.scrollaudio.volume = 1
        this.volumescurrentmode = volumestate.decreasing
        this.fadeoutaudio()

        playstate.catch((error) => {
            console.error(error['message'])
        })         
    }

    private maintainaudio() {
        if(this.volumescurrentmode === volumestate.increasing) {
            return
        }
        this.volumescurrentmode = volumestate.increasing  
        this.fadeupaudio()        
    }

    resetaudio() {
        if(this.volumescurrentmode === volumestate.decreasing) {
            return
        }
        this.volumescurrentmode = volumestate.decreasing  

        this.fadeoutaudio(() => {
            this.scrollaudio.currentTime = 0
            this.throttleinput = false                

            this.timeoutIDs.forEach((value) => {
                clearTimeout(value)
            })
            this.timeoutIDs = new Array<number>()
        })    
    }

    /** invoke after movement detection */
    private fadeoutaudio(onfaded?: () => void) {  
        let id = setTimeout(() => {
            if(this.scrollaudio.volume >= volumedecrement) {        
                this.scrollaudio.volume -= volumedecrement

                if(this.volumescurrentmode === volumestate.decreasing) {
                    this.fadeoutaudio()  
                }        
            }

            else {
                this.scrollaudio.volume = 0        
                this.volumescurrentmode = volumestate.stable
                this.scrollaudio.pause()
                this.throttleinput = false

                if(isnullorundefined(onfaded) === true) {
                    return
                }
                onfaded()
            }    
        })
        this.timeoutIDs.push(id)    
    }

    private fadeupaudio() {
        let id = setTimeout(() => {
            if(this.scrollaudio.volume <= maxvolume - volumeincrement) { //prevents out of bounds exc
                this.scrollaudio.volume += volumeincrement

                if(this.volumescurrentmode === volumestate.increasing) {
                    this.fadeupaudio()
                }
            }

            else {
                this.scrollaudio.volume = 1
                this.volumescurrentmode = volumestate.stable
            }      
        })
        this.timeoutIDs.push(id)    
    }
}