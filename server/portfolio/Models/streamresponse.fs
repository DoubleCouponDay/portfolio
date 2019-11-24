﻿namespace portfolio.models

open System.Collections.Generic

[<AllowNullLiteral>]
type public streamresponse() =
    member val public chunk: float32[] = null with get, set
    member val public totalchunks: int64 = 0L with get, set
    member val public bitdepth: int = 0 with get, set
    member val public samplerate: int = 0 with get, set
    member val public channels: int = 0 with get, set