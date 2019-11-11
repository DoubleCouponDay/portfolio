
export enum messagestate {
    request_connecttoserver,
    response_connected,
    response_connectfailed,    
    request_startstreaming,
    response_haveachunk,
    response_finishedtreaming,
    response_badrequest,
}

export interface inputmessage {
    state: messagestate,
    connection?: null
}

export const chunksize = 256_000

export const workerfilepath = "assets/audiostreamer.js"