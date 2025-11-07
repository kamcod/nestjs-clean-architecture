import { Injectable, OnModuleInit } from '@nestjs/common';
import * as http from 'http';
import WebSocket from 'ws';
import { YjsService } from './yjs.service';

@Injectable()
export class CollaborationGateway implements OnModuleInit {
    constructor(private readonly yjsService: YjsService) {}

    onModuleInit() {
        const server = http.createServer();
        const wss = new WebSocket.Server({ server });

        wss.on('connection', (ws, req) => {
            this.yjsService.handleConnection(ws, req);
        });

        const PORT = 1234;
        const HOST = '0.0.0.0';
        server.listen(PORT, HOST, () => {
            console.log(`✅ Yjs Collaboration WebSocket running on ws://localhost:${PORT}`);
        });
    }
}
