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

    override this.readchunk(): byte[] =
        use newstream = new MemoryStream()
        let writer = new WaveFileWriter(newstream, reader.WaveFormat)
        reader.Position <- startposition
        let buffersize = reader.BlockAlign * 1024 /// make sure that buffer is sized to a multiple of our WaveFormat.BlockAlign.
        /// BlockAlign equals channels * (bits / 8), so for 16 bit stereo wav it will be 4096 bytes
        let buffer = Array.create buffersize 0.0F
        
        let mutable shouldloop = true
        let formattedsize = int64(chunksize)
        let difference = reader.Length - reader.Position
        let takecount = if difference >= formattedsize then formattedsize else difference
        

        while shouldloop do
            let bytesrequired = int32(takecount - writer.Length) 

            if bytesrequired > 0 then
                let bytestoread = Math.Min(bytesrequired, buffer.Length)
                let bytesread = sampler.Read(buffer, 0, bytestoread)        
                
                if bytesread > 0 then
                    writer.WriteSamples(buffer, 0, bytestoread)                      

                else
                    shouldloop <- false                    

            else
                shouldloop <- false

        startposition <- reader.Position        
        writer.Dispose() // writes the header
        newstream.GetBuffer()

    interface IDisposable with
        member this.Dispose() =
            reader.Dispose()   