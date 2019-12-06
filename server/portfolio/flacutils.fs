module portfolio.flacutils

open CUETools.Codecs.FLAKE
open System.Linq
open CUETools.Codecs
open System

type public flacutils =
    static member public writeflacchunk(reader:FlakeReader, output: FlakeWriter, startposition: int64, endposition: int64): int =
        let takecount = int(endposition - startposition)
        if takecount % reader.PCM.BlockAlign <> 0 then
            failwith ("amount: " + string(takecount) + " to take must be a multiple of block align: " + string(reader.PCM.BlockAlign))

        let portion = 
            reader.Samples
                .Skip(int(startposition))
                .Take(int(takecount))
                .Select(fun item -> byte(item))
                .ToArray()

        let buffer = new AudioBuffer(reader.PCM, portion, portion.Length)
        output.WriteHeader()
        output.Write(buffer)
        
        portion.Length

