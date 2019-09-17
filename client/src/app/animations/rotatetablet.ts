import { animation, style, animate } from "@angular/animations";

export const rotationtime = 5

export const rotatetablet = animation(    
    animate(
        `${rotationtime}s cubic-bezier(.04,.18,0,-0.32)`,
        style({
            transform: '{{ inputtransform }}'
        }),
    )
)
