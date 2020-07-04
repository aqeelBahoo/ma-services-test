import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { HttpService } from 'src/app/services/http.service';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

export interface IEmployees {
  employee_age: string;
  employee_name: number;
  employee_salary: number;
  id?: string;
  profile_image: string;
}

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss']
})

export class EmployeesComponent {
  public isReqPending: boolean;
  public displayedColumns: string[] = ['moreOptions', 'Id', 'Employee Name', 'Employee Age', 'Employee Salary', 'Profile Image'];
  public dataSource = new MatTableDataSource<IEmployees[]>([]);
  public formGroup: FormGroup;
  public isEditMode: boolean;
  public selectedRow;

  constructor(private httpService: HttpService, private formBuilder: FormBuilder) {
    this.getEmployees();
    this.formGroup = this.formBuilder.group({
      employee_age: ['', [Validators.required,]],
      employee_name: ['', [Validators.required,]],
      employee_salary: ['', [Validators.required,]],
      profile_image: ['',],
    });
  }

  private getEmployees() {
    this.isReqPending = true;
    this.httpService.employees().subscribe(({ data }) => {
      this.isReqPending = false;
      if (data.length) {
        this.dataSource.data = data;
      }
    }, _ => {
      this.isReqPending = false;
    });
  }

  public add() {
    if (this.formGroup.invalid) {
      return;
    }
    const values = this.formGroup.value;
    if (this.selectedRow) {
      const data: {
        name: string,
        salary: number,
        age: number,
        id?: string
      } = { "name": values.employee_name, "salary": values.employee_salary, "age": values.employee_age };
      data.id = this.selectedRow.id;
      this.httpService.update(data).subscribe(() => {
        this.getEmployees();
        this.clear();
      });
    }
    else {
      const data = { "name": values.employee_name, "salary": values.employee_salary, "age": values.employee_age };
      this.httpService.add(data).subscribe(() => {
        this.getEmployees();
        this.clear();
      });
    }
  }


  public edit(row) {
    this.selectedRow = row;
    this.isEditMode = true;
    this.formGroup.setValue({
      employee_age: row.employee_age,
      employee_name: row.employee_name,
      employee_salary: row.employee_salary,
      profile_image: row.profile_image,
    });
  }

  public delete(row) {
    this.httpService.delete(row).subscribe(() => {
      this.getEmployees();
    });
  }

  public clear() {
    this.isEditMode = false;
    this.selectedRow = undefined;
    this.formGroup.reset();
  }

  public applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
