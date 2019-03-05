import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { QuestionService } from './app.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule} from '@angular/forms';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { UiSwitchModule } from 'ngx-toggle-switch';
import { AppComponent } from './app.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { LineChartAComponent } from './line-chart-a/line-chart-a.component';
import { RowComponentComponent } from './row-component/row-component.component';
import { SectionAComponent } from './section-a/section-a.component';
import { AngularFileUploaderModule } from 'angular-file-uploader';
import { FileDropModule } from 'ngx-file-drop';
import { SectionBComponent } from './section-b/section-b.component';
import { LineChartBComponent } from './line-chart-b/line-chart-b.component';
import { SectionCComponent } from './section-c/section-c.component';
import { LineChartCComponent } from './line-chart-c/line-chart-c.component';
import { SectionDComponent } from './section-d/section-d.component';
import { LineChartDComponent } from './line-chart-d/line-chart-d.component';
import { LineChartEComponent } from './line-chart-e/line-chart-e.component';
import { SectionEComponent } from './section-e/section-e.component';
import { SectionFComponent } from './section-f/section-f.component';
import { LineChartFComponent } from './line-chart-f/line-chart-f.component';
import { LineChartGComponent } from './line-chart-g/line-chart-g.component';
import { SectionGComponent } from './section-g/section-g.component'
import { Angular2CsvModule } from 'angular2-csv';
import { AppRoutingModule } from './app-routing.module';
import { TechnicalAnalysisToolComponent } from './technical-analysis-tool/technical-analysis-tool.component';
import { RouterModule, Routes } from '@angular/router';
import { ForecastingToolComponent } from './forecasting-tool/forecasting-tool.component';
import { LineChartHComponent } from './line-chart-h/line-chart-h.component';
import { BarChartAComponent } from './bar-chart-a/bar-chart-a.component';
import { BarChartBComponent } from './bar-chart-b/bar-chart-b.component';
import { BarChartCComponent } from './bar-chart-c/bar-chart-c.component';
import { BarChartDComponent } from './bar-chart-d/bar-chart-d.component';
import { NgxLoadingModule } from 'ngx-loading';


const appRoutes: Routes = [

  {
    path: 'technicalAnalysis',
    component: TechnicalAnalysisToolComponent
  },
  {
    path: 'forecast',
    component: ForecastingToolComponent
  }
];


@NgModule({
  declarations: [
    AppComponent,
    LineChartAComponent,
    RowComponentComponent,
    SectionAComponent,
    SectionBComponent,
    LineChartBComponent,
    SectionCComponent,
    LineChartCComponent,
    SectionDComponent,
    LineChartDComponent,
    LineChartEComponent,
    SectionEComponent,
    SectionFComponent,
    LineChartFComponent,
    LineChartGComponent,
    SectionGComponent,
    TechnicalAnalysisToolComponent,
    ForecastingToolComponent,
    LineChartHComponent,
    BarChartAComponent,
    BarChartBComponent,
    BarChartCComponent,
    BarChartDComponent
   

  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    Ng4LoadingSpinnerModule.forRoot(),
    UiSwitchModule,
    NgxSpinnerModule,
    AngularFileUploaderModule,
    FileDropModule,
    Angular2CsvModule,
    AppRoutingModule,
    RouterModule.forRoot(appRoutes),
    NgxLoadingModule.forRoot({})

  ],
  providers: [
    HttpClient,
    QuestionService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
