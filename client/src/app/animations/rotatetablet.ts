import { animation, style, animate, sequence } from "@angular/animations";
import { rotatename, degreesunit, inputtimename } from './animation.data';

export const rotationtime = 6800
export const anglename = 'angle'

export const normalkick = `.21, .14, 0, -0.32`
export const flipkick = '.5, 0.09, .3, 0.39'

export const curvename = 'curve'

/**parameters: inputangle, angle, curve */
export const rotatetablet90withkick = animation(    
    animate(
        `{{ ${inputtimename} }}ms cubic-bezier({{ ${curvename} }})`,
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