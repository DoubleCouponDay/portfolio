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
                this.decodewavchunks(track)

            | _ -> 
                failwith (String.concat "" [|"filetype: "; track.fileextension; " not known by decoder!"|])

    member private this.decodemp3(track: audiofile): seq<streamresponse> =        
        null

    member private this.decodewavchunks(track: audiofile): seq<streamresponse> =
        let reader = new WaveFileReader(track.stream)
        
        if reader.CanRead = false then
            failwith "the data of the wav file is unknown!"
            
        let mutable output = new streamresponse()
        let samplegiver = reader.ToSampleProvider()
        output.bitdepth <- reader.WaveFormat.BitsPerSample
        output.samplerate <- reader.WaveFormat.SampleRate
        output.channels <- reader.WaveFormat.Channels
        output.totalchunks <- reader.Length / int64(chunksize)
        output.encoding <- samplegiver.WaveFormat.Encoding.ToString()        
        let samplesarray = Array.create chunksize 0.0F
        let mutable moredatatoread = true

        seq {
            while moredatatoread do                 
                if reader.Position <> 0L then
                    output <- new streamresponse()

                let countread = samplegiver.Read(samplesarray, 0, chunksize)
                moredatatoread <- if countread = chunksize then true else false
                output.chunk <- samplesarray
                
                yield output
        }

    //member private this.decodem4a(track: audiofile): Async<audiofile> =
    //    null

    //member private this.decodeflac(track: audiofile): Async<audiofile> =
    //    null

    //member private this.decodeogg(input: audiofile): Async<audiofile> =
    //    null