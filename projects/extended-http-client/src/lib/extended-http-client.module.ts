import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ExtendedHttpClientComponent } from './extended-http-client.component';
import { ExtendedHttpClientService } from './extended-http-client.service';

@NgModule({
  declarations: [ExtendedHttpClientComponent],
  imports: [HttpClientModule],
  exports: [ExtendedHttpClientComponent],
  providers: [ExtendedHttpClientService],
})
export class ExtendedHttpClientModule {}
