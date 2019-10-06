import { animation, style, animate, sequence } from "@angular/animations";
import { rotatename, degreesunit } from './styleconstants';

export const rotationtime = 6800
export const angle1name = 'angle1'
export const angle2name = 'angle2'
export const inputtimename = 'inputtime'

export const kickstart90 = animate(
    `{{ ${inputtimename} }}ms cubic-bezier(.21,.14,0,-0.32)`,
    style({
        transform: `${rotatename}({{ ${angle1name} }}${degreesunit})`
    }),
)

export const rotate90 = animate(
    `{{ ${inputtimename} }}ms cubic-bezier(0, 0, 1, 1)`,
    style({
        transform: `${rotatename}({{ ${angle2name} }}${degreesunit})`
    })
)

/**parameters: inputangle */
export const rotatetablet90 = animation(    
    kickstart90
)

/**parameters: inputangle, time1  */
export const rotatetablet180 = animation(
    sequence([kickstart90, rotate90])
)