import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { filter } from 'rxjs/operators';
import * as moment from 'moment'

declare var $: any;
@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

    routes = [
        { path: 'Financeiro', icon: 'bx bx-money', link: '/dash-financeiro' },
        { path: 'Performance', icon: 'bx bx-trending-up', link: '/dash-performance' },
        { path: 'Configuração', icon: 'bx bx-cog', link: '/form-relatorio' }
    ];

    user: any = {};
    activeLink: any;
    hour: string;
    nome_foto: any;
    color: any;
    letters = '0123456789ABCDEF';

    constructor(
        private route: Router,
        private authService: AuthService,
        private snackBar: MatSnackBar,
    ) {
        route.events.pipe(
            filter(event => event instanceof NavigationEnd)
        ).subscribe(event => {
            this.activeLink = event;
        });
    }

    ngOnInit() {

        this.authService.getObjectUser().then(user => {

            this.user = user.user
            this.geraNomeFoto()

        })

        $(document).ready(function (e) {
            $('#btn').on('click', function () {
                $(".sidebar").toggleClass("active");
            })
        })

        setInterval(() => {
            this.hour = moment().format("HH:mm:ss");
        }, 100)

    }

    setColorFoto() {
        this.color = '#';
        for (var i = 0; i < 6; i++) {
            this.color += this.letters[Math.floor(Math.random() * 16)];
        };
    }

    geraNomeFoto() {

        if (this.user.name) {

            let array = this.user.name.split(' ')

            if (array.length > 1) {
                this.nome_foto = array[0].slice(0, 1) + array[1].slice(0, 1)
            } else {
                this.nome_foto = array[0].slice(0, 2)
            }
        }

    }

    currentRoute(link: string): string {

        switch (link) {
            case '/dash-performance': return 'INDICADORES DE PERFORMANCE';
            case '/form-relatorio': return 'CONFIGURAÇÃO'
            default: return `RELATÓRIO COLABORADOR(A) - ${this.user.name}`;
        }
    }

    ngOnDestroy() {

        localStorage.clear();

        this.snackBar.open('Saindo...', "X", {
            duration: 2000
        })

        setTimeout(() => {
            window.location.reload()
        }, 1000)
    }

}
