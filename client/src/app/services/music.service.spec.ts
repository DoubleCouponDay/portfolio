import { TestBed, tick } from '@angular/core/testing';
import { MusicService } from './music.service';
import { HttpClientModule } from '@angular/common/http';
import { SubSink } from 'subsink';
import {strictEqual, notStrictEqual} from 'assert'
import { isnullorundefined } from '../utility/utilities';
import { assertNotNull } from '@angular/compiler/src/output/output_ast';
import { IStreamSubscriber } from '@aspnet/signalr';
import { LoadingService } from './loading.service';
import { messagestate } from './streaming.data';

const streamtimeout = 60_000

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
                expect(connectionresult).toBeTruthy()
                done()
            })
    })

    it('should stream music', (done: DoneFn) => {
        service.startconnection()
        .then(() => {
            let allowedtostream = service.loadrandomdeserttrack((output) => {
                expect(output.state).toEqual(messagestate.response_haveachunk)
                expect(output.chunk).toBeTruthy()
                done()
            })   
            expect(allowedtostream).toBeTruthy()
        })
    }, streamtimeout)

    afterEach(() => {
        subs.unsubscribe()
    })
});
