import { Body, Controller, Delete, Get, Headers, Param, Post, Put, Request } from '@nestjs/common';
import { ResponseDto } from 'src/dtos/response.dto';
import { SessionService } from 'src/services/session.service';
import { Request as ExpressRequest } from 'express';

@Controller('/api/v1/session')
export class SessionController {
    constructor(private readonly sessionService: SessionService) {}
    @Post('llm/:llm_type')
    async createSessionllm(@Body() body: any,@Headers() header:any,@Param('llm_type') llm_type: string):Promise<any>{
        try {
            return this.sessionService.createSessionllm(body,header,llm_type)
        } catch (error) {
            return ResponseDto.handleCatchError(error)
        }   
    }
    @Get()
    async getParticipatedSession(@Headers() header:any,@Request() req: ExpressRequest):Promise<any>{
        try {
            return this.sessionService.getParticipatedSession(header,req)
        } catch (error) {
            return ResponseDto.handleCatchError(error)
        }   
    }
    @Get('mySessions')
    async getMySession(@Headers() header:any,@Request() req: ExpressRequest):Promise<any>{
        try {
            return this.sessionService.getMySession(header,req)
        } catch (error) {
            return ResponseDto.handleCatchError(error)
        }   
    }
    @Get(':id')
    async getOneSession(@Headers() header:any,@Param('id') id:string):Promise<any>{
        try {
            return this.sessionService.getOneSession(id,header)
        } catch (error) {
            return ResponseDto.handleCatchError(error)
        }   
    }
    @Post()
    async createSession(@Body() body: any,@Headers() header:any):Promise<any>{
        try {
            return this.sessionService.createSession(body,header)
        } catch (error) {
            return ResponseDto.handleCatchError(error)
        }   
    }
    @Put('addParticipant/:sessionId')
    async addParticipantSession(@Body() body: any,@Headers() header:any,@Param('sessionId')sessionId:string):Promise<any>{
        try {
            return this.sessionService.addParticipantSession(body,header,sessionId)
        } catch (error) {
            return ResponseDto.handleCatchError(error)
        }   
    }
    @Put('rename/:sessionId')
    async renameSession(@Body() body: any,@Headers() header:any,@Param('sessionId')sessionId:string):Promise<any>{
        try {
            return this.sessionService.renameSession(body,header,sessionId)
        } catch (error) {
            return ResponseDto.handleCatchError(error)
        }   
    }
    @Delete('removeParticipant/:sessionId')
    async removeParticipantSession(@Body() body: any,@Headers() header:any,@Param('sessionId')sessionId:string):Promise<any>{
        try {
            return this.sessionService.removeParticipantSession(body,header,sessionId)
        } catch (error) {
            return ResponseDto.handleCatchError(error)
        }   
    }
    @Put('enable_llm/:sessionId')
    async enableLLM(@Body() body: any,@Headers() header:any,@Param('sessionId')sessionId:string):Promise<any>{
        try {
            return this.sessionService.enableLLM(body,header,sessionId)
        } catch (error) {
            return ResponseDto.handleCatchError(error)
        }   
    }
    @Put('disable_llm/:sessionId')
    async disableLLM(@Body() body: any,@Headers() header:any,@Param('sessionId')sessionId:string):Promise<any>{
        try {
            return this.sessionService.disableLLM(body,header,sessionId)
        } catch (error) {
            return ResponseDto.handleCatchError(error)
        }   
    }
    @Delete(':sessionId')
    async removeSession(@Headers() header:any,@Param('sessionId')sessionId:string):Promise<any>{
        try {
            return this.sessionService.removeSession(header,sessionId)
        } catch (error) {
            return ResponseDto.handleCatchError(error)
        }   
    }

}
