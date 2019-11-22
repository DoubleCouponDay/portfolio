import { streamresponse, peakint8bit, troughint8bit, troughint16bit, peakint16bit, peakint24bit, troughint24bit } from '../services/streaming.data'

class _bitrateconverter {
    /** brings all the sample ranges down so they dont clip */
    converttowebaudio(response: streamresponse) {
        let peak: number
        let trough: number

        switch(response.bitdepth) {
            case 8:
                peak = peakint8bit
                trough = troughint8bit
                break

            case 16:
                peak = peakint16bit
                trough = troughint16bit   
                break
                
            default:
            case 24:
                peak = peakint24bit
                trough = troughint24bit
                break
        }

        for(let i = 0; i < response.chunk.length; i++) {
            let currentsample = response.chunk[i]
            response.chunk[i] = currentsample > 0 ? currentsample / peak : currentsample / trough
        }
    }
}

export const bitrateconverter = new _bitrateconverter()