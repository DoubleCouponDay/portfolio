module drivereading

open Xunit
open portfolio.googledrivereader
open System
open Xunit.Abstractions

type public drivereading(log: ITestOutputHelper) = 

    [<Fact>]
    member x.can_read_random_track() =
        let test1 = drivereader.get.readrandomdeserttrack()
        Assert.True(test1.stream.Length <> 0L, "song length is not zero")
        Assert.True(String.IsNullOrEmpty(test1.filetype) = false, "filetype is not empty")
        Assert.True(String.IsNullOrEmpty(test1.filename) = false, "filename is not empty")
        ()