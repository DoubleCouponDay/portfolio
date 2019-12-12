namespace portfolio.bridgedecoders

open portfolio.models
open NAudio.MediaFoundation
open NAudio.Wave
open System
open audio.data

type public universalm4a(track: audiofile) =
    inherit universalreader(track)

    do
        MediaFoundationApi.Startup()
   
    let reader = new StreamMediaFoundationReader(track.stream)
    let sampler = reader.ToSampleProvider()
    let mutable skipcount = 0.0

    do
        let bytes = track.stream.ToArray()
        reader.Write(bytes, 0, bytes.Length) 

        if reader.CanRead = false then
            failwith "error trying to read the M4A file!"

        reader.Position <- 0L

    interface Ireader with
        member this.bitdepth: int = reader.WaveFormat.BitsPerSample
        member this.channels: int = reader.WaveFormat.Channels
        member this.filesize: int64 = reader.Length
        member this.position: int64 = reader.Position
        member this.samplerate: int = reader.WaveFormat.SampleRate

        member this.readchunk(): Option<byte []> = 
            let mutable taketime:float = 
                

            let cut = 
                sampler.Skip(TimeSpan.FromSeconds(skipcount))
                    .Take(TimeSpan.FromSeconds(taketime))
                    .ToWaveProvider()

            skipcount <- skipcount + taketime
            let mutable amountread = 1
            let buffer = Array.create 0 22

            while amountread > 0 do
                cut.Read()

            Some output
        
    interface IDisposable with
        member this.Dispose(): unit = 
            reader.Dispose()
            MediaFoundationApi.Shutdown()