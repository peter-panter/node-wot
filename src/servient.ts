/// <reference path="protocols/protocol-client.ts"  />
/// <reference path="protocols/protocol-server.ts"  />

import ServedThing from './servedthing';
import WoTImpl from './wot-impl';
import ThingDescription from './td/thingdescription'
import * as TD from './td/thingdescription'
//import {Dictionary} from 'typescript-collections' //seems TS2.1 still does not polyfill ES6 Map for ES5
import * as Helpers from './helpers'


export default class Servient {
    private servers: Array<ProtocolServer> = [];
    private clientFactories: Map<string, ProtocolClientFactory> = new Map<string, ProtocolClientFactory>();
    private things: Map<string, ServedThing> = new Map<string, ServedThing>();

    public chooseLink(links: Array<TD.TDInteractionLink>): string {
        // some way choosing a link
        return (links.length > 0) ? links[0].href : "nope://none";
    }

    public addServer(server: ProtocolServer): boolean {
        this.servers.push(server);
        return true;
    }

    public addClientFactory(clientFactory: ProtocolClientFactory): boolean {
        for (let scheme in clientFactory.getSchemes()) {
            this.clientFactories.set(scheme, clientFactory);
        }
        return true;
    }

    public hasClientFor(scheme: string) : boolean {
        return this.clientFactories.has(scheme);
    }

    public getClientFor(scheme: string): ProtocolClient {
        if(this.clientFactories.has(scheme))
            return this.clientFactories.get(scheme).getClient();
        else
            return null;
    }

    public getClientSchemes() : string[] {
        return [...this.clientFactories.keys()];
    }

    public addThingFromTD(thing: ThingDescription): boolean {
        return false;
    }


    public addThing(thing: ServedThing): boolean {
        if (!this.things.has(thing.name)) {
            this.things.set(thing.name, thing);
            return true
        } else
            return false
    }

    public getThing(name: string): ServedThing {
        if (this.things.has(name)) {
            return this.things.get(name);
        } else return null;
    }

    //will return WoT object
    public start(): WoT.WoTFactory {
        this.servers.forEach((server) => server.start());
        this.clientFactories.forEach((clientFactory) => clientFactory.init());
        // Clients are to be created / started when a ConsumedThing is created
        return new WoTImpl(this);
    }

    public shutdown(): void {
        this.clientFactories.forEach((clientFactory) => clientFactory.destroy());
        this.servers.forEach((server) => server.stop());
    }
}
