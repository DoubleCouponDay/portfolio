module drivereading

open Xunit
open portfolio.googledrivereader
open System
open Xunit.Abstractions
open portfolio.models

type public when_google_drive_is_read(log: ITestOutputHelper) = 

    [<Fact>]
    member x.it_can_read_random_track(): Async<unit> =
        async {
            let! context = googledrivereader.get.readrandomdeserttrack()
            Assert.True(context.stream.Length <> 0L, "song length is not zero")
            Assert.True(String.IsNullOrEmpty(context.fileextension) = false, "filetype is not empty")
            Assert.True(String.IsNullOrEmpty(context.filename) = false, "filename is not empty")

        }
