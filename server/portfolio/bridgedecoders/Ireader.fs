namespace portfolio.bridgedecoders

open System

type public Ireader =
    inherit IDisposable

    abstract position: int64
    abstract filesize: int64
    abstract bitdepth: int
    abstract samplerate: int
    abstract channels: int

    ///reads the next chunk in the audio file. chunk is a separate audio file. returns null if no chunk left
    abstract readchunk: unit -> Option<byte[]>