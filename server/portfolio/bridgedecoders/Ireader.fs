namespace portfolio.bridgedecoders

type public Ireader =
    abstract position: int64
    abstract filesize: int64
    abstract bitdepth: int
    abstract samplerate: int
    abstract channels: int
    abstract encoding: string    

    ///reads the next chunk in the audio file. chunk is a separate audio file. returns null if no chunk left
    abstract readchunk: unit -> Option<byte[]>