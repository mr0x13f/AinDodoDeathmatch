import { RemoteClient } from "./RemoteClient";

// Networking for game server

export module NetServer {

    let clients: {[id:string]:RemoteClient};
    let _onConnectionReady:(client:RemoteClient)=>void;

    export let netHooks: {[action:string]:(data:any,sender:RemoteClient)=>void} = {};

    export function init(onConnectionReady:(client:RemoteClient)=>void) {
        clients = {};
        _onConnectionReady = onConnectionReady;
    }

    export function addNetHook(action:string, func:(data:any,sender:RemoteClient)=>void ): (data:any,sender:RemoteClient)=>void {
        netHooks[action] = func;
        return func;
    }

    export function newClient(clientId:string) {
        console.log("New client "+clientId);
        clients[clientId] = new RemoteClient(clientId, _onConnectionReady);
    }

    export function onReceiveOffer(clientId:string, description:RTCSessionDescriptionInit) {
        clients[clientId].onReceiveOffer(description);
    }

    export function addIceCandidate(clientId:string, candidate:RTCIceCandidate) {
        clients[clientId].addIceCandidate(candidate);
    }

    export function broadcastReliable(action:string, data:any) {
        for (let id in clients) 
            clients[id].sendReliable(action, data);  
    }

    export function broadcastUnreliable(action:string, data:any) {
        for (let id in clients) 
            clients[id].sendUnreliable(action, data);  
    }

}