module portfolio.Controllers.audio.upload

open System
open System.Collections.Generic
open System.Linq
open System.Threading.Tasks
open Microsoft.AspNetCore.Mvc
open Microsoft.AspNetCore.Http
open System.Net.Http

[<Route("api/upload")>]
[<ApiController>]
type uploadcontroller() = 
   inherit ControllerBase()

   [<HttpPost>]
   member this.Post([<FromBody>] song:HttpRequestMessage) : HttpResponseMessage =
       new HttpResponseMessage()


