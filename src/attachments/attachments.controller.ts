import {
  Controller,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Public } from 'libs/decorator/public_access.decorator';
import { Response } from 'express';

@Controller('attachments')
export class AttachmentsController {
  @UseInterceptors(FileInterceptor('file'))
  @Post('upload-file')
  @Public()
  uploadFile(@Res() res: Response, @UploadedFile() file: Express.Multer.File) {
    res.set({
      'Content-Type': file.mimetype,
    });
    res.end(file.buffer);
  }
}
