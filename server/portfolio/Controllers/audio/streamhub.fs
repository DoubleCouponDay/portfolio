namespace portfolio.controllers.audio

open Microsoft.AspNetCore.SignalR
open portfolio.googledrivereader
open System.Threading.Channels
open System
open portfolio.data

type streamhub() =
    inherit Hub()

    override this.OnConnectedAsync() =
        Console.WriteLine("socket connected!")
        base.OnConnectedAsync()

    member public this.randomdeserttrack(): ChannelReader<byte[]> =        
        let channel = Channel.CreateUnbounded<byte[]>()
        this.fillchannel(channel) |> ignore
        channel.Reader

    member private this.fillchannel(input: Channel<byte[]>): unit =
        let task = async {
            let track = drivereader.get.readrandomdeserttrack()
            let chunk = Array.create chunksize (Byte())

            while track.stream.CanRead do
                track.stream.Read(chunk, 0, chunksize) |> ignore
                input.Writer.WriteAsync(chunk) |> ignore

            input.Writer.TryComplete() |> ignore
            track.stream.Dispose()
        }
        task |> Async.Start

