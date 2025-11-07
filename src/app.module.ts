import { Module } from '@nestjs/common';
import { SharedModule } from './shared/shared.module';
import { AuthModule } from './modules/auth/auth.module';
import {CollaborationModule} from "@/modules/collaboration/collaboration.module";

@Module({
  imports: [SharedModule, AuthModule, CollaborationModule],
})
export class AppModule {}
