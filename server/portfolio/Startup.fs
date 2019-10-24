namespace portfolio

open System
open System.Collections.Generic
open System.Linq
open System.Threading.Tasks
open Microsoft.AspNetCore.Builder
open Microsoft.AspNetCore.Hosting
open Microsoft.AspNetCore.HttpsPolicy;
open Microsoft.AspNetCore.Mvc
open Microsoft.Extensions.Configuration
open Microsoft.Extensions.DependencyInjection
open Microsoft.AspNetCore.SpaServices.AngularCli
open Microsoft.AspNetCore.Cors.Infrastructure
open portfolio.data

type Startup private () =
    [<Literal>]
    let staticfilespath = "/dist"

    new (configuration: IConfiguration) as this =
        Startup() then
        this.Configuration <- configuration

    member this.addcustomorigins (builder: CorsPolicyBuilder) = 
        ()        

    // This method gets called by the runtime. Use this method to add services to the container.
    member this.ConfigureServices(services: IServiceCollection) =
        // Add framework services.
        services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_2) |> ignore

        services.AddSpaStaticFiles(fun configuration -> 
            configuration.RootPath <- staticfilespath
            ()
        )

        services.AddCors(
            fun options ->
                options.AddPolicy(
                    "portfolio",
                    this.addcustomorigins
                )
                ()
        )
        |> ignore

    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    member this.Configure(app: IApplicationBuilder, env: IHostingEnvironment) =
        if (env.IsDevelopment()) then
            app.UseDeveloperExceptionPage() |> ignore
        else
            // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
            app.UseHsts() |> ignore

        app.UseSpaStaticFiles()

        app.UseHttpsRedirection() |> ignore
        app.UseMvc(fun routes ->
            routes.MapRoute("default", "{controller=Home}/{action=Index}/{id?}")
            |> ignore
            ()

        ) |> ignore     

    member val Configuration : IConfiguration = null with get, set
