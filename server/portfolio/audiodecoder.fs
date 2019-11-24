module portfolio.audiodecoder

open ManagedBass.Aac
open MP3Sharp
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
    member public this.decodeaudio(track: audiofile): seq<streamresponse> =
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

    member private this.readstreamtoend(initialresponse: streamresponse, formattedstream: Stream): seq<streamresponse> =
        seq {
            let mutable output = initialresponse

            let mutable peak: float = unsignedpeak8bit
            let trough: float = 0.0
                
            //match initialresponse.bitdepth with
            //| 8 -> 
            //    peak <- unsignedpeak8bit

            //| 16 ->
            //    peak <- unsignedpeak16bit

            //| 24 ->
            //    peak <- unsignedpeak24bit
    
            //| _ -> 
            //    ()

            while formattedstream.Position < formattedstream.Length do
                if formattedstream.Position <> 0L then
                    output <- new streamresponse()

                GC.Collect() //collect the byte array from previous iterations
                let currentchunk = Array.create chunksize (new byte())       
                formattedstream.Read(currentchunk, 0, chunksize) |> ignore  

                output.chunk <- currentchunk.Select(
                    fun currentbyte -> 
                        let asint = uint32(currentbyte) //assuming the data is unsigned!!!
                        let floatsigned = float(asint)
                        this.converttowebaudiorange(floatsigned, peak, trough)
                    ).ToArray()
                
                yield output
        }

    member private this.converttowebaudiorange(value: float, max: float, min: float) =
        let range = max - min
        let percentagevalue = value / range
        let output = webaudiotrough + percentagevalue * webaudiorange
        output

    member private this.decodemp3(track: audiofile): seq<streamresponse> =        
        //let decoder = new MP3Stream(track.stream, chunksize)

        //if decoder.IsEOF then
        //    String.concat "" [|track.fileextension; " decoder: could not understand audio file '"; track.filename;"'"|]
        //    |> failwith

        //this.readstreamtoend(track, decoder)
        null

    member private this.decodewav(track: audiofile): seq<streamresponse> =
        let reader = new WaveFileReader(track.stream)
        
        if reader.CanRead = false then
            failwith "the data of the wav file is unknown!"

        let output = new streamresponse()
        output.bitdepth <- reader.WaveFormat.BitsPerSample
        output.samplerate <- reader.WaveFormat.SampleRate
        output.channels <- reader.WaveFormat.Channels
        output.totalchunks <- reader.Length / int64(chunksize)
        this.readstreamtoend(output, reader)

    //member private this.decodem4a(track: audiofile): Async<audiofile> =
    //    Async.

    //member private this.decodeflac(track: audiofile): Async<audiofile> =
    //    null

    //member private this.decodeogg(input: audiofile): Async<audiofile> =
    //    null