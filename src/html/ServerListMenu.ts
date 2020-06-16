import { Matchmaking } from "../network/Matchmaking";
import { HtmlUtil } from "./HtmlUtil";
import { HostMenu } from "./HostMenu";
import { SettingsMenu } from "./SettingsMenu";
import { GameMenu } from "./GameMenu";
import { JoiningMenu } from "./JoiningMenu";

export module ServerListMenu {
 
    let serverListElement: HTMLUListElement;
    let refreshButton: HTMLButtonElement;
    let hostButton: HTMLButtonElement;
    let settingsButton: HTMLButtonElement;

    export function show() {

        HtmlUtil.showElement("join-section");

        getElements();
        
        refreshButton.onclick = getServers;
        hostButton.onclick = host;
        settingsButton.onclick = settings;

        refreshButton.disabled = !Matchmaking.connected;
        hostButton.disabled = !Matchmaking.connected;

        setServerMessage("Connecting to matchmaking server...");

        if (!Matchmaking.connected)
            Matchmaking.init(() => {
                // Success
                refreshButton.disabled = false;
                hostButton.disabled = false;
                getServers();
            }, () => {
                // Fail
                setServerMessage("Failed to connect to matchmaking server");
            }, () => {
                // Connection lost
                window.alert("Lost connection to matchmaking server");
                location.reload();
            });
        else {
            getServers();
        }
        
    }

    function hide() {
        HtmlUtil.hideElement("join-section");
    }

    function getElements() {
        serverListElement = <HTMLUListElement> document.getElementById("server-list");
        refreshButton = <HTMLButtonElement> document.getElementById("refresh-button");
        hostButton = <HTMLButtonElement> document.getElementById("host-button");
        settingsButton = <HTMLButtonElement> document.getElementById("settings-button");
    }
    

    function getServers() {

        HtmlUtil.clearChildren(serverListElement);
        setServerMessage("Retrieving server list...");
    
        Matchmaking.listServers((servers) => {
    
            if (servers.length == 0)
                setServerMessage("No servers found");
            else {
                HtmlUtil.clearChildren(serverListElement);
                for (let server of servers) 
                    addServer(server);
            }
        });
    
    
    }
    
    function addServer(server:string) {
        let listItem = document.createElement("LI");
        listItem.classList.add("list-group-item");
        listItem.innerText = server;
    
        let joinButton = document.createElement("BUTTON");
        joinButton.classList.add("btn","btn-primary","btn-sm","right","smol");
        joinButton.innerText = "Join";
        joinButton.onclick = () => {
            joinServer(server);
        }
        listItem.appendChild(joinButton);
    
        serverListElement.appendChild(listItem);
    }
    
    function setServerMessage(message:string) {
        HtmlUtil.clearChildren(serverListElement);
        let listItem = document.createElement("LI");
        listItem.classList.add("list-group-item");
        listItem.innerText = message; 
        serverListElement.appendChild(listItem);
    }
    
    function joinServer(server:string) {
        
        console.log("Joining "+server)
        Matchmaking.join(server, () => {
            // Join success
            JoiningMenu.show();
            hide();
        }, (message) => {
            // Join Fail
            window.alert("Failed to join server: "+message);
        });
    
    }

    function host() {
        hide()
        HostMenu.show();
    }

    function settings() {
        hide()
        SettingsMenu.show();
    }

}