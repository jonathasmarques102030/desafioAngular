import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserTableComponent } from './user-table.component';
import { By } from '@angular/platform-browser';

describe('UserTableComponent', () => {
  let component: UserTableComponent;
  let fixture: ComponentFixture<UserTableComponent>;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserTableComponent ],
      imports: [ HttpClientTestingModule ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserTableComponent);
    component = fixture.componentInstance;
    httpTestingController = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('Deve ser criado', () => {
    expect(component).toBeTruthy();
  });

  it('Deve carregar os usuários no início', () => {
    const mockUsers = [
      { id: 1, nome: 'Jonathas', email: 'jonathas@mail.com' },
      { id: 2, nome: 'Gabriel', email: 'gabriel@mail.com' }
    ];

    const req = httpTestingController.expectOne('http://localhost:3000/users');
    expect(req.request.method).toEqual('GET');
    req.flush(mockUsers);

    fixture.detectChanges();

    const rows = fixture.debugElement.queryAll(By.css('.styled-table tbody tr'));
    expect(rows.length).toBe(2);
    expect(rows[0].nativeElement.textContent).toContain('Jonathas');
    expect(rows[0].nativeElement.textContent).toContain('jonathas@mail.com');
    expect(rows[1].nativeElement.textContent).toContain('Gabriel');
    expect(rows[1].nativeElement.textContent).toContain('gabriel@mail.com');
  });

  it('Deve deletar os usuários da lista', () => {
    const mockUsers = [
      { id: 1, nome: 'Jonathas', email: 'jonathas@mail.com' },
      { id: 2, nome: 'Gabriel', email: 'gabriel@mail.com' }
    ];

    let req = httpTestingController.expectOne('http://localhost:3000/users');
    req.flush(mockUsers);
    fixture.detectChanges();

    component.deleteUser(1);
    req = httpTestingController.expectOne('http://localhost:3000/users/1');
    expect(req.request.method).toEqual('DELETE');
    req.flush({});

    req = httpTestingController.expectOne('http://localhost:3000/users');
    req.flush(mockUsers.slice(1));
    fixture.detectChanges();

    const rows = fixture.debugElement.queryAll(By.css('.styled-table tbody tr'));
    expect(rows.length).toBe(1);
    expect(rows[0].nativeElement.textContent).toContain('Gabriel');
    expect(rows[0].nativeElement.textContent).toContain('gabriel@mail.com');
  });
});
