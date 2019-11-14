namespace portfolio.audiodecoder

open ManagedBass.Aac
open MP3Sharp.Decoding
open Accord.Audio
open portfolio.models
open portfolio.data

type public audiodecoder() =
    member public this.decodeaudio(track: audiofile): audiofile =
        match track.mimetype with
            | wavtype ->
                this.decodewav(track)

            | mp3type -> 
                this.decodemp3(track)

            | m4atype ->
                this.decodem4a(track)

            | xflactype ->
                this.decodeflac(track)

            | flactype ->
                this.decodeflac(track)

            | oggtype ->
                this.decodeogg(track)

            | _ -> 
                failwith (String.concat "" [|"filetype: "; track.mimetype; "not known by decoder!"|])

    member private this.decodemp3(track: audiofile): audiofile =        
        null

    member private this.decodem4a(track: audiofile): audiofile =
        null

    member private this.decodeflac(track: audiofile): audiofile =
        null

    member private this.decodeogg(input: audiofile): audiofile =
        null

    member private this.decodewav(input: audiofile): audiofile =
        null


