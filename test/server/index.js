import io from 'socket.io-client'
import assert from 'assert'

// start socket.io server
import '../../server.js'

const ioUrl = 'http://localhost:4000/'

describe('Socket.io Server', () => {
  it('should emit peer when client connects', done => {
    const socket = io(ioUrl)
    socket.on('peer', msg => {
      const peerId = msg.peerId
      assert(peerId === socket.id)
      done()
    })
  });
});