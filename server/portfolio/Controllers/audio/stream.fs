namespace portfolio.Controllers.audio

open System
open System.Collections.Generic
open System.Linq
open System.Threading.Tasks
open Microsoft.AspNetCore.Mvc
open portfolio.data
open portfolio.googledrivereader

[<Route(defaultapiroute)>]
[<ApiController>]
type streamcontroller() =
    inherit ControllerBase()

    [<HttpGet>]
    member this.randomdeserttrack(): FileStreamResult =
        let (tracksstream, trackstype) = drivereader.get.readrandomdeserttrack()
        let output = new FileStreamResult(tracksstream, trackstype)
        output




