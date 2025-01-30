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
} from '@nestjs/common';
import { ResponseDto } from 'src/dtos/response.dto';
import { Request as ExpressRequest } from 'express';
import { MessageService } from 'src/services/message.service';

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
  async getMySession(
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
  async createSession(@Body() body: any, @Headers() header: any): Promise<any> {
    try {
      return this.messageService.createMessage(body, header);
    } catch (error) {
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
