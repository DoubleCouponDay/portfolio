namespace portfolio.controllers.audio

open Microsoft.AspNetCore.SignalR
open System.Threading.Tasks
open System.Collections.Generic
open portfolio.googledrivereader
open System.Threading.Channels
open System
open portfolio.data
open portfolio.models

type streamhub() =
    inherit Hub()

    override this.OnConnectedAsync() =
        Console.WriteLine("socket connected!")
        base.OnConnectedAsync()

    member public this.randomdeserttrack(): ChannelReader<streamresponse> =
        let channel = Channel.CreateUnbounded<streamresponse>()
        this.fillchannel(channel) |> ignore
        channel.Reader

    member private this.fillchannel(input: Channel<streamresponse>): unit =
        let task = async {
            let track = drivereader.get.readrandomdeserttrack()
            let chunk = Array.create chunksize (new byte())
            let totalchunks = track.stream.Length / int64(chunksize)

            while track.stream.Position < track.stream.Length do
                let output = new streamresponse(chunk)

                if track.stream.Position = 0L then
                    output.totalchunks <- totalchunks

                track.stream.Read(chunk, 0, chunksize) |> ignore
                input.Writer.WriteAsync(output).AsTask() 
                |> Async.AwaitTask |> ignore

            input.Writer.TryComplete() |> ignore
            track.stream.Dispose()
        }
        task |> Async.Start

