module portfolio.WaveUtils

open System
open System.Collections.Generic
open System.Linq
open System.Text
open System.Threading.Tasks
open NAudio.Wave
open audio.data

/// make sure that buffer is sized to a multiple of our WaveFormat.BlockAlign.
/// WaveFormat.BlockAlign = channels * (bits / 8), so for 16 bit stereo wav it will be 4096 bytes
/// courtesy of @alexvab
type public waveutils =
    static member public writewavchunk(reader:WaveFileReader, writer:WaveFileWriter, startposition:int64, stopposition:int64): unit =
        reader.Position <- startposition

        let buffersize = reader.BlockAlign * 1024
        let buffer = Array.create buffersize 0uy

        while reader.Position < stopposition do
            let bytesrequired = int32(stopposition - reader.Position) 

            if bytesrequired > 0 then
                let bytestoread = Math.Min(bytesrequired, buffer.Length)
                let bytesread = reader.Read(buffer, 0, bytestoread)        
                
                if bytesread > 0 then
                    writer.Write(buffer, 0, bytestoread)     
                    
        ()