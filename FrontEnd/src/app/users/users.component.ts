import { Component, OnInit } from '@angular/core';
import { CommonService } from '../common.service';

import { AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';



@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  displayedColumns: string[] = ['firstName', 'lastName', 'email', 'phone', 'address', 'action'];
  // tslint:disable-next-line: member-ordering
  dataSource: any = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private route:Router, private newService: CommonService, private modalService: NgbModal) { }

  Repdata;
  valbutton = "Save";
  id: any;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  selectedFile: File;

  title = 'appBootstrap';

  closeResult: string;

  ngOnInit(): void {
    this.loadData();
  }

  async loadData() {
    await this.newService.GetUser().subscribe(data => {
      this.dataSource = new MatTableDataSource<any>(data);
    });
  }

  getRecord(row) {
    console.log("ddd", row)
  }


  open(data, content, mode) {
    this.valbutton = mode;
    if (mode === 'Update') {
      this.id = data._id;
      this.firstName = data.firstName;
      this.lastName = data.lastName;
      this.phone = data.phone;
      this.email = data.email;
      this.address = data.address;
      this.valbutton = "Update";
    }
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  onSave = function (user, isValid: boolean) {
    user.mode = this.valbutton;
    this.newService.saveUser(user)
      .subscribe(data => {
        alert(data.data);
        this.fileUpload(data.value);
        this.loadData();
        // this.ngOnInit();
      }
        , error => this.errorMessage = error)

  }

  fileUpload(value) {
    console.log("-=value-=-", value)
    this.newService.uploadImage(value._id, this.selectedFile).subscribe(
      data => {
        console.log('done', data);
      }
    );
  }

  handleFileInput(file: FileList) {
    console.log("-=handleFileInput-=-=", file.item(0));
    this.selectedFile = file.item(0);
  }

  openDetail(element){
    console.log("-=element-=-=",element);
    this.route.navigate(['/details/', { id: element._id }]);
  }

  delete = function (element) {
    var result = confirm("Do you want to delete this user?");
    if (result) {
      this.newService.deleteUser(element._id)
        .subscribe(data => { alert(data.data); this.ngOnInit(); }, error => this.errorMessage = error)
    } else {
      // the user clicked cancel or closed the confirm dialog.
    }

  }

}
