namespace portfolio.bridgedecoders

open audio.data
open portfolio.models

type public universalreader(track: audiofile) =

    member this.getbuffersize(currentposition: int64, totalsize: int64): int =
        let formattedsize = chunksize
        let difference = int(totalsize - currentposition)
        let output = if difference >= formattedsize then formattedsize else difference
        output
    