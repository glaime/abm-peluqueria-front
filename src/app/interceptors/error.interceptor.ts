import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, throwError } from 'rxjs';
import { OMITIR_ERROR_GLOBAL } from './http-context-tokens';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const snackBar = inject(MatSnackBar);

  return next(req).pipe(
    catchError((httpError) => {
      if (req.context.get(OMITIR_ERROR_GLOBAL)) {
        return throwError(() => httpError);
      }

      let mensaje = 'Ocurrió un error inesperado';

      if (httpError.error?.message) {
        mensaje = httpError.error.message;
      } else if (httpError.status === 404) {
        mensaje = 'Recurso no encontrado';
      } else if (httpError.status === 409) {
        mensaje = 'El recurso ya existe o está en conflicto';
      } else if (httpError.status === 500) {
        mensaje = 'Error interno del servidor';
      } else if (httpError.status === 0) {
        mensaje = 'No se pudo conectar con el servidor';
      }

      snackBar.open(mensaje, 'Cerrar', {
        duration: 5000,
        panelClass: ['snackbar-error'],
      });

      return throwError(() => httpError);
    })
  );
};
