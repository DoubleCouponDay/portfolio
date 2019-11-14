namespace portfolio.audiodecoder

open ManagedBass.Aac
open MP3Sharp
open Accord.Audio
open portfolio.models
open portfolio.data
open System.Linq
open System.Collections.Generic
open System.IO

type public audiodecoder() =
    member public this.decodeaudio(track: audiofile): Async<audiofile> =
        match track.mimetype with
            //| wavtype ->
            //    this.decodewav(track)

            | mp3type -> 
                this.decodemp3(track)

            //| m4atype ->
            //    this.decodem4a(track)

            //| xflactype ->
            //    this.decodeflac(track)

            //| flactype ->
            //    this.decodeflac(track)

            //| oggtype ->
            //    this.decodeogg(track)

            | _ -> 
                failwith (String.concat "" [|"filetype: "; track.mimetype; "not known by decoder!"|])

    member private this.decodemp3(track: audiofile): Async<audiofile> =        
        async {        
            let decoder = new MP3Stream(track.stream)
            let buffer = new ResizeArray<byte[]>()
            buffer.Capacity <- int32(decoder.Length)
            decoder.Position <- 0L

            while decoder.Position < decoder.Length do
                let formattedposition = int32(decoder.Position)
                let! computation = decoder.AsyncRead(buffer.[formattedposition], 0, chunksize)
                ()

            let seed = [||] :> IEnumerable<byte>

            let combined = buffer.Aggregate<byte[], IEnumerable<byte>>(seed, fun currentitem sum ->
                currentitem.Concat(sum)
            )
            let formatted = new MemoryStream(combined.ToArray())
            let output = new audiofile(formatted, track.filename, track.mimetype)
            return output
        }

    //member private this.decodem4a(track: audiofile): Async<audiofile> =
    //    Async.

    //member private this.decodeflac(track: audiofile): Async<audiofile> =
    //    null

    //member private this.decodeogg(input: audiofile): Async<audiofile> =
    //    null

    //member private this.decodewav(input: audiofile): Async<audiofile> =
    //    null


