import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Hocuspocus } from '@hocuspocus/server';
import { IncomingMessage } from 'http';
import WebSocket from 'ws';

@Injectable()
export class YjsService implements OnModuleInit, OnModuleDestroy {
    private hocuspocus: Hocuspocus;

    async onModuleInit() {
        this.hocuspocus = new Hocuspocus({
            name: 'hocuspocus-nestjs',

            // Optional: Add persistence with a database
            // extensions: [
            //     new Database({
            //         fetch: async ({ documentName }) => {
            //             // Load document from your database
            //             return null;
            //         },
            //         store: async ({ documentName, state }) => {
            //             // Save document to your database
            //         },
            //     }),
            // ],

            // Lifecycle hooks
            async onConnect(data) {
                console.log(`Client connected to document: ${data.documentName}`);
                console.log(`Total connections: ${data.instance.getConnectionsCount()}`);
            },

            async onDisconnect(data) {
                console.log(`Client disconnected from: ${data.documentName}`);
            },

            async onChange(data) {
                console.log(`Document changed: ${data.documentName}`);
                // You can persist changes here
            },

            async onDestroy() {
                console.log(`Document destroyed`);
            },

            // Optional: Authentication
            // async onAuthenticate(data) {
            //     const { token } = data;
            //     // Validate token and return user data
            //     return {
            //         user: {
            //             id: '123',
            //             name: 'John Doe',
            //         },
            //     };
            // },
        });

        console.log('Hocuspocus initialized');
    }

    async onModuleDestroy() {
        if (this.hocuspocus) {
            this.hocuspocus.closeConnections();
            console.log('Hocuspocus connections closed');
        }
    }

    handleConnection(ws: WebSocket, request: IncomingMessage) {
        this.hocuspocus.handleConnection(ws, request);
    }

    getInstance(): Hocuspocus {
        return this.hocuspocus;
    }
}
