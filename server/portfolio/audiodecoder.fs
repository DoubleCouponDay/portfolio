namespace portfolio.audiodecoder

open ManagedBass.Aac
open MP3Sharp.Decoding
open Accord.Audio
open portfolio.models

type public audiodecoder =
    private new() = new audiodecoder()
    static member public get = new audiodecoder()    

    member public this.decodeaudio(input: audiofile): audiofile =
        match input.filetype with
            | "audio/mpeg" -> 
                   this.decodemp3(input)

            | "audio/aac" ->
                this.decodeaac(input)

            | "audio/flac" ->
                this.decodeflac(input)

            | "audio/x-flac" ->
                this.decodeflac(input)

            | "audio/ogg" ->
                this.decodeogg(input)

            | _ -> 
                failwith (String.concat "" [|"filetype: "; input.filetype; "not known by decoder!"|])

    member private this.decodemp3(input: audiofile): audiofile =
        
        null

    member private this.decodeaac(input: audiofile): audiofile =
        null

    member private this.decodeflac(input: audiofile): audiofile =
        null

    member private this.decodeogg(input: audiofile): audiofile =
        null




