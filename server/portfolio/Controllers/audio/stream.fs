﻿namespace portfolio.Controllers.audio

open System
open System.Collections.Generic
open System.Linq
open System.Threading.Tasks
open Microsoft.AspNetCore.Mvc
open portfolio.data
open portfolio.googledrivereader
open Microsoft.Net.Http.Headers
open portfolio.models
open Newtonsoft.Json

[<Route(defaultapiroute)>]
[<ApiController>]
type streamcontroller() =
    inherit ControllerBase()

    [<HttpGet>]
    member this.randomdeserttrack(): ActionResult =
        let track = drivereader.get.readrandomdeserttrack()
        let output = new OkObjectResult(track.stream)
        output.ContentTypes.Add(track.filetype)
        output :> ActionResult




