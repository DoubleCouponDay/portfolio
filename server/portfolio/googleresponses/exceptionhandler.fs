namespace portfolio.googleresponses

open Google.Apis.Drive.v3
open Google.Apis.Http
open System.Threading.Tasks
open System

type exceptionhandler() =
    interface IHttpExceptionHandler with
        member x.HandleExceptionAsync (args: HandleExceptionArgs) : Task<bool> = 
            Task.Run(fun _ -> 
                Console.WriteLine(args.Exception.Message)
                false
            )