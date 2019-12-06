module portfolio.flacutils

open CUETools.Codecs.FLAKE
open System.Linq
open CUETools.Codecs
open System

type public flacutils =
    static member public writeflacchunk(reader:FlakeReader, output: FlakeWriter, startposition: int64, endposition: int64): int =
        let takecount = int(endposition - startposition)

        let portion = 
            reader.Samples
                .Skip(int(startposition))
                .Take(int(takecount))
                .Select(fun item -> byte(item))
                .ToArray()

        let length = portion.Length / reader.PCM.BlockAlign

        let buffer = new AudioBuffer(reader.PCM, portion, length)
        output.WriteHeader()
        output.Write(buffer)
        
        portion.Length

