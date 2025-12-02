import { Injectable, OnModuleInit } from '@nestjs/common';
import * as http from 'http';
import WebSocket from 'ws';
import { YjsService } from './yjs.service';

@Injectable()
export class CollaborationGateway implements OnModuleInit {
    constructor(private readonly yjsService: YjsService) {}

    onModuleInit() {
        const server = http.createServer();
        const wss = new WebSocket.Server({ noServer: true });

        // Handle WebSocket upgrade requests
        server.on('upgrade', (request, socket, head) => {
            wss.handleUpgrade(request, socket, head, (ws) => {
                this.yjsService.handleConnection(ws, request);
            });
        });

        const PORT = 1234;
        const HOST = '0.0.0.0';
        server.listen(PORT, HOST, () => {
            console.log(`✅ Hocuspocus WebSocket server running on ws://localhost:${PORT}`);
        });
    }
}
