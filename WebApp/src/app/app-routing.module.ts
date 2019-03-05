import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Routes, RouterModule, PreloadAllModules} from '@angular/router';
import { TechnicalAnalysisToolComponent } from './technical-analysis-tool/technical-analysis-tool.component';
import { BrowserModule} from "@angular/platform-browser";
import {HttpClientModule} from "@angular/common/http";
import { RowComponentComponent } from './row-component/row-component.component';


const appRoutes: Routes = [

  {
    path: 'technicalAnalysis',
    component: TechnicalAnalysisToolComponent
  },
  {
  	path: 'test',
    component: RowComponentComponent
}
];

@NgModule({
  imports: [
  	BrowserModule,
  	RouterModule.forRoot(
    	appRoutes, {}),
    HttpClientModule,
    CommonModule
    
  ],
  declarations: [],
  exports: [RouterModule]
})
export class AppRoutingModule { }
