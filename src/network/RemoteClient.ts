import { Matchmaking } from "./Matchmaking";
import { NetServer } from "./NetServer";
import { Race } from "../Race";
import { Player } from "../world/Player";

// Used by the game server to store connections to remote clients

export class RemoteClient {
    
    static readonly ICE_URL: string = "stun:stun.l.google.com:19302";

    public rtcConnection: RTCPeerConnection;
    public unreliableDataChannel: RTCDataChannel|null = null;
    public reliableDataChannel: RTCDataChannel|null = null;
    public matchmakingId: string; // Used to tell the matchmaking server which client we're sending ice/answer to
    public race: Race;
    public player: Player|null = null;

    constructor(matchmakingId: string, onConnectionReady:(client:RemoteClient)=>void) {

        this.matchmakingId = matchmakingId;

        const config:RTCConfiguration = { iceServers: [{ urls: RemoteClient.ICE_URL }] };
        this.rtcConnection = new RTCPeerConnection(config);
        this.rtcConnection.ondatachannel = (...args:any[]) => { this.onDataChannel(args[0]); };

        this.race = new Race(2, () => {
            onConnectionReady(this);
        });
        
    }

    private onDataChannel(event:RTCDataChannelEvent) {
        console.log("Got data channel '"+event.channel.label+"'");

        switch (event.channel.label) {
            case "unreliable": {
                this.unreliableDataChannel = event.channel;
                this.unreliableDataChannel.onmessage = (...args:any[]) => { this.onUnreliableMessage(args[0]); };
                this.unreliableDataChannel.onopen = (...args:any[]) => { this.onUnreliableOpen(args[0]); };
            } break;

            case "reliable": {
                this.reliableDataChannel = event.channel;
                this.reliableDataChannel.onmessage = (...args:any[]) => { this.onReliableMessage(args[0]); };
                this.reliableDataChannel.onopen = (...args:any[]) => { this.onReliableOpen(args[0]); };
            } break;
        }
    }

    public sendUnreliable(action:string, data:any) {
        this.unreliableDataChannel?.send(JSON.stringify({
            action:action,
            data:data
        }));
    }

    public sendReliable(action:string, data:any) {
        this.reliableDataChannel?.send(JSON.stringify({
            action:action,
            data:data
        }));
    }

    private onUnreliableMessage(message:MessageEvent) {
        const data = JSON.parse(message.data);
        if (NetServer.netHooks[data.action])
            NetServer.netHooks[data.action](data.data,this);
    }

    private onReliableMessage(message:MessageEvent) {
        const data = JSON.parse(message.data);
        if (NetServer.netHooks[data.action])
            NetServer.netHooks[data.action](data.data,this);
    }

    private onUnreliableOpen(event:Event) {
        console.log("Unreliable datachannel opened");
        this.race.increment();
    }

    private onReliableOpen(event:Event) {
        console.log("Reliable datachannel opened");
        this.race.increment();
    }

    public addIceCandidate(candidate:RTCIceCandidate) {
        this.rtcConnection.addIceCandidate(candidate);
    }

    public onReceiveOffer(description:RTCSessionDescriptionInit) {
        this.rtcConnection.setRemoteDescription(description).then(() => {
            this.rtcConnection.createAnswer().then((answerDescription: RTCSessionDescriptionInit) => {
                this.onAnswerCreated(answerDescription);
            });
        });
    }

    private onAnswerCreated(description:RTCSessionDescriptionInit) {
        this.rtcConnection.setLocalDescription(description);

        Matchmaking.sendAnswer(this.matchmakingId, description);
    }


}