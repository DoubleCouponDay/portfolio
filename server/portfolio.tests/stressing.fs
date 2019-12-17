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

type public when_the_server_is_stressed() =
    let factory = new WebApplicationFactory<Startup>()
    let mutable server: TestServer = factory.Server
    let address = server.BaseAddress.OriginalString + "/stream"
    
    let thing = fun (options:HttpConnectionOptions) -> 
        options.HttpMessageHandlerFactory <- fun _ -> server.CreateHandler()
        ()
    
    let connection =
        (new HubConnectionBuilder())
            .WithUrl(address, thing)
            .Build()

    let canceller = new CancellationTokenSource()
            
    do
        connection.StartAsync(canceller.Token).RunSynchronously()

    interface IDisposable with
        member this.Dispose(): unit = 
            canceller.Cancel()
            connection.DisposeAsync().RunSynchronously()
            server.Dispose()
            factory.Dispose()
            
    [<Fact>]
    member public this.it_can_handle_1000_requests() =
            let foreachstress = fun index ->
                let request = 
                    connection.StreamAsChannelAsync<streamresponse>(randompath, canceller.Token)
                        
                request.RunSynchronously()
                let channel = request.Result
                let reader = channel.ReadAllAsync(canceller.Token).GetAsyncEnumerator(canceller.Token)

                while reader.Current <> null do
                    reader.MoveNextAsync().AsTask().RunSynchronously()
                    ()
                ()
        
            let loop = Parallel.For(0, stresscount, foreachstress)

            while loop.IsCompleted = false do
                ()