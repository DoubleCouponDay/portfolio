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
    member public this.streamdecodedchunks(track: audiofile): seq<FileResult> =
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

    member private this.decodewav(track: audiofile): seq<FileResult> =
        let reader = new WaveFileReader(track.stream)
        
        if reader.CanRead = false then
            failwith "the input wav file cant be read!"

        seq {
            track.stream.Position <- 0L
            let asarray = track.stream.ToArray()
            let output = new FileContentResult(asarray, "audio/wav")
            yield output
        }

    //member private this.decodem4a(track: audiofile): Async<audiofile> =
    //    null

    //member private this.decodeflac(track: audiofile): Async<audiofile> =
    //    null

    //member private this.decodeogg(input: audiofile): Async<audiofile> =
    //    null