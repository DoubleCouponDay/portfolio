﻿namespace portfolio.controllers.audio

open Microsoft.AspNetCore.SignalR
open System.Threading.Tasks
open System.Collections.Generic
open portfolio.googledrivereader
open System.Threading.Channels
open System
open portfoliodata
open portfolio.models
open Newtonsoft.Json
open System.Linq
open portfolio.audiodecoder

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
        async {
            let! track = drivereader.get.readrandomdeserttrack()
            let decoder = new audiodecoder()
            let decoded = decoder.decodeaudio(track)

            for item in decoded do
                input.Writer.TryWrite(item) |> ignore
                GC.Collect()

            input.Writer.TryComplete() |> ignore
            track.stream.Dispose()                
        }
        |> Async.Start
