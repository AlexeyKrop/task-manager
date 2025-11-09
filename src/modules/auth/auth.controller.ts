import { Body, Controller, Post, Req, Res, UnauthorizedException } from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CookieService, CurrentUser, Public } from '../../common';
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
  constructor(
    private authService: AuthService,
    private cookieService: CookieService
) {}

  @Public()
  @Post('signUp')
  async signUp(
    @Body() signUpDto: SignUpDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<SignUpResponseDto> {
    const result = await this.authService.signUp(signUpDto);

    this.cookieService.setRefreshToken(response, result.refresh_token);

    return { access_token: result.access_token };
  }

  @Public()
  @Post('signIn')
  async signIn(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<SignInResponseDto> {
    const result = await this.authService.signIn(signInDto);

    this.cookieService.setRefreshToken(response, result.refresh_token);

    return { access_token: result.access_token };
  }


  @Public()
  @Post('refresh')
  async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<RefreshTokenResponseDto> {
    const refreshToken = this.cookieService.getRefreshToken(request);

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    const result = await this.authService.refresh(refreshToken);

    this.cookieService.setRefreshToken(response, result.refresh_token);

    return { access_token: result.access_token };
  }

  @Post('logout')
  @ApiBearerAuth()
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
    @CurrentUser() userId: string,
  ) {
    const refreshToken = this.cookieService.getRefreshToken(request);

    if (refreshToken) {
      await this.authService.logout(refreshToken, userId);
    }

    this.cookieService.clearRefreshToken(response);

    return { message: 'Logged out successfully' };
  }

  @Post('logout-all')
  @ApiBearerAuth()
  async logoutAll(
    @Res({ passthrough: true }) response: Response,
    @CurrentUser() userId: string,
  ) {
    await this.authService.logoutAll(userId);
    this.cookieService.clearRefreshToken(response);

    return { message: 'Logged out from all devices' };
  }

}
