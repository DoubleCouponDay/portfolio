import { ElementRef } from '@angular/core';
import { AnimationBuilder, AnimationFactory } from '@angular/animations';
import rotatetablet from '../animations/rotatetablet';


export class tabletstate {
    private currentrotationfield: number
    private animationfactory: AnimationFactory

    private set currentrotation(input: number) {
        if(input > 360) {
            throw new Error('angle cannot be greater than 360')
        }

        else if(input < -360) {
            throw new Error('angle cannot be less than -360')
        }
        this.currentrotationfield = input
    }

    constructor(animationbuilder: AnimationBuilder, 
        inputrotation: number, 
        public inputorigin: [number, number],
        private inputtable: ElementRef) {
        this.currentrotation = inputrotation
        this.animationfactory = animationbuilder.build(rotatetablet)
    }

    applyrotation(angle: number) {
        this.currentrotation = angle
        
        this.animationfactory.create(this.inputtable, {
            params: {
                inputtransform: `rotate(${angle})`
            }
        })
    }
}