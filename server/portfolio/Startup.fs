namespace portfolio

open System
open System.Collections.Generic

open Microsoft.AspNetCore.Builder
open Microsoft.AspNetCore.Hosting
open Microsoft.AspNetCore.Mvc
open Microsoft.Extensions.Configuration
open Microsoft.Extensions.DependencyInjection
open Microsoft.AspNetCore.Http

open Microsoft.AspNetCore.Cors.Infrastructure
open Microsoft.AspNetCore.SignalR

open portfolio.controllers.audio
open Newtonsoft.Json.Serialization
open Newtonsoft.Json
open Microsoft.AspNetCore.Http.Connections
open Microsoft.Extensions.Primitives
open System.Threading.Tasks

open startupdata
open portfoliodata

type Startup private () =
    [<Literal>]
    let staticfilespath = "/dist"

    new (configuration: IConfiguration) as this =
        Startup() then
        this.Configuration <- configuration

    member private this.addcustomorigins (builder: CorsPolicyBuilder) = 
        builder.WithOrigins([|
            "http://localhost:4200"; //local dev
            "http://localhost:9876"; //test server
            "https://dcdgoportfolio.z26.web.core.windows.net";
            "https://www.samueljenks.me";
            "https://dragontrack.z26.web.core.windows.net";
            "https://dragontrack.samueljenks.me"
        |]).AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials()
            .SetPreflightMaxAge(TimeSpan.FromSeconds(60.0))

        |> ignore             

    // This method gets called by the runtime. Use this method to add services to the container.
    member this.ConfigureServices(services: IServiceCollection) =
        // Add framework services.
        services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_3_0) |> ignore
        
        let handleserialisationproblem = new EventHandler<ErrorEventArgs>(fun input -> 
            let message = JsonConvert.SerializeObject(input)
            failwith message
        )

        services.AddCors(
            fun options ->
                options.AddPolicy(
                    corspolicyname,
                    this.addcustomorigins
                )
                ()                    
            )
            .AddSignalR(fun options -> 
                let largetimeout = new Nullable<TimeSpan>(TimeSpan.FromSeconds(60.0))
                let large64 = new Nullable<int64>(100_000L)
                let large = new Nullable<int>(100_000)
                options.EnableDetailedErrors <- new Nullable<bool>(true)
                options.KeepAliveInterval <- largetimeout
                options.ClientTimeoutInterval <- largetimeout
                options.HandshakeTimeout <- largetimeout
                options.MaximumReceiveMessageSize <- large64
                options.StreamBufferCapacity <- large                
            )
            .AddNewtonsoftJsonProtocol(fun options -> 
                options.PayloadSerializerSettings.Error <- handleserialisationproblem
                options.PayloadSerializerSettings.ReferenceLoopHandling <- ReferenceLoopHandling.Error
                ()
            )
        |> ignore       

    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    member this.Configure(app: IApplicationBuilder, env: IWebHostEnvironment) =      
        app.UseDefaultFiles()
            .UseStaticFiles() 
            .UseCors(corspolicyname)
            .UseRouting()  |> ignore
        
        app.UseEndpoints(fun routing ->
            routing.MapHub<streamhub>("/stream", fun options ->
                let longtimeout = TimeSpan.FromSeconds(60.0) //azure has a cap on web socket connections. edge doesnt support server sent events
                options.Transports <- HttpTransportType.LongPolling

                options.TransportMaxBufferSize <- int64(chunksize + maxsampleratebits * 2)
                options.LongPolling.PollTimeout <- longtimeout
                options.WebSockets.CloseTimeout <- longtimeout
                ()
            ) |> ignore
            ()
        ) |> ignore

        app.UseHttpsRedirection() |> ignore

        app.Run(fun context ->
            new Task(fun _ ->
                if context.Response.Headers.ContainsKey(alloworigin) = false then
                    let origin = new StringValues(context.Request.Host.Value)
                    context.Response.Headers.Add(alloworigin, origin)

                if context.Request.Headers.ContainsKey(allowmethod) = false then
                    let method = new StringValues(context.Request.Method)
                    context.Response.Headers.Add(allowmethod, method)
            )
        )

    member val Configuration : IConfiguration = null with get, set
