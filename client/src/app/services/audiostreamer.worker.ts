import { HubConnection, LogLevel, IStreamSubscriber, HttpTransportType, ISubscription, HubConnectionState, HubConnectionBuilder, IStreamResult } from '@aspnet/signalr'
import { baseroute } from 'src/environments/api'
import { streamhublabel, randomdeserttrackroute } from 'src/environments/environment.data'
import { messagestate } from 'src/app/services/streaming.data'

let connection: HubConnection

let connected = false

const subscriber = {
    next: onchunkdownloaded,
    error: self.console.error,
    complete: onstreamcomplete
}

let stream: IStreamResult<number[]>
let subscription: ISubscription<number[]>

addEventListener("message", (inputevent: MessageEvent) => {
  switch(inputevent.data) {
    case messagestate.request_connecttoserver:
      startconnection()
        .then(() => {
          postMessage(messagestate.response_connected, baseroute)
        })
        .catch((error: any) => {
          console.error(error)
          postMessage(messagestate.response_connectfailed, baseroute)
        })
      break

    case messagestate.request_startstreaming:
      startstreaming()
      break

    default:
      postMessage(messagestate.response_badrequest, baseroute)
  }
})

function startconnection(): Promise<void> {
    return new Promise((resolve, reject) => {
      if(connected === true) {
        resolve()
        return
      }
      connection = new HubConnectionBuilder()    
        .configureLogging(LogLevel.Warning)
        .withUrl(baseroute + streamhublabel, {
            transport: HttpTransportType.LongPolling
        })    
        .build()

      connection.start()            
        .then(() => {
            connected = true
            resolve()
            return
        })
        .catch(reject)          
    })
}

function startstreaming() {
    stream = connection.stream<number[]>(randomdeserttrackroute)
    subscription = stream.subscribe(subscriber)
}

function onchunkdownloaded(chunk: number[]) {
  let buffer = new Float32Array(chunk)
  let response = {
    state: messagestate.response_haveachunk,
    chunk: buffer
  }
  postMessage(response, baseroute, [response.chunk])
}

function onstreamcomplete() {
  postMessage(messagestate.response_finishedtreaming, baseroute)
  connection.stop()
}