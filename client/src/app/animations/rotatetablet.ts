import { animation, style, animate, sequence } from "@angular/animations";
import { rotatename, degreesunit } from './styleconstants';

export const rotationtime = 6800
export const angle1name = 'angle1'
export const angle2name = 'angle2'
export const inputtimename = 'inputtime'

const rotationtemplate = `${rotatename}({{ ${angle1name} }}${degreesunit})`

export const kickstart90 = animate(
    `{{ ${angle1name} }}ms cubic-bezier(.21,.14,0,-0.32)`,
    style({
        transform: rotationtemplate
    }),
)

export const rotate90 = animate(
    `{{ ${angle2name} }}ms cubic-bezier(0, 0, 1, 1)`,
    style({
        transform: rotationtemplate
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