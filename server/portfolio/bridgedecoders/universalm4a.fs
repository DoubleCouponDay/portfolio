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
    let mutable skiptime = 0.0

    do
        if reader.CanRead = false then
            failwith "error trying to read the M4A file!"

    interface Ireader with
        member this.bitdepth: int = reader.WaveFormat.BitsPerSample
        member this.channels: int = reader.WaveFormat.Channels
        member this.filesize: int64 = reader.Length
        member this.position: int64 = reader.Position
        member this.samplerate: int = reader.WaveFormat.SampleRate

        member this.readchunk(): Option<byte []> =             
            let samplesperchunk = chunksize / reader.WaveFormat.BitsPerSample
            let timeperchunk = float(samplesperchunk / reader.WaveFormat.SampleRate) |> float

            let cut = 
                sampler.Skip(TimeSpan.FromSeconds(skiptime))
                    .Take(TimeSpan.FromSeconds(timeperchunk))
                    .ToWaveProvider()

            skiptime <- skiptime + timeperchunk
            let mutable shouldread = true
            let buffer = Array.create chunksize 0uy

            while shouldread do
                let amountread = cut.Read(buffer, 0, buffer.Length)
                let output = amountread
                () 

            Some buffer
        
    interface IDisposable with
        member this.Dispose(): unit = 
            reader.Dispose()
            MediaFoundationApi.Shutdown()