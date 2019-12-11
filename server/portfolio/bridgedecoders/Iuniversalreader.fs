namespace portfolio.bridgedecoders.Iuniversalreader

type public Iuniversalreader =
    abstract read: (byte[] * int64 * int64) -> int64
    abstract position: int64
    abstract filesize: int64
    abstract samplecount: int64
    abstract bitdepth: int
    abstract samplerate: int
    abstract channels: int
