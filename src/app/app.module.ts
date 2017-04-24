import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { TJsonViewerComponent } from './t-json-viewer.component/t-json-viewer.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {DndModule} from 'ng2-dnd';

import { AppComponent } from './app.component';
import { TJsonViewerSourceComponent } from './t-json-viewer-source.component/t-json-viewer-source.component';

@NgModule({
  declarations: [
    AppComponent,
    TJsonViewerComponent,
    TJsonViewerSourceComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    NgbModule.forRoot(),
    DndModule.forRoot()
  ],
  exports: [DndModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
