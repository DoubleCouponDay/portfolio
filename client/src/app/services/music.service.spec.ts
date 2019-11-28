import { TestBed, tick } from '@angular/core/testing';
import { MusicService } from './music.service';
import { HttpClientModule } from '@angular/common/http';
import { SubSink } from 'subsink';
import {strictEqual, notStrictEqual} from 'assert'
import { isnullorundefined } from '../utility/utilities';
import { assertNotNull } from '@angular/compiler/src/output/output_ast';
import { IStreamSubscriber } from '@aspnet/signalr';
import { LoadingService } from './loading.service';
import { streamresponse } from './streaming.data';

const streamtimeout = 60000

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
        return service
    })

    it('should negotiate a transport', (done: DoneFn) => {
        service.startconnection()
            .then((connectionresult) => {
                expect(connectionresult.outcome).toBeTruthy()
                done()
            })
    }, streamtimeout)

    /** only one streaming test can succeed at a time! the server just runs out of memory. */
    it('should stream music', (done: DoneFn) => {
        service.startconnection()
        .then(() => {
            let subscriber: IStreamSubscriber<streamresponse> = {
                next: (chunk: streamresponse) => {
                    expect(chunk.chunk.length).toBeGreaterThan(0)
                    expect(chunk.bitdepth !== 0).toBeTruthy()
                    expect(chunk.channels !== 0).toBeTruthy()
                    expect(isnullorundefined(chunk.encoding)).toBeTruthy()
                    expect(chunk.encoding !== "").toBeTruthy()
                    expect(chunk.samplerate !== 0).toBeTruthy()
                    expect(chunk.totalchunks !== 0).toBeTruthy()
                },
                complete: () => {             
                    done()
                },
                error: console.error
            }
            let allowedtostream = service.loadrandomdeserttrack(subscriber)   
            expect(allowedtostream).toBeTruthy()
        })
    }, streamtimeout)

    afterEach(() => {
        subs.unsubscribe()
    })
});
