import { animation, style, animate, sequence } from "@angular/animations";
import { rotatename, degreesunit } from './styleconstants';

export const rotationtime = 6800
export const anglename = 'angle1'
export const inputtimename = 'inputtime'

/**parameters: inputangle */
export const rotatetablet90withkick = animation(    
    animate(
        `{{ ${inputtimename} }}ms cubic-bezier(.21,.14,0,-0.32)`,
        style({
            transform: `${rotatename}({{ ${anglename} }}${degreesunit})`
        }),
    )
)

/**parameters: inputangle, time1  */
export const rotatetablet90 = animation(
    animate(
        `{{ ${inputtimename} }}ms cubic-bezier(0, 0, 1, 1)`,
        style({
            transform: `${rotatename}({{ ${anglename} }}${degreesunit})`
        })
    )
    
)

export const reset360 = animation(
    animate(
        '0s',
        style({
            transform: 'rotate(0deg)'
        })
    )
)