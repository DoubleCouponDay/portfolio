namespace portfolio.bridgedecoders

open NAudio.Wave
open portfolio.models
open System.IO
open System
open audio.data

type public universalwav(stream: MemoryStream) =
    inherit Iuniversalreader()

    let reader = new WaveFileReader(stream)
    let mutable startposition = 0L
    let sampler = reader.ToSampleProvider()

    do
        if reader.CanRead = false then
             failwith "the received chunk file cant be read!"
    
    override this.channels: int = reader.WaveFormat.Channels         
    override this.filesize: int64 = reader.Length
    override this.position: int64 = reader.Position
    override this.samplecount: int64 = reader.SampleCount
    override this.samplerate: int = reader.WaveFormat.SampleRate
    override this.bitdepth = reader.WaveFormat.BitsPerSample
    override this.encoding = reader.WaveFormat.Encoding.ToString()  

    override this.readchunk(): Option<byte[]> =
        use newstream = new MemoryStream()
        let writer = new WaveFileWriter(newstream, reader.WaveFormat)

        reader.Position <- startposition
        let buffersize = reader.BlockAlign * 1024 /// make sure that buffer is sized to a multiple of our WaveFormat.BlockAlign.
        /// BlockAlign equals channels * (bits / 8), so for 16 bit stereo wav it will be 4096 bytes
        let buffer = Array.create buffersize 0.0F        
        let formattedsize = int64(chunksize)
        let difference = reader.Length - reader.Position
        let mutable takecount:int32 = if difference >= formattedsize then int32(formattedsize) else int32(difference)
        let mutable sampleswritten = false

        while takecount > 0 do
            buffer.Initialize()
            let bytestoread = Math.Min(takecount, buffer.Length)
            let bytesread = sampler.Read(buffer, 0, bytestoread)        
                
            if bytesread > 0 then
                writer.WriteSamples(buffer, 0, bytestoread) 
                takecount <- takecount - bytesread
                sampleswritten <- true
                
            if takecount = 0 then
                writer.Dispose() // writes the header     
                
            else
                takecount <- takecount - bytesread

        startposition <- reader.Position     
        writer.Dispose()

        if sampleswritten then 
            let output = newstream.GetBuffer()
            Some output

        else None
        

    interface IDisposable with
        member this.Dispose() =
            reader.Dispose()   