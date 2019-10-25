import { TestBed } from '@angular/core/testing';

import { MusicService } from './music.service';
import { HttpClientModule } from '@angular/common/http';

describe('TestService', () => {
    let service: MusicService

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule
            ]
        })
        service = TestBed.get(MusicService);
    });

    it('should be created', () => {
    const service: MusicService = TestBed.get(MusicService);
    expect(service).toBeTruthy();
    });

    it('should stream music', () => {
        let onrandomtrack = (data: any) => {
            console.log(data)
            
        }

        service.getrandomdeserttrack()
            .subscribe(onrandomtrack)
    });
});
