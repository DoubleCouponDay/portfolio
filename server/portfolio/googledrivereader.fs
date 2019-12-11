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

[<Literal>]
let credentialspath = @"portfolio-ffdfea565994.p12"

//[<Literal>]
//let playlistname = "wilderness.m3u"

[<Literal>]
let playlistname = "test.m3u"

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

type public drivereader private() =    
    let privatekey: string = reader.Driveprivatekey
    let mutable initializer = new ServiceAccountCredential.Initializer(serviceaccountemail)        

    do
        initializer.Scopes <- Scopes
        initializer.User <- serviceaccountemail
        let certificate = new X509Certificate2(credentialspath, privatekey, X509KeyStorageFlags.MachineKeySet)
        initializer <- initializer.FromCertificate(certificate)

    let credential = new ServiceAccountCredential(initializer)
    let baseservice = new BaseClientService.Initializer()

    do
        baseservice.HttpClientInitializer <- credential
        baseservice.ApplicationName <- "googledrivereader"        
    
    static member public get = new drivereader() //singleton

    member val private playlist: string[] = null
        with get, set

    member val private rng = new Random()

    member public x.readrandomdeserttrack(): Async<audiofile> =    
        async {
            use service = new DriveService(baseservice)            
            let! operation = x.setplaylist(service)
            let chosenindex = x.rng.Next(x.playlist.Length)
            let chosenfilename = x.playlist.[chosenindex]
            let! chosenfile = x.requestfilebyname(service, chosenfilename)
            let stream = x.requestfilebyID(service, chosenfile.Id)
            return new audiofile(stream, chosenfilename, chosenfile.FileExtension)
        }        

    member private x.setplaylist(service: DriveService): Async<unit> =
        async {
            let! playlistfile = 
                x.requestfilebyname(service, playlistname)

            x.playlist <- x.getplaylistlines(service, playlistfile)
        }                
        
    member private x.requestfilebyname(service: DriveService, filename: string): Async<Data.File> =
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

        async {
            let! query = 
                listRequest.ExecuteAsync() 
                |> Async.AwaitTask

            if query.Files.Count = 0 then
                let message = "query failed!"
                Console.WriteLine(message)
                failwith message

            return query.Files.Item(0)
        }

    member private x.requestfilebyID(service: DriveService, id: string): MemoryStream = 
        let request = service.Files.Get(id)
        request.Fields <- myfields
        let mutable output = new MemoryStream()
        let result = request.DownloadWithStatus(output)

        if result.Exception <> null then
            raise result.Exception

        output.Position <- 0L
        output

    member private x.getplaylistlines(service: DriveService, playlist: Data.File): string[] =
        let download = x.requestfilebyID(service, playlist.Id)
        let entire = Encoding.UTF8.GetString(download.ToArray())
        download.Dispose()

        let output = 
            entire.Split(Environment.NewLine)
                .Where(fun currentline -> currentline <> "")
                .Select(fun currentline -> 
                    currentline.Split(backslash)
                        .Last()
                )
                .ToArray()
        output


        

           