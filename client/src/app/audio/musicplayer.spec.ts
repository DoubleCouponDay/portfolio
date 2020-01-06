import { musicplayer } from './musicplayer'
import { streamresponse } from '../services/streaming.data'

const samplespath = "../assets/sample"

describe("music player", () => {
    let samples = new Array<number[]>()
    let subject: musicplayer

    beforeAll(async (done: DoneFn) => {
        for(let i = 1; i <= 3; i++) {
            let path = "assets/" + samplespath + `${i}` + ".mp3"
            let asset = await fetch(path)
            let assetbuffer = await asset.arrayBuffer()
            let asdataview = new Uint8Array(assetbuffer)
            let finaltransform = Array.from(asdataview)
            samples.push(finaltransform)
        }        
        subject = setupplayer()
        done()
    })

    afterAll(() => {
        subject.ngOnDestroy()
    })

    let setupplayer = () => {
        let subject = new musicplayer()

        samples.forEach((sample) => {
            let response: streamresponse = {
                bitdepth: 0,
                channels: 0,
                chunk: sample,
                samplerate: 0,
                totalchunks: 0
            }
            subject.onchunk(response)
        })
        subject.ondownloadcomplete()
        return subject
    }

    let waitasecond = async () => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve()
            }, 1000)
        })
    }

    it("plays multiple buffers seamlessly", async (done: DoneFn) => {
        subject.toggleplayback(true)
        await waitasecond()
        expect(subject.musicisplaying).toBeTruthy() 
        done()
    })

    it("can stop at anytime", async (done: DoneFn) => {
        subject.toggleplayback(true)
        await waitasecond()
        subject.toggleplayback(false)
        expect(subject.musicisplaying).toBeFalsy()
        done()
    })

    it("restarts at the same position where it stopped", async (done: DoneFn) => {
        subject.toggleplayback(true)
        await waitasecond()
        let currentindex = subject.playindex
        subject.toggleplayback(false)
        await waitasecond()       
        subject.toggleplayback(true)    
        expect(currentindex === subject.playindex).toBeTruthy()
        done()
    })

    it("notifies when song has finished", async (done: DoneFn) => {
        subject.toggleplayback(true)

        subject.songfinished.subscribe(() => {
            expect(true).toBeTruthy()
            done()
        })
    })

    it("restarts from the beginning after finishing", async (done: DoneFn) => {
        subject.toggleplayback(true)

        subject.songfinished.subscribe(async () => {
            subject.toggleplayback(true)
            expect(subject.playindex).toEqual(0)
            await waitasecond()
            expect(subject.musicisplaying).toBeTruthy()
            done()
        })
    })
})