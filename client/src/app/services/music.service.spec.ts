import { TestBed } from '@angular/core/testing';
import { MusicService } from './music.service';
import { HttpClientModule } from '@angular/common/http';
import { SubSink } from 'subsink';

describe('TestService', () => {
    let service: MusicService
    let subs: SubSink

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule
            ]
        })
        service = TestBed.get(MusicService);

        subs = new SubSink()
    });

    it('should be created', () => {
    const service: MusicService = TestBed.get(MusicService)
    expect(service).toBeTruthy()
    });

    it('should stream music', () => {
        let hasdata = false
        let onrandomtrack = (data: any) => {
            console.log(data)
            hasdata = true
        }

        let sub1 = service.getrandomdeserttrack()
        .subscribe(onrandomtrack)

        let sub2 = sub1.add(() => {
            expect(hasdata).toBeTruthy()
        })
        subs.add(sub1, sub2)
                    
    });

    afterEach(() => {
        subs.unsubscribe()
    })
});
