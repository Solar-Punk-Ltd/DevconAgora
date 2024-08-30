import { Bee } from '@ethersphere/bee-js'
import { ZeroHash } from 'ethers'
import { BEE_DEBUG_URL, BEE_URL } from './constants/constants'
import { Comment, CommentRequest } from './model/comment.model'
import { getAddressFromIdentifier, getIdentifierFromUrl, getPrivateKeyFromIdentifier } from './uitls/url'
import { isComment } from './asserts/models.assert'
import { numberToFeedIndex } from './uitls/feeds'
import { Options } from './model/options.model'
import { Optional } from './model/util.types'


export async function writeComment(comment: CommentRequest, options?: Options) {
  try {
    if (!options) return;
    const { identifier, stamp, beeApiUrl, privateKey: optionsPrivateKey, signer } = options
    if (!stamp) return;
    const privateKey = optionsPrivateKey// || getPrivateKeyFromIdentifier(identifier)
    const bee = new Bee(beeApiUrl || "http://localhost:1633")
  
    const commentObject: Comment = {
      ...comment,
      timestamp: typeof comment.timestamp === 'number' ? comment.timestamp : new Date().getTime(),
    }
  
    const { reference } = await bee.uploadData(stamp, JSON.stringify(commentObject))
    console.log("Data upload successful: ", reference)
    console.log("Signer", signer)
    const feedWriter = bee.makeFeedWriter('sequence', identifier || ZeroHash, signer)
    console.log("feedWriter made: ", feedWriter)
  
    const r = await feedWriter.upload(stamp, reference);
    console.log("feed updated: ", r)

    return commentObject;
    
  } catch (error) {
    console.error("Error while writing comment: ", error);
  }
}

export async function readComments(options?: Options): Promise<Comment[]> {
  if (!options) return []
  const { identifier, beeApiUrl, approvedFeedAddress: optionsAddress } = options
  if (!identifier) {
    console.error("No identifier")
    return []
  }

  const bee = new Bee(beeApiUrl || "http://localhost:1633")

  const address = optionsAddress || getAddressFromIdentifier(identifier)

  const feedReader = bee.makeFeedReader('sequence', identifier || ZeroHash, address)

  const comments: Comment[] = []

  let nextIndex = 0

  while (true) {
    try {
      const feedUpdate = await feedReader.download({ index: numberToFeedIndex(nextIndex++) })

      const data = await bee.downloadData(feedUpdate.reference)

      const comment = data.json()

      if (isComment(comment)) {
        comments.push(comment)
      }
    } catch (error) {
      break
    }
  }

  return comments
}
