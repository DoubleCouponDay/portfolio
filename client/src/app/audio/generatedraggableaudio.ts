import { volumestate, millisecondspoint } from '../pages/scrollview/scrollview.data';
import { isnullorundefined } from '../utilities';
import { maxvolume, volumedecrement, volumeincrement } from './audio.data';

export class generatedraggableaudio {

    private scrollaudio: HTMLAudioElement

    private isplaying = false

    constructor(private pathtoaudio: string) {
        this.scrollaudio = new Audio(pathtoaudio) 
    }

    startaudio() {   
        if(this.isplaying === true) {
            return
        }  
        this.scrollaudio = new Audio(this.pathtoaudio) 

        this.scrollaudio.onplay = () => {
            this.isplaying = true
        }
        this.scrollaudio.onpause = () => {
            this.isplaying = false
        }
        let playstate = this.scrollaudio.play()
        console.log('played')

        playstate.catch((error) => {
            console.error(error['message'])
        })
        this.fadeoutaudio()        
    }

    maintainaudio() {        
        this.fadeupaudio()
    }

    resetaudio() {
        this.fadeoutaudio()    
    }

    private fadeoutaudio() {  
        while(this.scrollaudio.volume >= volumedecrement) {
            this.scrollaudio.volume -= volumedecrement
        }
        this.scrollaudio.volume = 0           

        if(this.isplaying === true) {
            this.scrollaudio.pause()
        }
        
        console.log('paused')     
    }

    private fadeupaudio() {
        while(this.scrollaudio.volume <= maxvolume - volumeincrement) {
            this.scrollaudio.volume += volumeincrement
        }
        this.scrollaudio.volume = 1
    }
}