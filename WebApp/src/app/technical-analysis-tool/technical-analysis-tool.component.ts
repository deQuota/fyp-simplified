import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {QuestionService} from '../app.service';
import {Ng4LoadingSpinnerService} from 'ng4-loading-spinner';
import {NgxSpinnerService} from 'ngx-spinner';
import * as Chartist from 'chartist';
import * as moment from 'moment';
import { UploadEvent, UploadFile, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import * as chartist2image from 'chartist-to-image';

@Component({
  selector: 'app-technical-analysis-tool',
  templateUrl: './technical-analysis-tool.component.html',
  styleUrls: ['./technical-analysis-tool.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class TechnicalAnalysisToolComponent implements OnInit {

  coptions = {
    fieldSeparator: ','
  };

 chartist2image:any;
 relativePath = 'Drop files here';
 uploaded = true;
 buttonStatus = 'Upload';
 fileKey = 'all_forecasts.csv';
 selectedFile: File;
 public files: UploadFile[] = [];

  constructor(
    private questionService: QuestionService,
    private spinner: NgxSpinnerService) {

  }

  ngOnInit() {

  }
  async upload() {
    this.buttonStatus = 'Uploading...';
    this.spinner.show();
    const file = this.selectedFile;
    await this.questionService.uploadfile(file).then((res) => {
      this.uploaded = res['status']; this.spinner.hide()
      this.fileKey = res['data']['Key'];
      this.uploaded = true;
      this.buttonStatus = 'Upload';
    });
  }
  public dropped(event: UploadEvent) {
    this.files = event.files;
    this.uploaded = false;
    for (const droppedFile of event.files) {
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          console.log(droppedFile.relativePath, file);
          this.relativePath = droppedFile.relativePath;
          this.selectedFile = file;
        });
      } else {
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        console.log(droppedFile.relativePath, fileEntry);
      }
    }
  }
 
  public fileOver(event){
    console.log(event);
  }
 
  public fileLeave(event){
    console.log(event);
  }

   async genImage(){
    let options = {
  outputImage: {
    quality: 1.00,
    bgcolor: '#ffffff',
    name: 'test'
  },
  format: 'jpeg',
  download: true,
  log: true,

  }
  let base64;
  this.chartist2image = chartist2image;
  await chartist2image.toJpeg('sections',options).then(
  (res) => {
    base64 = res;
    console.log('Logged >>>>>>>>',base64);
  }
);
}

}
