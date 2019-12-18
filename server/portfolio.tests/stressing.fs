module stressing

open Xunit
open System
open portfolio
open Microsoft.AspNetCore.SignalR.Client
open Microsoft.AspNetCore.Http.Connections.Client
open System.Threading
open stressingdata
open portfolio.models
open testserver
open System.Collections.Generic
open Xunit.Abstractions

type public when_the_server_is_stressed(server: testserver<Startup>, logger: ITestOutputHelper) =
    let _server = server
    
    let configureurl = fun (options:HttpConnectionOptions) -> 
        options.HttpMessageHandlerFactory <- fun _ -> _server.Server.CreateHandler()
        ()
    
    let connection =
        (new HubConnectionBuilder())
            .WithUrl(address, configureurl)
            .Build()

    let canceller = new CancellationTokenSource()
            
    do
        let connect =
            connection.StartAsync(canceller.Token)
            |> Async.AwaitTask
            |> Async.Ignore
        
        Async.RunSynchronously(connect, -1, canceller.Token)

        if connection.State <> HubConnectionState.Connected then
            failwith "test is not connected"

    interface IClassFixture<testserver<Startup>>

    interface IDisposable with
        member this.Dispose(): unit = 
            let disposeall = 
                async {
                    let! dispose1 = 
                        connection.StopAsync(canceller.Token) 
                        |> Async.AwaitTask 

                    let! dispose2 = 
                        connection.DisposeAsync()
                        |> Async.AwaitTask

                    _server.Dispose()
                    canceller.Cancel()
                    canceller.Dispose()
                }
                |> Async.Ignore

            Async.RunSynchronously(disposeall, -1, canceller.Token)
            
    [<Fact>]
    member public this.it_can_handle_10_simultaneous_streams() =
        let stressonce = async {
            let! channel = 
                connection.StreamAsChannelAsync<streamresponse>(randompath, canceller.Token)
                |> Async.AwaitTask

            let reader = channel.ReadAllAsync(canceller.Token).GetAsyncEnumerator(canceller.Token)
            let! hasread = this.readnextiteration(reader)
            let mutable received = 0

            while reader.Current <> null do
                let! hasread = this.readnextiteration(reader)
                Assert.True(hasread)
                received <- received + 1
                ()

            logger.WriteLine("single stress finished by receiving chunk amount: " + string(received))
        }

        let stressall =
            Array.create stresscount stressonce
            |> Async.Parallel
        
        Async.RunSynchronously(stressall, -1, canceller.Token)

    member private this.readnextiteration(reader: IAsyncEnumerator<streamresponse>): Async<bool> =
        reader.MoveNextAsync().AsTask()
        |> Async.AwaitTask
