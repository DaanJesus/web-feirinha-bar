import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import * as paperCore from 'paper/dist/paper-core';
import { Group, Path, view } from 'paper/dist/paper-core';
import { AuthService } from '../../service/auth.service';

declare var $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  formLogin: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {

    this.loadCanvas();
    this.loginForm();

  }

  loginForm() {
    this.formLogin = this.fb.group({
      email: 'adm@gmail.com',
      password: '123',
    })
  }

  async login() {

    try {

      const res = await this.authService.login(this.formLogin.value);
      this.router.navigate([''])
      
    } catch (error) {
      console.error(error);
      
    }

    /* this.authService.login(this.formLogin.value).subscribe((res: any) => {
      console.log("res: ", res);

    }, err => {
      console.log("erro: ", err);

    }) */

  }

  loadCanvas() {
    /* ====================== *
     *  Initiate Canvas       *
     * ====================== */
    paperCore.setup(document.getElementById('canvas') as HTMLCanvasElement);

    // Paper JS Variables
    var canvasWidth, canvasHeight, canvasMiddleX, canvasMiddleY;
    var shapeGroup = new Group();
    var positionArray = [];

    function getCanvasBounds() {
      // Get current canvas size
      canvasWidth = view.size.width;
      canvasHeight = view.size.height;
      canvasMiddleX = canvasWidth / 2;
      canvasMiddleY = canvasHeight / 2;
      // Set path position
      var position1 = {
        x: (canvasMiddleX / 2) + 100,
        y: 100,
      };
      var position2 = {
        x: 200,
        y: canvasMiddleY,
      };
      var position3 = {
        x: (canvasMiddleX - 50) + (canvasMiddleX / 2),
        y: 150,
      };
      var position4 = {
        x: 0,
        y: canvasMiddleY + 100,
      };
      var position5 = {
        x: canvasWidth - 130,
        y: canvasHeight - 75,
      };
      var position6 = {
        x: canvasMiddleX + 80,
        y: canvasHeight - 50,
      };
      var position7 = {
        x: canvasWidth + 60,
        y: canvasMiddleY - 50,
      };
      var position8 = {
        x: canvasMiddleX + 100,
        y: canvasMiddleY + 100,
      };
      positionArray = [position3, position2, position5, position4, position1, position6, position7, position8];
    }
    ;
    /* ====================== *
     * Create Shapes          *
     * ====================== */
    function initializeShapes() {
      // Get Canvas Bounds
      getCanvasBounds();
      var shapePathData = [
        'M231,352l445-156L600,0L452,54L331,3L0,48L231,352',
        'M0,0l64,219L29,343l535,30L478,37l-133,4L0,0z',
        'M0,65l16,138l96,107l270-2L470,0L337,4L0,65z',
        'M333,0L0,94l64,219L29,437l570-151l-196-42L333,0',
        'M331.9,3.6l-331,45l231,304l445-156l-76-196l-148,54L331.9,3.6z',
        'M389,352l92-113l195-43l0,0l0,0L445,48l-80,1L122.7,0L0,275.2L162,297L389,352',
        'M 50 100 L 300 150 L 550 50 L 750 300 L 500 250 L 300 450 L 50 100',
        'M 700 350 L 500 350 L 700 500 L 400 400 L 200 450 L 250 350 L 100 300 L 150 50 L 350 100 L 250 150 L 450 150 L 400 50 L 550 150 L 350 250 L 650 150 L 650 50 L 700 150 L 600 250 L 750 250 L 650 300 L 700 350 '
      ];
      for (var i = 0; i <= shapePathData.length; i++) {
        // Create shape
        var headerShape = new Path({
          strokeColor: 'rgba(255, 255, 255, 0.5)',
          strokeWidth: 2,
          parent: shapeGroup,
        });
        // Set path data
        headerShape.pathData = shapePathData[i];
        headerShape.scale(2);
        // Set path position
        headerShape.position = positionArray[i];
      }
    }
    ;
    initializeShapes();
    /* ====================== *
     * Animation              *
     * ====================== */
    view.onFrame = function paperOnFrame(event) {
      if (event.count % 4 === 0) {
        // Slows down frame rate
        for (var i = 0; i < shapeGroup.children.length; i++) {
          if (i % 2 === 0) {
            shapeGroup.children[i].rotate(-0.3);
          }
          else {
            shapeGroup.children[i].rotate(0.3);
          }
        }
      }
    };
    view.onResize = function paperOnResize() {
      getCanvasBounds();
      for (var i = 0; i < shapeGroup.children.length; i++) {
        shapeGroup.children[i].position = positionArray[i];
      }
      if (canvasWidth < 700) {
        shapeGroup.children[3].opacity = 0;
        shapeGroup.children[2].opacity = 0;
        shapeGroup.children[5].opacity = 0;
      }
      else {
        shapeGroup.children[3].opacity = 1;
        shapeGroup.children[2].opacity = 1;
        shapeGroup.children[5].opacity = 1;
      }
    };
  }

}
