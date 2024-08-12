import { TestBed, ComponentFixture } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { FormComponent } from './form.component';

describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;
  let httpMock: HttpTestingController;
  let dialog: MatDialog;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormComponent],
      imports: [
        HttpClientTestingModule,
        MatDialogModule,
        FormsModule
      ],
      providers: [MatDialog]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    dialog = TestBed.inject(MatDialog);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('Deve ser criado o componente de formulário', () => {
    expect(component).toBeTruthy();
  });

  it('Deve ser renderizado o formulário com um valor incial', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('#nome').value).toBe('');
    expect(compiled.querySelector('#email').value).toBe('');
    expect(compiled.querySelector('.submit-button').disabled).toBeTruthy();
  });

  it('Deve ativar o botão enviar quando o formulário for válido', () => {
    component.user.nome = 'Jonathas';
    component.user.email = 'jonathasmail@mail.com';
    fixture.detectChanges();

    const submitButton = fixture.debugElement.query(By.css('.submit-button')).nativeElement;
    expect(submitButton.disabled).toBeFalsy();
  });

  it('Deve chamar o método onSubmit quando o formulário for enviado', () => {
    spyOn(component, 'onSubmit');

    component.user.nome = 'Jonathas';
    component.user.email = 'jonathasmail@mail.com';
    fixture.detectChanges();

    const form = fixture.debugElement.query(By.css('form'));
    form.triggerEventHandler('ngSubmit', null);

    expect(component.onSubmit).toHaveBeenCalled();
  });

  it('Deve exibir mensagem de sucesso no envio bem-sucedido', () => {
    component.user.nome = 'Jonathas';
    component.user.email = 'jonathasmail@mail.com';

    component.onSubmit();

    const req = httpMock.expectOne('http://localhost:3000/adduser');
    expect(req.request.method).toBe('POST');
    req.flush({ message: 'Usuário adicionado com sucesso!' });

    fixture.detectChanges();

    const messageElement = fixture.debugElement.query(By.css('.message')).nativeElement;
    expect(messageElement.textContent).toContain('Usuário adicionado com sucesso!');
    expect(messageElement.classList).toContain('success');
  });

  it('Deve exibir mensagem de erro em caso de erro', () => {
    component.user.nome = 'Jonathas';
    component.user.email = 'jonathasmail@mail.com';

    component.onSubmit();

    const req = httpMock.expectOne('http://localhost:3000/adduser');
    expect(req.request.method).toBe('POST');
    req.flush({ message: 'Erro ao adicionar usuário' }, { status: 500, statusText: 'Server Error' });

    fixture.detectChanges();

    const messageElement = fixture.debugElement.query(By.css('.message')).nativeElement;
    expect(messageElement.textContent).toContain('Erro ao adicionar usuário');
    expect(messageElement.classList).toContain('error');
  });
});
