module portfolio.googledrivereader

open Google.Apis.Services
open Google.Apis.Util.Store
open System
open System.IO
open Google.Apis.Drive.v3
open Google.Apis.Auth.OAuth2
open System.Threading
open System.Security.Cryptography.X509Certificates
open Newtonsoft.Json
open FSharp.Data
open portfolio.googleresponses
open System.Linq
open System.Collections.Generic
open System.Text
open portfolio.models
open System.Collections.ObjectModel

[<Literal>]
let credentialspath = @"portfolio-ffdfea565994.p12"

[<Literal>]
let playlistname = "wilderness.m3u"

[<Literal>]
let serviceaccountemail = "server@portfolio-256800.iam.gserviceaccount.com"

[<Literal>]
let secretspath = "secrets.json"

[<Literal>]
let backslash = @"\"

[<Literal>]
let myfields = "files(*)"

type secrets = JsonProvider<secretspath>
let reader = secrets.Load(secretspath)
let Scopes = [| DriveService.Scope.DriveReadonly |] 

type public googledrivereader private() =    
    let privatekey: string = reader.Driveprivatekey
    let mutable initializer = new ServiceAccountCredential.Initializer(serviceaccountemail)        

    do
        initializer.Scopes <- Scopes
        initializer.User <- serviceaccountemail
        let certificate = new X509Certificate2(credentialspath, privatekey, X509KeyStorageFlags.MachineKeySet)
        initializer <- initializer.FromCertificate(certificate)

    let credential = new ServiceAccountCredential(initializer)
    let baseservice = new BaseClientService.Initializer()
    let mutable playlist: ReadOnlyCollection<string> = null

    do
        baseservice.HttpClientInitializer <- credential
        baseservice.ApplicationName <- "googledrivereader"        
    
    static member public get = new googledrivereader() //singleton
    member val private rng = new Random()

    member public this.readrandomdeserttrack(canceller: CancellationToken): Async<audiofile> =    
        async {
            use service = this.createdriveservice()     
            let! operation = this.setplaylist(service, canceller)
            let chosenindex = this.rng.Next(playlist.Count)
            let chosenfilename = playlist.[chosenindex]
            let! chosenfile = this.requestfilebyname(service, chosenfilename, canceller)
            let! stream = this.requestfilebyID(service, chosenfile.Id, canceller)
            return new audiofile(stream, chosenfilename, chosenfile.FileExtension)
        }    
        
    member public this.createdriveservice(): DriveService =
        new DriveService(baseservice)

    member private x.setplaylist(service: DriveService, canceller: CancellationToken): Async<unit> =
        async {
            let! playlistfile = 
                x.requestfilebyname(service, playlistname, canceller)

            let! lines = x.getplaylistlines(service, playlistfile, canceller)
            playlist <- lines
        }    
        
    member public this.getplaylist(canceller: CancellationToken): Async<ReadOnlyCollection<string>> =
        async {
            use service = new DriveService(baseservice)            
            let! operation = this.setplaylist(service, canceller)
            return playlist
        }
        
    member public x.requestfilebyname(service: DriveService, filename: string, canceller: CancellationToken): Async<Data.File> =
        async {
            let verytrue = new Nullable<bool>(true)
            let listRequest = service.Files.List()    
            listRequest.PageSize <- new Nullable<int>(1)
            listRequest.Fields <- myfields
            listRequest.Spaces <- "drive"
            listRequest.Corpora <- "allDrives"
            listRequest.Q <- "name = '" + filename + "'"
            listRequest.SupportsAllDrives <- verytrue
            listRequest.IncludeItemsFromAllDrives <- verytrue   
            
            listRequest.AddExceptionHandler(new exceptionhandler())
            listRequest.AddUnsuccessfulResponseHandler(new unsuccessfulhandler())

            let! query = 
                listRequest.ExecuteAsync(canceller)
                |> Async.AwaitTask

            if query.Files.Count = 0 then
                let message = "query failed!"
                Console.WriteLine(message)
                failwith message

            return query.Files.Item(0)
        }

    member public x.requestfilebyID(service: DriveService, id: string, canceller: CancellationToken): Async<MemoryStream> = 
        async {
            let request = service.Files.Get(id)
            request.Fields <- myfields
            let mutable output = new MemoryStream()

            let! result =
                request.DownloadAsync(output, canceller)
                |> Async.AwaitTask
                

            if result.Exception <> null then
                raise result.Exception

            output.Position <- 0L
            return output
        }

    member private x.getplaylistlines(service: DriveService, playlist: Data.File, canceller: CancellationToken): Async<ReadOnlyCollection<string>> =
        async {
            let! download = x.requestfilebyID(service, playlist.Id, canceller)
            let entire = Encoding.UTF8.GetString(download.ToArray())
            download.Dispose()

            let lineending:string = 
                if entire.IndexOf("\r\n") <> -1 then 
                    "\r\n"

                else 
                    Environment.NewLine                   

            let output = 
                entire.Split(lineending)
                    .Where(fun currentline -> currentline <> "")
                    .Select(fun currentline -> 
                        currentline.Split(backslash)
                            .Last()
                    )
                    .ToArray()

            return Array.AsReadOnly(output)
        }


        

           