import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Public } from '../../common';
import { CurrentUser } from '../users/decorators';
import { AuthService } from './auth.service';
import {
  LogoutDto,
  RefreshTokenDto,
  RefreshTokenResponseDto,
  SignInDto,
  SignInResponseDto,
  SignUpDto,
  SignUpResponseDto,
} from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('signUp')
  async signUp(@Body() signUpDto: SignUpDto): Promise<SignUpResponseDto> {
    return this.authService.signUp(signUpDto);
  }

  @Public()
  @Post('signIn')
  async signIn(@Body() signInDto: SignInDto): Promise<SignInResponseDto> {
    return this.authService.signIn(signInDto);
  }

  @Post('refresh')
  async refresh(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<RefreshTokenResponseDto> {
    return this.authService.refresh(refreshTokenDto);
  }

  @Post('logout')
  @ApiBearerAuth()
  async logout(@Body() logoutDto: LogoutDto, @CurrentUser() userId: string) {
    this.authService.logout(logoutDto, userId);
  }

  @Post('logout-all')
  @ApiBearerAuth()
  async logoutAll(@CurrentUser() userId: string) {
    await this.authService.logoutAll(userId);
    return { message: 'Logged out from all devices' };
  }
}
