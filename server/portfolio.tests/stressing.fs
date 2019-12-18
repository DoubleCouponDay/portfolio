module stressing

open Xunit
open Microsoft.AspNetCore.TestHost
open System
open Microsoft.AspNetCore.Mvc.Testing
open portfolio
open Microsoft.AspNetCore.SignalR.Client
open Microsoft.AspNetCore.Http.Connections.Client
open System.Threading
open stressingdata
open System.Threading.Tasks
open System.Threading.Channels
open portfolio.models
open System.Reflection
open System.IO

type public when_the_server_is_stressed(factory:WebApplicationFactory<Startup>) =
    let _factory = factory
    let address = _factory.Server.BaseAddress.OriginalString + "/stream"
    
    let thing = fun (options:HttpConnectionOptions) -> 
        options.HttpMessageHandlerFactory <- fun _ -> _factory.Server.CreateHandler()
        ()
    
    let connection =
        (new HubConnectionBuilder())
            .WithUrl(address, thing)
            .Build()

    let canceller = new CancellationTokenSource()
            
    do
        connection.StartAsync(canceller.Token)
        |> Async.AwaitTask
        |> Async.Ignore
        |> Async.RunSynchronously
        ()

    interface IClassFixture<WebApplicationFactory<Startup>>

    interface IDisposable with
        member this.Dispose(): unit = 
            connection.StopAsync(canceller.Token) 
            |> Async.AwaitTask 
            |> Async.RunSynchronously

            canceller.Cancel()

            connection.DisposeAsync()
            |> Async.AwaitTask
            |> ignore

            _factory.Dispose()
            
    [<Fact>]
    member public this.it_can_handle_10_simultaneous_streams() =
        if connection.State <> HubConnectionState.Connected then
            failwith "test is not connected"

        let stressonce = async {
            let channel = 
                connection.StreamAsChannelAsync<streamresponse>(randompath, canceller.Token)
                |> Async.AwaitTask
                |> Async.RunSynchronously

            let reader = channel.ReadAllAsync(canceller.Token).GetAsyncEnumerator(canceller.Token)

            while reader.Current <> null do
                reader.MoveNextAsync().AsTask()
                |> Async.AwaitTask
                |> Async.RunSynchronously
                |> ignore
        }
        Array.create stresscount stressonce
        |> Async.Parallel
        |> Async.RunSynchronously
        |> ignore
