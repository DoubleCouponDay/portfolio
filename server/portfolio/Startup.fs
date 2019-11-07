namespace portfolio

open Microsoft.AspNetCore.Builder
open Microsoft.AspNetCore.Hosting
open Microsoft.AspNetCore.Mvc

open Microsoft.Extensions.Configuration
open Microsoft.Extensions.DependencyInjection
open Microsoft.AspNetCore.Cors.Infrastructure

open portfolio.data
open portfolio.controllers.audio
open Microsoft.AspNetCore.Http
open System

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
        |]) |> ignore
        ()        

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
            options.EnableDetailedErrors <- true
        )
        ()

    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    member this.Configure(app: IApplicationBuilder, env: IHostingEnvironment) =
        if (env.IsDevelopment()) then
            app.UseDeveloperExceptionPage() |> ignore
        else
            // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
            app.UseHsts() |> ignore
      
        app.UseDefaultFiles() |> ignore
        app.UseStaticFiles() |> ignore

        app.UseSignalR(fun routes -> 
            routes.MapHub<stream>(new PathString("/stream"))
        ) |> ignore

        app.UseCors(corspolicyname)
            .UseHttpsRedirection()
            .UseMvc()
        |> ignore

    member val Configuration : IConfiguration = null with get, set
