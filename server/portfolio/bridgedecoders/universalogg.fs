namespace portfolio.bridgedecoders

open NAudio.Wave
open portfolio.models
open System.IO
open System
open audio.data
open NAudio.Vorbis

type public universalogg(track: audiofile) =
    inherit universalreader(track)
   
    let reader = new VorbisWaveReader(track.stream)
    let sampler = reader.ToSampleProvider()

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
            let buffer = Array.create chunksize 0.0F
            let amountread = sampler.Read(buffer, 0, chunksize)            

            if amountread = 0 then
                None

            else
                use outputstream = new MemoryStream()
                let writer = new WaveFileWriter(outputstream, sampler.WaveFormat)
                writer.WriteSamples(buffer, 0, buffer.Length)
                writer.Dispose()
                let output = outputstream.ToArray()
                Some output

    interface IDisposable with
        member this.Dispose(): unit = 
            reader.Dispose()