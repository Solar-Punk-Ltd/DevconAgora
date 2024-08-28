import { Utils } from '@ethersphere/bee-js'

export function numberToFeedIndex(index: number): string {
  const bytes = new Uint8Array(8)
  const dv = new DataView(bytes.buffer)
  dv.setUint32(4, index)

  return Utils.bytesToHex(bytes)
}
