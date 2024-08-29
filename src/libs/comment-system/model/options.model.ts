import { Signer } from "@ethersphere/bee-js"

export interface Options {
  stamp?: string // defaults to getUsableStamp()
  identifier?: string // defaults to getIdentifierFromUrl(window.location.href)
  signer?: Signer
  beeApiUrl?: string // defaults to http://localhost:1633
  beeDebugApiUrl?: string // defaults to http://localhost:1635
  privateKey?: string // If set, private key won't be derived from identifier
  approvedFeedAddress?: string // Address of feed that contains approved comments
}
