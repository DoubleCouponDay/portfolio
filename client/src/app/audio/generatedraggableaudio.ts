import { volumestate } from '../pages/scrollview/scrollview.data';
import { isnullorundefined } from '../utilities';

export const maxvolume  = 1

export class generatedraggableaudio {

    private timeoutIDs = new Array<number>()

    private volumescurrentmode = volumestate.stable

    private scrollaudio: HTMLAudioElement

    private throttleinput = false

    constructor(private pathtoaudio: string, 
        private volumeincrement: number, 
        private volumedecrement: number) {
        this.scrollaudio = new Audio(pathtoaudio) 
    }

    startaudio() {   
        if(this.throttleinput === true) {
            return
        }  
        this.scrollaudio = new Audio(this.pathtoaudio) 
        this.scrollaudio.play()  
        this.volumescurrentmode = volumestate.decreasing  
        this.fadeoutaudio()
        this.throttleinput = true
    }

    maintainaudio() {
        this.volumescurrentmode = volumestate.increasing  
        this.fadeupaudio()
    }

    resetaudio() {
        this.throttleinput = false    
        this.volumescurrentmode = volumestate.decreasing  

        this.fadeoutaudio(() => {
            this.timeoutIDs.forEach((value) => {
            clearTimeout(value)
            })
            this.timeoutIDs = new Array<number>()
        })    
    }

    /** invoke after movement detection */
    fadeoutaudio(onfaded?: () => void) {  
        let id = setTimeout(() => {
            if(this.scrollaudio.volume >= this.volumedecrement) {        
            this.scrollaudio.volume -= this.volumedecrement

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

    fadeupaudio() {
        let id = setTimeout(() => {
            if(this.scrollaudio.volume <= maxvolume - this.volumeincrement) { //prevents out of bounds exc
            this.scrollaudio.volume += this.volumeincrement

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