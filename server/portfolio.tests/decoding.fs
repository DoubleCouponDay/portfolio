﻿module decoding

open Xunit
open portfoliodata
open portfolio.audiodecoder
open System.IO
open FSharp.Data
open portfolio.models
open System
open System.Media
open System.Collections.Generic
open System.Linq

type public the_decoders() =
    let context = new audiodecoder()    
    let mutable subject: MemoryStream = null
    let player = new SoundPlayer()

    interface IDisposable with
        member this.Dispose() =
            subject.Dispose()
            player.Dispose()

    [<Fact>]
    member public this.can_decode_mp3() =
        async {
            use stream = new MemoryStream()
            use file = File.OpenRead("assets/sample.mp3")
            file.CopyTo(stream)
            let mime = MimeTypes.tryFind(".mp3").Value
            let input = new audiofile(stream, "", mime)
            let output = context.decodeaudio(input)
            this.fetchentireoutput(output)
            this.testoutput(stream)   
        }

    member private this.fetchentireoutput(sequence: seq<streamresponse>) =
        let mutable fetched = Array.create 0 0uy

        for item in sequence do
            let convertedbackaaah = 
                item.chunk.Select(fun current -> byte(current))
                    .ToArray()
            fetched <- Array.append fetched convertedbackaaah

        subject <- new MemoryStream(fetched)

    [<Fact>]
    member public this.can_decode_flac() =
        Assert.True(false)

    [<Fact>]
    member public this.can_decode_ogg() =
        Assert.True(false)

    [<Fact>]
    member public this.can_decode_m4a() =
        Assert.True(false)

    member private this.testoutput(unprocessedstream: MemoryStream) =
        Assert.True(subject.Length > unprocessedstream.Length, "there are more raw pcm bytes than mp3 encoded bytes")
