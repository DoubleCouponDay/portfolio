module portfolio.googledrivereader

open Google.Apis.Services
open Google.Apis.Util.Store
open System
open System.IO
open Google.Apis.Drive.v3
open Google.Apis.Auth.OAuth2
open System.Threading

[<Literal>]
let credentialspath = "credentials.json"

[<Literal>]
let playlistpath = "musicbeestate/Playlists/beta max/wilderness.m3u"

type public googledrivereader =
    
    // If modifying these scopes, delete your previously saved credentials
    // at ~/.credentials/drive-dotnet-quickstart.json
    static member Scopes = [DriveService.Scope.DriveReadonly]
    static member ApplicationName = "googledrivereader"

    static member public readrandomdeserttrack() =
        use stream = new FileStream(credentialspath, FileMode.Open, FileAccess.Read)
            
        // The file token.json stores the user's access and refresh tokens, and is created
        // automatically when the authorization flow completes for the first time.
        let credPath = "token.json"

        let credential: UserCredential = GoogleWebAuthorizationBroker.AuthorizeAsync(
            GoogleClientSecrets.Load(stream).Secrets,
            googledrivereader.Scopes,
            "user",
            CancellationToken.None,
            new FileDataStore(credPath, true)).Result
            

        let baseservice = new BaseClientService.Initializer()
        baseservice.HttpClientInitializer <- credential
        baseservice.ApplicationName <- googledrivereader.ApplicationName
        let googledrive = new DriveService(baseservice)

        let listRequest = googledrive.Files.Get("")
        listRequest.PageSize <- new Nullable<int>(10)
        listRequest.Fields <- "nextPageToken, files(id, name)"

        // List files.
        let files = listRequest.Execute().Files

        ()

           