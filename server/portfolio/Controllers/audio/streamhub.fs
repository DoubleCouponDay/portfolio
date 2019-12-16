namespace portfolio.controllers.audio

open Microsoft.AspNetCore.SignalR
open portfolio.googledrivereader
open System.Threading.Channels
open System
open portfolio.models
open portfolio.audiodecoder
open System.Threading
open audio.data
open portfolio.data

type streamhub() =
    inherit Hub()
    
    let canceller = new CancellationTokenSource()   
    let channel = Channel.CreateBounded<streamresponse>(channelcapacity)

    override this.OnConnectedAsync() =
        base.OnConnectedAsync()

    override this.OnDisconnectedAsync(error: exn) =
        canceller.Cancel()
        this.cleanup()
        base.OnDisconnectedAsync(error)

    member public this.randomdeserttrack(): ChannelReader<streamresponse> =        
        this.fillchannel(channel) |> ignore
        channel.Reader

    member private this.fillchannel(input: Channel<streamresponse>): unit =
        let mission = async {
            use! track = googledrivereader.get.readrandomdeserttrack(canceller.Token)                        
            let decoder = new audiodecoder()
            let decoded = decoder.streamdecodedchunks(track)

            for item in decoded do
                let! justwait = 
                    input.Writer
                        .WaitToWriteAsync()
                        .AsTask() 
                    |> Async.AwaitTask

                let! justwrite =
                    input.Writer
                        .WriteAsync(item, canceller.Token)
                        .AsTask()
                    |> Async.AwaitTask

                ()
            this.cleanup()
        }
        Async.Start(mission, canceller.Token)
        
    member private this.cleanup() =
        channel.Writer.TryComplete() |> ignore
        canceller.Dispose()
        GC.Collect()