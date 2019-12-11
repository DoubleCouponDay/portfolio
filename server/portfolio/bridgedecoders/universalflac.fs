namespace portfolio.bridgedecoders

open CUETools.Codecs.FLAKE
open CUETools.Codecs
open System.IO
open audio.data
open portfolio.models
open System

type public universalflac(track: audiofile) =
    inherit universalreader(track)
    let reader = new FlakeReader(null, track.stream)

    override this.position: int64 = reader.Position
    override this.filesize: int64 = reader.Length
    override this.samplecount: int64 = int64(reader.Samples.Length)
    override this.bitdepth: int = reader.PCM.BitsPerSample
    override this.samplerate: int = reader.PCM.SampleRate
    override this.channels: int = reader.PCM.SampleRate
    override this.encoding: string = "flac"

    override this.readchunk(): Option<byte[]> =
        use newstream = new MemoryStream()
        let writer = new FlakeWriter(null, newstream, reader.PCM)

        let takecount = 
            let naiveend = int(reader.Position + int64(chunksize))
            let amountleft = int(reader.Length - reader.Position)

            if naiveend > amountleft then amountleft else naiveend
    
        if takecount = 0 then
            None

        else
            let buffer = new AudioBuffer(reader, takecount)
            let amountread = reader.Read(buffer, takecount)
            writer.WriteHeader()
            writer.Write(buffer)
            writer.Dispose()
            let output = newstream.ToArray()
            Some output

    interface IDisposable with
        member this.Dispose() =
            reader.Dispose()