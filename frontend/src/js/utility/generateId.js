import { randomBytes } from 'crypto'

export default () => {
  // NOTE: generate hash by crypto randomByte
  const dataByteSize = 5
  const dataBytes = randomBytes(dataByteSize)
  const hashData = dataBytes.toString('hex')
  return hashData
}
