import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  Put,
  Request,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ResponseDto } from 'src/dtos/response.dto';
import { Request as ExpressRequest } from 'express';
import { MessageService } from 'src/services/message.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('/api/v1/message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}
  @Post('llm/:llm_type')
  async createMessagellm(
    @Body() body: any,
    @Headers() header: any,
    @Param('llm_type') llm_type: string,
  ): Promise<any> {
    try {
      return this.messageService.sendMessageLlm(body, header, llm_type);
    } catch (error) {
      return ResponseDto.handleCatchError(error);
    }
  }
  @Get('sessions/:sessionId')
  async getSessionMessages(
    @Headers() header: any,
    @Param('sessionId') sessionId: string,
    @Request() req: ExpressRequest,
  ): Promise<any> {
    try {
      return this.messageService.getSessionMessages(sessionId, header, req);
    } catch (error) {
      return ResponseDto.handleCatchError(error);
    }
  }
  @Post()
  async createTextMessage(@Body() body: any, @Headers() header: any): Promise<any> {
    try {
      return this.messageService.createMessage(body, header);
    } catch (error) {
      console.log('erroreeeeeeeeeeeee', error);
      return ResponseDto.handleCatchError(error);
    }
  }

  @Post('upload-audio')
  @UseInterceptors(FileInterceptor('audio'))
  async createAudioMessage(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any, 
    @Headers() header: any): Promise<any> {
    try {
      // return "yes"
      return this.messageService.createAudioMessage(file, body, header);
    } catch (error) {
      console.log('erroreeeeeeeeeeeee', error);
      // return ResponseDto.handleCatchError(error);
      throw error;
    }
  }
  @Post('test')
  @UseInterceptors(FileInterceptor('audio'))
  async test(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any, 
    @Headers() header: any): Promise<any> {
    try {
      return "test"
      // return this.messageService.createAudioMessage(file, body, header);
    } catch (error) {
      console.log('erroreeeeeeeeeeeee', error);
      // return ResponseDto.handleCatchError(error);
      throw error;
    }
  }
  
  @Post('upload-image')
  @UseInterceptors(FileInterceptor('image'))
  async createImageMessage(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
    @Headers() header: any): Promise<any> {
    try {
      return this.messageService.createImageMessage(file, body, header);
    } catch (error) {
      console.log('erroreeeeeeeeeeeee', error);
      return ResponseDto.handleCatchError(error);
    }
  }
  @Post('upload-pdf')
  @UseInterceptors(FileInterceptor('pdf'))
  async createPdfMessage(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
    @Headers() header: any): Promise<any> {
    try {
      return this.messageService.createPdfMessage(file, body, header);
    } catch (error) {
      console.log('erroreeeeeeeeeeeee', error);
      return ResponseDto.handleCatchError(error);
    }
  }

  @Put(':messageId')
  async updateMessage(
    @Body() body: any,
    @Headers() header: any,
    @Param('messageId') messageId: string,
  ): Promise<any> {
    try {
      return this.messageService.updateMessage(body, header, messageId);
    } catch (error) {
      return ResponseDto.handleCatchError(error);
    }
  }
  @Delete(':messageId')
  async removeMessage(
    @Headers() header: any,
    @Param('messageId') sessionId: string,
  ): Promise<any> {
    try {
      return this.messageService.removeMessage(header, sessionId);
    } catch (error) {
      return ResponseDto.handleCatchError(error);
    }
  }
}
