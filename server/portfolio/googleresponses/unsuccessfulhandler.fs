namespace portfolio.googleresponses

open Google.Apis.Http
open System.Threading.Tasks
open System
open System.Diagnostics

type public unsuccessfulhandler() =
    interface IHttpUnsuccessfulResponseHandler with
        member x.HandleResponseAsync(args: HandleUnsuccessfulResponseArgs): Task<bool> =
            Task.Run(fun _ -> 
                failwith args.Response.ReasonPhrase
                false
            )

