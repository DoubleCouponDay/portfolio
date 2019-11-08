namespace portfolio

open System

open Microsoft.AspNetCore.Builder
open Microsoft.AspNetCore.Hosting
open Microsoft.AspNetCore.Mvc
open Microsoft.Extensions.Configuration
open Microsoft.Extensions.DependencyInjection
open Microsoft.AspNetCore.Http

open Microsoft.AspNetCore.Cors.Infrastructure
open Microsoft.Owin.Cors
open Owin
open Microsoft.AspNetCore.SignalR

open portfolio.data
open portfolio.controllers.audio


type Startup private () =
    [<Literal>]
    let staticfilespath = "/dist"

    new (configuration: IConfiguration) as this =
        Startup() then
        this.Configuration <- configuration

    member private this.addcustomorigins (builder: CorsPolicyBuilder) = 
        builder.WithOrigins([|
            "http://localhost:4200";
            "http://localhost:9876";
            "dcdgoportfolio.z26.web.core.windows.net";
            "www.samueljenks.me";
            "moonmachinestorage.z26.web.core.windows.net";
            "www.moonmachine.biz"
        |]).AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials()
            .Build()       
        |> ignore             

    // This method gets called by the runtime. Use this method to add services to the container.
    member this.ConfigureServices(services: IServiceCollection) =
        // Add framework services.
        services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_2) |> ignore

        services.AddCors(
            fun options ->
                options.AddPolicy(
                    corspolicyname,
                    this.addcustomorigins
                )
                ()
        ) |> ignore

        let signalrbuilder = services.AddSignalR(fun options -> 
            options.EnableDetailedErrors <- new Nullable<bool>(true)
        )
        ()

    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    member this.Configure(app: IApplicationBuilder, env: IHostingEnvironment) =
        if (env.IsDevelopment()) then
            app.UseDeveloperExceptionPage() |> ignore
        else
            // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
            app.UseHsts() |> ignore
      
        app.UseDefaultFiles()
            .UseStaticFiles()
            .UseCors(corspolicyname)
            .UseSignalR(fun routing ->
                routing.MapHub<streamhub>(new PathString("/stream"), fun options ->
                options.Transports <- Connections.HttpTransportType.LongPolling //azure has a cap on web socket connections. edge doesnt support server sent events
                options.LongPolling.PollTimeout <- TimeSpan.FromSeconds(30.0)
            ))
            .UseHttpsRedirection()
            .UseMvc() |> ignore

    member val Configuration : IConfiguration = null with get, set
