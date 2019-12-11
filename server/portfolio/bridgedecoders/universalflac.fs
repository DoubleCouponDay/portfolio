namespace portfolio.bridgedecoders

open CUETools.Codecs.FLAKE
open CUETools.Codecs
open System.IO
open audio.data
open portfolio.models
open System

type public universalflac(track: audiofile) =
    inherit universalreader(track)

    let reader = new FlakeReader(null, track.stream)

    interface Ireader with
        member this.bitdepth: int = reader.PCM.BitsPerSample            
        member this.channels: int = reader.PCM.SampleRate
        member this.encoding: string = "flac"
        member this.filesize: int64 = reader.Length
        member this.position: int64 = reader.Position
        member this.samplerate: int = reader.PCM.SampleRate

        member this.readchunk(): Option<byte[]> =
            use newstream = new MemoryStream()
            let writer = new FlakeWriter(null, newstream, reader.PCM)

            let takecount = this.getbuffersize(reader.Position, reader.Length)
    
            if takecount = 0 then
                None

            else
                let buffer = new AudioBuffer(reader, takecount)
                let amountread = reader.Read(buffer, takecount)
                writer.WriteHeader()
                writer.Write(buffer)
                writer.Dispose()
                let output = newstream.ToArray()
                Some output

    interface IDisposable with
        member this.Dispose() =
            reader.Dispose()