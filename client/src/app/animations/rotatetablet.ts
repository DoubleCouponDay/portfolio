import { animation, style, animate } from "@angular/animations";

export const rotationtime = 5

export const rotatetablet = animation(    
    animate(
        `${rotationtime}s cubic-bezier(.21,.14,0,-0.32)`,
        style({
            transform: '{{ inputtransform }}'
        }),
    )
)
