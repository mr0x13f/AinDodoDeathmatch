# https://websockets.readthedocs.io/en/stable/intro.html

import websockets
import asyncio
import json
import sys, traceback
import uuid

PORT = 42069

servers = {} # [serverName] = GameServer
clients = {} # [websocket.id] = serverName

class GameServer():
    def __init__(self, websocket):
        self.websocket = websocket
        self.clients = {} # [websocket.id] = websocket

async def ws_handler(websocket, path):

    websocket.id = str(uuid.uuid1())
    websocket.isClient = False
    websocket.isServer = False
    websocket.serverName = None

    while True:
        try:
            jsonString = await websocket.recv()
        except websockets.ConnectionClosed:
            disconnect(websocket)
            break

        message = json.loads(jsonString)
        data = message['data']
        action = message['action']
        await onMessage(websocket, action, data)

async def onMessage(websocket, action, data):

    if action == "ping":
        await send(websocket, "pong")

    elif action == "registerServer":
        name = data['serverName'].lower()
        if name in servers:
            await sendError(websocket, "registerServerError", "Server name already in use")
            return
        if len(name) < 1:
            await sendError(websocket, "registerServerError", "Bad server name")
            return
        
        servers[name] = GameServer(websocket)
        websocket.isServer = True
        websocket.serverName = name
        print("Server '"+name+"' opened")

        await send(websocket, "registerServerSuccess")

    elif action == "listServers":
        await send(websocket, "listServers", {
            "servers": list(servers.keys())
        })

    elif action == "join":
        name = data['serverName'].lower()
        if not name in servers:
            await sendError(websocket, "joinError", "Server not found")
            return

        websocket.isClient = True
        clients[websocket.id] = name
        server = servers[name]
        server.clients[websocket.id] = websocket
        await send(websocket, "joinSuccess")
        await send(servers[name].websocket, "newClient", {
            "clientId": websocket.id
        })

    elif action == "offer":
        await send(getServerByClient(websocket), "offer", {
            'clientId': websocket.id,
            'offer': data['offer']
        })

    elif action == "answer":
        await send(getClientById(websocket, data['clientId']), "answer", {
            'answer': data['answer']
        })

    elif action == "ice":
        if websocket.isClient:
            await send(getServerByClient(websocket), "ice", {
                'clientId': websocket.id,
                'candidate': data['candidate']
            })
        if websocket.isServer:
            await send(getClientById(websocket, data['clientId']), "ice", {
                'candidate': data['candidate']
            })

def disconnect(websocket):
    if websocket.isServer:
        servers.pop(websocket.serverName)
        print("Server '"+websocket.serverName+"' closed")

    if websocket.isClient:
        clients.pop(websocket.id)

def getServerByClient(clientSocket):
    serverName = clients[clientSocket.id]
    server = servers[serverName]
    serverSocket = server.websocket
    return serverSocket

def getClientById(serverSocket, clientId):
    serverName = serverSocket.serverName
    server = servers[serverName]
    clientSocket = server.clients[clientId]
    return clientSocket

async def send(websocket, action, data={}):
    await websocket.send(json.dumps({
        "error": False,
        "action": action,
        "data": data
    }))

async def sendError(websocket, action, message):
    await websocket.send(json.dumps({
        "error": True,
        "action": action,
        "message": message
    }))

def main():
    start_server = websockets.serve(ws_handler, "localhost", PORT)
    asyncio.get_event_loop().run_until_complete(start_server)
    asyncio.get_event_loop().run_forever()

if __name__ == "__main__":
    main()