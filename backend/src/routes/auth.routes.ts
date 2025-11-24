import { Router } from 'express';
import passport from '../config/passport';
import { isAuthenticated, AuthenticatedRequest } from '../middleware/auth.middleware';

const router = Router();

// Iniciar autenticación con Google
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
);

// Callback de Google OAuth
router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=auth_failed`,
  }),
  (_req, res) => {
    // Autenticación exitosa, redirigir al frontend
    res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
  }
);

// Obtener usuario actual
router.get('/me', isAuthenticated, (req: AuthenticatedRequest, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});

// Cerrar sesión
router.post('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.json({
      success: true,
      message: 'Sesión cerrada exitosamente',
    });
  });
});

// Verificar estado de autenticación
router.get('/status', (req, res) => {
  res.json({
    success: true,
    authenticated: req.isAuthenticated(),
    user: req.isAuthenticated() ? req.user : null,
  });
});

export default router;

