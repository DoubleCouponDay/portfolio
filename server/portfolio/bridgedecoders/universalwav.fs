namespace portfolio.bridgedecoders

open NAudio.Wave
open portfolio.models
open System.IO
open System
open audio.data

type public universalwav(track: audiofile) =
    inherit universalreader(track)

    let reader = new WaveFileReader(track.stream)
    let mutable startposition = 0L
    let sampler = reader.ToSampleProvider()

    do
        if reader.CanRead = false then
             failwith "the received chunk file cant be read!"
    
    interface Ireader with
        member this.channels: int = reader.WaveFormat.Channels         
        member this.filesize: int64 = reader.Length
        member this.position: int64 = reader.Position
        member this.samplerate: int = reader.WaveFormat.SampleRate
        member this.bitdepth = reader.WaveFormat.BitsPerSample

        member this.readchunk(): Option<byte[]> =
            use newstream = new MemoryStream()
            let writer = new WaveFileWriter(newstream, reader.WaveFormat)

            reader.Position <- startposition
            let buffersize = reader.BlockAlign * 1024 /// make sure that buffer is sized to a multiple of our WaveFormat.BlockAlign.
            /// BlockAlign equals channels * (bits / 8), so for 16 bit stereo wav it will be 4096 bytes
            let buffer = Array.create buffersize 0.0F        
            let mutable takecount = this.getbuffersize(reader.Position, reader.Length) //measured in actual memory, not samples
            let mutable sampleswritten = false

            while takecount > 0 do
                buffer.Initialize()
                let bytestoread = Math.Min(takecount, buffer.Length)
                let bytesread = sampler.Read(buffer, 0, bytestoread)        
                
                if bytesread > 0 then
                    writer.WriteSamples(buffer, 0, bytestoread) 
                    takecount <- takecount - bytesread
                    sampleswritten <- true
                
                if takecount = 0 then
                    writer.Dispose() // writes the header     
                
                else
                    takecount <- takecount - bytesread

            startposition <- reader.Position     
            writer.Dispose()

            if sampleswritten then 
                let output = newstream.GetBuffer()
                Some output

            else None
        
    interface IDisposable with
        member this.Dispose() =
            reader.Dispose()   