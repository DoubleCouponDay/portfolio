module playing

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
open decoding
open Xunit.Abstractions

type public when_an_audio_file_is_played(logger: ITestOutputHelper) =
    let decodingtests = new when_an_audio_file_is_decoded(logger)

    interface IDisposable with
        member this.Dispose(): unit = 
            (decodingtests :> IDisposable).Dispose()

    [<Fact>]
    member public this.it_can_play_split_flac_files() =
        let subject = decodingtests.it_can_decode_flac()
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
    member public this.it_can_play_split_wav_files() =
        let subject = decodingtests.it_can_decode_wav()
        use player = new WaveOutEvent()

        for item in subject do   
            use stream = new MemoryStream(item)
            use reader = new WaveFileReader(stream)
            player.Init(reader)
            player.Play()            
            Thread.Sleep(100)
            player.Stop()

    
    [<Fact>]
    member public this.it_can_play_split_mp3_files() =
        let subject = decodingtests.it_can_decode_mp3()
        use player = new WaveOutEvent()

        for item in subject do   
            use stream = new MemoryStream(item)
            use reader = new Mp3FileReader(stream)
            player.Init(reader)
            player.Play()            
            Thread.Sleep(100)
            player.Stop()

    [<Fact>]
    member public this.it_can_play_m4a() =
        let subject = decodingtests.it_can_decode_m4a()
        use player = new WaveOutEvent()

        for item in subject do   
            use stream = new MemoryStream(item)
            use reader = new WaveFileReader(stream)
            player.Init(reader)
            player.Play()            
            Thread.Sleep(100)
            player.Stop()

    
    [<Fact>]
    member public this.it_can_play_ogg() =
        let subject = decodingtests.it_can_decode_ogg()
        use player = new WaveOutEvent()

        for item in subject do   
            use stream = new MemoryStream(item)
            use reader = new WaveFileReader(stream)
            player.Init(reader)
            player.Play()            
            Thread.Sleep(100)
            player.Stop()
