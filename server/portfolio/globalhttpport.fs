module portfolio.globalhttpport

open System.Net.Http
open System

type public globalhttpport private() =
    static member get = new globalhttpport()

    member public x.port = new HttpClient()        
