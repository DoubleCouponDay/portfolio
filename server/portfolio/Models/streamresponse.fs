namespace portfolio.models

open System.IO
open System

type public streamresponse(inputstream: MemoryStream, inputfilename: string, inputfiletype: string) =    
    member public this.stream = inputstream
    member public this.filename = inputfilename
    member public this.filetype = inputfiletype

