module testserver

open Microsoft.AspNetCore.Mvc.Testing
open Microsoft.AspNetCore.Hosting
open Microsoft.AspNetCore

type public testserver<'TStartupType when 'TStartupType: not struct>() =
    inherit WebApplicationFactory<'TStartupType>()    

    override this.CreateWebHostBuilder() =
        WebHost.CreateDefaultBuilder()
            .UseStartup<'TStartupType>()
 
    override this.ConfigureWebHost(builder: IWebHostBuilder) =
        builder.UseContentRoot(".") |> ignore
        base.ConfigureWebHost(builder)
