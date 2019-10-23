module WebApplication1.Controllers

open System
open Microsoft.AspNetCore.Mvc
open Microsoft.AspNetCore.Routing
open System.Runtime.Caching
open Microsoft.AspNetCore.Mvc.ViewEngines
open portfolio.models.session
open portfolio.controllers.constants
open System.Collections.Generic
open Newtonsoft.Json

[<Route(api + "session")>]
[<ApiController>]
type sessioncontroller() =
    inherit ControllerBase()

    let mutable currentid : Nullable<Guid> = System.Nullable()

    [<HttpGet>]
    [<Route("{id}")>]
    member public x.Get(id : string) : ActionResult =
        let mutable possibleguid = Guid.Empty 
        let isguid = Guid.TryParse(id, &possibleguid)        

        if isguid = false then
            x.BadRequest("guid is not valid.") :> ActionResult

        else if (MemoryCache.Default
                .Contains(id)
            ) then

            let oldcacheitem = MemoryCache.Default.GetCacheItem(id)
            let newpolicy = x.getcacheitempolicy()
            MemoryCache.Default.Set(oldcacheitem, newpolicy) //updates the expiration date of the session
            new JsonResult(oldcacheitem.Value) :> ActionResult

        else
            currentid <- System.Nullable(possibleguid)
            let output = x.Post()
            currentid <- System.Nullable()
            output

    member private x.getcacheitempriority() : CacheItemPriority =
        CacheItemPriority.NotRemovable

    member private x.getcacheitempolicy() : CacheItemPolicy =
        let output = new CacheItemPolicy()
        output.SlidingExpiration <- session.expirationspan
        output.Priority <- x.getcacheitempriority()
        output

    [<HttpPost>]
    member public x.Post() : ActionResult =
        let mutable newsession = new session()

        if currentid.HasValue then //lets me implicitly create a session if you get a non existent session with a valid guid
            newsession.id <- currentid.Value

        let idstring = newsession.id.ToString()
        let cacheitem = new CacheItem(idstring, newsession)
        let policy = x.getcacheitempolicy()

        let outcome = 
            MemoryCache.Default
                .Add(cacheitem, policy)

        if outcome then 
            new JsonResult(cacheitem.Value) :> ActionResult

        else
            let error = 
                String.concat String.Empty [
                "session already exists."
            ]
            base.Conflict(error) :> ActionResult
