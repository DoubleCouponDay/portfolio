module portfolio.audiodecoder

open ManagedBass.Aac
open MP3Sharp
open Accord.Audio
open portfolio.models
open portfoliodata
open System.Linq
open System.Collections.Generic
open System.IO
open System

type public audiodecoder() =
    member public this.decodeaudio(track: audiofile): seq<streamresponse> =
        track.stream.Position <- 0L

        match track.mimetype with
            | "audio/mpeg" -> 
                this.decodemp3(track)

            //| "audio/aac" ->
            //    this.decodem4a(track)

            //| "audio/x-flac" ->
            //    this.decodeflac(track)

            //| "audio/flac" ->
            //    this.decodeflac(track)

            //| "audio/ogg" ->
            //    this.decodeogg(track)

            | "audio/wav" ->
                this.readstreamtoend(track)

            | "audio/x-wav" ->
                this.readstreamtoend(track)

            | _ -> 
                failwith (String.concat "" [|"filetype: "; track.mimetype; "not known by decoder!"|])

    member private this.readstreamtoend(track:audiofile, ?formattedstream: Stream, ?totalchunks: int): seq<streamresponse> =
        seq {
            let chosenstream: Stream = 
                match formattedstream with
                | None -> track.stream :> Stream

                | _ -> formattedstream.Value

            while chosenstream.Position < chosenstream.Length do
                let output = new streamresponse()

                if track.stream.Position = 0L &&
                    totalchunks.IsSome then
                    output.totalchunks <- int64(totalchunks.Value)

                let currentchunk = Array.create chunksize (new byte())       
                let amountread = chosenstream.Read(currentchunk, 0, chunksize) |> ignore                

                output.chunk <- currentchunk.Select(
                    fun currentbyte -> int32(currentbyte))
                    .ToArray()
                GC.Collect()
                yield output
        }

    member private this.decodemp3(track: audiofile): seq<streamresponse> =        
        let decoder = new MP3Stream(track.stream, chunksize)

        if decoder.IsEOF then
            String.concat "" [|track.mimetype; " decoder: could not understand audio file '"; track.filename;"'"|]
            |> failwith

        this.readstreamtoend(track, decoder)

    //member private this.decodem4a(track: audiofile): Async<audiofile> =
    //    Async.

    //member private this.decodeflac(track: audiofile): Async<audiofile> =
    //    null

    //member private this.decodeogg(input: audiofile): Async<audiofile> =
    //    null