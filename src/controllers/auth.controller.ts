import { Body, Controller, Post, Headers, Put, Param, Get, Delete, Query, Res, Req } from '@nestjs/common';
import { AuthProxyService } from '../services/auth-proxy.service';
import { ResponseDto } from '../dtos/response.dto';
import { ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private authService: AuthProxyService) {}

  @Get('user-number')
  @ApiOperation({ summary: 'Get the total number of users' })
  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 200, description: 'Successfully fetched the user number.' })
  async userNumber(@Headers() header: any) {
    try {
      return await this.authService.usersNumber(header);
    } catch (error) {
      return ResponseDto.handleCatchError(error);
    }
  }

  @Post('sign-in')
  @ApiOperation({ summary: 'Sign in a user' })
  @ApiBody({ description: 'User credentials for sign-in', type: Object })
  @ApiResponse({ status: 200, description: 'User successfully signed in.' })
  @ApiResponse({ status: 400, description: 'Bad request or invalid credentials.' })
  async signIn(@Body() body: any, @Headers() header: any): Promise<ResponseDto<any>> {
    try {
      const res = await this.authService.signIn(body, header);
      return ResponseDto.ok(res.data);
    } catch (error) {
      return ResponseDto.handleCatchError(error);
    }
  }
  @Post('sign-up')
  @ApiOperation({ summary: 'Sign-up a user' })
  @ApiBody({ description: 'User data for sign-up', type: Object })
  @ApiResponse({ status: 200, description: 'Register successful' })
  @ApiResponse({ status: 400, description: 'User already exists' })
  async signUp(@Body() body: any, @Headers() header: any): Promise<ResponseDto<any>> {
    try {
      const res = await this.authService.signUp(body, header);
      return ResponseDto.ok(res.data);
    } catch (error) {
      return ResponseDto.handleCatchError(error);
    }
  }
  @Get('google')
  @ApiOperation({ summary: 'sgin-up with google' })
  @ApiResponse({ status: 200, description: 'Register successful' })
  async authGoogle(@Req() req,@Res() res: Response) {
      return res.redirect(`${process.env.URL_AUTH_SERVICE_SERVER}/api/v1/auth/google`);

  
  }

  @Post('create-user')
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ description: 'New user details for account creation', type: Object })
  @ApiResponse({ status: 201, description: 'User successfully created.' })
  async createUser(@Body() body: any, @Headers() header: any): Promise<ResponseDto<any>> {
    try {
      body.code = body.code || process.env.CODE_PREFIX_USER || 'USR';
      const res = await this.authService.createUser(body, header);
      return ResponseDto.ok(res.data);
    } catch (error) {
      return ResponseDto.handleCatchError(error);
    }
  }

  @Put('update-user/:id')
  @ApiOperation({ summary: 'Update user details by ID' })
  @ApiParam({ name: 'id', description: 'User ID to update' })
  @ApiBody({ description: 'Updated user details', type: Object })
  @ApiResponse({ status: 200, description: 'User successfully updated.' })
  async updateUser(@Param('id') id: string, @Body() body: any, @Headers() header: any) {
    try {
      return await this.authService.updateUser(id, body, header);
    } catch (error) {
      return ResponseDto.handleCatchError(error);
    }
  }

  @Put('update-pass')
  @ApiOperation({ summary: 'Update user password' })
  @ApiBody({ description: 'User password details for update', type: Object })
  @ApiResponse({ status: 200, description: 'Password successfully updated.' })
  async updatePass(@Body() body: any, @Headers() header: any) {
    try {
      return await this.authService.updatePass(body, header);
    } catch (error) {
      return ResponseDto.handleCatchError(error);
    }
  }

  @Put('update-role/:id')
  @ApiOperation({ summary: 'Update user role by ID' })
  @ApiParam({ name: 'id', description: 'User ID to update role' })
  @ApiBody({ description: 'Updated user role details', type: Object })
  @ApiResponse({ status: 200, description: 'User role successfully updated.' })
  async updateRole(@Param('id') id: string, @Body() body: any, @Headers() header: any) {
    try {
      return await this.authService.updateRole(id, body, header);
    } catch (error) {
      return ResponseDto.handleCatchError(error);
    }
  }

  @Delete('delete-user/:id')
  @ApiOperation({ summary: 'Delete user by ID' })
  @ApiParam({ name: 'id', description: 'User ID to delete' })
  @ApiResponse({ status: 200, description: 'User successfully deleted.' })
  async deleteUser(@Param('id') id: string, @Headers() header: any) {
    try {
      return await this.authService.deleteUser(id, header);
    } catch (error) {
      return ResponseDto.handleCatchError(error);
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiQuery({ name: 'query', required: false, description: 'Query parameters for user filtering' })
  @ApiResponse({ status: 200, description: 'Successfully fetched all users.' })
  async getAllUsers(@Headers() header: any, @Query() query: any) {
    try {
      return await this.authService.getAllUsers(header, query);
    } catch (error) {
      return ResponseDto.handleCatchError(error);
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user details by ID' })
  @ApiParam({ name: 'id', description: 'User ID to fetch details' })
  @ApiResponse({ status: 200, description: 'Successfully fetched user details.' })
  async getOneUser(@Param('id') id: string, @Headers() header: any) {
    try {
      return await this.authService.getOneUser(id, header);
    } catch (error) {
      return ResponseDto.handleCatchError(error);
    }
  }

  @Post('send-otp')
  @ApiOperation({ summary: 'Send OTP for verification' })
  @ApiBody({ description: 'Phone number or email for OTP sending', type: Object })
  @ApiResponse({ status: 200, description: 'OTP successfully sent.' })
  async sendOtp(@Body() body: any, @Headers() header: any) {
    try {
      return await this.authService.sendOtp(body, header);
    } catch (error) {
      return ResponseDto.handleCatchError(error);
    }
  }

  @Post('verify-otp')
  @ApiOperation({ summary: 'Verify OTP for authentication' })
  @ApiBody({ description: 'OTP details for verification', type: Object })
  @ApiResponse({ status: 200, description: 'OTP successfully verified.' })
  async verifyOtp(@Body() body: any, @Headers() header: any) {
    try {
      return await this.authService.validateOtp(body, header);
    } catch (error) {
      return ResponseDto.handleCatchError(error);
    }
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset user password' })
  @ApiBody({ description: 'Details for password reset', type: Object })
  @ApiResponse({ status: 200, description: 'Password reset successfully.' })
  resetPassword(@Body() body) {
    return body;
  }

  @Post('sign-in-with-token')
  @ApiOperation({ summary: 'Sign in using token' })
  @ApiBody({ description: 'Token details for sign-in', type: Object })
  @ApiResponse({ status: 200, description: 'Successfully signed in with token.' })
  signInWithToken(@Body() body) {
    return ResponseDto.ok(body);
  }

  @Post('unlock-session')
  @ApiOperation({ summary: 'Unlock user session' })
  @ApiResponse({ status: 200, description: 'Session successfully unlocked.' })
  unlockSession() {}

  @Post('verify-password')
  async verifyPassword(@Body() body: any, @Headers() header: any){
    try {
      return await this.authService.verifyPassword(body, header);
    } catch (error) {
      return ResponseDto.handleCatchError(error);
    }
  }

}

