import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

/**
 * Guard pour la gestion des rôles et l'accès aux routes protégées.
 * 
 * Ce guard vérifie si une route est publique ou protégée. Pour les routes protégées,
 * il valide le token JWT et vérifie si l'utilisateur a les rôles requis pour accéder à la ressource.
 * 
 * Il gère également les erreurs d'authentification et d'autorisation en lançant des exceptions appropriées.
 */
@Injectable()
export class RolesGuard implements CanActivate {

  constructor(
    private jwtService: JwtService,
    private reflector: Reflector
  ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    // Traiter le token s'il est présent
    if (token) {
      try {
        const payload = await this.jwtService.verifyAsync(token, {
          secret: process.env.JWT_SECRET,
        });

        // Attach user payload to the request object
        request['user'] = payload;
      } catch (e) {
        console.warn('Invalid or expired token received:', e.message); // Log for debugging
      }
    }

    // Vérifier si la route est publique  
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Si la route est publique, permettre l'accès sans autre vérification
    if (isPublic) {
      return true;
    }

    // Si la route est protégée, vérifier si un token est présent

    // Si la route est protégée, et le token est absent, refuser l'accès
    if (!token) {
      throw new UnauthorizedException('Token manquant.');
    }

    // Si la route est protégée, et l'utilisateur n'est pas attaché, refuser l'accès
    if (!request['user']) {
      throw new UnauthorizedException('Invalide ou token expiré.');
    }

    // Vérifier les rôles requis pour la route protégée
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );

    // Vérifier si les rôles sont définis pour cette route protégée
    if (requiredRoles && requiredRoles.length > 0) {
      // Vérifier si l'utilisateur a un rôle défini
      if (!request['user'].role) {
        throw new UnauthorizedException('Permission refusée: rôle utilisateur non défini.');
      }
      if (!requiredRoles.includes(request['user'].role)) {
        throw new UnauthorizedException('Permission refusée: accès non autorisé.');
      }
    }

    // Si toutes les vérifications sont passées, permettre l'accès
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}