
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
    volume: GainNode
    timetoplay: number
}

export const dontplay = -1