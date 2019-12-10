module portfolio.flacutils

open CUETools.Codecs.FLAKE
open System.Linq
open CUETools.Codecs
open System
open portfolio.models

type public flacutils =
    static member public writeflacchunk(reader:FlakeReader, output: FlakeWriter, startposition: int64, endposition: int64): int =

        let takecount = 
            let naiveend = int(endposition - startposition)
            let intelligentend = reader.Samples.Length

            if naiveend > intelligentend then naiveend else intelligentend
        
        let buffer = new AudioBuffer(reader, takecount)
        let amountread = reader.Read(buffer, takecount)
        output.WriteHeader()
        output.Write(buffer)
        amountread
    

