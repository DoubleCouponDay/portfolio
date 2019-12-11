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
open flacutils
open CUETools.Codecs
open portfolio.bridgedecoders

type public audiodecoder() =
    member public this.streamdecodedchunks(track: audiofile): seq<streamresponse> =
        track.stream.Position <- 0L

        let reader: Iuniversalreader = 
            match track.fileextension with
                //| "flac" ->
                    //this.decodeflac(track)

                //| "mp3" -> 
                //    this.decodemp3(track)

                //| "ogg" ->
                //    this.decodeogg(track)

                //| "m4a" ->
                //    this.decodem4a(track)

                | "wav" ->
                    new universalwav(track.stream) :> Iuniversalreader

                | _ -> 
                    failwith (String.concat "" [|"filetype: "; track.fileextension; " not known by decoder!"|])

        this.decode(reader)

    //member private this.decodemp3(track: audiofile): seq<streamresponse> =        
    //    null

    member private this.decode(reader: Iuniversalreader): seq<streamresponse> =
        let mutable output = new streamresponse()
        let mutable firstiteration = true
        let mutable moredatatoread = true       

        seq {
            output.bitdepth <- reader.bitdepth
            output.samplerate <- reader.samplerate
            output.channels <- reader.channels
            output.totalchunks <- reader.calculatetotalchunks()
            output.encoding <- reader.encoding   

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
        }

    //member private this.decodeflac(track: audiofile): seq<streamresponse> =
    //    let mutable output = new streamresponse()
    //    output.encoding <- "flac"
    //    let mutable firstiteration = true
    //    let mutable moredatatoread = true    

    //    seq {
    //        let mutable skipamount = 0.0
    //        use reader = new FlakeReader(null, track.stream)
    //        output.bitdepth <- reader.PCM.BitsPerSample
    //        output.samplerate <- reader.PCM.SampleRate
    //        output.channels <- reader.PCM.ChannelCount
    //        let chunkcount = this.calculatetotalchunks(reader.Length)
    //        output.totalchunks <- chunkcount

    //        while moredatatoread do                   
    //            if firstiteration = false then                        
    //                output <- new streamresponse()

    //            else
    //                firstiteration <- false

    //            let outputstream = new MemoryStream()
    //            let writer = new FlakeWriter(null, outputstream, reader.PCM)
                
    //            let endingposition = int64(chunksize) + reader.Position
    //            let amountread = flacutils.writeflacchunk(reader, writer, reader.Position, endingposition)
    //            writer.Dispose()

    //            if amountread <> 0 then 
    //                moredatatoread <- true                        
    //                output.chunk <- outputstream.GetBuffer()
    //                outputstream.Dispose()
    //                skipamount <- skipamount + float(chunksize)
    //                yield output
                        
    //            else 
    //                moredatatoread <- false 
    //    }       

    //member private this.decodem4a(track: audiofile): Async<audiofile> =
    //    null

    //member private this.decodeogg(input: audiofile): Async<audiofile> =
    //    null