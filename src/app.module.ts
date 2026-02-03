import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { InvoicesModule } from './invoices/invoices.module';

@Module({
  imports: [ProductsModule, InvoicesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
