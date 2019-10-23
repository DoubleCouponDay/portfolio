module drivereading

open Xunit
open portfolio.googledrivereader

[<Fact>]
let can_read_random_track() = 
    let test1 = drivereader.get.readrandomdeserttrack()
    ()

