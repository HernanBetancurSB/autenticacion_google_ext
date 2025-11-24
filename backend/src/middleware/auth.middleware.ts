import { Request, Response, NextFunction } from 'express';

export interface AuthenticatedRequest extends Request {
  user?: any;
}

export const isAuthenticated = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.isAuthenticated()) {
    return next();
  }
  
  return res.status(401).json({
    success: false,
    message: 'No autenticado. Por favor, inicie sesión.',
  });
};

export const checkUserRole = (allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'No autenticado',
      });
    }

    if (allowedRoles.includes(req.user.role)) {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: 'No tiene permisos para acceder a este recurso',
    });
  };
};

