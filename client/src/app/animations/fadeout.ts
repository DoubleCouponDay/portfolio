import { AnimationTriggerMetadata, trigger, transition, animate, style, query } from '@angular/animations'

const fadeout = trigger(
    "fadeout", [
        transition(
            ":leave",
            query(
                "*",
                animate(
                    "1s",
                    style({
                        opacity: 0
                    })
                )
            )
        )
    ]
)

export default fadeout
