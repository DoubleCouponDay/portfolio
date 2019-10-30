module drivereading

open Xunit
open portfolio.googledrivereader
open System
open Xunit.Abstractions

type public drivereading(log: ITestOutputHelper) = 

    [<Fact>]
    member x.can_read_random_track() =
        let test1 = drivereader.get.readrandomdeserttrack()
        let (stream, filetype) = test1
        Assert.True(stream.Length <> 0L, "song length is not zero")
        Assert.True(String.IsNullOrEmpty(filetype) = false, "filetype is not empty")
        ()