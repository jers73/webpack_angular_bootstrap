import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    bootstrap: [ AppComponent ],
    declarations: [ AppComponent ],
    imports: [
        BrowserModule,
        NgbModule.forRoot()
    ],
    providers: [ ]
})
export class AppModule {}
