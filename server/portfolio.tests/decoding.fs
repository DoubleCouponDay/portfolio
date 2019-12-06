module decoding

open Xunit
open portfolio.data
open portfolio.audiodecoder
open System.IO
open FSharp.Data
open portfolio.models
open System
open System.Media
open System.Collections.Generic
open System.Linq
open NAudio.Wave
open System.Threading
open decodingdata
open CUETools.Codecs.FLAKE
open NAudio.Flac

type public when_an_audio_file_is_decoded() =
    let context = new audiodecoder()    

    interface IDisposable with
        member this.Dispose() =
            ()

    [<Fact>]
    member public this.it_can_decode_mp3() =
        //async {
        //    use stream = new MemoryStream()
        //    use file = File.OpenRead("assets/sample.mp3")
        //    file.CopyTo(stream)
        //    let mime = MimeTypes.tryFind(".mp3").Value
        //    let input = new audiofile(stream, "", mime)
        //    let output = context.decodeaudio(input)
        //    this.fetchentireoutput(output)
        //}
        Assert.True(false)

    [<Fact>]
    member public this.it_can_decode_flac() =
        use input = this.prepareencoding(flacfilepath, flacextension)
        let output = context.streamdecodedchunks(input)            
        let subject = this.fetchentireoutput(output, this.onflacchunk)            
        Assert.True(subject.Length <> 0, "I got the full file")
        subject

    member private this.prepareencoding(filepath: string, extension: string): audiofile =
        let stream = new MemoryStream()
        use file = File.OpenRead(filepath)
        file.CopyTo(stream)
        new audiofile(stream, "", extension)

    member private this.onflacchunk(stream:MemoryStream) =
        use file = new FlakeReader(null, stream)
        Assert.True(file.PCM.SampleRate <> 0, "a samplerate could be read")

        ()

    [<Fact>]
    member public this.it_can_play_flac() =
        let subject = this.it_can_decode_flac()
        use player = new WaveOutEvent()

        for item in subject do   
            use stream = new MemoryStream(item)
            use reader = new FlacReader(stream)
            player.Init(reader)
            player.Play()            
            Thread.Sleep(100)
            player.Stop()

        ()

    [<Fact>]
    member public this.it_can_decode_ogg() =
        Assert.True(false)

    [<Fact>]
    member public this.it_can_decode_m4a() =
        Assert.True(false)

    [<Fact>]
    member public this.it_can_decode_wav() =
        use input = this.prepareencoding(wavfilepath, wavextension)
        let output = context.streamdecodedchunks(input)  
        let subject = this.fetchentireoutput(output, this.onwavchunk)            
        Assert.True(subject.Length <> 0, "I got the full file")
        subject

    member private this.onwavchunk(stream:MemoryStream) =
        use possiblefile = new WaveFileReader(stream)
        
        if possiblefile.CanRead = false then
            failwith "the received chunk file cant be read!"

        ()

    [<Fact>]
    member public this.it_can_play_decoded_wav() =
        let subject = this.it_can_decode_wav()
        use player = new WaveOutEvent()

        for item in subject do   
            use stream = new MemoryStream(item)
            use reader = new WaveFileReader(stream)
            player.Init(reader)
            player.Play()            
            Thread.Sleep(100)
            player.Stop()

    member private this.fetchentireoutput(sequence: seq<streamresponse>, ?onchunkreceived: (MemoryStream) -> unit):byte[][] =
        let mutable isfirstiteration = true
        
        let output = seq {
            for item in sequence do
                if isfirstiteration = true then
                    Assert.True(item.bitdepth <> 0, "a bit depth was returned")
                    Assert.True(item.channels <> 0, "channel count was returned")
                    Assert.True(item.samplerate <> 0, "a samplerate was returned")
                    Assert.True(item.totalchunks <> 0L, "a chunk count was returned")
                    Assert.True(String.IsNullOrEmpty(item.encoding) <> true, "an ecoding was returned")
                    isfirstiteration <- false

                use currentstream = new MemoryStream(item.chunk)
                this.onwavchunk(currentstream)

                GC.Collect()
                yield item.chunk
        }
        output.ToArray()


