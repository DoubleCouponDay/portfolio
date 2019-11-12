namespace portfolio.models

type public streamresponse(inputchunk: byte[]) =
    member public this.chunk = inputchunk
    member val public totalchunks: int64 = 0L with get, set