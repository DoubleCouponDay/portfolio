namespace portfolio.googleresponses

open Google.Apis.Http
open System.Threading.Tasks
open System

type public unsuccessfulhandler() =
    interface IHttpUnsuccessfulResponseHandler with
        member x.HandleResponseAsync(args: HandleUnsuccessfulResponseArgs): Task<bool> =
            Task.Run(fun _ -> 
                Console.WriteLine(args.Response.ReasonPhrase)
                false
            )

