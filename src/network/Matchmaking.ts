import { NetServer } from "./NetServer";
import { NetClient } from "./NetClient";

// Handles communication with the matchmaking server

export module Matchmaking {

    const SERVER_URL = "ws://localhost:42069";

    let webSocket: WebSocket;
    export let connected = false;

    let _onInit:()=>void = () => {};
    let _onFail:()=>void = () => {};
    let _onClosed:()=>void = () => {};
    export function init(onInit:()=>void, onFail:()=>void, onClosed:()=>void) {
        
        webSocket = new WebSocket(SERVER_URL);
        webSocket.onopen = onOpen;
        webSocket.onclose = onClose;

        _onInit = onInit;
        _onFail = onFail;
        _onClosed = onClosed;

    }

    let _onJoinSuccess:()=>void = () => {};
    let _onJoinFail:(message:string)=>void = () => {};
    export function join(name:string, onJoinSucces:()=>void, onJoinFail:(message:string)=>void) {
        _onJoinSuccess = onJoinSucces;
        _onJoinFail = onJoinFail;

        send("join", {
            "serverName": name
        });
    }

    let _onRegisterSuccess: ()=>void = () => {};
    let _onRegisterFail: (message:string)=>void = () => {};
    export function registerServer(name: string, onRegisterSuccess:()=>void, onRegisterFail:(message:string)=>void) {
        _onRegisterSuccess = onRegisterSuccess;
        _onRegisterFail = onRegisterFail;

        send("registerServer", {
            "serverName": name
        });
    }

    let _onReceiveServers: (servers:string[]) => void = () => {};
    export function listServers(onReceiveServers: (servers:string[]) => void) {
        _onReceiveServers = onReceiveServers;

        send("listServers");
    }

    export function sendIceCandidate(candidate:RTCIceCandidate ) {
        send("ice", {
            "candidate": candidate
        });
    }

    export function sendOffer(description:RTCSessionDescriptionInit) {
        send("offer", {
            "offer": description
        });
    }

    export function sendAnswer(clientId:string, description:RTCSessionDescriptionInit) {
        send("answer", {
            "clientId": clientId,
            "answer": description 
        });    
    }

    function onOpen() {
        webSocket.onmessage = onReceive;
        console.log("Connected to matchmaking server");
        connected = true;
        _onInit();
    }

    function onClose() {
        console.log("Lost connection to matchmaking server");

        if (connected)
            _onClosed();
        else
            _onFail();
        
    }

    function onReceive(this: WebSocket, ev: MessageEvent) {

        const json = JSON.parse(ev.data);
        const action = json.action;
        const data = json.data;
        const error = json.error;
        const message = json.message;

        if (error) {
            onError(message, action);
            return;
        }
        
        onMessage(action, data);
    }

    function onMessage(action:string, data:any) {

        switch (action) {

            case "listServers": {
                _onReceiveServers(data.servers);
            } break;

            case "registerServerSuccess": {
                _onRegisterSuccess();
            } break;

            case "joinSuccess": {
                _onJoinSuccess();
            } break;

            case "newClient": {
                NetServer.newClient(data.clientId);
            } break;

            case "ice": {
                NetServer.addIceCandidate(data.clientId, data.candidate);
            } break;

            case "offer": {
                NetServer.onReceiveOffer(data.clientId, data.offer);
            } break;

            case "answer": {
                NetClient.onReceiveAnswer(data.answer);
            } break;
            
        }

    }

    function onError(message:string, action:string) {

        console.log("MATCHMAKING ERROR: "+message);

        if (action == "registerServerError") {
            _onRegisterFail(message);
        }

        switch (action) {
            case "registerServerError": {
                _onRegisterFail(message);
            } break;
            case "joinError": {
                _onJoinFail(message);
            } break;
        }

    }

    function send(action: string, data?: any|null) {
        webSocket.send(JSON.stringify({
            action: action,
            data: data || {}
        }));
    }

}