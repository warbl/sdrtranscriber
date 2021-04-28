import json
import ssl
import struct
import socket
import asyncio
import traceback
from quart import Quart, websocket, copy_current_websocket_context

app = Quart(__name__)
sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
sock.bind(("127.0.0.1", 15000))


class PcmServerProtocol:
    def __init__(self, queue: asyncio.Queue):
        self._queue = queue

    def connection_made(self, transport):
        self.transport = transport

    def datagram_received(self, data, addr):
        pcm_chunks = struct.unpack(
            # Convert the data to pulses
            "<" + "h" * (len(data) // struct.calcsize("h")),
            data
        )
        #print(json.dumps(pcm_chunks))
        self._queue.put_nowait(json.dumps(pcm_chunks))


async def sending(queue: asyncio.Queue):
    while True:
        data = await queue.get()
        await websocket.send(data)



def _exception_handler(loop: asyncio.AbstractEventLoop, context: dict) -> None:
    exception = context.get("exception")
    #if isinstance(exception, ssl.SSLError):
    #    pass  # Handshake failure
    #else:
     #   loop.default_exception_handler(context)
    pass






@app.websocket("/sound")
async def sound():
    global sock
    print(sock)
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        sock.bind(("127.0.0.1", 15000))
    except:
        print(traceback.format_exc())
        pass
    try:
        asyncio.get_event_loop().set_exception_handler(_exception_handler)
        pcm_queue = asyncio.Queue()
        streamer = asyncio.create_task(copy_current_websocket_context(sending)(pcm_queue))
        pcm_receiver = asyncio.create_task(
            asyncio.get_event_loop().create_datagram_endpoint(
                 lambda: PcmServerProtocol(pcm_queue), sock=sock
            )
        )
        await asyncio.gather(streamer, pcm_receiver)
    except Exception as e:
        print(sock)
        pcm_receiver.cancel()
        streamer.cancel()
        print(traceback.format_exc())



if __name__ == "__main__":
    app.run('0.0.0.0', 5000, certfile='cert.pem', keyfile='key.pem')
