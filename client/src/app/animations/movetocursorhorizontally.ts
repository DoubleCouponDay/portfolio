import { animation, animate, state, trigger, style, query, AnimationStyleMetadata, useAnimation } from '@angular/animations';

const movetocursorhorizontally = animation(
    animate(
        "0.3s ease-out",
        style({
            transform: "{{ inputstyle }}"
        })
    )
)
export default movetocursorhorizontally