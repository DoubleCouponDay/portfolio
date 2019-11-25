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

    member private this.readstreamtoend(initialresponse: streamresponse, stream: Stream): seq<streamresponse> =
        seq {
            let mutable output = initialresponse

            let mutable peak: float32 = unsignedpeak24bit
            let trough: float32 = 0.0F
                
            match initialresponse.bitdepth with
            | 8 -> 
                peak <- unsignedpeak8bit

            | 16 ->
                peak <- unsignedpeak16bit

            | 24 ->
                peak <- unsignedpeak24bit

            | 32 ->
                peak <- unsignedpeak32bit
    
            | _ -> 
                ()

            while stream.Position < stream.Length do
                if stream.Position <> 0L then
                    output <- new streamresponse()

                GC.Collect() //collect the byte array from previous iterations
                let currentchunk = Array.create chunksize (new byte()) 
                let amountread = stream.Read(currentchunk, 0, chunksize) //chunksize must be divisible by 8, 16, 24

                let formattedchunk: float32[] = 
                    currentchunk.Select(fun item index -> 
                            this.mapbytetoint(item, index, output, currentchunk)
                        )

                        .Where(fun item -> item.HasValue)
                        .Select(fun item -> 
                            this.converttowebaudiorange(
                                float32(item.Value), peak, trough
                            )
                        )
                        .ToArray()

                yield output
        }

    member private this.mapbytetoint(currentbyte: byte, index: int, response: streamresponse, currentchunk: byte[]): Nullable<float32> =
        let divider = response.bitdepth / 8
        
        if index % divider <> 0 then
            new Nullable<float32>()

        else if response.bitdepth = 8 then
            let output = float32(currentbyte)
            new Nullable<float32>(output)

        else if response.bitdepth = 16 then
            let output = float32(BitConverter.ToInt16(currentchunk, index))
            new Nullable<float32>(output)

        else if response.bitdepth = 24 then
            let bytes = currentchunk.Skip(index + 1).Take(3)
            let output = float32(BitConverter.ToInt32(bytes.ToArray(), 0))
            new Nullable<float32>(output)

        else if response.bitdepth = 32 then
            let output = float32(BitConverter.ToInt32(currentchunk, index))
            new Nullable<float32>(output)

        else
            new Nullable<float32>()

    member private this.converttowebaudiorange(value: float32, max: float32, min: float32) =
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
            
        let mutable output = new streamresponse()
        output.bitdepth <- reader.WaveFormat.BitsPerSample
        output.samplerate <- reader.WaveFormat.SampleRate
        output.channels <- reader.WaveFormat.Channels
        output.totalchunks <- reader.Length / int64(chunksize)
        let samplegiver = reader.ToSampleProvider()
        let testarray = Array.create chunksize 0.0F
        let mutable moredatatoread = true

        seq {
            while moredatatoread do 
                GC.Collect()

                if reader.Position <> 0L then
                    output <- new streamresponse()

                let countread = samplegiver.Read(testarray, 0, chunksize)
                moredatatoread <- if countread = chunksize then true else false
                output.chunk <- testarray
                
                yield output
        }

    //member private this.decodem4a(track: audiofile): Async<audiofile> =
    //    Async.

    //member private this.decodeflac(track: audiofile): Async<audiofile> =
    //    null

    //member private this.decodeogg(input: audiofile): Async<audiofile> =
    //    null