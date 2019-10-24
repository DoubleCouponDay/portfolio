module drivereading

open Xunit
open portfolio.googledrivereader
open System
open Xunit.Abstractions

type public drivereading(log: ITestOutputHelper) = 

    [<Fact>]
    member x.can_read_random_track() =
        let test1 = drivereader.get.readrandomdeserttrack()
        Assert.True(test1.Length <> 0L, "song length is not zero")
        ()

