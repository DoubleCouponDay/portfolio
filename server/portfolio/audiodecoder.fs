module portfolio.audiodecoder

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
open CUETools.Codecs.FLAKE
open CUETools.Codecs
open portfolio.bridgedecoders

type public audiodecoder() =
    member public this.streamdecodedchunks(track: audiofile): seq<streamresponse> =
        track.stream.Position <- 0L

        let reader: Ireader = 
            match track.fileextension with
                | "flac" ->
                    new universalflac(track) :> Ireader

                | "mp3" -> 
                    new universalmp3(track) :> Ireader

                //| "ogg" ->
                //    this.decodeogg(track)

                | "m4a" ->
                    new universalm4a(track) :> Ireader

                | "wav" ->
                    new universalwav(track) :> Ireader

                | _ -> 
                    failwith (String.concat "" [|"filetype: "; track.fileextension; " not known by decoder!"|])

        this.decode(reader)

    member private this.decode(reader: Ireader): seq<streamresponse> =
        let mutable output = new streamresponse()
        let mutable firstiteration = true
        let mutable moredatatoread = true       

        seq {
            output.bitdepth <- reader.bitdepth
            output.samplerate <- reader.samplerate
            output.channels <- reader.channels
            output.totalchunks <- this.calculatetotalchunks(reader.filesize)

            while moredatatoread do     
                if firstiteration = false then                        
                    output <- new streamresponse()

                else
                    firstiteration <- false

                let possiblechunk = reader.readchunk()

                if possiblechunk.IsSome then 
                    moredatatoread <- true  
                    output.chunk <- possiblechunk.Value
                    yield output
                        
                else 
                    moredatatoread <- false 
                    reader.Dispose()
        }

    member private this.calculatetotalchunks(filesize: int64): int64 =
        let floatsize = float(filesize)
        let floatchunk = float(chunksize)
        let calculation = floatsize / floatchunk
        let rounded = Math.Ceiling(calculation)
        int64(rounded)

    //member private this.decodem4a(track: audiofile): Async<audiofile> =
    //    null

    //member private this.decodeogg(input: audiofile): Async<audiofile> =
    //    null