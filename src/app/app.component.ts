import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormControl,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { StudentService } from './services/student.service';
import { IStudent } from './models/Student.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [HttpClient],
})
export class AppComponent implements OnInit {
  studentForm: FormGroup;
  students: IStudent[] = [];
  selectedStudent: IStudent | null = null;
  isFormSubmitted = false;

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private toastService: ToastrService
  ) {
    this.studentForm = this.fb.group(
      {
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required],
        confirm_password: ['', Validators.required], // Add confirm_password field to form group
      },
      { validator: this.passwordMatchValidator }
    ); // Apply custom validator
  }

  ngOnInit(): void {
    this.getAllStudents();
  }

  // Custom validator function to compare password and confirm_password fields
  passwordMatchValidator(g: FormGroup) {
    const password = g.get('password') as FormControl;
    const confirm_password = g.get('confirm_password') as FormControl;
    return password.value === confirm_password.value
      ? null
      : { mismatch: true };
  }

  resetForm() {
    this.studentForm.reset();
  }

  // create student
  onSubmit() {
    this.isFormSubmitted = true;
    if (this.studentForm.valid) {
      if (this.selectedStudent && this.selectedStudent) {
        this.studentService
          .updateStudent(this.selectedStudent._id, this.studentForm.value)
          .subscribe((res) => {
            console.log(res);
            this.toastService.success('student updated successfully');
            this.resetForm();
            this.getAllStudents();
            window.location.reload();
          });
      } else {
        this.studentService
          .createStudent(this.studentForm.value)
          .subscribe((res) => {
            console.log(res);
            this.toastService.success('student created successfully');
            this.resetForm();
            this.getAllStudents();
            window.location.reload();
          });
      }
    } else {
      this.studentForm.markAllAsTouched();
    }
  }

  getAllStudents() {
    const studentsComponent = this;
    this.studentService.getAllStudent().subscribe((res) => {
      console.log(res.data);
      this.students = res.data;
    });
  }

  delete(id: string) {
    this.studentService.deleteStudent(id).subscribe((res) => {
      this.toastService.success(res.message);
      this.getAllStudents();
    });
  }

  // Method to handle editing a student
  editStudent(student: IStudent) {
    this.selectedStudent = student;
    this.studentForm.patchValue({
      name: student.name,
      email: student.email,
      password: student.password,
      confirm_password: '',
    });
  }

  // Method to disable the submit button when the form is invalid or confirm_password doesn't match
  isSubmitDisabled() {
    const confirm_passwordControl = this.studentForm.get('confirm_password');
    return (
      this.studentForm.invalid ||
      (this.studentForm.hasError('mismatch') &&
        confirm_passwordControl &&
        confirm_passwordControl.touched) ||
      this.isFormSubmitted
    );
  }
}
