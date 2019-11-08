namespace portfolio.controllers.audio

open Microsoft.AspNetCore.SignalR
open System.Threading.Tasks
open System.Collections.Generic
open portfolio.googledrivereader
open System.Threading.Channels
open System

type streamhub() =
    inherit Hub()

    override this.OnConnectedAsync() =
        Console.WriteLine("socket connected!")
        base.OnConnectedAsync()

    member public this.randomdeserttrack(): ChannelReader<int> =        
        let channel = Channel.CreateUnbounded<int>()
        this.fillchannel(channel) |> ignore
        channel.Reader

    member private this.fillchannel(input: Channel<int>): unit =
        let task = async {
            let track = drivereader.get.readrandomdeserttrack()

            while track.stream.CanRead do
                input.Writer.WriteAsync(track.stream.ReadByte()) |> ignore
                Console.WriteLine("sent a byte")

            track.stream.Dispose()
        }
        task |> Async.Start

