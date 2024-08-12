import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.css']
})
export class UserTableComponent implements OnInit {
  users: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.http.get<any[]>('http://localhost:3000/users').subscribe({
      next: (data) => {
        this.users = data;
      },
      error: (err) => {
        console.error('Erro ao buscar usuários', err);
      }
    });
  }

  deleteUser(id: number): void {
    this.http.delete(`http://localhost:3000/users/${id}`).subscribe({
      next: () => {
        console.log('Usuário deletado com sucesso!');
        this.loadUsers();
      },
      error: (err) => {
        console.error('Erro ao deletar usuário', err);
      }
    });
  }
}
