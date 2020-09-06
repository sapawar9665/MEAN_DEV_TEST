import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from '../common.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {

  constructor(private route: ActivatedRoute, private newService: CommonService) { }
  selectedId: any;
  userData: any = {};
  url: string;
  ngOnInit(): void {
    this.selectedId = this.route.snapshot.paramMap.get('id');
    this.newService.GetUserById(this.selectedId)
      .subscribe(data => {
        this.userData = data;
        this.url = 'http://localhost:8080'+this.userData.profileUrl.split('public')[1];
      }
        , error => { })
  }



}
