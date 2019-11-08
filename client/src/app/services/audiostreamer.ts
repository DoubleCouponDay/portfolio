import { workermessage } from './streaming.data'
import { ITypedWorker } from 'typed-web-workers'


export class audiostreamer {
    
    private worker: ITypedWorker<workermessage, workermessage>
    private work: (
        initialmessage: workermessage, 
        sendback: (output: workermessage) => void
        ) => void

    constructor(private receivemessagefromsreamer: (message: workermessage) => void) {
        this.work = (initialmessage, sendback) => {                
            let context = new AudioContext()
            context.suspend()
            let player = context.createBufferSource()
            player.connect(context.destination)

            while(true) {

            }
        }
    }

    public sendmessage(message: workermessage) {

    }
}