namespace portfolio.bridgedecoders

open portfolio.models
open audio.data
open System

[<AbstractClass>]
type public Iuniversalreader() =
    abstract position: int64
    abstract filesize: int64
    abstract samplecount: int64
    abstract bitdepth: int
    abstract samplerate: int
    abstract channels: int
    abstract encoding: string
    ///reads the next chunk in the audio file. chunk is a separate audio file. returns null if no chunk left
    abstract readchunk: unit -> Option<byte[]>

    member this.calculatetotalchunks(): int64 =
        let floatsize = float(this.filesize)
        let floatchunk = float(chunksize)
        let calculation = floatsize / floatchunk
        let rounded = Math.Ceiling(calculation)
        int64(rounded)