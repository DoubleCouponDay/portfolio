module portfolio.models.session

open System
open System.IO

type session() =
    static member public expirationspan = TimeSpan.FromMinutes(float(20))

    member val public id : Guid = Guid.NewGuid() with get, set