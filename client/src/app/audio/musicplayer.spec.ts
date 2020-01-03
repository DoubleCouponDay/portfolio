import { TestBed, tick } from '@angular/core/testing';
import { musicplayer } from './musicplayer';
import { HttpClientModule } from '@angular/common/http';
import { SubSink } from 'subsink';
import {strictEqual, notStrictEqual} from 'assert'
import { isnullorundefined } from '../utility/utilities';
import { assertNotNull } from '@angular/compiler/src/output/output_ast';
import { IStreamSubscriber, HubConnectionState } from '@aspnet/signalr';

/** portfolio server must be running before running these tests */
describe('musicplayer', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
            ]
        })
    });

});
