import { Injectable, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    if (err) {
      console.error("JWT Auth Error:", err);
      throw err;
    }

    if (info) {
      console.error("JWT Auth Info:", info.message || info);
    }

    if (!user) {
      const errorMessage = info?.message || "Unauthorized - No user found";
      console.error("JWT Auth Failed:", errorMessage);
      throw new UnauthorizedException(errorMessage);
    }

    return user;
  }
}
