module portfolio.WaveUtils

open System
open System.Collections.Generic
open System.Linq
open System.Text
open System.Threading.Tasks
open NAudio.Wave
open audio.data

/// courtesy of @alexvab
type public waveutils =  
    ///returns amount read
    static member public writewavchunk(reader:WaveFileReader, writer:WaveFileWriter, startposition:int64, stopposition:int64): int =
        let mutable amountread: int = 0
        reader.Position <- startposition
        let buffersize = reader.BlockAlign * 1024 /// make sure that buffer is sized to a multiple of our WaveFormat.BlockAlign.
        /// WaveFormat.BlockAlign = channels * (bits / 8), so for 16 bit stereo wav it will be 4096 bytes
        let buffer = Array.create buffersize 0.0F
        let sampler = reader.ToSampleProvider()

        while reader.Position < stopposition do
            let bytesrequired = int32(stopposition - reader.Position) 

            if bytesrequired > 0 then
                let bytestoread = Math.Min(bytesrequired, buffer.Length)
                let bytesread = sampler.Read(buffer, 0, bytestoread)        
                amountread <- amountread + bytesread
                
                if bytesread > 0 then
                    writer.WriteSamples(buffer, 0, bytestoread)     
                    
        amountread