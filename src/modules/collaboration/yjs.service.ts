import { Injectable } from '@nestjs/common';
import * as Y from 'yjs';
import WebSocket from 'ws';
import { IncomingMessage } from 'http';
import * as encoding from 'lib0/encoding';
import * as decoding from 'lib0/decoding';
import * as syncProtocol from 'y-protocols/sync';
import * as awarenessProtocol from 'y-protocols/awareness';

const messageSync = 0;
const messageAwareness = 1;

interface WSSharedDoc {
    doc: Y.Doc;
    awareness: awarenessProtocol.Awareness;
    conns: Map<WebSocket.WebSocket, Set<number>>;
}

@Injectable()
export class YjsService {
    private docs = new Map<string, WSSharedDoc>();

    getOrCreateDoc(docName: string): WSSharedDoc {
        if (!this.docs.has(docName)) {
            const doc = new Y.Doc();
            const awareness = new awarenessProtocol.Awareness(doc);
            const wsDoc: WSSharedDoc = {
                doc,
                awareness,
                conns: new Map(),
            };
            this.docs.set(docName, wsDoc);
        }
        return this.docs.get(docName)!;
    }

    handleConnection(ws: WebSocket.WebSocket, req: IncomingMessage) {
        const docName = req.url?.slice(1).split('?')[0] || 'default';
        const wsDoc = this.getOrCreateDoc(docName);
        const { doc, awareness, conns } = wsDoc;

        conns.set(ws, new Set());

        // Send sync step 1
        const encoder = encoding.createEncoder();
        encoding.writeVarUint(encoder, messageSync);
        syncProtocol.writeSyncStep1(encoder, doc);
        ws.send(encoding.toUint8Array(encoder));

        const awarenessStates = awareness.getStates();
        if (awarenessStates.size > 0) {
            const encoder = encoding.createEncoder();
            encoding.writeVarUint(encoder, messageAwareness);
            encoding.writeVarUint8Array(
                encoder,
                awarenessProtocol.encodeAwarenessUpdate(
                    awareness,
                    Array.from(awarenessStates.keys()),
                ),
            );
            ws.send(encoding.toUint8Array(encoder));
        }

        // Handle incoming messages
        ws.on('message', (message: Buffer) => {
            try {
                const uint8Array = new Uint8Array(message);
                const decoder = decoding.createDecoder(uint8Array);
                const messageType = decoding.readVarUint(decoder);

                const encoder = encoding.createEncoder();

                if (messageType === messageSync) {
                    encoding.writeVarUint(encoder, messageSync);
                    syncProtocol.readSyncMessage(decoder, encoder, doc, null);

                    if (encoding.length(encoder) > 1) {
                        ws.send(encoding.toUint8Array(encoder));
                    }
                } else if (messageType === messageAwareness) {
                    awarenessProtocol.applyAwarenessUpdate(
                        awareness,
                        decoding.readVarUint8Array(decoder),
                        null,
                    );
                }
            } catch (err) {
                console.error('Error processing message:', err);
            }
        });

        // Handle document updates
        const updateHandler = (update: Uint8Array, origin: any) => {
            if (origin !== ws) {
                const encoder = encoding.createEncoder();
                encoding.writeVarUint(encoder, messageSync);
                syncProtocol.writeUpdate(encoder, update);
                const message = encoding.toUint8Array(encoder);

                conns.forEach((_, client) => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(message);
                    }
                });
            }
        };

        doc.on('update', updateHandler);

        // Handle awareness updates
        const awarenessChangeHandler = (
            { added, updated, removed }: any,
            origin: any,
        ) => {
            const changedClients = added.concat(updated).concat(removed);
            const encoder = encoding.createEncoder();
            encoding.writeVarUint(encoder, messageAwareness);
            encoding.writeVarUint8Array(
                encoder,
                awarenessProtocol.encodeAwarenessUpdate(awareness, changedClients),
            );
            const message = encoding.toUint8Array(encoder);

            conns.forEach((_, client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(message);
                }
            });
        };

        awareness.on('update', awarenessChangeHandler);

        // Handle connection close
        ws.on('close', () => {
            const connControlledIds = conns.get(ws);
            if (connControlledIds) {
                connControlledIds.forEach((clientId) => {
                    (awareness as any).removeStates([clientId], null);
                });
            }

            doc.off('update', updateHandler);
            awareness.off('update', awarenessChangeHandler);
            conns.delete(ws);

            if (conns.size === 0) {
                doc.destroy();
                this.docs.delete(docName);
            }
        });

    }
}
