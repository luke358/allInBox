export class Request {

  request: () => void
  constructor(request: () => void) {
    this.request = request
  }
}
export class CachedRequest {

}
