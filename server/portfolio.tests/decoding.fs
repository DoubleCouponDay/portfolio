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
        Assert.True(false)

    [<Fact>]
    member public this.it_can_decode_ogg() =
        Assert.True(false)

    [<Fact>]
    member public this.it_can_decode_m4a() =
        Assert.True(false)

    [<Fact>]
    member public this.it_can_decode_wav() =
        async {            
            let input = this.preparewavdecoding()
            let output = context.streamdecodedchunks(input)            
            let subject = this.fetchentireoutput(output)            
            Assert.True(subject <> null, "I got the full file")
            input.stream.Dispose()
        }

    member private this.preparewavdecoding(): audiofile =
        let stream = new MemoryStream()
        use file = File.OpenRead("assets/sample.wav")
        file.CopyTo(stream)
        new audiofile(stream, "", "wav")

    [<Fact>]
    member public this.it_can_play_decoded_wav() =
        async {
            let input = this.preparewavdecoding()
            let output = context.streamdecodedchunks(input)            
            let subject = this.fetchentireoutput(output)  
            use player = new WaveOutEvent()

            for item in subject do   
                use stream = new MemoryStream(item)
                use reader = new WaveFileReader(stream)
                player.Init(reader)
                player.Play()            
                Thread.Sleep(1000)
                player.Stop()
        }

    member private this.fetchentireoutput(sequence: seq<streamresponse>): seq<byte[]> =
        let mutable isfirstiteration = false
        
        seq {
            for item in sequence do
                if isfirstiteration = false then
                    Assert.True(item.bitdepth <> 0, "a bit depth was returned")
                    Assert.True(item.channels <> 0, "channel count was returned")
                    Assert.True(item.samplerate <> 0, "a samplerate was returned")
                    Assert.True(item.totalchunks <> 0L, "a chunk count was returned")
                    Assert.True(item.encoding = "IeeeFloat", "the decoder returned floating point samples")
                    isfirstiteration <- true

                use currentstream = new MemoryStream(item.chunk)
                use possiblefile = new WaveFileReader(currentstream)

                if possiblefile.CanRead = false then
                    failwith "the received chunk file cant be read!"

                GC.Collect()
                yield item.chunk
        }


