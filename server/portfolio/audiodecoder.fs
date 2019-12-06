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
open WaveUtils
open CUETools.Codecs.FLAKE
open flacutils
open CUETools.Codecs

type public audiodecoder() =
    member public this.streamdecodedchunks(track: audiofile): seq<streamresponse> =
        track.stream.Position <- 0L

        match track.fileextension with
            | "flac" ->
                this.decodeflac(track)

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

    //member private this.decodemp3(track: audiofile): seq<streamresponse> =        
    //    null

    member private this.decodewav(track: audiofile): seq<streamresponse> =
        use reader = new WaveFileReader(track.stream)
        
        if reader.CanRead = false then
            failwith ("wav reader could not understand wav file: " + track.filename)

        let mutable output = new streamresponse()
        output.bitdepth <- reader.WaveFormat.BitsPerSample
        output.samplerate <- reader.WaveFormat.SampleRate
        output.channels <- reader.WaveFormat.Channels
        output.totalchunks <- reader.Length / int64(chunksize)
        output.encoding <- reader.WaveFormat.Encoding.ToString()        
        let mutable firstiteration = true
        let mutable moredatatoread = true       

        seq {
            let mutable skipamount = 0.0

            while moredatatoread do                   
                if firstiteration = false then                        
                    output <- new streamresponse()

                firstiteration <- false
                use outputstream = new MemoryStream()
                let writer = new WaveFileWriter(outputstream, reader.WaveFormat)
                let endingposition = int64(chunksize) + reader.Position
                let amountread = waveutils.writewavchunk(reader, writer, reader.Position, endingposition)
                writer.Dispose()

                if amountread <> 0 then 
                    moredatatoread <- true                        
                    output.chunk <- outputstream.GetBuffer()
                    skipamount <- skipamount + float(chunksize)
                    yield output
                        
                else 
                    moredatatoread <- false 
        }

    member private this.decodeflac(track: audiofile): seq<streamresponse> =
        use reader = new FlakeReader(null, track.stream)

        let mutable output = new streamresponse()
        output.bitdepth <- reader.PCM.BitsPerSample
        output.samplerate <- reader.PCM.SampleRate
        output.channels <- reader.PCM.ChannelCount
        output.totalchunks <- reader.Length / int64(chunksize)
        output.encoding <- "flac"
        let mutable firstiteration = true
        let mutable moredatatoread = true    

        seq {
            let mutable skipamount = 0.0

            while moredatatoread do                   
                if firstiteration = false then                        
                    output <- new streamresponse()

                firstiteration <- false
                use outputstream = new MemoryStream()
                let writer = new FlakeWriter(null, outputstream, reader.PCM)
                
                let endingposition = int64(chunksize) + reader.Position
                let amountread = flacutils.writeflacchunk(reader, writer, reader.Position, endingposition)
                writer.Dispose()

                if amountread <> 0 then 
                    moredatatoread <- true                        
                    output.chunk <- outputstream.GetBuffer()
                    skipamount <- skipamount + float(chunksize)
                    yield output
                        
                else 
                    moredatatoread <- false 
        }
        

    //member private this.decodem4a(track: audiofile): Async<audiofile> =
    //    null



    //member private this.decodeogg(input: audiofile): Async<audiofile> =
    //    null