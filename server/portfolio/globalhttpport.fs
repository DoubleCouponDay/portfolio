module portfolio.globalhttpport

open System.Net.Http
open System

type public globalhttpport =
    static member get = new globalhttpport()

    member public x.port = new HttpClient()

    private new() = new globalhttpport()
        
