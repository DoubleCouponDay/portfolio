namespace server.portfolio.Controllers

open System
open System.Collections.Generic
open System.Linq
open System.Threading.Tasks
open Microsoft.AspNetCore.Mvc
open System.Net.Http
open System.Net

[<Route("")>]
type HomeController () =
    inherit Controller()

    [<HttpGet>]
    member this.Index (): HttpResponseMessage =
        let output = new HttpResponseMessage(HttpStatusCode.OK)
        output.Content <- (new StringContent("server") :> HttpContent)
        output

    [<Route("error")>]        
    member this.Error () =
        let output = new HttpResponseMessage(HttpStatusCode.OK)
        output.Content <- (new StringContent("something went wrong!") :> HttpContent)
        output
