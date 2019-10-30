namespace portfolio.googleresponses

open Google.Apis.Drive.v3
open Google.Apis.Http
open System.Threading.Tasks
open System
open System.Diagnostics

type exceptionhandler() =
    interface IHttpExceptionHandler with
        member x.HandleExceptionAsync (args: HandleExceptionArgs) : Task<bool> = 
            Task.Run(fun _ -> 
                Debug.Assert(false, args.Exception.Message)
                false
            )