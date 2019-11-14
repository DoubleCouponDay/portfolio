module decoding

open Xunit

type public the_decoders() =

    [<Fact>]
    member public this.can_decode_mp3() =
        Assert.True(false)
        ()

    [<Fact>]
    member public this.can_decode_wav() =
        Assert.True(false)
        ()

    [<Fact>]
    member public this.can_decode_flac() =
        Assert.True(false)

        ()

    [<Fact>]
    member public this.can_decode_ogg() =
        Assert.True(false)

        ()

    [<Fact>]
    member public this.can_decode_m4a() =
        Assert.True(false)

        ()