
export interface streamresponse {
    chunk: number[]
    totalchunks: number
    bitdepth: number
    samplerate: number
    channels: number
}

export const playablebuffercount = 5
export const millisecond = 1000

export interface playablechunk {
    chunk: AudioBufferSourceNode    
    timetoplay: number
    timetoend: number
}

export const dontplay = -1
export const audiocontextlatency = 0.02