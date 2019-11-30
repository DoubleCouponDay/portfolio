import { volumestate } from '../pages/scrollview/scrollview.data';
import { isnullorundefined } from '../utility/utilities';
import {  volumedecrement, volumeincrement } from './audio.data';
import { nooccurrence } from '../global.data';

export class generatedraggableaudio {

    private timeoutIDs = new Array<number>()

    private volumescurrentmode = volumestate.stable

    private audio: HTMLAudioElement

    private throttleinput = false

    constructor(pathtoaudio: string, private inputmaxvolume: number) {
        this.audio = new Audio(pathtoaudio)    
    }

    playaudio() {   
        if(this.throttleinput === true) {
            this.audio.volume = this.inputmaxvolume
            this.resetaudio()
            return            
        }  
        this.audio.currentTime = 0
        this.throttleinput = true
        this.audio.volume = this.inputmaxvolume
        let playstate = this.audio.play()
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
            this.audio.currentTime = 0
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
            if(this.audio.volume >= volumedecrement) {        
                this.audio.volume -= volumedecrement

                if(this.volumescurrentmode === volumestate.decreasing) {
                    this.fadeoutaudio()  
                }        
            }

            else {
                this.audio.volume = 0        
                this.volumescurrentmode = volumestate.stable
                this.audio.pause()
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
            if(this.audio.volume <= this.inputmaxvolume - volumeincrement) { //prevents out of bounds exc
                this.audio.volume += volumeincrement

                if(this.volumescurrentmode === volumestate.increasing) {
                    this.fadeupaudio()
                }
            }

            else {
                this.audio.volume = this.inputmaxvolume
                this.volumescurrentmode = volumestate.stable
            }      
        })
        this.timeoutIDs.push(id)    
    }
}