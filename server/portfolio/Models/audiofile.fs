namespace portfolio.models

open System.IO
open System

type public audiofile(inputstream: MemoryStream, inputfilename: string, inputfileextension: string) =    
    member val public stream = inputstream with get, set
    member public this.filename = inputfilename
    member public this.fileextension = inputfileextension

