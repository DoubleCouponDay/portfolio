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

[<Literal>]
let credentialspath = @"portfolio-256800-2c7593f8c9a5.p12"

[<Literal>]
let playlistname = "wilderness.m3u"

[<Literal>]
let serviceaccountemail = "server@portfolio-256800.iam.gserviceaccount.com"

[<Literal>]
let secretspath = "secrets.json"

type secrets = JsonProvider<secretspath>

let reader = secrets.Load(secretspath)

type public drivereader() =
    static member val public get = new drivereader()
        with get

    member private x.Scopes = [| DriveService.Scope.DriveReadonly |] 
    member private x.ApplicationName = "googledrivereader"

    member public x.readrandomdeserttrack(): unit =
        let privatekey: string = reader.Driveprivatekey
        let certificate = new X509Certificate2(credentialspath, privatekey, X509KeyStorageFlags.Exportable);

        let mutable initializer = new ServiceAccountCredential.Initializer(serviceaccountemail)        
        initializer.Scopes <- x.Scopes
        initializer.User <- serviceaccountemail
        initializer <- initializer.FromCertificate(certificate)
        let credential = new ServiceAccountCredential(initializer)

        let baseservice = new BaseClientService.Initializer()
        baseservice.HttpClientInitializer <- credential
        baseservice.ApplicationName <- x.ApplicationName
        let googledrive = new DriveService(baseservice)

        let verytrue = new Nullable<bool>(true)
        let listRequest = googledrive.Files.List()            
        listRequest.PageSize <- new Nullable<int>(1)
        listRequest.Fields <- "files(*)"
        listRequest.Spaces <- "drive"
        listRequest.Corpora <- "allDrives"
        listRequest.Q <- "name = '" + playlistname + "'"
        listRequest.SupportsAllDrives <- verytrue
        listRequest.IncludeItemsFromAllDrives <- verytrue   
        
        listRequest.AddExceptionHandler(new exceptionhandler())
        listRequest.AddUnsuccessfulResponseHandler(new unsuccessfulhandler())
        let files = listRequest.Execute().Files

        if files.Count = 0 then
            let message = "query failed!"
            Console.WriteLine(message)
            failwith message

        for file in files do
            Console.Write(file.Name)
            Console.Write("")
            Console.Write("")
            Console.Write("")
        
        

    member private x.findplaylistfile() =
        ()

    member private x.takerandomlinefromplaylist() =
        ()
           