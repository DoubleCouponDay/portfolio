namespace portfolio.models

open System.Collections.Generic

type public streamresponse() =
    member val public chunk = null with get, set
    member val public totalchunks: int64 = 0L with get, set