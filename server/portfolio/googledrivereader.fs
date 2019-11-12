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

let ApplicationName = "googledrivereader"

type public drivereader private() =    
    let privatekey: string = reader.Driveprivatekey
    let certificate = new X509Certificate2(credentialspath, privatekey, X509KeyStorageFlags.Exportable);
    let mutable initializer = new ServiceAccountCredential.Initializer(serviceaccountemail)        

    do
        initializer.Scopes <- Scopes
        initializer.User <- serviceaccountemail
        initializer <- initializer.FromCertificate(certificate)

    let credential = new ServiceAccountCredential(initializer)

    let baseservice = new BaseClientService.Initializer()

    do
        baseservice.HttpClientInitializer <- credential
        baseservice.ApplicationName <- ApplicationName        
    
    let servicefield = new DriveService(baseservice)

    static member public get = new drivereader()
    member private x.service: DriveService = servicefield

    member val private playlist: string[] = null
        with get, set

    member val private rng = new Random()

    member public x.readrandomdeserttrack(): driveresponse =    
        if x.playlist = null then
            x.setplaylist()

        let chosenindex = x.rng.Next(x.playlist.Length)
        let chosenfilename = x.playlist.[chosenindex]
        let chosenfile = x.requestfilebyname(chosenfilename)
        let stream = x.requestfilebyID(chosenfile.Id)
        new driveresponse(stream, chosenfilename, chosenfile.MimeType)

    member private x.setplaylist(): unit =
        let playlistfile = x.requestfilebyname(playlistname)
        x.playlist <- x.getplaylistlines(playlistfile)
        ()
        
    member private x.requestfilebyname(filename: string): Data.File =
        let verytrue = new Nullable<bool>(true)
        let listRequest = x.service.Files.List()            
        listRequest.PageSize <- new Nullable<int>(1)
        listRequest.Fields <- myfields
        listRequest.Spaces <- "drive"
        listRequest.Corpora <- "allDrives"
        listRequest.Q <- "name = '" + filename + "'"
        listRequest.SupportsAllDrives <- verytrue
        listRequest.IncludeItemsFromAllDrives <- verytrue   
        
        listRequest.AddExceptionHandler(new exceptionhandler())
        listRequest.AddUnsuccessfulResponseHandler(new unsuccessfulhandler())
        let files = listRequest.Execute().Files

        if files.Count = 0 then
            let message = "query failed!"
            Console.WriteLine(message)
            failwith message

        files.Item(0)

    member private x.requestfilebyID(id: string): MemoryStream = 
        let request = x.service.Files.Get(id)
        request.Fields <- myfields
        let mutable output = new MemoryStream()
        let result = request.DownloadWithStatus(output)

        if result.Exception <> null then
            raise result.Exception

        output.Position <- 0L
        output

    member private x.getplaylistlines(playlist: Data.File): string[] =
        let download = x.requestfilebyID(playlist.Id)
        let entire = Encoding.ASCII.GetString(download.ToArray())
        download.Dispose()

        let output = 
            entire.Split(Environment.NewLine)
                .Select(fun currentline -> 
                    currentline.Split(backslash)
                        .Last()
                )
                .ToArray()

        output


        

           