import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ExtendedHttpClientModule } from 'projects/extended-http-client/src/public-api';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, ExtendedHttpClientModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
