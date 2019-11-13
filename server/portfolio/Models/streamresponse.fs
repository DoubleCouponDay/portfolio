namespace portfolio.models

open System.Collections.Generic

type public streamresponse(inputchunk: IEnumerable<int>) =
    member public this.chunk = inputchunk
    member val public totalchunks: int64 = 0L with get, set