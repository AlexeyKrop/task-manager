import { Body, Controller, Post, Req, Res, UnauthorizedException } from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser, Public } from '../../common';
import { AuthService } from './auth.service';
import {
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
  async signUp(
    @Body() signUpDto: SignUpDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<SignUpResponseDto> {
    const result = await this.authService.signUp(signUpDto);

    this.setRefreshTokenCookie(response, result.refresh_token);

    return { access_token: result.access_token };
  }

  @Public()
  @Post('signIn')
  async signIn(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<SignInResponseDto> {
    const result = await this.authService.signIn(signInDto);

    this.setRefreshTokenCookie(response, result.refresh_token);

    return { access_token: result.access_token };
  }


  @Public()
  @Post('refresh')
  async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<RefreshTokenResponseDto> {
    const refreshToken = request.cookies?.['refreshToken'];

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    const result = await this.authService.refresh(refreshToken);

    this.setRefreshTokenCookie(response, result.refresh_token);

    return { access_token: result.access_token };
  }

  @Post('logout')
  @ApiBearerAuth()
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
    @CurrentUser() userId: string,
  ) {
    const refreshToken = request.cookies?.['refreshToken'];

    if (refreshToken) {
      await this.authService.logout(refreshToken, userId);
    }

    this.clearRefreshTokenCookie(response);

    return { message: 'Logged out successfully' };
  }

  @Post('logout-all')
  @ApiBearerAuth()
  async logoutAll(
    @Res({ passthrough: true }) response: Response,
    @CurrentUser() userId: string,
  ) {
    await this.authService.logoutAll(userId);
    this.clearRefreshTokenCookie(response);

    return { message: 'Logged out from all devices' };
  }

  private setRefreshTokenCookie(response: Response, refreshToken: string) {
    const isProduction = process.env.NODE_ENV === 'production';

    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: isProduction, // true только в production
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 дней
      path: '/api/auth', // кука доступна только для auth endpoints
    });
  }

  private clearRefreshTokenCookie(response: Response) {
    const isProduction = process.env.NODE_ENV === 'production';

    response.clearCookie('refreshToken', {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
      path: '/api/auth',
    });
  }

}
