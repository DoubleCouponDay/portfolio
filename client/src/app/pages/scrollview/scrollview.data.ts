

export const maximumtranslation = 625
export const scrollmultiplier = 2.6
export const mintranslationX = 15
export const mintranslationY = 1

export const nomovementtimer = 1000
export const buttonidentifier = 'scrollbutton'

export enum volumestate {
    stable = 1,
    increasing = 2,
    decreasing = 3
}

export type movementcalculation = {
    shouldmove: boolean,
    changeinposition: number
}