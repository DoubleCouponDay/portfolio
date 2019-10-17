import { AnimationTriggerMetadata, trigger, transition, animate, style, query, animation, AnimationQueryOptions } from '@angular/animations'
import { inputopacityname, inputtimename } from './styleconstants';
import { smoothtime } from './movetocursorvertically';

const options: AnimationQueryOptions = {
    optional: true
}

const defaultfadetime = '800ms'

export const fadeout = trigger(
    "fadeout", [
        transition(
            ":leave",
            query(
                "*",
                animate(
                    defaultfadetime,
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
                    defaultfadetime,
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