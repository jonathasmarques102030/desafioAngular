import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent {
  user = {
    nome: '',
    email: '',
  };
  message: string | null = null;
  isError: boolean = false;

  constructor(private http: HttpClient, public dialog: MatDialog) {}

  onSubmit() {
    this.http.post<{ message: string }>('http://localhost:3000/adduser', this.user)
      .subscribe({
        next: (response) => {
          this.message = 'Usuário adicionado com sucesso!';
          this.isError = false;

          setTimeout(() => {
            window.location.reload()
          }, 2000)

        },
        error: (error) => {
          if (error.status === 409) {
            this.message = 'Email já registrado!';
          } else {
            this.message = 'Erro ao adicionar usuário';
          }
          this.isError = true;
          console.error('Erro ao adicionar usuário', error);
        }
      });
  }
}
