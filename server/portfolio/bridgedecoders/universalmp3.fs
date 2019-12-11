﻿namespace portfolio.bridgedecoders

open NAudio.MediaFoundation
open portfolio.models
open NAudio.Wave
open System
open System.IO

type public universalmp3(track: audiofile) =
    inherit universalreader(track)
    let reader = new Mp3FileReader(track.stream)

    interface Ireader with
        member this.bitdepth: int = reader.WaveFormat.BitsPerSample
        member this.channels: int = reader.WaveFormat.BitsPerSample            
        member this.encoding: string = "mpeg"
        member this.filesize: int64 = reader.Length
        member this.position: int64 = reader.Position
        member this.samplerate: int = reader.WaveFormat.SampleRate

        member this.readchunk(): Option<byte []> = 
            let takecount = this.getbuffersize(reader.Position, reader.Length)
            let stream = new MemoryStream()
            let mutable readcount = 0
            
            while readcount < takecount do
                let frame = reader.ReadNextFrame()

                if frame <> null then
                    stream.Write(frame.RawData, 0, frame.RawData.Length)
                    readcount <- readcount + frame.RawData.Length                    

                else
                    readcount <- takecount

            let output = stream.ToArray()
            Some output
            

    interface IDisposable with
        member this.Dispose() =
            reader.Dispose()