namespace portfolio.models

open System.IO
open System

[<AllowNullLiteral>]
type public audiofile(inputstream: MemoryStream, inputfilename: string, inputmimetype: string) =    
    member val public stream = inputstream with get, set
    member public this.filename = inputfilename
    member public this.mimetype = inputmimetype

