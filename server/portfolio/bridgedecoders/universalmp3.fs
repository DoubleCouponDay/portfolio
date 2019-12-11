namespace portfolio.bridgedecoders

open NAudio.MediaFoundation
open portfolio.models
open NAudio.Wave
open System

type public universalmp3(track: audiofile) =
    let reader = new Mp3FileReader(track.stream)

    interface Ireader with
        member this.bitdepth: int = reader.WaveFormat.BitsPerSample
        member this.channels: int = reader.WaveFormat.BitsPerSample            
        member this.encoding: string = "mpeg"
        member this.filesize: int64 = reader.Length
        member this.position: int64 = reader.Position
        member this.samplerate: int = reader.WaveFormat.SampleRate

        member this.readchunk(): Option<byte []> = 
            None

    interface IDisposable with
        member this.Dispose() =
            reader.Dispose()