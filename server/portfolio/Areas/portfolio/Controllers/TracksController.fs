module portfolio.controllers.tracks

open Microsoft.AspNetCore.Mvc
open portfolio.googledrivereader
open portfolio.data

[<Route(tracksname)>]
type TracksController() =
    [<Route("getrandomdeserttrack")>]
    member public x.getrandomdeserttrack(): FileStreamResult =
        let (tracksstream, trackstype) = drivereader.get.readrandomdeserttrack()
        let output = new FileStreamResult(tracksstream, trackstype)
        output
