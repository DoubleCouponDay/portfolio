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
open NAudio.Vorbis

type public when_an_audio_file_is_decoded() =
    let context = new audiodecoder()    

    interface IDisposable with
        member this.Dispose() =
            ()

    [<Fact>]
    member public this.it_can_decode_flac(): byte[][] =
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
    member public this.it_can_play_split_flac_files() =
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
    member public this.it_can_decode_wav(): byte[][] =
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
    member public this.it_can_play_split_wav_files() =
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
                    isfirstiteration <- false

                if onchunkreceived.IsSome then
                    use currentstream = new MemoryStream(item.chunk)
                    onchunkreceived.Value(currentstream)

                GC.Collect()
                yield item.chunk
        }
        output.ToArray()

    [<Fact>]
    member public this.it_can_decode_mp3(): byte[][] =
        use input = this.prepareencoding(mp3filepath, mp3extension)
        let output = context.streamdecodedchunks(input)  
        let subject = this.fetchentireoutput(output, this.onmp3chunk)            
        Assert.True(subject.Length <> 0, "I got the full file")
        subject

    member private this.onmp3chunk(stream: MemoryStream) =
        use possiblefile = new Mp3FileReader(stream)
        
        if possiblefile.CanRead = false then
            failwith "the received chunk file cant be read!"

        ()

    [<Fact>]
    member public this.it_can_play_split_mp3_files() =
        let subject = this.it_can_decode_mp3()
        use player = new WaveOutEvent()

        for item in subject do   
            use stream = new MemoryStream(item)
            use reader = new Mp3FileReader(stream)
            player.Init(reader)
            player.Play()            
            Thread.Sleep(100)
            player.Stop()

    [<Fact>]
    member public this.it_can_decode_m4a(): byte[][] =
        use input = this.prepareencoding(m4afilepath, m4aextension)
        let output = context.streamdecodedchunks(input)  
        let subject = this.fetchentireoutput(output, this.onm4achunk)            
        Assert.True(subject.Length <> 0, "I got the full file")
        subject

    member private this.onm4achunk(stream: MemoryStream) =
        use reader = new WaveFileReader(stream)

        if reader.CanRead = false then
            failwith "split file was corrupted somehow."

    [<Fact>]
    member public this.it_can_play_m4a() =
        let subject = this.it_can_decode_m4a()
        use player = new WaveOutEvent()

        for item in subject do   
            use stream = new MemoryStream(item)
            use reader = new WaveFileReader(stream)
            player.Init(reader)
            player.Play()            
            Thread.Sleep(100)
            player.Stop()

    [<Fact>]
    member public this.it_can_decode_ogg(): byte[][] =
        use input = this.prepareencoding(oggfilepath, oggextension)
        let output = context.streamdecodedchunks(input)  
        let subject = this.fetchentireoutput(output, this.onoggchunk)            
        Assert.True(subject.Length <> 0, "I got the full file")
        subject

    member private this.onoggchunk(stream: MemoryStream) =
        use reader = new WaveFileReader(stream)

        if reader.CanRead = false then
            failwith "split file was corrupted somehow."

    [<Fact>]
    member public this.it_can_play_ogg() =
        let subject = this.it_can_decode_ogg()
        use player = new WaveOutEvent()

        for item in subject do   
            use stream = new MemoryStream(item)
            use reader = new WaveFileReader(stream)
            player.Init(reader)
            player.Play()            
            Thread.Sleep(100)
            player.Stop()