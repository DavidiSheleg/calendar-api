import { CanActivate, ExecutionContext, mixin, Type, UnauthorizedException } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';

const PermissionGuard = (): Type<CanActivate> => {
    class PermissionGuardMixin extends JwtAuthGuard {
        async canActivate(context: ExecutionContext) {
            await super.canActivate(context);

            const request = context.switchToHttp().getRequest();
            const { user } = request;
            const { params } = request;

            if (parseInt(params?.userId,10) !== user.id)
                throw new UnauthorizedException();

            return user;
        }
    }

    return mixin(PermissionGuardMixin);
}

export default PermissionGuard;