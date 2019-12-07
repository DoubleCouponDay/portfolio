namespace portfolio.controllers.audio

open Microsoft.AspNetCore.SignalR
open portfolio.googledrivereader
open System.Threading.Channels
open System
open portfolio.models
open portfolio.audiodecoder
open System.Threading

type streamhub() =
    inherit Hub()
    let channel = Channel.CreateUnbounded<streamresponse>()
    let canceller = new CancellationTokenSource()   

    override this.OnConnectedAsync() =
        Console.WriteLine("socket connected!")
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
            GC.Collect()
            use! track = drivereader.get.readrandomdeserttrack()                        
            let decoder = new audiodecoder()
            let decoded = decoder.streamdecodedchunks(track)

            for item in decoded do
                input.Writer.TryWrite(item) |> ignore

            this.cleanup()
        }
        Async.Start(mission, canceller.Token)
        
    member private this.cleanup() =
        channel.Writer.TryComplete() |> ignore
        canceller.Dispose()
        GC.Collect()