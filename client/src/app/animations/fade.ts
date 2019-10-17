import { AnimationTriggerMetadata, trigger, transition, animate, style, query, animation, AnimationQueryOptions } from '@angular/animations'
import { inputopacityname, inputtimename, loadingscreentime } from './animation.data';
import { smoothtime } from './movetocursorvertically';

const options: AnimationQueryOptions = {
    optional: true
}

export const fadeout = trigger(
    "fadeout", [
        transition(
            ":leave",
            query(
                "*",
                animate(
                    loadingscreentime,
                    style({
                        opacity: 0
                    })
                ),
                options
            )
        )
    ]
)

export const fadein = trigger(
    'fadein', [
        transition(
            ':enter', [
                style({ opacity: 0}),                            
                animate(
                    loadingscreentime,
                    style({
                        opacity: 1
                    })
                )
            ]
        )
    ]
)

/** parameteres: inputopacity */
export const togglefade = animation(
    animate(
        `${smoothtime}ms`,
        style({
            opacity: `{{ ${inputopacityname} }}`
        })
    )
)