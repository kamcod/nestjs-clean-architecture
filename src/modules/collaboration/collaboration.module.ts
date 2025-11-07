import { Module } from '@nestjs/common';
import { YjsService } from './yjs.service';
import { CollaborationGateway } from './collaboration.gateway';

@Module({
    providers: [YjsService, CollaborationGateway],
})
export class CollaborationModule {}
