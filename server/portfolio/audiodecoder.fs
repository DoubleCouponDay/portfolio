module portfolio.audiodecoder

open ManagedBass.Aac
open Accord.Audio
open portfolio.models
open portfolio.data
open System.Linq
open System.Collections.Generic
open System.IO
open System
open audio.data
open NAudio
open NAudio.Wave
open Microsoft.AspNetCore.Mvc

type public audiodecoder() =
    member public this.streamdecodedchunks(track: audiofile): seq<streamresponse> =
        track.stream.Position <- 0L

        match track.fileextension with
            //| "flac" ->
            //    this.decodeflac(track)

            //| "mp3" -> 
            //    this.decodemp3(track)

            //| "ogg" ->
            //    this.decodeogg(track)

            //| "m4a" ->
            //    this.decodem4a(track)

            | "wav" ->
                this.decodewav(track)

            | _ -> 
                failwith (String.concat "" [|"filetype: "; track.fileextension; " not known by decoder!"|])

    member private this.decodemp3(track: audiofile): seq<streamresponse> =        
        null

    member private this.decodewav(track: audiofile): seq<streamresponse> =
        let reader = new WaveFileReader(track.stream)
        
        if reader.CanRead = false then
            failwith "the input wav file cant be read!"

        let mutable output = new streamresponse()
        output.bitdepth <- reader.WaveFormat.BitsPerSample
        output.samplerate <- reader.WaveFormat.SampleRate
        output.channels <- reader.WaveFormat.Channels
        output.totalchunks <- reader.Length / int64(chunksize)
        output.encoding <- reader.WaveFormat.Encoding.ToString()        
        let inbetweenarray: float32[] = Array.create 0 0.0F
        let mutable moredatatoread = true       
        track.stream.Position <- 0L
        let sampler = reader.ToSampleProvider()

        seq {
                let mutable skipamount = 0.0

                while moredatatoread do                   
                    if reader.Position <> 0L then
                        output <- new streamresponse()

                    use outputstream = new MemoryStream()

                    let smallerwave = 
                        sampler.Skip(TimeSpan.FromSeconds(skipamount))
                            .Take(TimeSpan.FromSeconds(threeseconds))
                            .ToWaveProvider()

                    skipamount <- skipamount + threeseconds
                    WaveFileWriter.WriteWavFileToStream(outputstream, smallerwave) |> ignore                    
                    output.chunk <- outputstream.GetBuffer()

                    moredatatoread <- if output.chunk.Length = chunksize then true else false
                    GC.Collect()
                    yield output
        }

    //member private this.decodem4a(track: audiofile): Async<audiofile> =
    //    null

    //member private this.decodeflac(track: audiofile): Async<audiofile> =
    //    null

    //member private this.decodeogg(input: audiofile): Async<audiofile> =
    //    null