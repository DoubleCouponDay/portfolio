import { TestBed, tick } from '@angular/core/testing';
import { MusicService } from './music.service';
import { HttpClientModule } from '@angular/common/http';
import { SubSink } from 'subsink';
import { IStreamSubscriber, HubConnectionState } from '@aspnet/signalr';
import { LoadingService } from './loading.service';
import { streamresponse } from './streaming.data';

const streamtimeout = 60000

/** portfolio server must be running before running these tests */
describe('musicservice', () => {
    let service: MusicService
    let loader: LoadingService
    let subs: SubSink

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule
            ]
        })
        service = TestBed.get(MusicService)
        loader = TestBed.get(LoadingService)
        subs = new SubSink()
    });

    it('should create a service', () => {        
        expect(service).toBeTruthy()        
    })

    it('should negotiate a transport', async (done) => {
        await service.startconnection()
        expect(service.connection.state === HubConnectionState.Connected).toBeTruthy()
        done()
    }, streamtimeout)

    /** only one streaming test can succeed at a time! the server just runs out of memory. */
    it('should stream music', async (done) => {
        let subscriber: IStreamSubscriber<streamresponse> = {
            next: (chunk: streamresponse) => {
                expect(chunk.chunk.length).toBeGreaterThan(0)
                expect(chunk.bitdepth !== 0).toBeTruthy()
                expect(chunk.channels !== 0).toBeTruthy()
                expect(chunk.samplerate !== 0).toBeTruthy()
                expect(chunk.totalchunks !== 0).toBeTruthy()
            },
            complete: () => {             
                done()
            },
            error: console.error
        }
        await service.playrandomdeserttrack(subscriber)   
    })

    afterEach(() => {
        subs.unsubscribe()
    })
});
