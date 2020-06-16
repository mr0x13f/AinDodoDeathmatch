import { Matchmaking } from "./Matchmaking";
import { Race } from "../Race";

// Networking for game client

export module NetClient {

    const ICE_URL: string = "stun:stun.l.google.com:19302";

    let rtcConnection: RTCPeerConnection;
    let unreliableDataChannel: RTCDataChannel;
    let reliableDataChannel: RTCDataChannel;
    let race: Race;

    export let netHooks: {[action:string]:(data:any)=>void} = {};

    export function init(onConnectionReady:()=>void) {
        
        const config: RTCConfiguration = { iceServers: [{ urls: ICE_URL }] };
        rtcConnection = new RTCPeerConnection(config);
        rtcConnection.onicecandidate = (...args:any[]) => { onIceCandidate(args[0]); };

        const unreliableDataChannelConfig = { ordered: false, maxRetransmits: 0 };
        unreliableDataChannel = rtcConnection.createDataChannel('unreliable', unreliableDataChannelConfig);
        unreliableDataChannel.onopen = onUnreliableOpen;
        unreliableDataChannel.onmessage = onUnreliableMessage;

        const reliableDataChannelConfig = { ordered: true };
        reliableDataChannel = rtcConnection.createDataChannel('reliable', reliableDataChannelConfig);
        reliableDataChannel.onopen = onReliableOpen;
        reliableDataChannel.onmessage = onReliableMessage;

        rtcConnection.createOffer().then(onOfferCreated);

        race = new Race(2, onConnectionReady);

    }

    export function addNetHook(action:string, func:(data:any)=>void ): (data:any)=>void {
        netHooks[action] = func;
        return func;
    }

    export function sendUnreliable(action:string, data:any) {
        unreliableDataChannel?.send(JSON.stringify({
            action:action,
            data:data
        }));
    }

    export function sendReliable(action:string, data:any) {
        reliableDataChannel?.send(JSON.stringify({
            action:action,
            data:data
        }));
    }

    function onUnreliableMessage(message:MessageEvent) {
        const data = JSON.parse(message.data);
        if (netHooks[data.action])
            netHooks[data.action](data.data);
    }

    function onReliableMessage(message:MessageEvent) {
        const data = JSON.parse(message.data);
        if (netHooks[data.action])
            netHooks[data.action](data.data);
    }

    export function onReceiveAnswer(description: RTCSessionDescriptionInit) {
        console.log("Got answer from server");
        rtcConnection.setRemoteDescription(description);
    }

    function onIceCandidate(event:RTCPeerConnectionIceEvent) {
        if (event && event.candidate)
            Matchmaking.sendIceCandidate(event.candidate);
    }

    function onUnreliableOpen() {
        console.log("Unreliable datachannel opened");
        race.increment();
    }

    function onReliableOpen() {
        console.log("Reliable datachannel opened");
        race.increment();
    }

    function onOfferCreated(description: RTCSessionDescriptionInit) {
        rtcConnection.setLocalDescription(description);
        Matchmaking.sendOffer(description);
    }

}