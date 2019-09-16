import { animation, style, animate } from "@angular/animations";


const rotatetablet = animation(    
    animate(
        "6s cubic-bezier(.2, .53, 0, -0.32)",
        style({
            transform: '{{ inputtransform }}'
        }),
    )
)
export default rotatetablet