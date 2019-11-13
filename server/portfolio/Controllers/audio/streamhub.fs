﻿namespace portfolio.controllers.audio

open Microsoft.AspNetCore.SignalR
open System.Threading.Tasks
open System.Collections.Generic
open portfolio.googledrivereader
open System.Threading.Channels
open System
open portfolio.data
open portfolio.models
open Newtonsoft.Json
open System.Linq

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
                track.stream.Read(chunk, 0, chunksize) |> ignore
                let mapped = chunk.Select(fun current -> int(current))                
                let output = new streamresponse(mapped)

                if track.stream.Position = 0L then
                    output.totalchunks <- totalchunks
                
                input.Writer.WriteAsync(output).AsTask() 
                |> Async.AwaitTask |> ignore

            input.Writer.TryComplete() |> ignore
            track.stream.Dispose()
        }
        task |> Async.Start

