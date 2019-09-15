import { animation, animate, state, trigger, style, query, AnimationStyleMetadata, useAnimation } from '@angular/animations';

const movetocursorhorizontally = animation(
    animate(
        "0.2s",
        style({
            transform: "{{ inputstyle }}"
        })
    )
)
export default movetocursorhorizontally