import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  console.log('interceptor called');
  const token = localStorage.getItem('auth_token');
    const cloned = req.clone({
      setHeaders:
      {
        Authorization: `Bearer ${token}`
      }
    });
  

  return next(cloned);
};
