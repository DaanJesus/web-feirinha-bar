import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Chart } from 'chart.js';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, min, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/service/auth.service';

export interface UserData {
  id: string;
  name: string;
  progress: string;
  fruit: string;
}

/** Constants used to fill up our data base. */
const FRUITS: string[] = [
  'blueberry', 'lychee', 'kiwi', 'mango', 'peach', 'lime', 'pomegranate', 'pineapple'
];
const NAMES: string[] = [
  'Maia', 'Asher', 'Olivia', 'Atticus', 'Amelia', 'Jack', 'Charlotte', 'Theodore', 'Isla', 'Oliver',
  'Isabella', 'Jasper', 'Cora', 'Levi', 'Violet', 'Arthur', 'Mia', 'Thomas', 'Elizabeth'
];

@Component({
  selector: 'app-financeiro',
  templateUrl: './financeiro.component.html',
  styleUrls: ['./financeiro.component.css']
})
export class FinanceiroComponent implements OnInit, AfterViewInit, OnDestroy {

  displayedColumns: string[] = ['id', 'progress', 'name', 'fruit'];
  dataSource: MatTableDataSource<UserData>;

  searchTerm = new Subject<string>();
  pagamento_total: any;
  adiantamento: any;
  vr: any;
  vt: any;
  gorjeta: any;
  userObject: any = {
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  @ViewChild('myCanvas', { static: false }) myCanvas: ElementRef;

  constructor(
    private authService: AuthService
  ) {
    this.searchTerm.pipe(
      debounceTime(800),
      distinctUntilChanged(),
      tap(value => {
        this.applyFilter(value)
      })
    ).subscribe()

    this.authService.getObjectUser().then(user => {
      this.formatValues(user.user)
      this.userObject = user.user
    })

  }

  ngOnInit(): void {

    const users = Array.from({ length: 100 }, (_, k) => this.createNewUser(k + 1));

    this.dataSource = new MatTableDataSource(users);

    const DATA_COUNT = 7;
    const NUMBER_CFG = [];
    for (let index = 0; index < DATA_COUNT; index++) {
      NUMBER_CFG.push(Math.random() * (0 + 100))
    }

    new Chart('myCanvas', {
      type: 'bar',
      data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
          label: '# of Votes',
          data: NUMBER_CFG,
          backgroundColor:
            'rgba(7, 81, 160)'
        }]
      },
      options: {

      }
    });

  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy() {
    this.searchTerm.unsubscribe();
    /* this.userService.event.observers.pop(); */
  }

  applyFilter(event: string) {

    console.log(event);

    const filterValue = event;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  createNewUser(id: number): UserData {
    const name = NAMES[Math.round(Math.random() * (NAMES.length - 1))] + ' ' +
      NAMES[Math.round(Math.random() * (NAMES.length - 1))].charAt(0) + '.';

    return {
      id: id.toString(),
      name: name,
      progress: Math.round(Math.random() * 100).toString(),
      fruit: FRUITS[Math.round(Math.random() * (FRUITS.length - 1))]
    };

  }

  formatValues(user: any) {

    const base = user.salario_base.replace('.', '').replace(',', '.')
    const vr = user.vr.replace('.', '').replace(',', '.')
    const vt = user.vt.replace('.', '').replace(',', '.')
    var gorjeta = 0;

    user.gorjeta.forEach(element => {
      element.value.replace('.', '').replace(',', '.')
      gorjeta += parseFloat(element.value)
    });

    this.gorjeta = gorjeta.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

    const adiantamento = ((parseFloat(base) / 100) * 40);
    this.adiantamento = adiantamento.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    this.vr = parseFloat(vr).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    this.vt = parseFloat(vt).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

    this.pagamento_total = parseFloat(vr) + parseFloat(vt) + parseFloat(base)
    this.pagamento_total = this.pagamento_total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  }
}