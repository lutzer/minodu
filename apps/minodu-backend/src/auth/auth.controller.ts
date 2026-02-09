import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin.dto';
import { SignUpDto } from './dto/signup.dto';
import { Public } from './decorators/public.decorator';
import { User } from './decorators/user.decorator';
import { RolesGuard } from './guards/role.guard';
import { Throttle } from '@nestjs/throttler/dist/throttler.decorator';

@UseGuards(RolesGuard)
@ApiTags("Auth")
@Controller({
  path: 'auth',
  version: "1"
})
export class AuthController {

  constructor(
    private readonly authService: AuthService,
  ) {}

  @Public()
  @Throttle({ default: { limit: 10, ttl: 600000 } }) // Max 5 tentatives par 10 minute
  @ApiOperation({summary: "Sign in", description: "Login to account"})
  @Post('signin')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto.phone, signInDto.password);
  }

  @Public()
  @Throttle({ default: { limit: 5, ttl: 600000 } })
  @ApiOperation({summary: "Sign Up", description: "Create Account"})
  @Post('signup')
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.register(signUpDto);
  }

  @ApiBearerAuth()
  @ApiOperation({summary: "Logout", description: "Logout Account"})
  @Get('logout')
  logout(@User() user) {
    return this.authService.logout(user);
  }

}
