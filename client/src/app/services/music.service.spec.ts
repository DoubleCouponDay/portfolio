import { TestBed, tick } from '@angular/core/testing';
import { MusicService } from './music.service';
import { HttpClientModule } from '@angular/common/http';
import { SubSink } from 'subsink';
import {strictEqual, notStrictEqual} from 'assert'
import { isnullorundefined } from '../utility/utilities';
import { assertNotNull } from '@angular/compiler/src/output/output_ast';

const streamtimeout = 30000

describe('TestService', () => {
    let service: MusicService
    let subs: SubSink

    let ontesterror = (context: any) => {
        console.log(context)
    }

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule
            ]
        })
        service = TestBed.get(MusicService);

        subs = new SubSink()
    });

    it('should create a service', () => {
        const service: MusicService = TestBed.get(MusicService)        
        expect(service).toBeTruthy()
    })

    it('should stream music', (done: DoneFn) => {
        let onrandomtrack = (data: any) => {
            expect(data).toBeTruthy()
            console.log(data)
            done()
        }

        let sub1 = service.getrandomdeserttrack()
            .subscribe(onrandomtrack, ontesterror)   
        
        subs.add(sub1)
    }, streamtimeout)

    afterEach(() => {
        subs.unsubscribe()
    })
});
