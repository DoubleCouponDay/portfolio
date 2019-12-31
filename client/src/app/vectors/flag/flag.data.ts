import { slidestate } from 'src/app/animations/slide';
import { AnimationPlayer } from '@angular/animations';

export interface flagsegment {
    element: HTMLElement,
    expression: slidestate,
    animator: AnimationPlayer,
    startingoffset: number
}